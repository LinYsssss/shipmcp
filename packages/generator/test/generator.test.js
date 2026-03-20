import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { generateProject, loadSpec, summarizeSpec, validateSpec } from "../src/index.js";

const jsonFixturePath = path.resolve("examples/specs/petstore.json");
const yamlFixturePath = path.resolve("examples/specs/petstore.yaml");
const snapshotDir = path.resolve("packages/generator/test/__snapshots__");

function normalizeText(value) {
  return String(value).replaceAll("\r\n", "\n");
}

async function readSnapshot(name) {
  return normalizeText(await fs.readFile(path.join(snapshotDir, name), "utf8"));
}

async function assertSnapshotMatches(targetDir, filePath, snapshotName) {
  const actual = normalizeText(await fs.readFile(path.join(targetDir, filePath), "utf8"));
  const expected = await readSnapshot(snapshotName);

  assert.equal(actual, expected, `Snapshot mismatch for ${snapshotName}`);
}

test("validateSpec accepts the bundled petstore JSON fixture", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const result = validateSpec(spec);
  const summary = summarizeSpec(spec);

  assert.equal(result.ok, true);
  assert.equal(summary.title, "Acme Petstore API");
  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 4);
});

test("loadSpec parses YAML fixtures and keeps operation counts stable", async () => {
  const spec = await loadSpec(yamlFixturePath);
  const result = validateSpec(spec);
  const summary = summarizeSpec(spec);

  assert.equal(result.ok, true);
  assert.equal(summary.title, "Acme Petstore YAML API");
  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 4);
});

test("summarizeSpec reflects active tag and method filters", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      includeTags: ["pets"],
      excludeMethods: ["POST"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 2);
});

test("summarizeSpec reflects path and operationId wildcard filters", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      includePaths: ["/pets*"],
      excludeOperationIds: ["create*"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 2);
});

test("summarizeSpec reflects deprecated-only and response-status filters", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      deprecatedOnly: true,
      includeResponseStatuses: ["201"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 1);
});

test("generateProject writes a runnable scaffold", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto"
  });

  const packageJson = await fs.readFile(path.join(targetDir, "package.json"), "utf8");
  const serverFile = await fs.readFile(path.join(targetDir, "src", "server.ts"), "utf8");

  assert.equal(result.projectName, "acme-petstore-api");
  assert.equal(result.operationCount, 4);
  assert.match(packageJson, /@modelcontextprotocol\/sdk/);
  assert.match(serverFile, /McpServer/);
});

test("generateProject writes an HTTP transport template when requested", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-http-"));

  await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    transport: "http"
  });

  const packageJson = await fs.readFile(path.join(targetDir, "package.json"), "utf8");
  const serverFile = await fs.readFile(path.join(targetDir, "src", "server.ts"), "utf8");
  const envFile = await fs.readFile(path.join(targetDir, ".env.example"), "utf8");

  assert.match(packageJson, /"express"/);
  assert.match(serverFile, /StreamableHTTPServerTransport/);
  assert.match(serverFile, /createMcpExpressApp/);
  assert.ok(serverFile.includes(`app.post("/mcp"`));
  assert.match(envFile, /PORT=3000/);
});

test("generateProject matches stdio key-file snapshots", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-snapshot-stdio-"));

  await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto"
  });

  await assertSnapshotMatches(targetDir, "package.json", "stdio-package.json.snap");
  await assertSnapshotMatches(targetDir, "src/server.ts", "stdio-server.ts.snap");
  await assertSnapshotMatches(targetDir, "src/tools.ts", "stdio-tools.ts.snap");
  await assertSnapshotMatches(targetDir, "README.md", "stdio-readme.md.snap");
  await assertSnapshotMatches(targetDir, ".env.example", "stdio-env.example.snap");
});

