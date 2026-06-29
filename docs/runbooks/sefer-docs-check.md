# Runbook: Docs Update Checklist (Sefer)

**Team:** Sefer (Documentation)

## When to Run

Before every release. After any CONTRACT, ARCHITECTURE, or THREAT_MODEL change.

## Steps

1. Verify PRD.md and SRS.md reflect current functionality.
2. Verify CONTRACT.md invariants match actual implementation.
3. Check all diagrams are up to date.
4. Update docs/README.md if the doc map changed.
5. Run `git add docs/ && git status` — verify no doc is stale.
