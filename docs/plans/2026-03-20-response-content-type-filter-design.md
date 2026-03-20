# Response Content-Type Filter Design

## Summary

Add a small but useful response-aware selection slice to ShipMCP:

- collect response content types per operation
- allow include and exclude filtering by response content type
- support wildcard matching so `application/*json*` style filters remain practical

This builds on the existing response-status and deprecated filters without introducing a large new model of response analysis.

## Problem

ShipMCP can already filter operations by method, path, operationId, status code, and deprecation state.
That still leaves a practical gap for larger APIs:

- some operations only return empty acknowledgements
- some return binary content
- some return JSON, which is usually the best first pass for MCP tools

Without response content-type filtering, narrowing generation to useful operations still requires brittle manual curation.

## Goals

- collect response content types from operation responses
- support `include-response-content-types`
- support `exclude-response-content-types`
- support wildcard filters reusing the existing matcher approach
- expose the filters consistently in CLI output and generated README summaries

## Non-goals

- response body schema generation
- response-status priority logic
- transport changes
- snapshot expansion in this slice

## Approach

### Operation metadata

Extend collected operations with a `responseContentTypes` array.
The array should contain unique content types collected from every response entry that declares `content`.

### Filtering

Reuse the current wildcard matching pattern used by path, operationId, and response-status filters:

- include filter passes when any response content type matches
- exclude filter removes operations when any response content type matches

This keeps behavior predictable and aligned with the rest of the CLI.

### Fixture strategy

Use a dedicated response-aware fixture instead of mutating the existing petstore snapshots.
That avoids churn in snapshot coverage and keeps the tests focused on selection behavior.

## Testing strategy

Add one focused fixture with operations that return:

- `application/json`
- `application/problem+json`
- `image/png`
- no response body

Then verify:

- `include-response-content-types=application/json,application/*+json` selects the JSON cases
- `exclude-response-content-types=image/*` removes the binary case
- generated README filter summary includes the new flags

## Risks

- real specs may repeat content types across multiple statuses
- some responses omit `content` entirely

Both are fine in this slice because the filter only needs a deduplicated list of declared content types.
