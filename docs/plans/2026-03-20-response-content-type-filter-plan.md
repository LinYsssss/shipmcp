# Response Content-Type Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add include and exclude filtering for operation response content types.

**Architecture:** Extend collected operation metadata with response content types, thread new filter options through generator and CLI layers, and cover the change with focused behavior tests using a dedicated fixture.

**Tech Stack:** Node.js, node:test, OpenAPI 3.x parsing, wildcard-based CLI filtering

---

### Task 1: Add failing fixture-driven tests

**Files:**
- Create: `F:\Star\examples\specs\response-aware-filter.json`
- Modify: `F:\Star\packages\generator\test\generator.test.js`

**Step 1: Write the failing test**

Add tests that verify:

- `summarizeSpec` reflects response content-type filters
- `generateProject` includes JSON-style responses when asked
- `generateProject` excludes binary-style responses when asked
- generated README filter summary includes the new filter names

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because ShipMCP does not yet collect or filter response content types.

### Task 2: Implement minimal generator and CLI support

**Files:**
- Modify: `F:\Star\packages\generator\src\index.js`
- Modify: `F:\Star\packages\cli\src\index.js`

**Step 1: Write minimal implementation**

Add:

- `responseContentTypes` collection per operation
- `includeResponseContentTypes` and `excludeResponseContentTypes` in normalized filter options
- wildcard matching in `applyOperationFilters`
- CLI parsing, help text, and filter summary rendering

**Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS with no regressions.

### Task 3: Update docs

**Files:**
- Modify: `F:\Star\README.md`
- Modify: `F:\Star\docs\CLI_UX.md`
- Modify: `F:\Star\ROADMAP.md`

**Step 1: Document the new filter slice**

Update quick examples and filtering docs to show content-type filtering.

**Step 2: Run focused CLI verification**

Run:
- `node packages/cli/src/index.js validate examples/specs/response-aware-filter.json --include-response-content-types application/json,application/*+json`
- `node packages/cli/src/index.js generate examples/specs/response-aware-filter.json --out sandbox/response-aware-json --include-response-content-types application/json,application/*+json --yes`

Expected: output reflects selected operations and filter summary.

### Task 4: Commit and push

**Files:**
- Stage only files changed for this slice

**Step 1: Verify git status**

Run: `git status --short`
Expected: unrelated dirty docs stay unstaged.

**Step 2: Commit**

```bash
git add examples/specs/response-aware-filter.json packages/generator/test/generator.test.js packages/generator/src/index.js packages/cli/src/index.js README.md docs/CLI_UX.md ROADMAP.md docs/plans/2026-03-20-response-content-type-filter-design.md docs/plans/2026-03-20-response-content-type-filter-plan.md
git commit -m "feat: add response content-type filters"
```

**Step 3: Push**

Run: `git push origin main`
Expected: the commit lands on `main` only after fresh verification passes.
