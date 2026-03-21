# Generated Output Preview Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a README section that shows a concrete `spec in -> runnable MCP repo out` preview to improve first-visit comprehension and star conversion.

**Architecture:** The change is README-only plus supporting plan docs. Insert a new proof-oriented section after `Quick start`, using a real generate command, an output tree, and a short generated code excerpt. Keep claims aligned with existing repository capabilities.

**Tech Stack:** Markdown, existing ShipMCP CLI examples, Git, npm test for regression confidence

---

### Task 1: Save the design and plan docs

**Files:**
- Create: `F:\Star\docs\plans\2026-03-21-generated-output-preview-design.md`
- Create: `F:\Star\docs\plans\2026-03-21-generated-output-preview-plan.md`

**Step 1: Write the design doc**

Document the problem, goals, section layout, placement, and constraints for the new README preview section.

**Step 2: Save the implementation plan**

Describe the exact README insertion point, content blocks, and verification steps.

**Step 3: Verify the files exist**

Run:

```bash
Get-ChildItem F:\Star\docs\plans\2026-03-21-generated-output-preview*
```

Expected: both files are listed.

### Task 2: Update the README

**Files:**
- Modify: `F:\Star\README.md`

**Step 1: Insert the new section**

Add `## What ShipMCP actually generates` after `Quick start` and before `Why ShipMCP is different`.

**Step 2: Include the proof blocks**

Add:

- one example input line
- one real generate command
- one generated output tree
- one short generated code excerpt
- one closing line reinforcing editability and shippability

**Step 3: Keep it honest**

Use only examples already supported by the repository. Do not claim features that are not implemented.

### Task 3: Verify and prepare commit

**Files:**
- Verify: `F:\Star\README.md`
- Verify: `F:\Star\docs\plans\2026-03-21-generated-output-preview-design.md`
- Verify: `F:\Star\docs\plans\2026-03-21-generated-output-preview-plan.md`

**Step 1: Inspect the rendered markdown source**

Read the updated section in `README.md` and confirm ordering and clarity.

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
- Stage: `F:\Star\docs\plans\2026-03-21-generated-output-preview-design.md`
- Stage: `F:\Star\docs\plans\2026-03-21-generated-output-preview-plan.md`

**Step 1: Stage exact files**

Run:

```bash
git add README.md docs/plans/2026-03-21-generated-output-preview-design.md docs/plans/2026-03-21-generated-output-preview-plan.md
```

**Step 2: Commit**

Run:

```bash
git commit -m "docs: add generated output preview"
```

**Step 3: Push**

Run:

```bash
git push origin main
```
