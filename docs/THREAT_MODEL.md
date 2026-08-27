# Tracklet — Alpha Threat Model

- **Status:** Reviewed for 0.2.0
- **Updated:** 2026-08-27
- **Scope:** local-first browser PWA

## Trust boundaries

Tracklet runs inside a browser or installed PWA profile. Financial records are stored in origin-scoped IndexedDB. The application has no backend, account, analytics, or financial-data API.

Trust crosses a boundary when:

- someone gains access to the unlocked device or browser profile;
- the user downloads a JSON backup or CSV report;
- application code or dependencies are updated;
- a browser extension or compromised browser can inspect origin data.

## Prioritized risks

| Risk | Severity | Current control |
|---|---:|---|
| Unlocked-device access exposes financial records | High | Device/browser locking is required; biometric app lock is deferred |
| Backup or CSV file is shared or copied | High | Explicit privacy copy and destructive restore confirmation |
| Clearing site data removes the only local copy | High | Complete versioned JSON backup and restore |
| Supply-chain compromise changes shipped code | Medium | Locked npm dependency graph, automated build/tests, zero known audit findings at release |
| Cross-realm reference corrupts calculations | Medium | Repository validation and integration tests |
| Partial multi-record write corrupts a transfer or sale | Medium | Single IndexedDB transactions and integration tests |
| Stored text becomes script execution | Low | React text escaping, no raw HTML rendering, restrictive CSP |
| Stale service worker loads incompatible UI | Low | App-shell-only precache and auto-update; no arbitrary runtime network cache |

## Data flows

### At rest

IndexedDB protection is provided by the browser profile and device storage. The alpha does not encrypt individual records. Root access, a compromised browser, a malicious extension with sufficient privilege, or access to an unlocked profile may expose them.

### In transit

Core financial records have no network transit. The Content Security Policy limits connections to the same origin (plus localhost WebSocket access for the Vite development server). Hosting still requires HTTPS so the service worker and origin integrity work as intended.

### Exported

JSON and CSV exports are ordinary unencrypted files. They may be read by other apps, cloud-backup software, or recipients. Users must store and share them carefully.

## Integrity controls

- Whole-FCFA and date validation at repository boundaries
- Existing pocket/category and realm checks before writes
- Atomic paired transfers
- Atomic sale plus generated pocket credit
- Atomic full-store restore after envelope validation
- Terminal debt-state transitions
- Tests using a real IndexedDB-compatible implementation

## Deferred controls

- Biometric or PIN application lock
- Encrypted/password-protected backup
- Signed backup integrity metadata
- Automatic backup reminders
- Dependency provenance attestations

These are beta candidates and are not represented as alpha guarantees.
