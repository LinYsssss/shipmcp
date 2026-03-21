# ShipMCP

[![CI](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/LinYsssss/shipmcp?include_prereleases&label=release)](https://github.com/LinYsssss/shipmcp/releases/tag/v0.1.0-bootstrap)
[![Stars](https://img.shields.io/github/stars/LinYsssss/shipmcp?style=social)](https://github.com/LinYsssss/shipmcp/stargazers)

Turn any OpenAPI spec into a runnable MCP repository you can actually ship.

ShipMCP takes an existing REST API and generates an **editable TypeScript MCP repo** with auth presets, tests, Docker, CI, and a usable README already in place.

**OpenAPI in. Runnable MCP repo out.**

If ShipMCP saves you a day of MCP wiring, star the repo.

## Best for

- teams that already have an OpenAPI spec
- developers who want editable, self-hostable MCP code
- APIs that need auth, tests, Docker, and CI from day one

## Not for

- teams without an OpenAPI spec yet
- people looking for a hosted no-code builder
- projects that need OAuth browser flows or GraphQL out of the box today

ShipMCP is for shipping MCP repos from APIs you already own.

## Why people star this

- Most teams already have APIs. They do not want to hand-wire MCP tools, request mapping, auth, Docker, CI, tests, and docs again.
- ShipMCP gives you code you own. It is not a hosted black box and it is not a demo-only generator.
- Large specs stay usable because generation can be filtered by tags, methods, paths, operationIds, status codes, response content types, and deprecated operations.

## Manual MCP wiring is expensive

Most teams do not need another MCP demo. They need to stop rebuilding the same glue code around APIs they already own.

### Without ShipMCP

- wire MCP tools by hand
- map params and request bodies to HTTP calls
- add auth handling
- scaffold tests
- add Docker and CI
- write the first README and setup notes

### With ShipMCP

- run one generate command
- review the generated TypeScript repo
- adjust names or auth as needed
- commit and ship from a real project structure

ShipMCP does not remove review. It removes repetitive setup work.

## What you get

Given one OpenAPI file, ShipMCP creates a repo like this:

```text
my-api-mcp/
  src/
    server.ts
    client.ts
    tools.ts
  tests/
    smoke.test.ts
    api.test.ts
  openapi/
    source.json
  .env.example
  Dockerfile
  README.md
  .github/workflows/ci.yml
  package.json
  tsconfig.json
```

That output is meant to be reviewed, edited, committed, and shipped.

## Quick start

Validate a spec:

```bash
node packages/cli/src/index.js validate examples/specs/petstore.yaml
```

Generate a runnable MCP repo:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-mcp --yes
```

Run local checks:

```bash
npm test
node packages/cli/src/index.js doctor
```

## What ShipMCP actually generates

Give ShipMCP one OpenAPI file. Get back a runnable repo you can review, edit, and ship.

Input:

```text
examples/specs/petstore.yaml
```

Command:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-preview --yes
```

Output:

```text
petstore-preview/
  src/
    server.ts
    client.ts
    tools.ts
  tests/
    smoke.test.ts
    api.test.ts
  openapi/
    source.yaml
  .env.example
  Dockerfile
  README.md
  .github/workflows/ci.yml
  package.json
  tsconfig.json
```

Generated `src/server.ts` excerpt:

```ts
const server = new McpServer({
  name: "acme-petstore-api",
  version: "0.1.0"
});

for (const tool of generatedTools) {
  server.tool(tool.name, tool.inputSchema, async (input) => {
    const response = await callApi(tool, input);
    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
    };
  });
}

const transport = new StdioServerTransport();
await server.connect(transport);
```

Editable. Reviewable. Shippable.

## Why ShipMCP is different

- **Not a toy generator.** ShipMCP generates a repo that already includes tests, Docker, CI, env scaffolding, and a README.
- **Not a hosted builder.** The output is local, editable, reviewable, and self-hostable.
- **Not all-or-nothing on large specs.** You can narrow generation before the repo is created.
- **Built for modern OpenAPI reality.** JSON and YAML are supported, local refs work, nullable type arrays are handled, scalar multi-type arrays are normalized, and record-like `additionalProperties` are generated cleanly.

## Built for real OpenAPI specs

ShipMCP already handles more than a toy single-file petstore flow.

- **JSON and YAML both work today.** You can generate from either format without changing the workflow.
- **Local refs are supported.** Parameters, request bodies, and schemas can resolve through `#/components/...`.
- **Modern OpenAPI 3.1 edge cases are already covered.** Nullable type arrays and scalar multi-type arrays are normalized into usable Zod output.
- **Large specs can be narrowed before generation.** Response-aware, path, tag, method, and operation filters keep the generated MCP surface reviewable.
- **Output is not locked to one transport.** ShipMCP can generate both `stdio` and `http` MCP repos today.

You can inspect concrete examples in this repo right now:

- [`examples/specs/petstore.yaml`](examples/specs/petstore.yaml) -> baseline YAML support plus local `$ref` resolution.
- [`examples/specs/compatibility-nullable.json`](examples/specs/compatibility-nullable.json) -> nullable type arrays and cleaner `additionalProperties` handling.
- [`examples/specs/response-aware-filter.json`](examples/specs/response-aware-filter.json) -> response status and response content-type filtering.
- [`examples/specs/multi-type-array.json`](examples/specs/multi-type-array.json) -> scalar multi-type array normalization such as `type: ["string", "integer"]`.

## Supported today

ShipMCP currently supports:

- OpenAPI `3.x`
- local or remote spec input
- JSON and YAML input
- TypeScript MCP server output for `stdio` and `http`
- `API Key` and `Bearer Token` auth presets
- generated tests, Docker, and GitHub Actions CI
- local `#/components/...` `$ref` resolution for parameters, request bodies, and schemas
- structured Zod input generation for objects and arrays
- OpenAPI 3.1 nullable and scalar multi-type arrays such as `type: ["string", "null"]` and `type: ["string", "integer"]`
- improved `additionalProperties` handling for record-like maps and mixed objects
- generator snapshot coverage for key stdio and HTTP outputs
- filtering by tag, method, path, operationId, response status, response content type, and deprecated state

Explicitly not in v0.1:

- OAuth browser flows
- GraphQL
- GUI builders
- hosted generation
- multi-language output

## Filtering is a feature, not an afterthought

Real OpenAPI specs get large fast. If ShipMCP emits every operation from a large internal API, the generated MCP surface gets noisy and harder to review.

ShipMCP already supports practical control layers such as:

- `--include-tags pets,admin`
- `--exclude-tags internal`
- `--include-methods get,post`
- `--exclude-methods delete`
- `--include-paths /pets*,/billing/*`
- `--exclude-paths /admin/*`
- `--include-operation-ids listPets,getPet`
- `--exclude-operation-ids create*,delete*`
- `--include-response-statuses 200,201,2*`
- `--exclude-response-statuses 4*,5*`
- `--include-response-content-types application/json,application/*+json`
- `--exclude-response-content-types image/*,application/octet-stream`
- `--deprecated-only`
- `--exclude-deprecated`

Path, operationId, response-status, and response-content-type filters support `*` wildcards.

## More examples

Generate the sample from YAML with local refs:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-yaml --yes
```

Generate an HTTP MCP repo:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-http --transport http --yes
```

Generate only `/pets*` paths while excluding matching operationIds:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-focused --include-paths /pets* --exclude-operation-ids create* --yes
```

Generate only operations with JSON-style responses:

```bash
node packages/cli/src/index.js generate examples/specs/response-aware-filter.json --out sandbox/response-aware-json --include-response-content-types application/json,application/*+json --yes
```

## If your spec breaks, that is roadmap signal

ShipMCP is a better open-source project when real specs hit it.

Open an issue with:

- the failing spec or a reduced repro
- the current output
- the expected output
- auth requirements if relevant

This repo has a natural contribution surface:

- real-world spec compatibility fixes
- auth presets
- naming and normalization rules
- generator templates
- example APIs
- docs and launch assets

## Docs

- [PRD](docs/PRD.md)
- [Project Plan](docs/PROJECT_PLAN.md)
- [Issue Backlog](docs/ISSUE_BACKLOG.md)
- [Architecture](docs/ARCHITECTURE.md)
- [CLI UX](docs/CLI_UX.md)
- [GitHub Metadata](docs/GITHUB_METADATA.md)
- [Launch Copy](docs/LAUNCH_COPY.md)
- [Bootstrap Release Notes](docs/RELEASE_v0.1.0-bootstrap.md)
- [GitHub Setup](docs/GITHUB_SETUP.md)
- [Automation Runbook](docs/AUTOMATION_RUNBOOK.md)
- [Roadmap](ROADMAP.md)
- [Contributing](CONTRIBUTING.md)

## Monorepo layout

```text
packages/
  cli/
  generator/
  runtime/
examples/
  specs/
docs/
```

## Near-term focus

1. Improve real-world OpenAPI compatibility beyond local refs.
2. Expand schema normalization for discriminated unions, object and array multi-type arrays, and remaining additionalProperties edge cases.
3. Expand response-aware selection beyond status-code and deprecated filters.
4. Add more showcase examples for launch.
5. Tighten generated runtime error handling.

## License

MIT




