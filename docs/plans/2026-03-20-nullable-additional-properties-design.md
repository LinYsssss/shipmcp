# Nullable and AdditionalProperties Compatibility Design

## Summary

Improve ShipMCP's real-world OpenAPI compatibility in one small slice:

- support OpenAPI 3.1 nullable schemas written as `type: ["<base>", "null"]`
- generate better object schemas for `additionalProperties`

This work is intentionally narrow. It does not attempt discriminator support, full JSON Schema normalization, or broad response-shape analysis.

## Problem

ShipMCP already supports OpenAPI 3.x, local refs, composed inputs, and transport templates, but two common schema forms still degrade output quality:

1. OpenAPI 3.1 nullable fields often use `type: ["string", "null"]` instead of `nullable: true`
2. free-form maps often use `additionalProperties`, where `z.object({}).catchall(...)` is less readable than `z.record(...)`

When these forms are not normalized well, generated tool input schemas look inaccurate or overly noisy.

## Goals

- Treat `type: ["X", "null"]` as base type `X` plus nullable behavior
- Preserve existing `nullable: true` handling
- Render propertyless map-like objects as `z.record(...)`
- Keep mixed objects with declared properties as `z.object(...).catchall(...)`
- Cover both JSON and YAML generation paths with tests

## Non-goals

- discriminated union support
- full support for arbitrary type arrays
- output changes for transport templates
- changes to the existing snapshot matrix

## Approach

### Nullable normalization

Add a lightweight schema normalization step in the Zod rendering path:

- if `schema.type` is an array
- remove `"null"`
- if exactly one non-null type remains, use it as the effective base type
- mark the schema as nullable

This keeps the implementation local to schema rendering and avoids broad refactors.

### additionalProperties rendering

Improve object rendering with two modes:

- if an object has no named `properties` and has typed `additionalProperties`, emit `z.record(valueSchema)`
- if an object has named properties and typed `additionalProperties`, keep `z.object(...).catchall(valueSchema)`
- if `additionalProperties === true`, keep permissive catchall behavior

This produces more readable output for map-like request fields while preserving the existing behavior for mixed objects.

## Testing strategy

Add targeted tests with a dedicated compatibility fixture in both JSON and YAML:

- verify `type: ["string", "null"]` becomes `z.string().nullable()`
- verify `additionalProperties: { type: "string" }` becomes `z.record(z.string())`
- verify mixed objects still use `.catchall(...)`

Use behavior assertions instead of expanding snapshots again in this slice.

## Risks

- changing type inference could affect existing composed-schema behavior
- `type` arrays with multiple non-null entries are still ambiguous

Both are contained by limiting the new logic to the simple and common `["X", "null"]` case and leaving broader unions unchanged.
