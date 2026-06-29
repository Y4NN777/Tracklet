# CONTRACT — Tracklet

> The promises this system makes to its user and to itself. Invariants are
> always true. Guarantees describe committed behaviour, often with bounds.

- **Version:** alpha
- **Date:** 2026-06-29
- **Status:** Draft

---

## Versioning Policy

This document applies to the current alpha version. Because Tracklet is a
local-first PWA with no network API, contract changes are communicated via
app updates. Breaking invariants require a data migration and a major version
bump. Non-breaking additions (new pocket types, optional fields) may ship in
minor versions.

---

## Invariants

### Identifiers
- All resource IDs are prefixed by resource type and are immutable for the
  lifetime of the resource.
  - `pocket_xxx` — pocket
  - `txn_xxx` — transaction (credit, debit, transfer)
  - `debt_xxx` — debt or receivable
  - `sale_xxx` — sale (business only)
  - `expense_xxx` — expense (business only)
  - `goal_xxx` — goal
  - `insight_xxx` — contextual insight

### Realms
- Personal and Business data are strictly separated at the storage level.
  No query, calculation, or view ever mixes data across realms.
- A pocket belongs to exactly one realm and cannot change realms after
  creation.

### Money
- All monetary values are integer minor units (FCFA cents).
- No floats or decimals are used for any monetary calculation.
- FCFA is the only currency. No currency conversion is offered or performed.
- Display format: space-separated thousands, suffixed with "FCFA".
  Example: `47 500 FCFA`.

### Pockets
- Each realm has exactly 3 pocket slots: Cash, Orange Money, Moov Money.
- A pocket is created with an initial balance of 0.
- Pocket balance = sum of all credits to that pocket − sum of all debits.
- A transfer between pockets is a single atomic operation: debit source,
  credit destination. If either leg fails, neither leg is persisted.
- A pocket cannot be deleted if its balance is non-zero.

### Transaction Invariants
- Every credit, debit, and transfer creates an immutable transaction record.
- Transaction amount is immutable after creation.
- Transaction timestamp is set at creation time (device local time) and is
  immutable.
- A transaction references exactly one pocket (for credits/debits) or two
  pockets (for transfers, source + destination).
- A transaction cannot reference pockets from different realms.

### Debts & Receivables
- Amount is fixed at creation and is immutable.
- Status transitions are constrained:
  `pending → partially_paid → settled`
  `pending → settled`
  No reverse transitions are allowed (a settled debt cannot become pending).
- A debt or receivable references exactly one counterparty (name as free text)
  and belongs to exactly one realm.

### Sales (Business Only)
- Total = quantity × unit_price. Both factors are immutable after creation.
- A sale references exactly one receiving pocket.
- Quantity is a positive integer. Unit price is a positive integer in FCFA.

### Expenses (Business Only)
- Category is one of: `material_cost`, `fixed_cost`, `other`.
- An expense references exactly one debited pocket.

### Margin & Result Calculation
- Gross margin = sum of all sales (material costs only applied to cost of goods sold approach) - sum of material cost expenses.
- Net result = gross margin - sum of fixed cost expenses.
- These are computed values, not stored. They are recalculated on every read.
- All monetary inputs to these calculations are in FCFA minor units.

### Goals
- Target amount is immutable after creation.
- Source pocket association is optional. If set, it cannot change.
- Progress is computed as sum of all credits to source pocket (if set) since
  goal creation date.

### Contextual Learning (Insights)
- An insight is shown at most once per user session.
- The same insight is never shown twice in a row (even across sessions).
- Insights are dismissable in one tap. A dismissed insight is not shown again
  for that session.

### Timestamps
- All timestamps are ISO 8601 in the user's device local timezone.
- No UTC conversion is performed (the user operates in a single timezone).
- Format: `2026-06-29T14:30:00`

### Offline Data
- All data is stored exclusively on the device.
- No data is ever transmitted to a remote server.
- There is no sync, no backup to cloud, no multi-device support in alpha.
- Every write is persisted to durable storage before the operation is
  reported as complete to the user.

---

## Guarantees

### Balance Consistency
- After every credit, debit, or transfer, the pocket balance is recomputed
  and is guaranteed to reflect all preceding transactions.
- The total balance for a realm equals the sum of its three pocket balances.

### Read-after-write
- Any read that follows a write in the same session will reflect the written
  data. There is no staleness window.

### Data Durability
- Data is persisted to disk after every mutation. App close, crash, or
  background kill will not lose the last completed operation.
- If a crash occurs during a write, the write is rolled back and the
  previous consistent state is preserved.

### Max Taps
- Every primary action (view balance, log sale, record expense, check margin)
  is reachable in at most 2 taps from the home screen.

### Learning Insight Delivery
- An insight is delivered after every tracked action (sale logged, expense
  recorded, debt settled).
- Insights are contextual: they relate to the action just performed, not
  generic advice.
- Maximum 1 insight per action.

### Report Export
- Reports can be exported as PDF or image.
- Exported data reflects the selected period and all user data within it.

---

## Evolution

### What counts as a breaking change
- Changing the type or precision of monetary fields.
- Removing or renaming a field on a core entity (pocket, transaction, sale,
  expense, debt, goal).
- Changing the status transition rules for debts/receivables.
- Removing realm isolation.
- Changing the ID prefix scheme.
- Changing the timestamp format.

### What counts as non-breaking
- Adding new optional fields to any entity.
- Adding new entity types.
- Adding new pocket slots (within constraints).
- Adding new report formats.
- Adding new insight content.
- Changing display-only formatting.

### Data migration
- Breaking changes require a data migration that runs on first launch after
  update.
- The migration is transactional: if it fails, the app continues with the
  old schema and prompts the user to update.

---

## Change Log

| Date | Change | Kind |
|---|---|---|
| 2026-06-29 | Initial contract for alpha | Creation |
