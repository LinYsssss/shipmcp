#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import {
  detectAuthPreset,
  generateProject,
  loadSpec,
  summarizeSpec,
  validateSpec
} from "../../generator/src/index.js";
import { inspectEnvironment } from "../../runtime/src/index.js";

async function main() {
  const [command = "help", ...argv] = process.argv.slice(2);

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "doctor") {
    runDoctor();
    return;
  }

  if (command === "dev") {
    printDevHelp();
    return;
  }

  if (argv.length === 0) {
    fail("Missing required <spec> argument. Use `shipmcp help`.");
  }

  const specRef = argv[0];
  const flags = parseFlags(argv.slice(1));
  const filterOptions = buildFilterOptions(flags);

  if (command === "validate") {
    await runValidate(specRef, flags, filterOptions);
    return;
  }

  if (command === "init" || command === "generate") {
    await runGenerate(specRef, flags, filterOptions);
    return;
  }

  fail(`Unknown command: ${command}`);
}

async function runValidate(specRef, flags, filterOptions) {
  const spec = await loadSpec(specRef);
  const validation = validateSpec(spec, { filterOptions });
  const summary = summarizeSpec(spec, { filterOptions });
  const authPreset = detectAuthPreset(spec, flags.auth ?? "auto");

  console.log(`Spec: ${summary.title}`);
  console.log(`Version: ${summary.version}`);
  console.log(`Paths: ${summary.pathCount}`);
  console.log(`Operations: ${summary.operationCount}`);

  if (hasActiveFilters(filterOptions)) {
    console.log(`Selected operations: ${summary.selectedOperationCount}`);
    console.log(`Filters: ${formatFilters(filterOptions)}`);
  }

  console.log(`Suggested auth preset: ${authPreset}`);

  if (validation.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of validation.warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (!validation.ok) {
    console.log("");
    console.log("Errors:");
    for (const error of validation.errors) {
      console.log(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("");
  console.log("Validation passed.");
}

async function runGenerate(specRef, flags, filterOptions) {
  const outputDir = flags.out
    ? path.resolve(process.cwd(), flags.out)
    : undefined;

  const result = await generateProject({
    specRef,
    outDir: outputDir,
    projectName: flags.name,
    authPreset: flags.auth ?? "auto",
    filterOptions,
    yes: flags.yes ?? false
  });

  console.log(`Generated project: ${result.outDir}`);
  console.log(`Project name: ${result.projectName}`);
  console.log(`Detected auth preset: ${result.authPreset}`);

  if (result.filterSummary) {
    console.log(`Operations emitted: ${result.operationCount} of ${result.totalOperationCount}`);
    console.log(`Filters: ${result.filterSummary}`);
  } else {
    console.log(`Operations emitted: ${result.operationCount}`);
  }

  console.log("");
  console.log("Next:");
  console.log(`  cd ${result.outDir}`);
  console.log("  npm install");
  console.log("  cp .env.example .env");
  console.log("  npm run dev");
}

function runDoctor() {
  const report = inspectEnvironment();

  console.log("ShipMCP doctor");
  console.log(`- Node: ${report.nodeVersion}`);
  console.log(`- Current directory: ${report.cwd}`);
  console.log(`- Fetch available: ${report.hasFetch ? "yes" : "no"}`);
  console.log(`- Recommended runtime met: ${report.supported ? "yes" : "no"}`);
}

function printDevHelp() {
  console.log("`shipmcp dev` is intended for generated projects.");
  console.log("Inside a generated MCP repo, run:");
  console.log("  npm install");
  console.log("  npm run dev");
}

function printHelp() {
  console.log("ShipMCP");
  console.log("");
  console.log("Usage:");
  console.log("  shipmcp init <spec> [--out dir] [--name value] [--auth auto|apikey|bearer|none] [--include-tags tags] [--exclude-tags tags] [--include-methods methods] [--exclude-methods methods]");
  console.log("  shipmcp generate <spec> [--out dir] [--name value] [--auth auto|apikey|bearer|none] [--include-tags tags] [--exclude-tags tags] [--include-methods methods] [--exclude-methods methods]");
  console.log("  shipmcp validate <spec> [--auth auto|apikey|bearer|none] [--include-tags tags] [--exclude-tags tags] [--include-methods methods] [--exclude-methods methods]");
  console.log("  shipmcp doctor");
  console.log("  shipmcp dev");
}

function buildFilterOptions(flags) {
  return {
    includeTags: parseList(flags["include-tags"]),
    excludeTags: parseList(flags["exclude-tags"]),
    includeMethods: parseList(flags["include-methods"]),
    excludeMethods: parseList(flags["exclude-methods"])
  };
}

function parseList(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function hasActiveFilters(filterOptions) {
  return Object.values(filterOptions).some((entries) => Array.isArray(entries) && entries.length > 0);
}

function formatFilters(filterOptions) {
  const parts = [];

  if (filterOptions.includeTags.length > 0) {
    parts.push(`include-tags=${filterOptions.includeTags.join(",")}`);
  }

  if (filterOptions.excludeTags.length > 0) {
    parts.push(`exclude-tags=${filterOptions.excludeTags.join(",")}`);
  }

  if (filterOptions.includeMethods.length > 0) {
    parts.push(`include-methods=${filterOptions.includeMethods.join(",")}`);
  }

  if (filterOptions.excludeMethods.length > 0) {
    parts.push(`exclude-methods=${filterOptions.excludeMethods.join(",")}`);
  }

  return parts.join(" | ");
}

function parseFlags(argv) {
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--yes") {
      flags.yes = true;
      continue;
    }

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (value === undefined || value.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = value;
    index += 1;
  }

  return flags;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
