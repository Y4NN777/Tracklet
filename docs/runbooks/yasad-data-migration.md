# Runbook: Data Model Migration (Yasad)

**Team:** Yasad (Backend / Logic)

## When to Run

When a breaking change to the data model is required (see CONTRACT.md §Evolution).

## Steps

1. Write the migration function in `src/lib/migrations/`.
2. Add the migration version to the migration registry.
3. Test on a copy of the production IndexedDB store.
4. If migration fails, the app must continue with the old schema and
   prompt the user to update.
5. Update CONTRACT.md change log.

## Rollback

Not supported. Data is migrated forward only. Restore from last backup
(manual device backup) if needed.
