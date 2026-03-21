# README Proof Section Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a proof-oriented section and curated examples to the README so ShipMCP looks more credible and more star-worthy to first-time visitors.

**Architecture:** Keep the scope limited to README plus design/plan docs. Insert one compact proof section and one curated example list without disturbing the rest of the repo.

**Tech Stack:** Markdown, GitHub README conventions

---

### Task 1: Add the proof layer

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Insert a proof section**

Add a section such as "Built for real OpenAPI specs" that translates existing features into concrete evidence.

**Step 2: Add curated examples**

Add 3 concise example bullets linking to the relevant example specs and clarifying what each demonstrates.

### Task 2: Review and verify

**Files:**
- Review: `F:\Star\README.md`

**Step 1: Validate the flow**

Check that the README now moves through:

- value proposition
- differentiation
- proof
- support matrix
- examples

**Step 2: Validate the claims**

Make sure every proof bullet is already supported by code or tests in the repository.

### Task 3: Commit and push

**Files:**
- Stage only:
  - `F:\Star\README.md`
  - `F:\Star\docs\plans\2026-03-21-readme-proof-section-design.md`
  - `F:\Star\docs\plans\2026-03-21-readme-proof-section-plan.md`

**Step 1: Verify git status**

Run: `git status --short`
Expected: unrelated dirty docs remain unstaged.

**Step 2: Commit**

```bash
git add README.md docs/plans/2026-03-21-readme-proof-section-design.md docs/plans/2026-03-21-readme-proof-section-plan.md
git commit -m "docs: strengthen readme proof section"
```

**Step 3: Push**

Run: `git push origin main`
Expected: the README enhancement lands on `main` without carrying unrelated files.
