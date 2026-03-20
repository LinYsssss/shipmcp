# Snapshot Coverage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add low-noise generator snapshot coverage for the most important generated files across stdio and HTTP transports.

**Architecture:** Keep the existing behavior assertions and add a second layer of tests that compare generated key files against checked-in snapshot fixtures. Store the fixtures beside the generator tests and normalize line endings before comparison so the suite stays stable on Windows and CI.

**Tech Stack:** Node.js 22, node:test, existing generator test harness, checked-in text fixtures

---

### Task 1: Add the failing snapshot test harness

**Files:**
- Create: packages/generator/test/__snapshots__/
- Modify: packages/generator/test/generator.test.js
- Test: packages/generator/test/generator.test.js

**Step 1: Write the failing test**
- Add helpers to read generated files and snapshot fixtures
- Add one test for stdio + JSON spec
- Add one test for http + JSON spec
- Compare exactly these files:
  - package.json
  - src/server.ts
  - src/tools.ts
  - README.md
  - .env.example

**Step 2: Run test to verify it fails**
Run: npm test
Expected: FAIL because the snapshot fixture files do not exist yet

### Task 2: Create the minimal snapshot fixtures

**Files:**
- Create: packages/generator/test/__snapshots__/stdio-package.json.snap
- Create: packages/generator/test/__snapshots__/stdio-server.ts.snap
- Create: packages/generator/test/__snapshots__/stdio-tools.ts.snap
- Create: packages/generator/test/__snapshots__/stdio-readme.md.snap
- Create: packages/generator/test/__snapshots__/stdio-env.example.snap
- Create: packages/generator/test/__snapshots__/http-package.json.snap
- Create: packages/generator/test/__snapshots__/http-server.ts.snap
- Create: packages/generator/test/__snapshots__/http-tools.ts.snap
- Create: packages/generator/test/__snapshots__/http-readme.md.snap
- Create: packages/generator/test/__snapshots__/http-env.example.snap

**Step 1: Generate stable expected output**
- Use current generator output as the approved initial baseline
- Normalize line endings before saving

**Step 2: Run test to verify it passes**
Run: npm test
Expected: PASS

### Task 3: Document snapshot coverage

**Files:**
- Modify: README.md
- Modify: docs/ISSUE_BACKLOG.md

**Step 1: Update docs**
- Mention snapshot coverage where it helps explain generator stability
- Replace the generic backlog item "Snapshot tests" with more specific next-step wording

**Step 2: Run fresh verification**
Run:
- npm test
- node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-snapshot-stdio --yes
- node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-snapshot-http --transport http --yes

Expected:
- Tests pass
- Generated stdio and HTTP projects still match the intended snapshots

### Task 4: Commit and push

**Files:**
- Explicitly stage only touched repo files

**Step 1: Commit**
Run:
- git add <explicit files>
- git commit -m "test: add generator snapshot coverage"

**Step 2: Push**
Run:
- git push origin main
