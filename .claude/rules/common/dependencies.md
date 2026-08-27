---
description: Dependency management & supply-chain security — load on dependency manifests and lockfiles (Mishmar/Benaiah-owned)
globs: ["**/package.json", "**/pnpm-lock.yaml", "**/pnpm-workspace.yaml", "**/requirements*.txt", "**/pyproject.toml", "**/poetry.lock", "**/uv.lock", "**/Pipfile*", "**/go.mod", "**/go.sum", "**/Cargo.toml", "**/Cargo.lock", "**/composer.json", "**/composer.lock", "**/Gemfile*", "**/pom.xml", "**/build.gradle*", "**/*.csproj"]
alwaysApply: false
---

# Dependency Management & Supply-Chain Security

Owned by Benaiah (supply-chain) with Ira at the code level. Loads whenever a
dependency manifest or lockfile is touched. Adding or upgrading a dependency is a
**security decision**, not a convenience.

## Before adding or upgrading any dependency — vet it first

Run the **dependency-vetting** skill (drives the research pipeline). Do not adopt
a package until the following are checked and recorded in a research log:

1. **Known vulnerabilities** — query OSV.dev / NVD for the exact version.
2. **Maintenance health** — last release, open critical issues, single-maintainer
   risk, deprecation status.
3. **Typosquatting / impersonation** — confirm the package name and namespace are
   the genuine, intended ones (a frequent supply-chain vector).
4. **Provenance** — signed releases / SLSA level where available; source repo matches.
5. **Transitive blast radius** — what it pulls in; new transitive risk.

If vetting is not clean, do not add it — surface the finding to the team lead.

## Pinning & lockfiles

- **Pin exact versions.** No `"*"`, no `"latest"`, no unbounded ranges in manifests.
- **Commit the lockfile** and treat it as the source of truth. `pnpm-lock.yaml` for
  JS/TS (pnpm only — never `package-lock.json`/`yarn.lock`), `poetry.lock`/`uv.lock`
  for Python, `go.sum`, `Cargo.lock`, `composer.lock`.
- **Never hand-edit a lockfile.** Regenerate it via the package manager so the
  integrity hashes stay valid.
- **CVE pin comment** — when a version is pinned to dodge a CVE, cite the CVE id inline.

## Sources & integrity

- Only HTTPS package sources. No `http://`, no `git+http://`.
- No installing from arbitrary URLs or unpinned git refs (`git+https#<commit-sha>` only).
- Verify registry integrity / hashes are enabled (`pnpm` strict, pip hash-checking
  where used).

## Updates during the SDLC

- Staged upgrades, not blind bumps: use the **dependency-upgrade** skill —
  compatibility analysis, changelog/breaking-change review, test before merge.
- Group security patches separately from feature bumps.
- Re-vet (steps 1–5) on every **major** version change and on any maintainer/owner
  change of the package.
- Dependency scanning (`trivy`, OSV-Scanner) runs in CI as a gate (Ira), and the
  `security:scan` stage blocks merge on a new critical/high.
