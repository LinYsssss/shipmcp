import process from "node:process";

export function inspectEnvironment() {
  const version = process.versions.node ?? "0.0.0";
  const major = Number.parseInt(version.split(".")[0], 10);

  return {
    nodeVersion: version,
    cwd: process.cwd(),
    hasFetch: typeof fetch === "function",
    supported: Number.isFinite(major) && major >= 22
  };
}
