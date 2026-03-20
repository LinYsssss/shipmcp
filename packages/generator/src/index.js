import fs from "node:fs/promises";
import path from "node:path";

import { parse as parseYaml } from "yaml";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head"];

export async function loadSpec(specRef) {
  const raw = await readSpecSource(specRef);

  try {
    return JSON.parse(raw);
  } catch (jsonError) {
    try {
      const parsed = parseYaml(raw, {
        prettyErrors: true,
        strict: false
      });

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Parsed document is not an OpenAPI object.");
      }

      return parsed;
    } catch (yamlError) {
      throw new Error(
        `Failed to parse OpenAPI document as JSON or YAML: ${yamlError.message}`
      );
    }
  }
}

function resolveMaybeRef(spec, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  let current = value;
  const seenRefs = new Set();

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    typeof current.$ref === "string"
  ) {
    const ref = current.$ref;

    if (!ref.startsWith("#/")) {
      return current;
    }

    if (seenRefs.has(ref)) {
      throw new Error(`Circular local $ref detected: ${ref}`);
    }

    seenRefs.add(ref);
    current = resolveLocalRef(spec, ref);
  }

  return current;
}

function resolveLocalRef(spec, ref) {
  const segments = ref
    .slice(2)
    .split("/")
    .map(readRefSegment);

  let current = spec;

  for (const segment of segments) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      throw new Error(`Unresolved local $ref: ${ref}`);
    }

    current = current[segment];
  }

  return current;
}

