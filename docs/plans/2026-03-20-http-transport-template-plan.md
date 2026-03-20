# HTTP Transport Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a minimal `--transport http` path that generates a runnable stateless HTTP MCP server template.

**Architecture:** Keep `stdio` as the default path and branch generation only where output differs. For HTTP, reuse the same tool registration logic and swap the generated server bootstrap to an Express + `StreamableHTTPServerTransport` template.

**Tech Stack:** Node.js 22, TypeScript output, Express, `@modelcontextprotocol/sdk`, node:test

---

### Task 1: Lock behavior with a failing generator test

**Files:**
- Modify: `packages/generator/test/generator.test.js`
- Test: `packages/generator/test/generator.test.js`

**Step 1: Write the failing test**
- Add a test for `generateProject({ transport: "http" })`
- Assert generated `package.json`, `src/server.ts`, and `.env.example` contain HTTP-specific output

**Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL because HTTP transport generation does not exist yet

### Task 2: Add minimal transport plumbing

**Files:**
- Modify: `packages/generator/src/index.js`
- Modify: `packages/cli/src/index.js`

**Step 1: Add transport option**
- Thread `transport` through CLI -> generateProject -> render context
- Default to `stdio`

**Step 2: Implement HTTP template**
- Add package/env/README/server branching for `http`
- Keep stdio path unchanged

**Step 3: Run test to verify it passes**
Run: `npm test`
Expected: PASS

### Task 3: Verify generated output and docs

**Files:**
- Modify: `README.md`
- Modify: `docs/CLI_UX.md`
- Modify: `ROADMAP.md` if needed

**Step 1: Add minimal docs for `--transport http`**
- Update quick-start examples and current scope wording only where necessary

**Step 2: Run fresh verification**
Run:
- `npm test`
- `node packages/cli/src/index.js generate examples/specs/petstore.json --out sandbox/petstore-http --transport http --yes`
- `node packages/cli/src/index.js generate examples/specs/petstore.yaml --out sandbox/petstore-http-yaml --transport http --yes`

Expected:
- Tests pass
- Generated projects contain HTTP server template and `PORT=3000`

### Task 4: Commit and push

**Files:**
- Explicitly stage only touched repo files

**Step 1: Commit**
Run:
- `git add <explicit files>`
- `git commit -m "feat: add http transport template"`

**Step 2: Push**
Run:
- `git push origin main`
