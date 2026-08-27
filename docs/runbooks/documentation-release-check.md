# Documentation release check

Run this checklist before every release and after changing the product contract,
architecture, security model, or persisted data.

## Procedure

1. Verify `README.md`, `docs/PRD.md`, and `docs/SRS.md` describe only implemented
   behavior or clearly label future work.
2. Compare `docs/CONTRACT.md` invariants with repository validation and domain
   calculations.
3. Compare `docs/ARCHITECTURE.md` and every C4 diagram with the actual runtime,
   storage, service worker, and absence of backend services.
4. Re-run the threat-model review and update `docs/THREAT_MODEL.md` when data flow
   or browser capabilities changed.
5. Update the runbooks, document map in `docs/README.md`, release version, and
   revision dates where applicable.
6. Search documentation for removed frameworks, nonexistent paths, placeholder
   team names, and broken relative links.
7. Run `git diff --check`, review the documentation diff, and commit docs with the
   code whose behavior they describe.
