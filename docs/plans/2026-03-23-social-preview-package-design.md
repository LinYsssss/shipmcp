# Social Preview Package Design

## Summary

Unify the GitHub-facing metadata around the current ShipMCP positioning so repository cards, About text, and setup scripts all tell the same story.

This change should improve first impressions outside the README itself, especially on GitHub shares and repo discovery surfaces.

## Problem

The README narrative has been sharpened significantly, but the GitHub metadata layer still lags behind. The current metadata is serviceable, but it is not yet fully aligned with the new top-level message:

- `OpenAPI in. Runnable MCP repo out.`
- editable output
- built to ship, not to demo

Without that alignment, the repository card and About surface underperform relative to the README.

## Goal

- keep the repository description optimized for search and discovery
- make the About pitch more conversion-oriented
- improve the future social preview copy for shared links
- ensure the PowerShell setup script applies the same language

## Non-goals

- do not create actual social preview images
- do not change repository topics unless clearly beneficial
- do not modify the README in this slice
- do not depend on `gh` authentication during implementation

## Proposed Package

### Description

Keep it short and searchable:

`Generate a runnable MCP repo from any OpenAPI spec.`

### About pitch

Shift toward clearer value:

`Editable TypeScript MCP repos with auth, tests, Docker, CI, and filters.`

### Social preview headline

Keep it simple:

`ShipMCP`

### Social preview subtext

Make it action- and outcome-oriented:

`Turn an OpenAPI spec into a runnable MCP repo you can review, edit, and ship.`

### Topics

Keep the current topic set unless a clearly stronger replacement emerges during implementation review.

## Files to Update

- `docs/GITHUB_METADATA.md`
- `scripts/setup-github.ps1`
- one new supporting doc for social preview copy

## Design Constraints

- ASCII only
- no broken or misleading claims
- no dependency on successful live GitHub updates
- language should match the README hero and launch copy
