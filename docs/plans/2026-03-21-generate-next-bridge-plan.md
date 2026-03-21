# Generate Next Bridge Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the next step after `validate` explicit in the top README CTA by adding one inline `generate` command.

**Architecture:** This is a README-only change plus supporting plan docs. Keep the existing validate-first section intact and only replace the closing sentence with an inline `generate` command using the same example spec.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-design.md`
- Create: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-plan.md`

**Step 1: Write the design doc**

Document the problem, goal, wording change, and placement rationale for the inline bridge.

**Step 2: Save the implementation plan**

Document the exact README sentence replacement and verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-21-generate-next-bridge*
```

Expected: both files are listed.

### Task 2: Update the README

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Keep the current CTA structure**

Preserve:

- the section title
- the validate intro sentence
- the existing validate code block

**Step 2: Replace the closing sentence**

Change:

```text
If that looks good, generate a runnable repo next.
```

To:

```text
If that looks good, generate a runnable repo next with `node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-preview --yes`.
```

**Step 3: Keep the top compact**

Do not add another fenced block or extra explanatory lines.

### Task 3: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-design.md`
- Verify: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-plan.md`

**Step 1: Inspect the top of the README**

Read the first 50-70 lines and confirm the flow is:

- hero
- audience fit
- validate CTA
- inline generate bridge
- value sections below

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

Expected: only the README and the two new plan files are staged later; unrelated dirty docs remain unstaged.

### Task 4: Commit and push only relevant files

**Files:**
- Stage: `F:\Star\README.md`
- Stage: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-design.md`
- Stage: `F:\Star\docs\plans\2026-03-21-generate-next-bridge-plan.md`

**Step 1: Stage exact files**

Run:

```bash
git add README.md docs/plans/2026-03-21-generate-next-bridge-design.md docs/plans/2026-03-21-generate-next-bridge-plan.md
```

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add generate-next bridge"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
