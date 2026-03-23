# Demo GIF Script

## Goal

Show `OpenAPI in -> runnable MCP repo out` in about 20 seconds.

## Recording flow

### Shot 1: Title hold

Duration: 1-2 seconds

Show:

```text
OpenAPI in. Runnable MCP repo out.
```

### Shot 2: Validate

Duration: 4 seconds

Run:

```bash
node packages/cli/src/index.js validate examples/specs/petstore.yaml
```

Pause long enough for the success output to be readable.

### Shot 3: Generate

Duration: 5 seconds

Run:

```bash
node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-preview --yes
```

Pause long enough for the generated-project output to be readable.

### Shot 4: Show the generated repo

Duration: 4 seconds

Run:

```bash
tree /F sandbox\\petstore-preview
```

Keep these paths visible:

- `src\\server.ts`
- `src\\tools.ts`
- `tests`
- `Dockerfile`
- `.github\\workflows\\ci.yml`

### Shot 5: Show real generated code

Duration: 5 seconds

Open or print:

```text
sandbox/petstore-preview/src/server.ts
```

Pause on the `McpServer` setup and the tool registration loop.

### Closing frame

Duration: 1 second

Show:

```text
Editable. Reviewable. Shippable.
```

## Total target length

18-22 seconds
