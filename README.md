# ShipMCP

[![CI](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/LinYsssss/shipmcp?include_prereleases&label=release)](https://github.com/LinYsssss/shipmcp/releases/tag/v0.1.0-bootstrap)
[![Stars](https://img.shields.io/github/stars/LinYsssss/shipmcp?style=social)](https://github.com/LinYsssss/shipmcp/stargazers)

Turn any OpenAPI spec into a runnable MCP repository you can actually ship.

ShipMCP takes an existing REST API and generates an **editable TypeScript MCP repo** with auth presets, tests, Docker, CI, and a usable README already in place.

**OpenAPI in. Runnable MCP repo out.**

If ShipMCP saves you a day of MCP wiring, star the repo.

## Why people star this

- Most teams already have APIs. They do not want to hand-wire MCP tools, request mapping, auth, Docker, CI, tests, and docs again.
- ShipMCP gives you code you own. It is not a hosted black box and it is not a demo-only generator.
- Large specs stay usable because generation can be filtered by tags, methods, paths, operationIds, status codes, response content types, and deprecated operations.

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

## Why ShipMCP is different

- **Not a toy generator.** ShipMCP generates a repo that already includes tests, Docker, CI, env scaffolding, and a README.
- **Not a hosted builder.** The output is local, editable, reviewable, and self-hostable.
- **Not all-or-nothing on large specs.** You can narrow generation before the repo is created.
- **Built for modern OpenAPI reality.** JSON and YAML are supported, local refs work, nullable type arrays are handled, scalar multi-type arrays are normalized, and record-like `additionalProperties` are generated cleanly.

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
