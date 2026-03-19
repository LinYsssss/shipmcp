import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { generateProject, loadSpec, summarizeSpec, validateSpec } from "../src/index.js";

const jsonFixturePath = path.resolve("examples/specs/petstore.json");
const yamlFixturePath = path.resolve("examples/specs/petstore.yaml");

test("validateSpec accepts the bundled petstore JSON fixture", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const result = validateSpec(spec);
  const summary = summarizeSpec(spec);

  assert.equal(result.ok, true);
  assert.equal(summary.title, "Acme Petstore API");
  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 4);
});

test("loadSpec parses YAML fixtures and keeps operation counts stable", async () => {
  const spec = await loadSpec(yamlFixturePath);
  const result = validateSpec(spec);
  const summary = summarizeSpec(spec);

  assert.equal(result.ok, true);
  assert.equal(summary.title, "Acme Petstore YAML API");
  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 4);
});

test("summarizeSpec reflects active tag and method filters", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      includeTags: ["pets"],
      excludeMethods: ["POST"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 2);
});

test("summarizeSpec reflects path and operationId wildcard filters", async () => {
  const spec = await loadSpec(jsonFixturePath);
  const summary = summarizeSpec(spec, {
    filterOptions: {
      includePaths: ["/pets*"],
      excludeOperationIds: ["create*"]
    }
  });

  assert.equal(summary.operationCount, 4);
  assert.equal(summary.selectedOperationCount, 2);
});

test("generateProject writes a runnable scaffold", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
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
    specRef: jsonFixturePath,
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

test("generateProject respects includePaths and excludeOperationIds filters", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-path-filtered-"));

  const result = await generateProject({
    specRef: jsonFixturePath,
    outDir: targetDir,
    authPreset: "auto",
    filterOptions: {
      includePaths: ["/pets*"],
      excludeOperationIds: ["create*"]
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
  assert.match(generatedReadme, /include-paths=\/pets\*/);
  assert.match(generatedReadme, /exclude-operation-ids=create\*/);
});

test("generateProject supports YAML specs with local refs and json-like request bodies", async () => {
  const targetDir = await fs.mkdtemp(path.join(os.tmpdir(), "shipmcp-yaml-"));

  const result = await generateProject({
    specRef: yamlFixturePath,
    outDir: targetDir,
    authPreset: "auto"
  });

  const toolsFile = await fs.readFile(path.join(targetDir, "src", "tools.ts"), "utf8");
  const envFile = await fs.readFile(path.join(targetDir, ".env.example"), "utf8");

  assert.equal(result.projectName, "acme-petstore-yaml-api");
  assert.equal(result.authPreset, "bearer");
  assert.equal(result.operationCount, 4);
  assert.match(toolsFile, /petId: z\.string\(\)/);
  assert.match(toolsFile, /body: z\.record\(z\.string\(\), z\.unknown\(\)\)/);
  assert.match(toolsFile, /create_pet/);
  assert.match(envFile, /BEARER_TOKEN=replace-me/);
});
