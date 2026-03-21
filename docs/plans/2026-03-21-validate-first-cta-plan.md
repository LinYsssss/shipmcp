# Validate-First CTA README Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a minimal top-of-page README CTA that asks visitors to validate a real spec in one command before reading deeper.

**Architecture:** This is a README-only change plus supporting plan docs. Insert one short section after `Best for / Not for` and before `Why people star this`, containing a title, one sentence, one validate command, and one short bridge sentence to generation.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-21-validate-first-cta-design.md`
- Create: `F:\Star\docs\plans\2026-03-21-validate-first-cta-plan.md`

**Step 1: Write the design doc**

Document the problem, goals, placement, and wording boundaries for the validate-first CTA.

**Step 2: Save the implementation plan**

Document the exact insertion point, exact content shape, and verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-21-validate-first-cta*
```

Expected: both files are listed.

### Task 2: Update the README

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Insert the new section**

Add `## Try ShipMCP in 30 seconds` after the audience-fit section and before `## Why people star this`.

**Step 2: Add the minimal CTA content**

Add:

- one short intro sentence
- one validate command using `examples/specs/petstore.yaml`
- one short closing line that points readers toward generation

**Step 3: Keep it tight**

Avoid adding more than one command or more than two short sentences around it.

### Task 3: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\plans\2026-03-21-validate-first-cta-design.md`
- Verify: `F:\Star\docs\plans\2026-03-21-validate-first-cta-plan.md`

**Step 1: Inspect the markdown source**

Read the updated top section of the README and confirm the new CTA does not crowd the hero.

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
- Stage: `F:\Star\docs\plans\2026-03-21-validate-first-cta-design.md`
- Stage: `F:\Star\docs\plans\2026-03-21-validate-first-cta-plan.md`

**Step 1: Stage exact files**

Run:

```bash
git add README.md docs/plans/2026-03-21-validate-first-cta-design.md docs/plans/2026-03-21-validate-first-cta-plan.md
```

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add validate-first cta"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
