# Launch Copy

## Show HN title

Show HN: ShipMCP - turn an OpenAPI spec into a runnable MCP repo

## Show HN body

I built ShipMCP because most OpenAPI-to-MCP tools stop too early.

They generate something, but not something I would actually hand to a team and say "ship this".

ShipMCP takes an OpenAPI spec and generates an editable TypeScript MCP repository with:

- MCP server scaffold
- generated tools
- auth presets
- smoke tests
- Dockerfile
- GitHub Actions CI
- generated README

The goal is simple: if a team already has a REST API, they should not have to hand-roll the same MCP boilerplate every time.

Current scope already covers:

- OpenAPI 3.x
- JSON and YAML
- stdio and HTTP transports
- tag, method, path, operationId, response-status, response-content-type, and deprecated filtering
- local refs
- improved normalization for nullable, multi-type, and additionalProperties cases

Repo:
https://github.com/LinYsssss/shipmcp

I would especially value feedback from anyone who has tried connecting an existing API to Claude, Cursor, Codex, or another MCP client.

## X post

Most "OpenAPI to MCP" tools generate code.

ShipMCP is trying to generate a repo you can actually ship.

Input:
- OpenAPI spec

Output:
- editable TypeScript MCP repo
- auth presets
- tests
- Docker
- GitHub Actions
- README

Now supports JSON + YAML, stdio + HTTP, filters, local refs, and better schema normalization.

Repo: https://github.com/LinYsssss/shipmcp

## X post (short)

OpenAPI in.
Runnable MCP repo out.

ShipMCP generates an editable TypeScript MCP repo with auth, tests, Docker, CI, and docs.

Not a toy scaffold.
Not a hosted black box.

https://github.com/LinYsssss/shipmcp

## Reddit post

I built an open-source project called ShipMCP.

The goal is to turn an existing OpenAPI spec into a runnable MCP repo instead of another half-finished demo scaffold.

Current output includes:
- editable TypeScript MCP repo
- generated tools from operations
- API Key / Bearer auth presets
- smoke tests
- Dockerfile
- GitHub Actions CI
- generated README

Current scope also includes:
- JSON and YAML input
- stdio and HTTP transports
- filtering for large specs
- local refs
- improved schema normalization

Repo: https://github.com/LinYsssss/shipmcp

I am looking for real-world OpenAPI specs that break the generator. Those are the best inputs right now.

## Product Hunt tagline

OpenAPI to runnable MCP repo

## Product Hunt short description

Generate an editable TypeScript MCP repo with auth, tests, Docker, CI, and docs from your OpenAPI spec.

## Demo GIF caption

From one OpenAPI file to a runnable MCP repo in seconds.

## First GitHub release title

v0.1.0-bootstrap

## First GitHub release notes

ShipMCP bootstrap release.

Included in this version:
- local CLI scaffold
- OpenAPI 3.x loading for JSON and YAML
- validation and auth detection
- TypeScript MCP repo generation
- stdio and HTTP transport templates
- filtering for large specs
- generated Dockerfile, CI, tests, and README
- bundled Petstore sample

What is intentionally missing:
- OAuth browser flows
- GraphQL
- hosted generation
- multi-language output

This release is for validating the project shape and collecting real API feedback.