function readRefSegment(segment) {
  return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

export function validateSpec(spec, options = {}) {
  const errors = [];
  const warnings = [];

  if (!spec || typeof spec !== "object") {
    errors.push("Spec must be a JSON or YAML object.");
    return { ok: false, errors, warnings, operationCount: 0, selectedOperationCount: 0 };
  }

  if (!spec.openapi || typeof spec.openapi !== "string" || !spec.openapi.startsWith("3.")) {
    errors.push("Only OpenAPI 3.x documents are supported.");
  }

  if (!spec.paths || typeof spec.paths !== "object" || Object.keys(spec.paths).length === 0) {
    errors.push("Spec must contain at least one path.");
  }

  if (!spec.info?.title) {
    warnings.push("Missing info.title. ShipMCP will fall back to a generic project name.");
  }

  const allOperations = collectOperations(spec);
  const filterOptions = normalizeFilterOptions(options.filterOptions);
  const selectedOperations = applyOperationFilters(allOperations, filterOptions);

  if (allOperations.length === 0) {
    errors.push("Spec does not contain any HTTP operations ShipMCP can generate.");
  }

  if (allOperations.length > 0 && hasActiveFilters(filterOptions) && selectedOperations.length === 0) {
    errors.push("Applied filters excluded every operation. Relax your filters.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    operationCount: allOperations.length,
    selectedOperationCount: selectedOperations.length
  };
}

export function summarizeSpec(spec, options = {}) {
  const allOperations = collectOperations(spec);
  const selectedOperations = applyOperationFilters(
    allOperations,
    normalizeFilterOptions(options.filterOptions)
  );

  return {
    title: spec.info?.title ?? "Generated MCP API",
    version: spec.info?.version ?? "0.1.0",
    pathCount: Object.keys(spec.paths ?? {}).length,
    operationCount: allOperations.length,
    selectedOperationCount: selectedOperations.length
  };
}

export function detectAuthPreset(spec, requested = "auto") {
  if (requested && requested !== "auto") {
    return requested;
  }

  const schemes = Object.values(spec.components?.securitySchemes ?? {});
  const hasApiKey = schemes.some((scheme) => scheme?.type === "apiKey");
  const hasBearer = schemes.some(
    (scheme) => scheme?.type === "http" && String(scheme.scheme).toLowerCase() === "bearer"
  );

  if (hasBearer) {
    return "bearer";
  }

  if (hasApiKey) {
    return "apikey";
  }

  return "none";
}

export async function generateProject(options) {
  const spec = await loadSpec(options.specRef);
  const filterOptions = normalizeFilterOptions(options.filterOptions);
  const validation = validateSpec(spec, { filterOptions });

  if (!validation.ok) {
    throw new Error(`Spec validation failed:\n- ${validation.errors.join("\n- ")}`);
  }

  const summary = summarizeSpec(spec, { filterOptions });
  const authPreset = detectAuthPreset(spec, options.authPreset);
  const projectName = options.projectName ?? slug(summary.title);
  const outDir = options.outDir ?? path.resolve(process.cwd(), projectName);
  const operations = normalizeOperations(applyOperationFilters(collectOperations(spec), filterOptions));
  const serverUrl = resolveServerUrl(spec);
  const files = renderProjectFiles({
    projectName,
    title: summary.title,
    specVersion: summary.version,
    spec,
    operations,
    authPreset,
    serverUrl,
    filterOptions
  });

  await fs.mkdir(outDir, { recursive: true });
  await writeFiles(outDir, files);

  return {
    outDir,
    projectName,
    authPreset,
    operationCount: operations.length,
    totalOperationCount: summary.operationCount,
    filterSummary: formatFilterSummary(filterOptions)
  };
}

function collectOperations(spec) {
  const operations = [];

  for (const [routePath, routeValue] of Object.entries(spec.paths ?? {})) {
    const routeConfig = resolveMaybeRef(spec, routeValue);
    const pathParameters = Array.isArray(routeConfig?.parameters) ? routeConfig.parameters : [];

    for (const method of HTTP_METHODS) {
      const operation = resolveMaybeRef(spec, routeConfig?.[method]);
      if (!operation || typeof operation !== "object") {
        continue;
      }

      const parameters = mergeParameters(spec, pathParameters, operation.parameters ?? []);

      operations.push({
        method: method.toUpperCase(),
        path: routePath,
        operationId: operation.operationId ?? null,
        summary: operation.summary ?? operation.description ?? `${method.toUpperCase()} ${routePath}`,
        description: operation.description ?? "",
        deprecated: Boolean(operation.deprecated),
        tags: Array.isArray(operation.tags) ? operation.tags.map((tag) => String(tag)) : [],
        responseStatuses: Object.keys(operation.responses ?? {}),
        parameters: parameters.map((parameter) => toInputParameter(spec, parameter)),
        requestBody: toRequestBodyInput(spec, operation.requestBody)
      });
    }
  }

  return operations;
}

function applyOperationFilters(operations, filterOptions) {
  const normalized = normalizeFilterOptions(filterOptions);
  const includeTagSet = new Set(normalized.includeTags.map((entry) => entry.toLowerCase()));
  const excludeTagSet = new Set(normalized.excludeTags.map((entry) => entry.toLowerCase()));
  const includeMethodSet = new Set(normalized.includeMethods.map((entry) => entry.toUpperCase()));
  const excludeMethodSet = new Set(normalized.excludeMethods.map((entry) => entry.toUpperCase()));
  const includePathMatchers = normalized.includePaths.map(buildWildcardMatcher);
  const excludePathMatchers = normalized.excludePaths.map(buildWildcardMatcher);
  const includeOperationIdMatchers = normalized.includeOperationIds.map(buildWildcardMatcher);
  const excludeOperationIdMatchers = normalized.excludeOperationIds.map(buildWildcardMatcher);
  const includeResponseStatusMatchers = normalized.includeResponseStatuses.map(buildWildcardMatcher);
  const excludeResponseStatusMatchers = normalized.excludeResponseStatuses.map(buildWildcardMatcher);

  return operations.filter((operation) => {
    const method = operation.method.toUpperCase();
    const tags = operation.tags.map((tag) => tag.toLowerCase());
    const operationId = operation.operationId ?? "";
    const responseStatuses = operation.responseStatuses ?? [];

    if (normalized.deprecatedOnly && !operation.deprecated) {
      return false;
    }

    if (normalized.excludeDeprecated && operation.deprecated) {
      return false;
    }

    if (includeMethodSet.size > 0 && !includeMethodSet.has(method)) {
      return false;
    }

    if (excludeMethodSet.has(method)) {
      return false;
    }

    if (includeTagSet.size > 0 && !tags.some((tag) => includeTagSet.has(tag))) {
      return false;
    }

    if (excludeTagSet.size > 0 && tags.some((tag) => excludeTagSet.has(tag))) {
      return false;
    }

    if (includePathMatchers.length > 0 && !matchesWildcardFilters(operation.path, includePathMatchers)) {
      return false;
    }

    if (excludePathMatchers.length > 0 && matchesWildcardFilters(operation.path, excludePathMatchers)) {
      return false;
    }

    if (includeOperationIdMatchers.length > 0 && !operationId) {
      return false;
    }

    if (includeOperationIdMatchers.length > 0 && !matchesWildcardFilters(operationId, includeOperationIdMatchers)) {
      return false;
    }

    if (
      excludeOperationIdMatchers.length > 0 &&
      operationId &&
      matchesWildcardFilters(operationId, excludeOperationIdMatchers)
    ) {
      return false;
    }

    if (includeResponseStatusMatchers.length > 0 && !matchesAnyWildcardFilter(responseStatuses, includeResponseStatusMatchers)) {
      return false;
    }

    if (excludeResponseStatusMatchers.length > 0 && matchesAnyWildcardFilter(responseStatuses, excludeResponseStatusMatchers)) {
      return false;
    }

    return true;
  });
}

function normalizeFilterOptions(filterOptions = {}) {
  return {
    includeTags: normalizeList(filterOptions.includeTags),
    excludeTags: normalizeList(filterOptions.excludeTags),
    includeMethods: normalizeList(filterOptions.includeMethods).map((entry) => entry.toUpperCase()),
    excludeMethods: normalizeList(filterOptions.excludeMethods).map((entry) => entry.toUpperCase()),
    includePaths: normalizeList(filterOptions.includePaths),
    excludePaths: normalizeList(filterOptions.excludePaths),
    includeOperationIds: normalizeList(filterOptions.includeOperationIds),
    excludeOperationIds: normalizeList(filterOptions.excludeOperationIds),
    includeResponseStatuses: normalizeList(filterOptions.includeResponseStatuses),
    excludeResponseStatuses: normalizeList(filterOptions.excludeResponseStatuses),
    deprecatedOnly: Boolean(filterOptions.deprecatedOnly),
    excludeDeprecated: Boolean(filterOptions.excludeDeprecated)
  };
}

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => String(entry).split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function hasActiveFilters(filterOptions) {
  return Object.values(filterOptions).some((value) =>
    Array.isArray(value) ? value.length > 0 : value === true
  );
}

function formatFilterSummary(filterOptions) {
  if (!hasActiveFilters(filterOptions)) {
    return null;
  }

  const parts = [];

  if (filterOptions.includeTags.length > 0) {
    parts.push(`include-tags=${filterOptions.includeTags.join(",")}`);
  }

  if (filterOptions.excludeTags.length > 0) {
    parts.push(`exclude-tags=${filterOptions.excludeTags.join(",")}`);
  }

  if (filterOptions.includeMethods.length > 0) {
    parts.push(`include-methods=${filterOptions.includeMethods.join(",")}`);
  }

  if (filterOptions.excludeMethods.length > 0) {
    parts.push(`exclude-methods=${filterOptions.excludeMethods.join(",")}`);
  }

  if (filterOptions.includePaths.length > 0) {
    parts.push(`include-paths=${filterOptions.includePaths.join(",")}`);
  }

  if (filterOptions.excludePaths.length > 0) {
    parts.push(`exclude-paths=${filterOptions.excludePaths.join(",")}`);
  }

  if (filterOptions.includeOperationIds.length > 0) {
    parts.push(`include-operation-ids=${filterOptions.includeOperationIds.join(",")}`);
  }

  if (filterOptions.excludeOperationIds.length > 0) {
    parts.push(`exclude-operation-ids=${filterOptions.excludeOperationIds.join(",")}`);
  }

  if (filterOptions.includeResponseStatuses.length > 0) {
    parts.push(`include-response-statuses=${filterOptions.includeResponseStatuses.join(",")}`);
  }

  if (filterOptions.excludeResponseStatuses.length > 0) {
    parts.push(`exclude-response-statuses=${filterOptions.excludeResponseStatuses.join(",")}`);
  }

  if (filterOptions.deprecatedOnly) {
    parts.push("deprecated-only=true");
  }

  if (filterOptions.excludeDeprecated) {
    parts.push("exclude-deprecated=true");
  }

  return parts.join(" | ");
}

function buildWildcardMatcher(pattern) {
  const escaped = String(pattern)
    .replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${escaped}$`);
}

function matchesWildcardFilters(value, matchers) {
  return matchers.some((matcher) => matcher.test(String(value)));
}

function matchesAnyWildcardFilter(values, matchers) {
  return values.some((value) => matchesWildcardFilters(value, matchers));
}

function normalizeOperations(operations) {
  const seenNames = new Map();

  return operations.map((operation) => {
    const baseName = operation.operationId
      ? slug(operation.operationId).replace(/-/g, "_")
      : buildPathToolName(operation.method, operation.path);

    const count = seenNames.get(baseName) ?? 0;
    seenNames.set(baseName, count + 1);

    const finalName = count === 0 ? baseName : `${baseName}_${count + 1}`;

    return {
      ...operation,
      toolName: finalName
    };
  });
}

function mergeParameters(spec, pathParameters, operationParameters) {
  const byKey = new Map();

  for (const parameterValue of [...pathParameters, ...operationParameters]) {
    const parameter = resolveMaybeRef(spec, parameterValue);

    if (!parameter || typeof parameter !== "object" || !parameter.name) {
      continue;
    }

    byKey.set(`${parameter.in}:${parameter.name}`, parameter);
  }

  return [...byKey.values()];
}

function toInputParameter(spec, parameter) {
  const required = Boolean(parameter.required);

  return {
    originalName: parameter.name,
    source: parameter.in ?? "query",
    name: toSafeIdentifier(parameter.name),
    required,
    description: parameter.description ?? `${parameter.in ?? "query"} parameter ${parameter.name}`,
    zodExpression: renderZodExpression(spec, parameter.schema, { required })
  };
}

function toRequestBodyInput(spec, requestBodyValue) {
  const requestBody = resolveMaybeRef(spec, requestBodyValue);

  if (!requestBody || typeof requestBody !== "object") {
    return null;
  }

  const jsonContent = findJsonContent(requestBody.content);
  if (!jsonContent) {
    return null;
  }

  return {
    name: "body",
    required: Boolean(requestBody.required),
    description: "JSON request body",
    zodExpression: renderZodExpression(spec, jsonContent.schema, {
      required: Boolean(requestBody.required)
    })
  };
}

function findJsonContent(content) {
  if (!content || typeof content !== "object") {
    return null;
  }

  if (content["application/json"]) {
    return content["application/json"];
  }

  for (const [contentType, value] of Object.entries(content)) {
    if (/^application\/(.+\+)?json$/i.test(contentType)) {
      return value;
    }
  }

  return null;
}

function renderZodExpression(spec, schemaValue, options = {}) {
  const required = options.required ?? true;
  const expression = renderRequiredZodExpression(spec, schemaValue);
  return required ? expression : `${expression}.optional()`;
}

function renderRequiredZodExpression(spec, schemaValue) {
  const schema = resolveMaybeRef(spec, schemaValue);

  if (!schema || typeof schema !== "object") {
    return "z.string()";
  }

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    return renderEnumZodExpression(schema.enum);
  }

  let expression;

  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    expression = renderAllOfZodExpression(spec, schema);
  } else if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    expression = renderUnionZodExpression(spec, schema.oneOf);
  } else if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    expression = renderUnionZodExpression(spec, schema.anyOf);
  } else {
    const normalizedType = inferSchemaType(spec, schema);

    if (normalizedType === "integer") {
      expression = "z.number().int()";
    } else if (normalizedType === "number") {
      expression = "z.number()";
    } else if (normalizedType === "boolean") {
      expression = "z.boolean()";
    } else if (normalizedType === "array") {
      expression = `z.array(${renderRequiredZodExpression(spec, schema.items)})`;
    } else if (normalizedType === "object") {
      expression = renderObjectZodExpression(spec, schema);
    } else {
      expression = "z.string()";
    }
  }

  if (schema.nullable) {
    expression += ".nullable()";
  }

  return expression;
}

function renderObjectZodExpression(spec, schema) {
  const properties = schema.properties ?? {};
  const requiredSet = new Set(Array.isArray(schema.required) ? schema.required : []);
  const entries = Object.entries(properties).map(([propertyName, propertySchema]) => {
    const propertyExpression = renderZodExpression(spec, propertySchema, {
      required: requiredSet.has(propertyName)
    });

    return `${renderObjectKey(propertyName)}: ${propertyExpression}`;
  });

  let expression = `z.object({${entries.length > 0 ? ` ${entries.join(", ")} ` : ""}})`;

  if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
    expression += `.catchall(${renderRequiredZodExpression(spec, schema.additionalProperties)})`;
  } else if (schema.additionalProperties === true) {
    expression += ".catchall(z.unknown())";
  }

  return expression;
}

function renderAllOfZodExpression(spec, schema) {
  const variants = schema.allOf
    .map((entry) => resolveMaybeRef(spec, entry))
    .filter((entry) => entry && typeof entry === "object");

  if (variants.length === 0) {
    return "z.object({})";
  }

  if (variants.every((entry) => inferSchemaType(spec, entry) === "object")) {
    return renderObjectZodExpression(spec, mergeAllOfObjectSchemas(variants));
  }

  return renderIntersectionZodExpression(spec, variants);
}

function mergeAllOfObjectSchemas(schemas) {
  const merged = {
    type: "object",
    properties: {},
    required: []
  };
  const requiredSet = new Set();

  for (const schema of schemas) {
    Object.assign(merged.properties, schema.properties ?? {});

    for (const field of schema.required ?? []) {
      requiredSet.add(field);
    }

    if (schema.additionalProperties === true) {
      merged.additionalProperties = true;
    } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      merged.additionalProperties = schema.additionalProperties;
    }
  }

  merged.required = [...requiredSet];
  return merged;
}

function renderUnionZodExpression(spec, variants) {
  const expressions = [...new Set(variants.map((entry) => renderRequiredZodExpression(spec, entry)))];

  if (expressions.length === 0) {
    return "z.unknown()";
  }

  if (expressions.length === 1) {
    return expressions[0];
  }

  return `z.union([${expressions.join(", ")}])`;
}

function renderIntersectionZodExpression(spec, variants) {
  const expressions = variants.map((entry) => renderRequiredZodExpression(spec, entry));

  if (expressions.length === 0) {
    return "z.unknown()";
  }

  return expressions
    .slice(1)
    .reduce((current, expression) => `z.intersection(${current}, ${expression})`, expressions[0]);
}
function renderEnumZodExpression(values) {
  if (values.every((value) => typeof value === "string")) {
    return `z.enum([${values.map((value) => JSON.stringify(value)).join(", ")}])`;
  }

  if (values.length === 1) {
    return `z.literal(${JSON.stringify(values[0])})`;
  }

  return `z.union([${values
    .map((value) => `z.literal(${JSON.stringify(value)})`)
    .join(", ")}])`;
}

function inferSchemaType(spec, schemaValue) {
  const schema = resolveMaybeRef(spec, schemaValue);

  if (!schema || typeof schema !== "object") {
    return "string";
  }

  if (schema.type) {
    return schema.type;
  }

  if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf) || Array.isArray(schema.allOf)) {
    const variants = schema.oneOf ?? schema.anyOf ?? schema.allOf ?? [];
    const inferredTypes = [...new Set(variants.map((entry) => inferSchemaType(spec, entry)))];

    if (inferredTypes.length === 1) {
      return inferredTypes[0];
    }

    if (inferredTypes.includes("object")) {
      return "object";
    }

    if (inferredTypes.includes("array")) {
      return "array";
    }
  }

  if (schema.properties || schema.additionalProperties) {
    return "object";
  }

  if (schema.items) {
    return "array";
  }

  return "string";
}

function renderObjectKey(value) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value) ? value : JSON.stringify(value);
}

function resolveServerUrl(spec) {
  return spec.servers?.[0]?.url ?? "https://api.example.com";
}

function renderProjectFiles(context) {
  const envFile = renderEnvExample(context.authPreset, context.serverUrl);
  const packageJson = renderGeneratedPackageJson(context.projectName);

  return {
    ".gitignore": "node_modules/\ndist/\n.env\n",
    ".env.example": envFile,
    "package.json": JSON.stringify(packageJson, null, 2),
    "tsconfig.json": renderTsconfig(),
    "Dockerfile": renderDockerfile(),
    "README.md": renderGeneratedReadme(context),
    ".github/workflows/ci.yml": renderGeneratedCi(),
    "src/server.ts": renderServerTs(context),
    "src/client.ts": renderClientTs(context.authPreset, context.serverUrl),
    "src/tools.ts": renderToolsTs(context.operations),
    "tests/smoke.test.ts": renderSmokeTest(context.projectName),
    "tests/api.test.ts": renderApiTest(),
    "openapi/source.json": JSON.stringify(context.spec, null, 2)
  };
}

function renderGeneratedPackageJson(projectName) {
  return {
    name: projectName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "tsx src/server.ts",
      build: "tsc -p tsconfig.json",
      test: "vitest run"
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^1.17.0",
      zod: "^3.25.0"
    },
    devDependencies: {
      "@types/node": "^24.0.0",
      tsx: "^4.20.0",
      typescript: "^5.8.0",
      vitest: "^3.2.0"
    }
  };
}

function renderTsconfig() {
  return `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src", "tests"]
}
`;
}

function renderDockerfile() {
  return `FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "dev"]
`;
}

function renderGeneratedCi() {
  return `name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - run: npm test
`;
}

function renderEnvExample(authPreset, serverUrl) {
  const lines = [`API_BASE_URL=${serverUrl}`];

  if (authPreset === "bearer") {
    lines.push("BEARER_TOKEN=replace-me");
  }

  if (authPreset === "apikey") {
    lines.push("API_KEY_HEADER=x-api-key");
    lines.push("API_KEY_VALUE=replace-me");
  }

  return `${lines.join("\n")}\n`;
}

function renderGeneratedReadme(context) {
  const operationTable = context.operations
    .map((operation) => `- \`${operation.toolName}\` -> ${operation.method} ${operation.path}`)
    .join("\n");
  const filterSummary = formatFilterSummary(context.filterOptions);
  const filterSection = filterSummary
    ? `\n## Generation filters\n\n- ${filterSummary}\n`
    : "";

  return `# ${context.projectName}

Generated by ShipMCP from \`${context.title}\`.

## What this project includes

- MCP stdio server
- Generated tool handlers from OpenAPI operations
- ${context.authPreset === "none" ? "No auth preset" : `${context.authPreset} auth preset`}
- Dockerfile
- GitHub Actions CI
- Smoke tests
${filterSection}## Quick start

\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## Generated tools

${operationTable}

## Notes

- Review generated tool names before publishing.
- Replace placeholder auth values in \`.env\`.
- Extend \`src/client.ts\` if your API needs custom signing or retries.
`;
}

