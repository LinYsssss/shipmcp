# Snapshot Coverage Design

## Goal

Add low-noise, maintainable generator snapshot coverage for ShipMCP so key generated files stay stable across the primary stdio and HTTP template paths.

## Problem

The current generator tests prove that important strings exist, but they do not protect the full structure of generated files. That leaves room for silent regressions in:
- package.json dependency and script layout
- src/server.ts transport templates
- src/tools.ts overall generated shape
- README.md generated onboarding content
- .env.example placeholder values

## Chosen Scope

Use key-file snapshots, not full repository snapshots.

### Snapshot files
- package.json
- src/server.ts
- src/tools.ts
- README.md
- .env.example

### Snapshot scenarios
- stdio + JSON spec
- http + JSON spec

## Why not full-repo snapshots

Full repository snapshots are too noisy. Small README wording changes or harmless file ordering changes would create large diffs and make the tests expensive to maintain. ShipMCP needs a stable guardrail around the highest-value generator output first.

## Design

### Test strategy
- Keep using node:test
- Do not add a separate snapshot framework
- Generate temporary projects during tests
- Compare selected generated files against checked-in fixtures
- Normalize line endings before comparison to avoid CRLF/LF drift

### Snapshot storage
- packages/generator/test/__snapshots__/
- One fixture per file per scenario, for example:
  - stdio-package.json.snap
  - stdio-server.ts.snap
  - stdio-tools.ts.snap
  - stdio-readme.md.snap
  - stdio-env.example.snap
  - http-package.json.snap
  - http-server.ts.snap
  - http-tools.ts.snap
  - http-readme.md.snap
  - http-env.example.snap

### Update policy
- No auto-update flag in v1
- Fixture changes stay explicit and checked into git
- Failure messages must clearly show which snapshot mismatched

## Success Criteria

- A structural regression in a key template file fails the test suite immediately
- Both stdio and HTTP generator paths have snapshot protection
- No new test dependencies are introduced
