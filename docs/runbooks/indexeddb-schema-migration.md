# IndexedDB schema migration

Use this runbook whenever a release changes an object store, index, persisted
record shape, or backup compatibility. Tracklet has no server-side database and no
separate migration registry: the authoritative schema and version are in
`src/db/schema.ts`.

## Before implementation

1. Document the old and new record shapes and decide whether older app versions
   must still be able to read the data.
2. Add a fixture representing a real database created by the previous version.
   Never use the live browser profile as a test fixture.
3. Export a JSON backup with the previous release and verify it can be parsed by
   the candidate release.
4. Decide how failure is recovered. The supported recovery path is restoring a
   previously exported backup; silently deleting IndexedDB is not acceptable.

## Implementation

1. Increment `DB_VERSION` in `src/db/schema.ts` exactly once for the release.
2. Add version-gated work to the `openDB` upgrade callback. Create or remove
   stores and indexes through its `versionchange` transaction.
3. Preserve existing IDs and realm ownership. When records need transformation,
   perform it in the same upgrade transaction and reject invalid output rather
   than partially committing it.
4. Update `TrackletDB`, persisted types, repository validation, backup parsing,
   and the compatibility section of `docs/CONTRACT.md` together.
5. Increase the backup schema version only if the JSON envelope or stored record
   format becomes incompatible. Keep imports from older supported versions
   explicit and tested.

## Verification

1. Test a fresh database and an upgrade from every supported prior DB version
   using `fake-indexeddb`.
2. Verify existing pockets, transactions, transfers, linked sales, debts, goals,
   and categories retain their IDs, realm, and calculated totals.
3. Verify an interrupted or rejected migration does not expose a partially
   upgraded database.
4. Run `npm run check`, export a new backup, restore it, and repeat the smoke test
   in a clean browser profile.
5. Record the migration and compatibility boundary in the release notes and
   `docs/CONTRACT.md`.

## Rollback and recovery

IndexedDB schema versions only move forward; shipping an older build after a
schema upgrade is not a reliable rollback. Fix forward with a higher DB version,
or have the user restore a known-good JSON backup into a compatible release.
