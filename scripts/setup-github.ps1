param(
  [string]$Repository = "LinYsssss/shipmcp"
)

$topics = @(
  "mcp",
  "model-context-protocol",
  "openapi",
  "openapi-generator",
  "api",
  "api-first",
  "typescript",
  "cli",
  "developer-tools",
  "ai-tools",
  "automation",
  "codegen",
  "llm-tools",
  "anthropic",
  "cursor",
  "claude-code",
  "codex"
)

$arguments = @(
  "repo", "edit", $Repository,
  "--description", "Turn any OpenAPI spec into a production-ready MCP server.",
  "--enable-discussions"
)

foreach ($topic in $topics) {
  $arguments += @("--add-topic", $topic)
}

Write-Host "Applying GitHub metadata to $Repository ..."
& gh @arguments

if ($LASTEXITCODE -ne 0) {
  throw "Failed to update repository settings. Make sure 'gh auth login' has completed."
}

Write-Host "Repository metadata updated."
