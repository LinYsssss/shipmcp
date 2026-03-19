param(
  [string]$Repository = "LinYsssss/shipmcp",
  [string]$Tag = "v0.1.0-bootstrap",
  [string]$Title = "v0.1.0-bootstrap",
  [string]$NotesFile = "docs/RELEASE_v0.1.0-bootstrap.md"
)

if (-not (Test-Path $NotesFile)) {
  throw "Release notes file not found: $NotesFile"
}

Write-Host "Creating GitHub release $Tag for $Repository ..."
& gh release create $Tag --repo $Repository --title $Title --notes-file $NotesFile

if ($LASTEXITCODE -ne 0) {
  throw "Failed to create release. Make sure 'gh auth login' has completed and the tag exists on origin."
}

Write-Host "Release created."
