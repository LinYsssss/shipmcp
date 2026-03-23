# Demo GIF Launch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prepare ShipMCP launch collateral for a terminal-first demo GIF and align README and launch copy with that asset.

**Architecture:** This is a docs-only change. Add two new docs under `docs/launch/`, update `docs/LAUNCH_COPY.md` to current product scope, and add a small future-GIF placeholder line near the top of the README.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-23-demo-gif-launch-design.md`
- Create: `F:\Star\docs\plans\2026-03-23-demo-gif-launch-plan.md`

**Step 1: Write the design doc**

Document the GIF goals, scope, placement, and launch-copy alignment rules.

**Step 2: Save the implementation plan**

Document the exact docs to add, the launch-copy sections to refresh, and the README placeholder approach.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-23-demo-gif-launch*
```

Expected: both files are listed.

### Task 2: Add GIF collateral docs

**Files:**
- Create: `F:\Star\docs\launch\demo-gif-script.md`
- Create: `F:\Star\docs\launch\demo-gif-checklist.md`

**Step 1: Add the script doc**

Include:

- target duration
- shot sequence
- exact commands
- pause timings
- closing frame text

**Step 2: Add the recording checklist**

Include:

- resolution
- aspect ratio
- terminal setup
- cleanup steps before recording
- export constraints

### Task 3: Refresh launch copy

**Files:**
- Modify: `F:\Star\docs\LAUNCH_COPY.md`

**Step 1: Update the Show HN body**

Replace outdated scope statements so they reflect current support.

**Step 2: Update the X and Reddit copy**

Reflect JSON + YAML, stdio + HTTP, filtering, local refs, and improved schema handling.

**Step 3: Update release notes wording where stale**

Do not keep lines that imply YAML or filtering are still missing.

### Task 4: Add README GIF placeholder

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Add a short future-GIF caption**

Place it near the hero/value-prop area.

**Step 2: Keep it neutral**

Do not embed a broken URL. Use a short line that clearly marks the intended GIF slot.

### Task 5: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\LAUNCH_COPY.md`
- Verify: `F:\Star\docs\launch\demo-gif-script.md`
- Verify: `F:\Star\docs\launch\demo-gif-checklist.md`
- Verify: `F:\Star\docs\plans\2026-03-23-demo-gif-launch-design.md`
- Verify: `F:\Star\docs\plans\2026-03-23-demo-gif-launch-plan.md`

**Step 1: Inspect top README flow**

Confirm the hero area still scans cleanly.

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

Expected: only the targeted docs are staged later.

### Task 6: Commit and push only relevant files

**Files:**
- Stage the exact docs changed in this plan

**Step 1: Stage exact files**

Run `git add` with explicit paths only.

**Step 2: Commit**

Run:

```bash
git commit -m "docs: prepare demo gif launch assets"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
