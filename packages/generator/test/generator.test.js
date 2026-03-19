import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { generateProject, loadSpec, summarizeSpec, validateSpec } from "../src/index.js";

const fixturePath = path.resolve("examples/specs/petstore.json");

test("validateSpec accepts the bundled petstore fixture", async () => {
  const spec = await loadSpec(fixturePath);
  const result = validateSpec(spec);
  const summary = summarizeSpec(spec);

  assert.equal(result.ok, true);
  assert.equal(summary.title, "Acme Petstore API");
  assert.ok(summary.operationCount >= 3);
});

test("generateProject writes a runnable scaffold", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-"));

  const result = await generateProject({
    specRef: fixturePath,
    outDir: targetDir,
    authPreset: "auto"
  });

  const packageJson = await fs.readFile(path.join(targetDir, "package.json"), "utf8");
  const serverFile = await fs.readFile(path.join(targetDir, "src", "server.ts"), "utf8");

  assert.equal(result.projectName, "acme-petstore-api");
  assert.match(packageJson, /@modelcontextprotocol\/sdk/);
  assert.match(serverFile, /McpServer/);
});
