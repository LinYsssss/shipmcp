# YAML Snapshot Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add stdio snapshot coverage for the YAML petstore fixture.

**Architecture:** Reuse the existing snapshot helpers and add one more scenario-specific test. Snapshot the same five key files used by the stdio JSON baseline so the YAML path has equivalent protection.

**Tech Stack:** Node.js 22, node:test, checked-in text fixtures

---

### Task 1: Add the failing YAML snapshot test

**Files:**
- Modify: packages/generator/test/generator.test.js
- Test: packages/generator/test/generator.test.js

**Step 1: Write the failing test**
- Add one YAML stdio snapshot test using examples/specs/petstore.yaml
- Compare these files:
  - package.json
  - src/server.ts
  - src/tools.ts
  - README.md
  - .env.example

**Step 2: Run test to verify it fails**
Run: npm test
Expected: FAIL because the YAML snapshot fixture files do not exist yet

### Task 2: Create the YAML snapshot fixtures

**Files:**
- Create: packages/generator/test/__snapshots__/yaml-package.json.snap
- Create: packages/generator/test/__snapshots__/yaml-server.ts.snap
- Create: packages/generator/test/__snapshots__/yaml-tools.ts.snap
- Create: packages/generator/test/__snapshots__/yaml-readme.md.snap
- Create: packages/generator/test/__snapshots__/yaml-env.example.snap

**Step 1: Generate approved baseline output**
- Use the current YAML generator output as the approved baseline
- Normalize line endings before saving

**Step 2: Run test to verify it passes**
Run: npm test
Expected: PASS

### Task 3: Update minimal docs

**Files:**
- Modify: README.md
- Modify: docs/ISSUE_BACKLOG.md

**Step 1: Update wording**
- Remove the remaining YAML snapshot expansion note from README near-term focus
- Remove the YAML snapshot expansion item from the backlog

**Step 2: Run fresh verification**
Run:
- npm test
- node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-snapshot-yaml --yes

Expected:
- Tests pass
- Generated YAML project matches the intended fixtures

### Task 4: Commit and push

**Files:**
- Explicitly stage only touched repo files

**Step 1: Commit**
Run:
- git add <explicit files>
- git commit -m "test: add yaml snapshot coverage"

**Step 2: Push**
Run:
- git push origin main
