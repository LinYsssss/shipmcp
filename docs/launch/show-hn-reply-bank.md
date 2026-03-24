# Show HN Reply Bank

## What is different from other OpenAPI-to-MCP tools?

ShipMCP is trying to generate a repo you can actually keep and ship, not just a thin demo scaffold.

## Why generate a repo instead of a hosted builder?

Because the teams I care about usually want editable code, self-hosting, normal code review, and the ability to extend the output.

## Does it support private APIs?

Yes. The model is the same as long as you have an OpenAPI spec and can provide auth/config at runtime.

## What does it support today?

OpenAPI 3.x, JSON and YAML, stdio and HTTP transports, filters, local refs, and stronger schema normalization than the initial bootstrap version.

## What does it not support yet?

OAuth browser flows, GraphQL, hosted generation, and multi-language output are still out of scope right now.

## What kind of feedback do you want most?

Real-world specs that break generation or make the output feel less shippable than it should.
