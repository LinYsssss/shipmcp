param(
  [string]$Repository = "LinYsssss/shipmcp"
)

$topics = @(
  "mcp",
  "model-context-protocol",
  "openapi",
  "openapi-generator",
  "codegen",
  "typescript",
  "cli",
  "developer-tools",
  "developer-experience",
  "api-first",
  "automation",
  "llm-tools"
)

$description = "Generate a runnable MCP repo from any OpenAPI spec."

Write-Host "Checking GitHub CLI authentication ..."
gh auth status *> $null

if ($LASTEXITCODE -ne 0) {
  throw "GitHub CLI authentication is invalid. Run 'gh auth login -h github.com' and retry."
}

$arguments = @(
  "repo", "edit", $Repository,
  "--description", $description,
  "--enable-discussions"
)

foreach ($topic in $topics) {
  $arguments += @("--add-topic", $topic)
}

Write-Host "Applying GitHub metadata to $Repository ..."
& gh @arguments

if ($LASTEXITCODE -ne 0) {
  throw "Failed to update repository settings after authentication succeeded."
}

Write-Host "Repository metadata updated."