function renderServerTs(context) {
  return `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { callApi } from "./client.js";
import { generatedTools } from "./tools.js";

const server = new McpServer({
  name: "${context.projectName}",
  version: "0.1.0"
});

for (const tool of generatedTools) {
  server.tool(tool.name, tool.inputSchema, async (input) => {
    const response = await callApi(tool, input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2)
        }
      ]
    };
  });
}

const transport = new StdioServerTransport();
await server.connect(transport);
`;
}

function renderClientTs(authPreset, serverUrl) {
  const authResolver =
    authPreset === "bearer"
      ? `  const token = process.env.BEARER_TOKEN;
  if (!token) {
    throw new Error("Missing BEARER_TOKEN in environment.");
  }
  return { Authorization: \`Bearer \${token}\` };`
      : authPreset === "apikey"
        ? `  const headerName = process.env.API_KEY_HEADER ?? "x-api-key";
  const value = process.env.API_KEY_VALUE;
  if (!value) {
    throw new Error("Missing API_KEY_VALUE in environment.");
  }
  return { [headerName]: value };`
        : "  return {};";

  return `import type { GeneratedTool } from "./tools.js";

type ToolInput = Record<string, unknown>;

export async function callApi(tool: GeneratedTool, input: ToolInput) {
  const request = tool.buildRequest(input);
  const baseUrl = process.env.API_BASE_URL ?? "${serverUrl}";
  const url = new URL(request.path, baseUrl);

  for (const [key, value] of request.query.entries()) {
    url.searchParams.set(key, value);
  }

  const headers = {
    ...resolveAuthHeaders(),
    ...request.headers
  };

  const response = await fetch(url, {
    method: tool.method,
    headers,
    body: request.body === undefined ? undefined : JSON.stringify(request.body)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(\`API request failed with \${response.status}: \${text}\`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function resolveAuthHeaders(): Record<string, string> {
${authResolver}
}
`;
}

