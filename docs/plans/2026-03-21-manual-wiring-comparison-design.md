# Manual MCP Wiring Comparison Design

## Summary

Add a compact before/after comparison block to the README that makes the pain of manual MCP wiring obvious in one scan.

The new section should sit after `Why people star this` and before `What you get`. It should compare the repetitive setup work teams do by hand with the single-command workflow ShipMCP provides.

## Problem

The current README explains value and shows generated output, but it still does not make the original pain sufficiently concrete. A visitor can understand what ShipMCP generates without fully feeling why that matters.

For first-time visitors, especially those arriving from GitHub or social links, the strongest conversion point is often not feature depth. It is immediate recognition of wasted work they already dislike.

## Goal

Show that manual MCP wiring is expensive because teams usually need to hand-build:

- tool wiring
- auth handling
- request mapping
- tests
- Docker
- CI
- README and onboarding notes

Then contrast that with ShipMCP's one-command path to a generated repository.

## Non-goals

- Add new product claims
- Replace the existing generated output preview section
- Add graphics, tables, or images
- Rewrite the whole README

## Recommended Structure

### Title

`## Manual MCP wiring is expensive`

### Framing sentence

`Most teams do not need another MCP demo. They need to stop rebuilding the same glue code around APIs they already own.`

### Comparison blocks

#### Without ShipMCP

A short checklist of repetitive work:

- wire MCP tools by hand
- map params and request bodies to HTTP calls
- add auth handling
- scaffold tests
- add Docker and CI
- write the first README and setup notes

#### With ShipMCP

A shorter list centered on generated leverage:

- run one generate command
- review the generated TypeScript repo
- adjust names or auth as needed
- commit and ship from a real project structure

### Closing line

`ShipMCP does not remove review. It removes repetitive setup work.`

## Design Constraints

- Keep the section short and scannable
- Preserve technical credibility; avoid inflated marketing copy
- Use only claims already supported by the repository
- Stay in ASCII to avoid encoding issues

## Placement Rationale

Placing the section before `What you get` improves the narrative order:

1. explain the pain
2. contrast the ShipMCP workflow
3. then show the concrete generated output and examples

This should improve README conversion without making the page feel like a landing page instead of an open-source infrastructure repo.
