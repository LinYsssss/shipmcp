# ShipMCP

Turn any OpenAPI spec into a production-ready MCP server in under 90 seconds.

ShipMCP is an open-source generator for teams that already have REST APIs and want a fast path into the MCP ecosystem. The goal is not to spit out a demo. The goal is to generate a repo you can actually run, review, test, and ship.

## Why this repo exists

Most OpenAPI-to-MCP experiments stop at "it generated something".

ShipMCP is opinionated about the next step:

- generate editable TypeScript code
- include auth presets
- include tests
- include Docker
- include CI
- include a readable README

That is the wedge.

## Recommended repository name

Use `shipmcp`.

It is short, memorable, easy to type, and already communicates the value: generate an MCP project you can ship.

Backup names if you want a more aggressive growth-style brand:

- `mcpdock`
- `spec2mcp`
- `mcpforge`

## Current scaffold status

This repository now includes:

- a zero-dependency local CLI scaffold
- a JSON-first OpenAPI loader
- a minimal generator that emits a TypeScript MCP server repo
- product docs, roadmap, backlog, and architecture notes
- a sample Petstore spec for testing the happy path

This bootstrap is intentionally narrow. It proves the shape of the product before deeper compatibility work.

## Quick start

Validate the bundled example:

```bash
node packages/cli/src/index.js validate examples/specs/petstore.json
```

Generate a sample MCP project:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-mcp --yes
```

## Generated output

The generator creates a repository like this:

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

## Docs

- [PRD](docs/PRD.md)
- [Project Plan](docs/PROJECT_PLAN.md)
- [Issue Backlog](docs/ISSUE_BACKLOG.md)
- [Architecture](docs/ARCHITECTURE.md)
- [CLI UX](docs/CLI_UX.md)
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

1. Make JSON OpenAPI generation reliable on real-world specs.
2. Add YAML parsing without bloating onboarding.
3. Improve schema normalization and filtering controls.
4. Expand example coverage and auth presets.

## License

MIT
