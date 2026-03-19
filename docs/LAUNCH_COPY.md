# Launch Copy

## Show HN title

Show HN: ShipMCP ¨C turn any OpenAPI spec into a production-ready MCP server

## Show HN body

I built ShipMCP because most OpenAPI-to-MCP projects stop too early.

They generate something, but not something I would actually hand to a team and say "ship this".

ShipMCP takes an OpenAPI spec and generates an editable TypeScript MCP repository with:

- MCP server scaffold
- tool handlers
- auth preset support
- smoke tests
- Dockerfile
- GitHub Actions CI
- generated README

The goal is simple: if a team already has a REST API, they should not have to hand-roll the same MCP boilerplate every time.

Current bootstrap scope is intentionally narrow: OpenAPI 3.x, JSON-first input, API Key / Bearer auth, TypeScript output.

Repo:
https://github.com/LinYsssss/shipmcp

I would especially value feedback from anyone who has tried connecting an existing API to Claude, Cursor, Codex, or another MCP client.

## X post

Most ¡°OpenAPI to MCP¡± tools generate code.

ShipMCP is trying to generate a repo you can actually ship.

Input:
- OpenAPI spec

Output:
- TypeScript MCP server
- auth preset
- tests
- Docker
- GitHub Actions
- README

Repo: https://github.com/LinYsssss/shipmcp

## Reddit post

I built an open-source project called ShipMCP.

The goal is to turn an existing OpenAPI spec into a production-ready MCP server repo instead of another half-finished demo scaffold.

Current output includes:
- TypeScript MCP server
- generated tools from operations
- API Key / Bearer auth presets
- smoke tests
- Dockerfile
- GitHub Actions CI
- generated README

Repo: https://github.com/LinYsssss/shipmcp

I am looking for real-world OpenAPI specs that break the generator. Those are the best inputs right now.

## Product Hunt tagline

OpenAPI to production-ready MCP server repo

## Product Hunt short description

Generate an editable TypeScript MCP server with auth, tests, Docker, CI, and docs from your OpenAPI spec.

## First GitHub release title

v0.1.0-bootstrap

## First GitHub release notes

ShipMCP bootstrap release.

Included in this version:
- local CLI scaffold
- OpenAPI 3.x JSON-first loading
- basic validation and auth detection
- TypeScript MCP repo generation
- generated Dockerfile, CI, tests, and README
- bundled Petstore sample

What is intentionally missing:
- YAML parsing
- OAuth browser flows
- GraphQL
- advanced filtering
- broader real-world spec normalization

This release is for validating the project shape and collecting real API feedback.
