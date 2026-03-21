# GitHub Metadata Polish Design

## Summary

Improve ShipMCP's GitHub discovery and click-through by tightening repository metadata and making the metadata setup script more reliable.

This slice focuses on the repository surfaces users see before they read the full README:

- description
- topics
- about pitch
- social preview copy
- setup script usability

## Problem

The current metadata is accurate but still generic. It describes the project as a production-ready MCP server generator, but does not fully capture the strongest differentiators:

- editable repo output
- included auth, tests, Docker, and CI
- practical filtering for large specs
- real OpenAPI compatibility work already shipped

The setup script also assumes valid GitHub CLI authentication, which currently fails with a less helpful message than it should.

## Goals

- sharpen the repository description
- improve topic selection for discovery
- align About copy with the stronger README positioning
- improve setup script preflight behavior when `gh` authentication is invalid

## Non-goals

- no screenshot or image generation
- no README structural rewrite in this slice
- no changes to unrelated docs

## Recommended changes

### 1. Stronger metadata copy

Use a shorter, clearer description centered on runnable MCP repo output rather than generic server generation.

### 2. Better topics

Prefer topics that describe the repo category and search intent:

- protocol
- input standard
- tooling style
- developer workflow

Avoid overly brand-specific topics that dilute the repo identity.

### 3. Setup script preflight

Check `gh auth status` before attempting to edit repository settings.
If auth is invalid, fail early with one clear remediation path.

## Validation

The updated metadata should let a GitHub visitor understand, from the repository card or About section alone:

- what ShipMCP does
- why it is relevant to OpenAPI and MCP workflows
- that it generates editable repo output rather than a toy demo
