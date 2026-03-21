# Generated Output Preview Design

## Summary

Add a compact "Generated Output Preview" section to the README to show, in one scan, what ShipMCP turns an OpenAPI spec into.

The section should sit after `Quick start` and before `Why ShipMCP is different`. It should focus on proof, not hype: a real generate command, a generated repository tree, a short code excerpt, and a closing line that reinforces the repo is editable, reviewable, and ready to ship.

## Problem

The current README explains the value well, but it still asks visitors to infer what the generated output actually looks like. That creates friction for developers skimming the page from GitHub Trending, Hacker News, or social links.

Without a concrete preview, ShipMCP can still feel like:

- a toy directory scaffold
- a hosted builder with opaque output
- a generator that only works for demos

## Goals

- Show `spec in -> runnable repo out` in under 10 seconds
- Prove the output is real code, not just a file tree
- Reinforce the core positioning: editable, reviewable, shippable
- Improve README star conversion without adding visual assets or depending on GitHub settings

## Non-goals

- Add GIFs or screenshots
- Rewrite the rest of the README
- Change product claims or supported feature lists
- Introduce marketing-heavy comparison language

## Proposed Section

### Title

`## What ShipMCP actually generates`

### Supporting sentence

`Give ShipMCP one OpenAPI file. Get back a runnable repo you can review, edit, and ship.`

### Content blocks

1. `Input`
   A short line pointing to an existing repo example such as `examples/specs/petstore.yaml`.
2. `Command`
   One real `generate` command with `--out`.
3. `Output`
   A generated repository tree with the most convincing files surfaced:
   - `src/server.ts`
   - `src/tools.ts`
   - `tests/`
   - `.env.example`
   - `Dockerfile`
   - `.github/workflows/ci.yml`
4. `Proof`
   A small excerpt from generated code that looks readable and real.
5. `Closing line`
   `Editable. Reviewable. Shippable.`

## Design Constraints

- Keep the whole section short enough to scan without scrolling fatigue
- Use only ASCII text to avoid encoding issues
- Prefer concrete output over feature restatement
- Do not duplicate the existing `What you get` section too closely; this section should feel like proof, not another summary

## Placement Rationale

Placing this section immediately after `Quick start` gives visitors:

1. the shortest path to "how do I run it?"
2. immediate proof of what they will receive
3. a stronger bridge into the deeper positioning sections that follow

This order should improve comprehension for first-time visitors without making the README feel salesy.