function renderToolsTs(operations) {
  const entries = operations.map(renderToolEntry).join(",\n\n");

  return `import { z } from "zod";

export type GeneratedTool = {
  name: string;
  method: string;
  path: string;
  description: string;
  inputSchema: Record<string, z.ZodTypeAny>;
  buildRequest: (input: Record<string, unknown>) => {
    path: string;
    query: URLSearchParams;
    headers: Record<string, string>;
    body?: unknown;
  };
};

export const generatedTools: GeneratedTool[] = [
${entries}
];
`;
}

function renderToolEntry(operation) {
  const inputs = [...operation.parameters];

  if (operation.requestBody) {
    inputs.push({
      ...operation.requestBody
    });
  }

  const schemaEntries =
    inputs.length === 0
      ? ""
      : inputs
          .map(
            (input) =>
              `      ${input.name}: ${input.zodExpression}`
          )
          .join(",\n");

  const buildPath = renderPathExpression(operation.path);
  const queryLines = operation.parameters
    .filter((parameter) => parameter.source === "query")
    .map(
      (parameter) =>
        `      if (input.${parameter.name} !== undefined) query.set("${parameter.originalName}", String(input.${parameter.name}));`
    )
    .join("\n");
  const headerLines = operation.parameters
    .filter((parameter) => parameter.source === "header")
    .map(
      (parameter) =>
        `      if (input.${parameter.name} !== undefined) headers["${parameter.originalName}"] = String(input.${parameter.name});`
    )
    .join("\n");

  const bodyLines = operation.requestBody
    ? `      if (input.body !== undefined) {
        headers["content-type"] = "application/json";
        body = input.body;
      }`
    : "";

  return `  {
    name: "${operation.toolName}",
    method: "${operation.method}",
    path: "${operation.path}",
    description: "${escapeText(operation.summary)}",
    inputSchema: {
${schemaEntries}
    },
    buildRequest(input) {
      const query = new URLSearchParams();
      const headers: Record<string, string> = {};
      let body: unknown = undefined;
      const resolvedPath = ${buildPath};
${queryLines}
${headerLines}
${bodyLines}
      return {
        path: resolvedPath,
        query,
        headers,
        body
      };
    }
  }`;
}

