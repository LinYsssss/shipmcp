# Filtered Snapshot Expansion Design

## Goal

Expand generator snapshot coverage to include one high-value filtered JSON scenario without adding redundant fixtures.

## Why this scenario first

Filtered generation is one of the highest-risk areas for silent regressions because it changes:
- generated tool selection
- README filter summary output
- operation counts and onboarding clarity

The current baseline snapshots already protect the unfiltered stdio and HTTP template paths. The next best increment is to protect the files that actually change when filters are applied.

## Scope

Add one filtered JSON snapshot scenario using:
- includePaths: /pets*
- excludeOperationIds: create*

### Snapshot files for this scenario
- src/tools.ts
- README.md

## Why only these files

For this filtered scenario, package.json, src/server.ts, and .env.example are effectively the same as the existing stdio baseline. Snapshotting them again would add churn without improving regression coverage.

## Success criteria

- A regression in filtered tool selection fails the snapshot test
- A regression in README filter summary fails the snapshot test
- The new coverage stays low-noise and easy to maintain
