# Multi-Type Array Normalization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate stable Zod unions for OpenAPI 3.1 scalar type arrays, including nullable variants.

**Architecture:** Add one fixture in JSON and YAML, write failing generator tests first, then implement a narrow helper in the schema-rendering path that converts scalar type arrays into unions while preserving nullable behavior.

**Tech Stack:** Node.js, node:test, OpenAPI 3.x parsing, Zod code generation

---

### Task 1: Add failing fixture-driven tests

**Files:**
- Create: `F:\Star\examples\specs\multi-type-array.json`
- Create: `F:\Star\examples\specs\multi-type-array.yaml`
- Modify: `F:\Star\packages\generator\test\generator.test.js`

**Step 1: Write the failing test**

Add tests that verify generated tools contain:

- `z.union([z.string(), z.number().int()]).optional()`
- `z.union([z.string(), z.number().int()]).nullable().optional()`

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because ShipMCP does not yet render broader scalar type arrays as unions.

### Task 2: Implement minimal generator support

**Files:**
- Modify: `F:\Star\packages\generator\src\index.js`

**Step 1: Write minimal implementation**

Add helpers that:

- detect scalar multi-type arrays
- render the corresponding Zod union
- preserve existing nullable handling for `null`

**Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS with no regressions.

### Task 3: Update minimal docs

**Files:**
- Modify: `F:\Star\README.md`
- Modify: `F:\Star\ROADMAP.md`

**Step 1: Document the new compatibility slice**

Update the feature list and roadmap wording to reflect support for scalar type arrays.

**Step 2: Re-run focused CLI checks**

Run:
- `node packages/cli/src/index.js generate examples/specs/multi-type-array.json --out sandbox/multi-type-array-json --yes`
- `node packages/cli/src/index.js generate examples/specs/multi-type-array.yaml --out sandbox/multi-type-array-yaml --yes`

Expected: generated tools contain the expected union expressions.

### Task 4: Commit and push

**Files:**
- Stage only files changed for this slice

**Step 1: Verify git status**

Run: `git status --short`
Expected: unrelated dirty docs stay unstaged.

**Step 2: Commit**

```bash
git add examples/specs/multi-type-array.json examples/specs/multi-type-array.yaml packages/generator/test/generator.test.js packages/generator/src/index.js README.md ROADMAP.md docs/plans/2026-03-20-multi-type-array-normalization-design.md docs/plans/2026-03-20-multi-type-array-normalization-plan.md
git commit -m "feat: support scalar multi-type arrays"
```

**Step 3: Push**

Run: `git push origin main`
Expected: the commit lands on `main` only after fresh verification passes.
