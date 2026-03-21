# Audience Fit README Section Design

## Summary

Add a short `Best for / Not for` section near the top of the README so visitors can quickly decide whether ShipMCP matches their use case.

The section should sit after the hero copy and CTA, before `Why people star this`. It should help the right visitors self-identify fast while clearly filtering out people who need a different class of product.

## Problem

The current README explains value and output quality well, but it does not yet tell visitors whether ShipMCP is actually meant for them.

That creates two avoidable problems:

- good-fit users need to infer applicability from multiple sections
- poor-fit users keep reading, then bounce later when they realize they want something ShipMCP does not aim to be

## Goal

Make the intended audience legible in one scan.

Specifically:

- attract teams that already have an OpenAPI spec
- attract developers who want editable, self-hostable MCP code
- attract users who care about tests, Docker, and CI from day one
- politely filter out users who want a hosted no-code builder
- politely filter out users who do not yet have an OpenAPI spec
- politely filter out users who require OAuth browser flows or GraphQL today

## Non-goals

- do not expand feature scope
- do not add new product claims
- do not turn the README into a landing page
- do not duplicate the `Supported today` or `Explicitly not in v0.1` sections

## Proposed Structure

### Title

`## Best for`

This keeps the section short and readable, while allowing `Not for` to appear immediately below as a counterpart.

### Best for

- teams that already have an OpenAPI spec
- developers who want editable, self-hostable MCP code
- APIs that need auth, tests, Docker, and CI from day one

### Not for

- teams without an OpenAPI spec yet
- people looking for a hosted no-code builder
- projects that need OAuth browser flows or GraphQL out of the box today

### Closing line

`ShipMCP is for shipping MCP repos from APIs you already own.`

## Design Constraints

- keep the section short enough to scan in under 10 seconds
- use only claims already supported by the repository
- stay in ASCII to avoid markdown encoding issues
- preserve maintainer tone rather than product-marketing tone

## Placement Rationale

Placing this section before `Why people star this` improves top-of-page comprehension:

1. visitor sees what ShipMCP is
2. visitor sees whether ShipMCP is for them
3. visitor then reads deeper value and proof sections

This should improve README conversion by reducing ambiguity without increasing top-of-page clutter too much.
