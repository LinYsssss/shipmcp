# Filtered Snapshot Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a filtered JSON snapshot scenario that protects generated tools and README output.

**Architecture:** Reuse the existing snapshot helpers and add one more scenario-specific test. Only snapshot files whose content changes under filtering so the fixture set stays small and meaningful.

**Tech Stack:** Node.js 22, node:test, checked-in text fixtures

---

### Task 1: Add the failing filtered snapshot test

**Files:**
- Modify: packages/generator/test/generator.test.js
- Test: packages/generator/test/generator.test.js

**Step 1: Write the failing test**
- Add one filtered generation test with:
  - includePaths: /pets*
  - excludeOperationIds: create*
- Compare these files against checked-in fixtures:
  - src/tools.ts
  - README.md

**Step 2: Run test to verify it fails**
Run: npm test
Expected: FAIL because the filtered snapshot fixture files do not exist yet

### Task 2: Create the filtered snapshot fixtures

**Files:**
- Create: packages/generator/test/__snapshots__/filtered-tools.ts.snap
- Create: packages/generator/test/__snapshots__/filtered-readme.md.snap

**Step 1: Generate approved baseline output**
- Use the current generator output for the chosen filtered scenario
- Normalize line endings before saving

**Step 2: Run test to verify it passes**
Run: npm test
Expected: PASS

### Task 3: Update minimal docs

**Files:**
- Modify: README.md
- Modify: docs/ISSUE_BACKLOG.md

**Step 1: Update wording**
- Narrow the remaining snapshot expansion note from "YAML and filtered" to "YAML"
- Keep wording concise and ASCII-safe

**Step 2: Run fresh verification**
Run:
- npm test
- node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-snapshot-filtered --include-paths /pets* --exclude-operation-ids create* --yes

Expected:
- Tests pass
- Filtered generated output matches the intended fixtures

### Task 4: Commit and push

**Files:**
- Explicitly stage only touched repo files

**Step 1: Commit**
Run:
- git add <explicit files>
- git commit -m "test: expand filtered snapshot coverage"

**Step 2: Push**
Run:
- git push origin main
