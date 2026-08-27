# Tracklet — Architecture

- **Status:** Stabilized alpha
- **Version:** 0.2.0
- **Updated:** 2026-08-27

## System overview

Tracklet is a single-user, local-first progressive web app. The browser origin on the user's device is the source of truth. Core operations do not call a backend and do not depend on connectivity.

```text
React UI + HashRouter
        │
        ├── hooks: asynchronous view state
        │
        ├── domain: balances, cash position, profit, reports, tips
        │
        └── repositories: validation and IndexedDB transactions
                         │
                         └── IndexedDB (tracklet, schema v3)
```

## Runtime stack

- React 19 and React Router
- Vite 8 with the PWA plugin
- TypeScript 7
- Tailwind CSS 4
- IndexedDB through `idb`
- Vitest and `fake-indexeddb` for automated verification

`index.html`, `vite.config.ts`, TypeScript configuration, and PWA assets are source-controlled. `dist/` is generated and ignored.

## Presentation and routes

The hash route `/#/` renders the public French landing page without the application shell. It presents only implemented product capabilities and links to `/#/dashboard`. Financial routes render inside the authenticated-free application layout; they remain directly addressable for existing bookmarks.

The installed PWA starts at `/#/dashboard`, so returning users enter their financial workspace directly instead of passing through the marketing page on every launch.

## Data model

Every financial record is scoped to `personal` or `business`.

- `pockets`: named stores of money
- `transactions`: income, expense, and linked transfer ledger entries
- `categories`: realm-scoped income/expense categories
- `debts`: active, settled, or written-off debts and receivables
- `goals`: explicitly tracked savings progress
- `sales`: business sales linked to their generated income transaction

Existing alpha data remains readable. New identifiers use a resource prefix, but earlier unprefixed identifiers remain valid.

## Correctness boundaries

Repository functions validate realm, whole-FCFA amounts, references, and dates before persistence. A transfer creates linked outgoing and incoming entries in one IndexedDB transaction; either both writes commit or neither does. A new sale and its pocket credit are also committed atomically. Deleting a linked sale removes only the income entry created by that sale.

Balances and reports are computed from ledger records rather than stored aggregates. Legacy transfer records without a direction are treated as neutral because their financial intent cannot be inferred safely.

## Backup and recovery

A backup is a versioned JSON document containing all six stores plus format, schema, application version, and export timestamp. Restore validates the envelope and record identifiers, then replaces every store in one IndexedDB transaction. The UI requires an explicit destructive confirmation.

## PWA behavior

The service worker precaches the compiled application shell. There is no runtime cache for arbitrary network traffic. Updates use the plugin's automatic-update strategy; IndexedDB data is not stored in the service-worker cache.

## Security model

- No credentials, API tokens, telemetry, or remote financial-data transmission
- React's default text escaping; no `dangerouslySetInnerHTML`
- A restrictive HTML Content Security Policy
- Origin-scoped IndexedDB storage
- Backup files are unencrypted and must be protected by the user

Device access and browser-profile access remain the primary risks. Biometric locking and encrypted backups are deferred.

## Deliberate limits

Cloud sync, multi-device conflict resolution, bank integrations, partial debt schedules, PDF/image reports, and a conversational premium agent are outside alpha 0.2.0.
