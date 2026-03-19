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
  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 4);
});

test("summarizeSpec reflects active tag and method filters", async () => {
  const spec = await loadSpec(fixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      includeTags: ["pets"],
      excludeMethods: ["POST"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 2);
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
  assert.equal(result.operationCount, 4);
  assert.match(packageJson, /@modelcontextprotocol\/sdk/);
  assert.match(serverFile, /McpServer/);
});

test("generateProject respects includeTags and excludeMethods filters", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-filtered-"));

  const result = await generateProject({
    specRef: fixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      includeTags: ["pets"],
      excludeMethods: ["POST"]
    }
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const generatedReadme = await fs.readFile(path.join(targetDir, "README.md"), "utf8");

  assert.equal(result.operationCount, 2);
  assert.equal(result.totalOperationCount, 4);
  assert.match(toolsFile, /list_pets/);
  assert.match(toolsFile, /get_pet/);
  assert.doesNotMatch(toolsFile, /create_pet/);
  assert.doesNotMatch(toolsFile, /get_admin_stats/);
  assert.match(generatedReadme, /include-tags=pets/);
  assert.match(generatedReadme, /exclude-methods=POST/);
});
