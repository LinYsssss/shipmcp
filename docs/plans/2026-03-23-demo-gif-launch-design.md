# Demo GIF Launch Design

## Summary

Add a lightweight documentation bundle for a terminal-first demo GIF and align launch copy with the current ShipMCP feature set.

The GIF should prove one story only: `OpenAPI in -> runnable MCP repo out`. It should stay focused on the validate -> generate -> inspect flow already established in the README.

## Problem

The README has become strong at explaining value, fit, and output, but there is still no reusable launch asset that visually compresses the story into a short clip.

The current launch copy is also stale in one important way: it still describes ShipMCP as JSON-first and narrower than the current feature set. That creates avoidable trust loss if used externally.

## Goal

- create a decision-complete GIF script that anyone can record
- add a recording checklist so the asset stays visually clean
- refresh launch copy to match current capabilities
- reserve a clear placement for a future GIF in the README without pretending the asset already exists

## Non-goals

- do not record or generate the GIF in this change
- do not add images to the repository yet
- do not restructure the entire README
- do not rewrite non-launch docs

## Proposed Deliverables

### 1. GIF script

Add a script document under `docs/launch/` with:

- duration target
- exact commands
- exact shot order
- end-state text

### 2. Recording checklist

Add a second document under `docs/launch/` with:

- terminal styling guidance
- resolution and aspect ratio
- cleanliness checks before recording
- export constraints

### 3. Launch copy refresh

Update `docs/LAUNCH_COPY.md` so it reflects current reality:

- JSON and YAML
- stdio and HTTP
- filters
- local refs
- stronger normalization coverage

### 4. README placeholder

Insert a small placeholder line near the hero area for the future GIF:

- one short sentence under the main value prop
- one markdown image placeholder block comment or neutral alt line is acceptable
- do not embed a broken remote image URL

## Placement Rationale

The README should be ready for a GIF without becoming awkward before the asset exists.

The best location remains:

1. title
2. badges
3. value prop
4. GIF slot
5. audience fit
6. first CTA

## Design Constraints

- keep everything ASCII-only
- keep the README honest before the GIF exists
- align all launch claims with current repository capabilities
- keep the GIF narrative terminal-first, not client-demo-first
