# ShipMCP Auto Improve Runbook

## Goal

Maintain a safe hourly improvement loop for ShipMCP that only advances core product capabilities.
This automation exists to keep the repository moving while the owner is away without turning `main` into a half-finished branch.

## Workstream Priority

Always choose the highest-priority task that can be completed safely in one run:

1. response-aware and deprecated-operation selection
2. schema flattening
3. better `oneOf` / `anyOf` / `allOf` handling
4. HTTP transport template
5. generator snapshot coverage

If the current top-priority task is too large, ambiguous, or risky, skip to the next smaller safe task.
Do not force a partial implementation just to produce output.

## Pre-Run Checks

At the start of every run:

1. Inspect `git status` and confirm only repository files will be touched.
2. Confirm `.agents/` remains local-only and untracked.
3. Read `ROADMAP.md` and `docs/ISSUE_BACKLOG.md` to validate the next candidate task.
4. Prefer the smallest decision-complete slice that can land in one commit.

## Guardrails

- Do not touch `.agents/`.
- Do not commit or stage any local skill files.
- Never use `git add .`.
- Stage only explicit repository files.
- Push directly to `main` only after verification passes.
- If verification fails, do not commit partial work.
- If a task becomes risky mid-run, stop that task and choose a smaller one.

## Required Verification

Every run must complete relevant verification before commit:

- `npm test`
- a relevant `validate` command when CLI or filtering behavior changes
- a relevant `generate` command when output generation changes

The exact commands should match the task changed in that run.

## End-of-Run Summary

Every run must end with a concise summary containing:

- task completed
- files changed
- verification results
- commit hash
- next candidate task

Use this shape:

```text
Task: <what shipped>
Files: <comma-separated file list>
Verified: <commands and results>
Commit: <hash>
Next: <next small safe task>
```
