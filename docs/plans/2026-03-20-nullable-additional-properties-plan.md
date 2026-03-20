# Nullable and AdditionalProperties Compatibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve generated Zod schemas for OpenAPI 3.1 nullable type arrays and object schemas that use additionalProperties.

**Architecture:** Keep the change local to generator schema rendering. Add one compatibility fixture in JSON and YAML, write failing tests first, then implement a narrow normalization helper for nullable type arrays and better object rendering for map-like schemas.

**Tech Stack:** Node.js, node:test, OpenAPI 3.x parsing, Zod code generation

---

### Task 1: Add failing compatibility tests

**Files:**
- Create: `F:\Star\examples\specs\compatibility-nullable.json`
- Create: `F:\Star\examples\specs\compatibility-nullable.yaml`
- Modify: `F:\Star\packages\generator\test\generator.test.js`

**Step 1: Write the failing test**

Add tests that generate projects from the new JSON and YAML fixtures and assert:

- nullable type arrays render as `z.string().nullable()`
- map-like objects render as `z.record(z.string())`
- mixed objects still render with `.catchall(...)`

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL in the new compatibility assertions because the current generator does not normalize `type: ["string", "null"]` or record-like maps well enough.

### Task 2: Implement minimal generator compatibility logic

**Files:**
- Modify: `F:\Star\packages\generator\src\index.js`

**Step 1: Write minimal implementation**

Add a narrow helper that:

- derives an effective scalar/object/array type from `schema.type`
- marks a schema nullable when the type array contains `null`

Update object rendering so that:

- propertyless typed maps use `z.record(...)`
- mixed objects keep `z.object(...).catchall(...)`

**Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS for the new tests and no regressions in the existing generator suite.

### Task 3: Update minimal docs

**Files:**
- Modify: `F:\Star\README.md`
- Modify: `F:\Star\ROADMAP.md`

**Step 1: Document the new compatibility slice**

Update the feature list and near-term roadmap text to reflect support for OpenAPI 3.1 nullable type arrays and improved additionalProperties handling.

**Step 2: Re-run relevant checks**

Run:
- `npm test`
- `node packages/cli/src/index.js generate examples/specs/compatibility-nullable.json --out sandbox/compat-nullable-json --yes`
- `node packages/cli/src/index.js generate examples/specs/compatibility-nullable.yaml --out sandbox/compat-nullable-yaml --yes`

Expected: all commands succeed and generated tools include the expected nullable and map-like Zod output.

### Task 4: Commit and push

**Files:**
- Stage only the files changed in this slice

**Step 1: Verify git status**

Run: `git status --short`
Expected: stage only new fixture, test, code, and doc files; do not stage unrelated dirty docs or `.agents/`.

**Step 2: Commit**

```bash
git add examples/specs/compatibility-nullable.json examples/specs/compatibility-nullable.yaml packages/generator/test/generator.test.js packages/generator/src/index.js README.md ROADMAP.md docs/plans/2026-03-20-nullable-additional-properties-design.md docs/plans/2026-03-20-nullable-additional-properties-plan.md
git commit -m "feat: improve nullable and additionalProperties compatibility"
```

**Step 3: Push**

Run: `git push origin main`
Expected: commit lands on `main` only after fresh verification passes.
