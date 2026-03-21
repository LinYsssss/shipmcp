# Manual MCP Wiring Comparison Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a short before/after README section that makes the cost of manual MCP wiring obvious and contrasts it with ShipMCP's one-command path.

**Architecture:** This is a README-focused change plus supporting plan docs. Insert one comparison section after `Why people star this` and before `What you get`, using two short checklists and one closing line. Keep all claims aligned with existing ShipMCP capabilities.

**Tech Stack:** Markdown, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-design.md`
- Create: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-plan.md`

**Step 1: Write the design doc**

Document the problem, goals, comparison structure, placement, and constraints.

**Step 2: Save the implementation plan**

Document the exact README insertion point, wording boundaries, and verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-21-manual-wiring-comparison*
```

Expected: both files are listed.

### Task 2: Update the README

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Insert the new section**

Add `## Manual MCP wiring is expensive` after `Why people star this` and before `What you get`.

**Step 2: Add the comparison blocks**

Add:

- one short framing sentence
- one `Without ShipMCP` checklist
- one `With ShipMCP` checklist
- one closing line reinforcing that ShipMCP removes repetitive setup work, not review

**Step 3: Keep the tone disciplined**

Avoid inflated marketing language. The section should feel like a maintainer explaining the value, not an ad page.

### Task 3: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-design.md`
- Verify: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-plan.md`

**Step 1: Inspect the markdown source**

Read the updated README section and confirm ordering, clarity, and tone.

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

Expected: only the README and the two new plan files are staged later; the existing dirty docs remain unstaged.

### Task 4: Commit and push only relevant files

**Files:**
- Stage: `F:\Star\README.md`
- Stage: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-design.md`
- Stage: `F:\Star\docs\plans\2026-03-21-manual-wiring-comparison-plan.md`

**Step 1: Stage exact files**

Run:

```bash
git add README.md docs/plans/2026-03-21-manual-wiring-comparison-design.md docs/plans/2026-03-21-manual-wiring-comparison-plan.md
```

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add manual wiring comparison"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
