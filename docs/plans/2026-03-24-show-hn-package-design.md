# Show HN Package Design

## Summary

Create a complete, ready-to-post Show HN package for ShipMCP and keep the launch docs aligned around that package.

The package should give the user everything needed to post without improvising: title, body, first comment, reply bank, and a short launch checklist.

## Problem

Current launch materials contain useful copy, but they are still spread across general-purpose docs. That increases friction at the exact moment the project needs a clean, fast launch workflow.

## Goal

- produce a single Show HN package that is ready to use
- reduce launch-day improvisation
- keep the copy aligned with current ShipMCP capabilities
- make future iteration easier by separating main post, first comment, and common replies

## Non-goals

- do not auto-post to Hacker News
- do not create or upload GIF assets in this change
- do not rewrite README in this slice

## Deliverables

- `docs/launch/show-hn-post.md`
- `docs/launch/show-hn-first-comment.md`
- `docs/launch/show-hn-reply-bank.md`
- `docs/launch/show-hn-checklist.md`
- updated `docs/LAUNCH_COPY.md`

## Core Narrative

The package should center on one message:

`ShipMCP is not another MCP demo generator. It generates a runnable repo you can actually review, edit, and ship.`

## Design Constraints

- ASCII only
- keep the HN body readable and not overloaded with feature lists
- keep replies short and concrete
- align all claims with the current repository state
