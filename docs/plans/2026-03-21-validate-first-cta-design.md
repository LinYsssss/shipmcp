# Validate-First CTA README Section Design

## Summary

Add a very short call-to-action section near the top of the README that encourages visitors to validate a real spec first.

The section should sit after `Best for / Not for` and before `Why people star this`. It should lower the first-action barrier without adding top-of-page clutter.

## Problem

The README now explains audience fit and product value well, but it still does not offer a lightweight first action near the top. The first real command is lower on the page, which means some visitors will bounce before they try anything.

Because the chosen strategy is to optimize for the lowest-friction action, the top CTA should not ask visitors to generate a full repo first. It should ask them to validate a real spec.

## Goal

Make the first action feel trivial:

- show one command only
- use a real bundled spec
- keep the section short enough to scan in a few seconds
- gently point the reader toward generation afterward without duplicating `Quick start`

## Non-goals

- do not replace `Quick start`
- do not add multiple commands
- do not explain the CLI in detail
- do not add more product claims

## Proposed Structure

### Title

`## Try ShipMCP in 30 seconds`

### Body

A single sentence:

`Validate a real spec first:`

Then one command block:

```bash
node packages/cli/src/index.js validate examples/specs/petstore.yaml
```

Then one closing line:

`If that looks good, generate a runnable repo next.`

## Design Constraints

- keep the section extremely short
- preserve whitespace and scanning rhythm near the top of the README
- avoid repeating the later `Quick start` section too closely
- stay in ASCII to avoid encoding issues

## Placement Rationale

Placing this section after audience fit means the top-of-page flow becomes:

1. what ShipMCP is
2. who it is for
3. one easy action to try it
4. deeper value and proof below

This should improve first-action conversion without diluting the README's technical tone.