test("generateProject matches http key-file snapshots", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-snapshot-http-"));

  await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    transport: "http"
  });

  await assertSnapshotMatches(targetDir, "package.json", "http-package.json.snap");
  await assertSnapshotMatches(targetDir, "src/server.ts", "http-server.ts.snap");
  await assertSnapshotMatches(targetDir, "src/tools.ts", "http-tools.ts.snap");
  await assertSnapshotMatches(targetDir, "README.md", "http-readme.md.snap");
  await assertSnapshotMatches(targetDir, ".env.example", "http-env.example.snap");
});

test("generateProject matches filtered tools and readme snapshots", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-snapshot-filtered-"));

  await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      includePaths: ["/pets*"],
      excludeOperationIds: ["create*"]
    }
  });

  await assertSnapshotMatches(targetDir, "src/tools.ts", "filtered-tools.ts.snap");
  await assertSnapshotMatches(targetDir, "README.md", "filtered-readme.md.snap");
});

test("generateProject respects includeTags and excludeMethods filters", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-filtered-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      includeTags: ["pets"],
      excludeMethods: ["POST"]
    }
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const generatedReadme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");

  assert.equal(result.operationCount, 2);
  assert.equal(result.totalOperationCount, 4);
  assert.match(toolsFile, /list_pets/);
  assert.match(toolsFile, /get_pet/);
  assert.doesNotMatch(toolsFile, /create_pet/);
  assert.doesNotMatch(toolsFile, /get_admin_stats/);
  assert.match(generatedReadme, /include-tags=pets/);
  assert.match(generatedReadme, /exclude-methods=POST/);
});

test("generateProject respects includePaths and excludeOperationIds filters", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-path-filtered-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      includePaths: ["/pets*"],
      excludeOperationIds: ["create*"]
    }
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const generatedReadme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");

  assert.equal(result.operationCount, 2);
  assert.equal(result.totalOperationCount, 4);
  assert.match(toolsFile, /list_pets/);
  assert.match(toolsFile, /get_pet/);
  assert.doesNotMatch(toolsFile, /create_pet/);
  assert.doesNotMatch(toolsFile, /get_admin_stats/);
  assert.match(generatedReadme, /include-paths=\/pets\*/);
  assert.match(generatedReadme, /exclude-operation-ids=create\*/);
});

test("generateProject respects deprecated and response-status filters", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-response-filtered-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      deprecatedOnly: true,
      includeResponseStatuses: ["201"]
    }
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const generatedReadme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");

  assert.equal(result.operationCount, 1);
  assert.equal(result.totalOperationCount, 4);
  assert.match(toolsFile, /create_pet/);
  assert.doesNotMatch(toolsFile, /list_pets/);
  assert.match(generatedReadme, /deprecated-only=true/);
  assert.match(generatedReadme, /include-response-statuses=201/);
  assert.match(toolsFile, /body: z\.object\({[\s\S]*name: z\.string\(\)\.optional\(\)/);
  assert.match(toolsFile, /metadata: z\.object\({[\s\S]*vaccinated: z\.boolean\(\)/);
  assert.match(toolsFile, /traits: z\.array\(z\.string\(\)\)\.optional\(\)/);
  assert.match(toolsFile, /profile: z\.object\({[\s\S]*age: z\.number\(\)\.int\(\)\.optional\(\)[\s\S]*name: z\.string\(\)/);
  assert.ok(toolsFile.includes("identifier: z.union([z.string(), z.number().int()]).optional()"));
  assert.ok(toolsFile.includes("status: z.union([z.string(), z.number().int()]).optional()"));
});

test("generateProject supports YAML specs with local refs and json-like request bodies", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-yaml-"));

  const result = await generateProject({
    specRef: yamlFixturePath,
    outDir: targetDir,
    authPreset: "auto"
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const envFile = await fs.readFile(path.join(targetDir, ".env.example"), "utf8");

  assert.equal(result.projectName, "acme-petstore-yaml-api");
  assert.equal(result.authPreset, "bearer");
  assert.equal(result.operationCount, 4);
  assert.match(toolsFile, /petId: z\.string\(\)/);
  assert.match(toolsFile, /create_pet/);
  assert.match(envFile, /BEARER_TOKEN=replace-me/);
});

