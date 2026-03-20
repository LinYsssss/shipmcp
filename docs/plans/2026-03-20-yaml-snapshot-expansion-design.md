# YAML Snapshot Expansion Design

## Goal

Expand generator snapshot coverage to include the YAML stdio path so ShipMCP protects both primary spec input formats.

## Why this scenario now

The current snapshot matrix already covers:
- stdio + JSON
- http + JSON
- filtered + JSON

The highest-value remaining gap is YAML input. YAML changes more than just parser behavior: it also affects generated project naming, README content, server naming, and default env values tied to the YAML fixture metadata.

## Scope

Add one YAML stdio snapshot scenario using the existing petstore YAML fixture.

### Snapshot files
- package.json
- src/server.ts
- src/tools.ts
- README.md
- .env.example

## Why full key-file coverage here

Unlike the filtered JSON scenario, YAML changes several generated files beyond tools and README. Partial snapshots would miss project-level drift in names and environment scaffolding.

## Success criteria

- YAML-generated key files match checked-in fixtures
- A regression in YAML output fails the test suite immediately
- No generator behavior changes are required beyond test coverage
