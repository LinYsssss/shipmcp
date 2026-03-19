# Contributing to ShipMCP

ShipMCP is being built as a contributor-friendly infrastructure project. The best contributions make the generator more reliable, more predictable, or more useful on real API specs.

## Good first contribution types

- fix a real OpenAPI compatibility bug
- add a small example API
- improve naming or collision handling
- improve generated README output
- improve error messages

## Contribution flow

1. Open an issue with the failing spec or use case.
2. Explain the current output and the expected output.
3. Keep changes narrow and reviewable.
4. Add or update a test when generator behavior changes.

## Priority labels

- `good first issue`
- `help wanted`
- `generator`
- `runtime`
- `spec-compat`
- `docs`
- `examples`

## Local checks

```bash
node --test --test-isolation=none packages/generator/test/generator.test.js
node packages/cli/src/index.js validate examples/specs/petstore.json
```

## Design rule

Do not add broad flexibility if it makes output less predictable. ShipMCP should prefer strong defaults over weak abstractions.


