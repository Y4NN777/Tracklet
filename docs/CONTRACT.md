# Tracklet — Alpha Contract

- **Status:** Implemented
- **Version:** 0.2.0
- **Updated:** 2026-08-27

This document states behavior implemented by the current local-first alpha. It intentionally does not promise future features.

## Invariants

### Realms

- A pocket, transaction, debt, goal, category, or sale belongs to one realm: `personal` or `business`.
- Repository writes reject references to a pocket or category from another realm.
- Transfers cannot cross realms.
- Sales belong to the business realm.

### Money and dates

- Persisted amounts are safe, non-negative or positive integers as appropriate.
- One stored unit is one FCFA; fractional values are rejected.
- Entry dates use `YYYY-MM-DD`; creation timestamps use ISO 8601 UTC.

### Ledger

- Pocket balance is the sum of income and incoming transfers minus expenses and outgoing transfers.
- New manual income and expenses reference an existing pocket and, when supplied, a matching category.
- A new transfer persists one outgoing and one incoming entry atomically with a shared transfer identifier.
- Legacy transfers without direction metadata have no balance effect.
- Transactions are not editable or deletable through the application UI.

### Debts

- Only active records contribute to committed and receivable totals.
- Valid terminal transitions are `active → settled` and `active → written-off`.
- A terminal record cannot transition again.
- Partial payment schedules are not implemented in this alpha.

### Sales

- Quantity and unit price are positive whole numbers.
- Total equals quantity multiplied by unit price.
- Creating a sale atomically creates a linked income transaction in the selected business pocket.
- Deleting a sale removes its linked generated transaction; legacy sales without a link remain supported.

### Goals

- Target amounts are positive and tracked savings are non-negative.
- A linked pocket must be in the same realm.
- Goal contributions update progress only; they do not transfer pocket funds.

## Durability and recovery

- A successful repository promise means IndexedDB committed the write.
- Multi-record transfer, sale, and restore operations are transactional.
- Backup export contains all local stores in a versioned JSON envelope.
- Restore rejects unknown formats and schema versions newer than the running app.
- Restore replaces current local data only after explicit user confirmation.

## Privacy

- Core financial data is not sent to a server.
- The app has no account, authentication, telemetry, or cloud sync.
- A downloaded backup or CSV contains sensitive unencrypted data; its protection is the user's responsibility.

## Reports and tips

- Reports support a selected date range and CSV export.
- Personal report revenue comes from income transactions; business report revenue comes from recorded sales.
- Contextual tips are deterministic local rules and may be dismissed.

## Compatibility

New records use prefixed IDs such as `pocket_`, `txn_`, `transfer_`, `debt_`, `goal_`, and `sale_`. Records produced by earlier alpha commits remain accepted. Any future destructive schema change requires a tested forward migration and a compatible backup path.
