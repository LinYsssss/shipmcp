# Social Preview Package Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align GitHub metadata, social preview copy, and the repository setup script with the current ShipMCP positioning.

**Architecture:** This is a docs-and-script change. Update `docs/GITHUB_METADATA.md`, add a small `docs/launch/social-preview-copy.md` helper, and adjust `scripts/setup-github.ps1` so the repository description matches the refreshed metadata package.

**Tech Stack:** Markdown, PowerShell, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-23-social-preview-package-design.md`
- Create: `F:\Star\docs\plans\2026-03-23-social-preview-package-plan.md`

**Step 1: Write the design doc**

Document the metadata goals, wording updates, and file targets.

**Step 2: Save the implementation plan**

Document the exact metadata fields to update and the verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-23-social-preview-package*
```

Expected: both files are listed.

### Task 2: Update metadata docs

**Files:**
- Modify: `F:\Star\docs\GITHUB_METADATA.md`
- Create: `F:\Star\docs\launch\social-preview-copy.md`

**Step 1: Refresh metadata wording**

Update description, About pitch, and social preview subtext to match the new README positioning.

**Step 2: Add a social preview helper doc**

Add a compact doc with:

- headline
- subtext
- optional short variants

### Task 3: Update the setup script

**Files:**
- Modify: `F:\Star\scripts\setup-github.ps1`

**Step 1: Keep the topic list unless a clear improvement is needed**

Do not churn topics unnecessarily.

**Step 2: Update the description constant**

Match the latest approved wording from the metadata doc.

### Task 4: Verify and prepare commit

**Files:**
- Verify: `F:\Star\docs\GITHUB_METADATA.md`
- Verify: `F:\Star\docs\launch\social-preview-copy.md`
- Verify: `F:\Star\scripts\setup-github.ps1`
- Verify: `F:\Star\docs\plans\2026-03-23-social-preview-package-design.md`
- Verify: `F:\Star\docs\plans\2026-03-23-social-preview-package-plan.md`

**Step 1: Inspect wording consistency**

Make sure README, launch copy, metadata doc, and setup script all reinforce the same message.

**Step 2: Run regression confidence check**

Run:

```bash
npm test
```

Expected: all tests pass.

**Step 3: Check git status**

Run:

```bash
git status --short
```

Expected: only the intended files are staged later.

### Task 5: Commit and push only relevant files

**Files:**
- Stage the exact files touched in this plan

**Step 1: Stage exact files**

Run `git add` with explicit paths only.

**Step 2: Commit**

Run:

```bash
git commit -m "docs: align social preview metadata"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
