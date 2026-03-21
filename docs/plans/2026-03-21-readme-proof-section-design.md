# README Proof Section Design

## Summary

Add a tighter proof layer to the ShipMCP README so visitors can see, quickly, that the project already handles more than toy OpenAPI inputs.

The README already has a stronger hero and structure. What it still lacks is a compact proof section that turns repository capabilities into star-conversion evidence.

## Problem

The current README explains what ShipMCP does and why it matters, but it still asks visitors to infer too much:

- the project sounds useful, but the strongest evidence is scattered
- examples exist, but they are presented more like commands than proof points
- visitors do not get an immediate "this already handles real API edge cases" signal

For a tooling repo, that missing proof layer reduces both trust and star conversion.

## Goals

- add a short "Built for real OpenAPI specs" section
- surface a few concrete example scenarios near the middle of the README
- convert current capability breadth into fast credibility
- keep the README concise and factual

## Non-goals

- no GIFs or screenshots in this slice
- no new example code generation features
- no edits to unrelated docs

## Recommended structure

### 1. Proof section

Add a short section that directly states the kinds of specs ShipMCP already handles well:

- JSON and YAML inputs
- local refs
- nullable type arrays
- scalar multi-type arrays
- response-aware filtering
- stdio and HTTP output

This should read like evidence, not marketing copy.

### 2. Curated example list

Add 3 short example bullets that each answer:

- what the example is
- what it proves
- where to find it

This keeps the examples useful for both visitors and contributors.

### 3. Placement

Place the proof section after "Why ShipMCP is different" and before the broader support matrix.
That is the point where a visitor is deciding whether the project is already real.

## Validation

The revised README should let a first-time visitor answer these questions within one scroll:

- does this handle anything beyond a toy petstore spec?
- what kinds of OpenAPI complexity are already covered?
- where can I inspect concrete examples right now?
