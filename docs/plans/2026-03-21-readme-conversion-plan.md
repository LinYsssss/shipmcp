# README Conversion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the ShipMCP README into a more effective GitHub conversion page while preserving technical credibility.

**Architecture:** Keep all work constrained to README plus design/plan docs. Strengthen the hero and top-half structure, preserve existing capability coverage, and avoid touching unrelated dirty documentation files.

**Tech Stack:** Markdown, GitHub README conventions, developer-tooling positioning

---

### Task 1: Rewrite the README structure

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Replace the opening sections**

Rewrite the top of the README to include:

- a sharper hero
- a short CTA for starring
- a "why people star this" proof section
- a tighter quick-start section

**Step 2: Preserve technical trust**

Keep:

- capability scope
- filtering examples
- contribution guidance
- docs links

But move them into a clearer narrative order.

### Task 2: Review the final content

**Files:**
- Review: `F:\Star\README.md`

**Step 1: Check for conversion quality**

Verify that the README answers:

- what it does
- why it is different
- why it is worth starring
- how to try it

within the first screen or two.

**Step 2: Check for credibility**

Verify that all claims are already supported by the repository.

### Task 3: Commit and push

**Files:**
- Stage only:
  - `F:\Star\README.md`
  - `F:\Star\docs\plans\2026-03-21-readme-conversion-design.md`
  - `F:\Star\docs\plans\2026-03-21-readme-conversion-plan.md`

**Step 1: Verify git status**

Run: `git status --short`
Expected: unrelated dirty docs remain unstaged.

**Step 2: Commit**

```bash
git add README.md docs/plans/2026-03-21-readme-conversion-design.md docs/plans/2026-03-21-readme-conversion-plan.md
git commit -m "docs: improve readme conversion"
```

**Step 3: Push**

Run: `git push origin main`
Expected: the README refresh lands on `main` without carrying unrelated files.
