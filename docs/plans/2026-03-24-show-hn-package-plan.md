# Show HN Package Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prepare a complete, ready-to-post Show HN package and align launch docs around it.

**Architecture:** This is a docs-only change. Add four focused docs under `docs/launch/` for the Show HN post flow, and update `docs/LAUNCH_COPY.md` so it references and aligns with the new package.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-24-show-hn-package-design.md`
- Create: `F:\Star\docs\plans\2026-03-24-show-hn-package-plan.md`

**Step 1: Write the design doc**

Document the Show HN package goals, deliverables, narrative, and boundaries.

**Step 2: Save the implementation plan**

Document the exact launch docs to create, the launch-copy update, and the verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-24-show-hn-package*
```

Expected: both files are listed.

### Task 2: Add the Show HN package docs

**Files:**
- Create: `F:\Star\docs\launch\show-hn-post.md`
- Create: `F:\Star\docs\launch\show-hn-first-comment.md`
- Create: `F:\Star\docs\launch\show-hn-reply-bank.md`
- Create: `F:\Star\docs\launch\show-hn-checklist.md`

**Step 1: Add the main post**

Write a clear title and a concise HN body.

**Step 2: Add the first comment**

Include the repo link, what feedback is most useful, and the bridge to demo/GIF assets.

**Step 3: Add the reply bank**

Include short answers for common questions and objections.

**Step 4: Add the checklist**

Include launch-day prep and post-launch follow-up items.

### Task 3: Update launch copy

**Files:**
- Modify: `F:\Star\docs\LAUNCH_COPY.md`

**Step 1: Keep the short-form channel copy**

Preserve the broader launch-copy role of the file.

**Step 2: Add references to the new Show HN package**

Make the file clearly point to the dedicated Show HN docs.

### Task 4: Verify and prepare commit

**Files:**
- Verify all new launch docs and `docs/LAUNCH_COPY.md`

**Step 1: Inspect wording consistency**

Ensure the package matches README and current feature support.

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

Expected: only the intended launch-package files are staged later.

### Task 5: Commit and push only relevant files

**Files:**
- Stage the exact files touched in this plan

**Step 1: Stage exact files**

Run `git add` with explicit paths only.

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add show hn launch package"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
