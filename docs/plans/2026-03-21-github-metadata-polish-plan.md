# GitHub Metadata Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve ShipMCP repository discovery and click-through by polishing GitHub metadata copy and hardening the metadata setup script.

**Architecture:** Keep the changes scoped to `docs/GITHUB_METADATA.md`, `scripts/setup-github.ps1`, and plan docs. Align metadata wording with the current README positioning and add auth preflight before attempting to edit repository settings.

**Tech Stack:** Markdown, PowerShell, GitHub CLI metadata workflow

---

### Task 1: Rewrite metadata copy

**Files:**
- Modify: `F:\Star\docs\GITHUB_METADATA.md`

**Step 1: Improve description and About copy**

Rewrite the description, About pitch, social preview text, and recommended topics to better match the README's stronger positioning.

**Step 2: Keep the copy honest**

Make sure every claim already matches current repository capabilities.

### Task 2: Harden the setup script

**Files:**
- Modify: `F:\Star\scripts\setup-github.ps1`

**Step 1: Add auth preflight**

Check `gh auth status` before attempting `gh repo edit`.
If auth is invalid, stop with a clear remediation message.

**Step 2: Align script values with the updated metadata**

Use the new description and refined topic set in the script.

### Task 3: Verify and commit

**Files:**
- Stage only:
  - `F:\Star\docs\GITHUB_METADATA.md`
  - `F:\Star\scripts\setup-github.ps1`
  - `F:\Star\docs\plans\2026-03-21-github-metadata-polish-design.md`
  - `F:\Star\docs\plans\2026-03-21-github-metadata-polish-plan.md`

**Step 1: Verify script syntax**

Run a PowerShell parser check for `setup-github.ps1`.

**Step 2: Commit**

```bash
git add docs/GITHUB_METADATA.md scripts/setup-github.ps1 docs/plans/2026-03-21-github-metadata-polish-design.md docs/plans/2026-03-21-github-metadata-polish-plan.md
git commit -m "docs: polish github metadata"
```

**Step 3: Push**

Run: `git push origin main`
Expected: the commit lands on `main` without carrying unrelated dirty files.
