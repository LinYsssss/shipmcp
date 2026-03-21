# Audience Fit README Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a short `Best for / Not for` README section that quickly signals which users ShipMCP is built for and which users should not expect it to fit their current needs.

**Architecture:** This is a README-only change plus supporting plan docs. Insert one short audience-fit section after the hero and CTA, before `Why people star this`, using two compact bullet lists and one closing sentence. Keep every claim aligned with current product scope.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-design.md`
- Create: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-plan.md`

**Step 1: Write the design doc**

Document the problem, audience goals, section structure, placement, and wording boundaries.

**Step 2: Save the implementation plan**

Document the exact insertion point in the README, the bullet content, and the verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-21-audience-fit-readme*
```

Expected: both files are listed.

### Task 2: Update the README

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Insert the new section**

Add the new audience-fit section after the opening CTA and before `## Why people star this`.

**Step 2: Add the two fit lists**

Add:

- a `Best for` list
- a `Not for` list
- one closing line explaining ShipMCP is for shipping MCP repos from APIs users already own

**Step 3: Keep the scope honest**

Avoid implying hosted workflows, GUI flows, or OAuth browser support.

### Task 3: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-design.md`
- Verify: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-plan.md`

**Step 1: Inspect the markdown source**

Read the updated README and confirm the new section flows cleanly between the hero and the value sections.

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

Expected: only the README and the two new plan files are staged later; existing dirty docs remain unstaged.

### Task 4: Commit and push only relevant files

**Files:**
- Stage: `F:\Star\README.md`
- Stage: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-design.md`
- Stage: `F:\Star\docs\plans\2026-03-21-audience-fit-readme-plan.md`

**Step 1: Stage exact files**

Run:

```bash
git add README.md docs/plans/2026-03-21-audience-fit-readme-design.md docs/plans/2026-03-21-audience-fit-readme-plan.md
```

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add audience fit section"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