function renderPathExpression(routePath) {
  const template = routePath.replace(/\{([^}]+)\}/g, (_, value) => `\${encodeURIComponent(String(input.${toSafeIdentifier(value)}))}`);
  return `\`${template}\``;
}

function renderSmokeTest(projectName) {
  return `import { describe, expect, it } from "vitest";

import { generatedTools } from "../src/tools.js";

describe("${projectName}", () => {
  it("emits at least one tool", () => {
    expect(generatedTools.length).toBeGreaterThan(0);
  });
});
`;
}

function renderApiTest() {
  return `import { describe, expect, it } from "vitest";

import { generatedTools } from "../src/tools.js";

describe("generated tool metadata", () => {
  it("uses stable tool names", () => {
    const names = generatedTools.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
`;
}

async function writeFiles(rootDir, files) {
  for (const [relativePath, content] of Object.entries(files)) {
    const targetPath = path.join(rootDir, relativePath);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, content, "utf8");
  }
}

async function readSpecSource(specRef) {
  if (/^https?:\/\//i.test(specRef)) {
    const response = await fetch(specRef);

    if (!response.ok) {
      throw new Error(`Failed to download spec: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  return fs.readFile(path.resolve(process.cwd(), specRef), "utf8");
}

function slug(value) {
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "shipmcp-project";
}

function toSafeIdentifier(value) {
  const normalized = String(value)
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const withPrefix = /^[0-9]/.test(normalized) ? `value_${normalized}` : normalized;
  return withPrefix || "value";
}

function buildPathToolName(method, routePath) {
  const pieces = routePath
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment.startsWith("{") ? `by_${toSafeIdentifier(segment.slice(1, -1))}` : toSafeIdentifier(segment)
    );

  return [method.toLowerCase(), ...pieces].join("_");
}

function escapeText(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}



