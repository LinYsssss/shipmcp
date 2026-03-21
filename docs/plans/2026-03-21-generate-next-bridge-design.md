# Generate Next Bridge Design

## Summary

Add a lightweight inline `generate` bridge to the existing `Try ShipMCP in 30 seconds` README section.

The goal is to keep the validate-first call to action intact while making the next step explicit without adding another fenced code block.

## Problem

The top-of-page CTA already lowers the first-action barrier by asking visitors to validate a real spec. The remaining gap is that the next step is still described abstractly instead of shown concretely.

That means some readers will stop at "validate works" without immediately seeing the exact command that turns the validated spec into a runnable repo.

## Goal

- keep the top CTA compact
- preserve the validate-first flow
- make the follow-up `generate` action explicit
- avoid adding enough structure to crowd the top of the README

## Non-goals

- do not add a second fenced code block
- do not create a new README section
- do not change the surrounding audience-fit or value sections
- do not introduce new product claims

## Proposed Change

Keep the existing section structure:

- `## Try ShipMCP in 30 seconds`
- one intro sentence
- one validate command block

Only replace the closing sentence:

- from: `If that looks good, generate a runnable repo next.`
- to: `If that looks good, generate a runnable repo next with `node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-preview --yes`.`

## Design Constraints

- use the same `petstore.yaml` example as the validate step
- keep the bridge inline rather than block-level
- stay in ASCII to avoid encoding issues
- preserve scanning rhythm near the top of the README

## Placement Rationale

The current section already sits in the right place:

1. audience fit
2. first action
3. why the project matters

The bridge should strengthen step 2 without making the top of the page feel heavy.
