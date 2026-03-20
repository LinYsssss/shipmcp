# Multi-Type Array Normalization Design

## Summary

Improve ShipMCP's OpenAPI 3.1 compatibility for schemas that use JSON Schema style type arrays such as:

- `type: ["string", "integer"]`
- `type: ["string", "integer", "null"]`

The goal is to generate stable Zod unions instead of silently collapsing these schemas to a single fallback type.

## Problem

ShipMCP already handles:

- classic `nullable: true`
- OpenAPI 3.1 `type: ["string", "null"]`
- `oneOf` and `anyOf`

But broader type arrays still degrade output quality because they are not rendered as explicit unions.
That means real-world 3.1 schemas can lose intent when they express compact multi-type constraints directly in `type`.

## Goals

- render scalar multi-type arrays as `z.union([...])`
- preserve declared type order for stable output
- append `.nullable()` when the type array includes `null`
- cover both JSON and YAML fixtures

## Non-goals

- discriminator support
- object and array unions inside `type` arrays
- full JSON Schema normalization
- snapshot expansion in this slice

## Approach

Add one narrow helper in the Zod rendering path:

- if `schema.type` is an array
- split `null` from non-null types
- if one non-null type remains, keep the current normalization path
- if multiple scalar non-null types remain, render `z.union([...])`
- if `null` was present, append `.nullable()` after the union

This keeps the change local and avoids broad rewrites to composed-schema handling.

## Testing strategy

Add a dedicated compatibility fixture with request body fields like:

- `idOrName: type: ["string", "integer"]`
- `statusOrCode: type: ["string", "integer", "null"]`

Then verify the generated tools include:

- `z.union([z.string(), z.number().int()])`
- `z.union([z.string(), z.number().int()]).nullable()`

## Risks

- type arrays that include `object` or `array` remain ambiguous
- stable union ordering matters for predictable diffs

This slice avoids the first risk by limiting support to scalar type arrays only and solves the second by preserving source order.
