# Show HN Post

## Title

Show HN: ShipMCP - turn an OpenAPI spec into a runnable MCP repo

## Body

I built ShipMCP because most OpenAPI-to-MCP tools stop too early.

They generate something, but not something I would actually hand to a team and say "ship this".

ShipMCP takes an existing OpenAPI spec and generates an editable TypeScript MCP repo with:

- generated tools
- auth presets
- tests
- Docker
- GitHub Actions
- generated README

Current scope already covers:

- OpenAPI 3.x
- JSON and YAML
- stdio and HTTP transports
- tag, method, path, operationId, response-aware, and deprecated filtering
- local refs
- improved normalization for nullable, multi-type, and additionalProperties cases

The goal is simple: if a team already has an API, they should not have to hand-roll the same MCP glue code every time.

Repo:
https://github.com/LinYsssss/shipmcp

The most useful feedback right now is real OpenAPI specs that break the generator.
