---
description: Sefer (Documentation) rules — load on docs files
globs: ["**/docs/**", "**/*.md", "**/*.mdx", "**/*.rst", "**/*.adoc", "**/adr/**", "**/rfc/**", "**/runbooks/**", "**/diagrams/**", "**/CHANGELOG.md", "**/CHANGES.md", "**/README.md", "**/CONTRIBUTING.md", "**/SECURITY.md", "**/ARCHITECTURE.md", "**/mkdocs.y*ml", "**/docusaurus.config.*", "**/.github/ISSUE_TEMPLATE/**", "**/.github/PULL_REQUEST_TEMPLATE*"]
alwaysApply: false
---

# Sefer — Documentation Rules

Load only on `docs/**` and markdown. Owned by Jehoshaphat (Team Lead).

- **Diátaxis quadrant declared** on every doc: Tutorial / How-to / Reference / Explanation.
- **ADR format: MADR template.** Decision drivers explicit. Consequences documented (positive/negative/risk).
- **Changelog: Keep a Changelog format.** Semantic versioning.
- **Commit messages feed the changelog** — Conventional Commits convention.
- **README: 50–150 lines.** Written for builders, not end users. Terse.
- **Design documents: 300–800 lines.** Heavy. Future-engineer audience.
- **Runbooks: copy-paste safe under stress.** One command per failure mode, no thinking required at execution time.
- **No documentation without a date.** No undated decisions.
- Sefer writes to `docs/` only — never to the codebase.
