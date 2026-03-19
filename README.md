# ShipMCP

[![CI](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml/badge.svg)](https://github.com/LinYsssss/shipmcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Release](https://img.shields.io/github/v/release/LinYsssss/shipmcp?include_prereleases&label=release)](https://github.com/LinYsssss/shipmcp/releases/tag/v0.1.0-bootstrap)
[![Stars](https://img.shields.io/github/stars/LinYsssss/shipmcp?style=social)](https://github.com/LinYsssss/shipmcp/stargazers)

Turn any OpenAPI spec into a production-ready MCP server in under 90 seconds.

ShipMCP generates an **editable TypeScript MCP repository** from your OpenAPI spec, with auth presets, tests, Docker, CI, and a usable README included.

It is not trying to be another "look, it generated some code" demo.
It is trying to be the shortest path from **existing REST API** to **something you can actually ship into the MCP ecosystem**.

## The problem

Most teams already have APIs.
What they do not have is time to manually wire:

- MCP tool definitions
- request mapping
- auth handling
- Docker
- CI
- smoke tests
- onboarding docs

That repeated setup work is the gap ShipMCP is designed to remove.

## What ShipMCP generates

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

## Current v0.1 bootstrap scope

ShipMCP currently focuses on the minimum path that matters:

- OpenAPI `3.x`
- local or remote spec input
- JSON and YAML spec input
- TypeScript MCP server output
- `API Key` and `Bearer Token` auth presets
- generated tests
- generated Dockerfile
- generated GitHub Actions CI
- generated project README
- local `#/components/...` $ref resolution for parameters, request bodies, and schemas
- tag and HTTP method filtering

Explicitly not in v0.1:

- OAuth browser flows
- GraphQL
- GUI builder
- hosted generation
- multi-language output

## Quick start

Validate the bundled spec:

```bash
node packages/cli/src/index.js validate examples/specs/petstore.yaml
```

Generate a sample MCP repo from JSON:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-mcp --yes
```

Generate the same sample from YAML with local refs:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-yaml --yes
```

Generate only the `pets` tools and skip `POST` endpoints:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-readonly --include-tags pets --exclude-methods post --yes
```

Run the local project checks:

```bash
npm test
node packages/cli/src/index.js doctor
```

## Why filtering matters

Real OpenAPI specs get large fast.
If ShipMCP emits every operation by default on a large internal API, the generated MCP surface becomes noisy and harder to review.

Filtering is the first practical control layer:

- `--include-tags pets,admin`
- `--exclude-tags internal`
- `--include-methods get,post`
- `--exclude-methods delete`

## Example output

The bundled JSON and YAML samples currently generate these tools before filtering:

- `list_pets` -> `GET /pets`
- `create_pet` -> `POST /pets`
- `get_pet` -> `GET /pets/{petId}`
- `get_admin_stats` -> `GET /admin/stats`

See the generated sample in [sandbox/petstore-mcp](sandbox/petstore-mcp).

## Why this project can attract contributors

ShipMCP has a natural contribution surface:

- real-world spec compatibility fixes
- auth presets
- naming and normalization rules
- generator templates
- example APIs
- docs and launch assets

This is the kind of infrastructure project that can compound if the first 20 contributors each add one real API edge case.

## Repository name

Primary name: `shipmcp`

Backup names if you ever rebrand:

- `mcpforge`
- `spec2mcp`
- `mcpdock`

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
2. Expand filter coverage and operation selection.
3. Improve schema flattening and composed-schema naming quality.
4. Add more showcase examples for launch.
5. Tighten generated runtime error handling.

## Contributing

If ShipMCP fails on your spec, that is not noise. That is roadmap signal.

Open an issue with:

- the failing spec or a reduced repro
- current output
- expected output
- auth requirements if relevant

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
