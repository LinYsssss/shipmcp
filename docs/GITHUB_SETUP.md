# GitHub Setup Scripts

These scripts exist because Git push credentials and GitHub CLI auth are often configured separately on Windows.

## Setup repository metadata

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-github.ps1
```

This applies:

- repository description
- topic tags
- Discussions enabled

## Create the bootstrap release

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish-bootstrap-release.ps1
```

This creates the GitHub release for tag `v0.1.0-bootstrap` using:

- [docs/RELEASE_v0.1.0-bootstrap.md](RELEASE_v0.1.0-bootstrap.md)

## Requirement

Run `gh auth login` first, or set `GH_TOKEN` in the current shell.
