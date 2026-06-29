# Tracklet — Threat Model

- **Status:** Draft
- **Date:** 2026-06-29
- **Author:** Benaiah (Mishmar)
- **Methodology:** STRIDE
- **Scope:** Tracklet alpha — local-first PWA, no backend

---

## 1. System Context & Assumptions

Tracklet has a radically reduced attack surface compared to a typical web
application because:

- **No network requests.** All data stays on device. No API, no sync,
  no telemetry.
- **No authentication.** Single-user device-local app.
- **No third-party dependencies at runtime.** The app shell (Next.js/React)
  and IndexedDB are the only active components.
- **No user accounts.** No passwords, no tokens, no session management.

The primary threat surface is the **device itself** — physical access, data
leakage via export, and supply chain via app updates.

### Trust Boundary

```
[User] ─── [Android Device] ─── [Tracklet PWA]
                                      │
                                      │ (file system export)
                                      ▼
                                 [SD card / Downloads]
```

The single trust boundary is the device screen lock. Everything inside the
device is trusted (after app installation). Everything outside (exported
files, another app reading storage) is untrusted.

---

## 2. STRIDE Analysis

### Spoofing

| Threat | Risk | Mitigation |
|---|---|---|
| An attacker impersonates the Tracklet app via a fake app on the Play Store | **Medium** | App signing by the developer. User-side: verify developer name. No server-side API to steal credentials since none exist. |
| Another app on the device pretends to be Tracklet to read financial data | **Low** | Android sandboxing prevents apps from reading each other's private storage. No inter-app communication or intent handling in alpha. |

**Risk acceptance:** No user authentication exists to spoof. The app is
single-user by design.

### Tampering

| Threat | Risk | Mitigation |
|---|---|---|
| Another app modifies Tracklet's IndexedDB data | **Low** | Android sandbox — each app's IndexedDB is in its private storage. Requires root access. |
| Malicious app update overwrites Tracklet with tampered version | **Medium** | App store code signing; tampered updates would fail signature verification. Mitigation: use official Play Store distribution only. |
| User modifies exported PDF/image with false data | **Low** | Exported files are static snapshots. The app's internal data is the source of truth. Fake exports cannot be re-imported (no import feature). |

**Key mitigation:** IndexedDB data is protected by Android's per-app
sandbox. Tampering requires root.

### Repudiation

| Threat | Risk | Mitigation |
|---|---|---|
| User denies making a transaction they recorded | **Low** | All transactions are immutable after creation with timestamps. The app serves a single user who has sole access — repudiation benefit is near-zero. |
| User claims exported report shows wrong data | **Low** | Reports are computed from immutable transaction data. Discrepancy can be checked by re-exporting. |

**Risk acceptance:** This is a personal finance tool, not an audit system.
Repudiation is not a practical concern for a single-user offline app.

### Information Disclosure

| Threat | Risk | Mitigation |
|---|---|---|
| Someone gains physical access to the unlocked device and opens Tracklet | **High** | No app-level lock in alpha. All financial data is visible. Mitigation: user must lock their device screen. Future: biometric app lock. |
| Exported PDF/image is shared or leaked | **Medium** | Export writes to user-chosen location (Downloads, SD card). The user controls what they share. Mitigation: clear warning on export about sensitive data. |
| Service Worker cache retains stale data | **Low** | SW caches only app shell (JS/CSS/HTML), never user data. |
| IndexedDB data extracted via USB debugging | **Low** | Requires USB debugging enabled + device unlocked. Developer-only surface. |

**Key risks:**
1. Physical access to unlocked device — **highest risk**. Mitigation is
   user behavior (screen lock) or future biometric lock.
2. Exported file leakage — user responsibility, but should be warned.

### Denial of Service

| Threat | Risk | Mitigation |
|---|---|---|
| Malicious app fills device storage, preventing IndexedDB writes | **Low** | Device storage management is the OS's responsibility. The app cannot prevent other apps from filling storage. |
| IndexedDB quota exceeded | **Low** | Tracklet's data volume is small (KB to low MB). IndexedDB quota on Android is typically 50MB+ per origin. |
| Intentional data corruption via IndexedDB API misuse | **N/A** | Only the app itself writes to its own IndexedDB. No external API surface. |

**Risk acceptance:** DoS threats are handled by the Android OS and are
not specific to Tracklet.

### Elevation of Privilege

| Threat | Risk | Mitigation |
|---|---|---|
| An attacker uses a vulnerability in Tracklet to escalate privileges on the device | **Low** | PWA runs within the browser sandbox (Chrome renderer). No native code, no system API access beyond storage and file download. |
| XSS via user input fields (counterparty name, product name) leads to data theft | **Medium** | User-entered names are rendered in the UI. If unsanitized, stored XSS could leak data to another origin. Mitigation: sanitize all user text input before rendering. |
| Malicious service worker update intercepts navigation | **Low** | SW scope is limited to the app's origin. Cannot read other origins' data. |

**Key mitigation:** All user text input must be sanitized before rendering
(escape HTML entities). The app has no `eval()`, no dynamic imports, no
`innerHTML` usage.

---

## 3. Risk Prioritization

| # | Threat | Severity | Action |
|---|---|---|---|
| 1 | Physical access to unlocked device | **High** | Future: biometric app lock. Alpha: device screen lock disclaimer. |
| 2 | Stored XSS via user input fields | **Medium** | Sanitize all user text input before rendering (DOMPurify or React's built-in escaping). |
| 3 | Exported file leakage | **Medium** | Warn user on export. Default to app-private directory, not shared Downloads. |
| 4 | Fake/tampered app update | **Medium** | Distribute only via official app store. |
| 5 | USB debug data extraction | **Low** | Accept (requires developer mode + unlocked device). |
| 6 | Sandbox violation by another app | **Low** | Accept (Android sandbox is mature). |

---

## 4. Security Controls (Alpha)

### Implemented
- **Android sandbox**: IndexedDB is per-app private.
- **React DOM escaping**: React escapes string content by default when
  rendered via `{expression}`.
- **Immutable transactions**: No edit/delete of financial records after
  creation (prevents retrospective manipulation).
- **No network**: No data transmission means no interception, no MITM,
  no server-side breach.

### Recommended for Alpha (before release)
- **Input sanitization**: Even with React's built-in escaping, use
  `DOMPurify` for any `dangerouslySetInnerHTML` usage (should be zero in
  the app, but audit).
- **Export warning**: Show a dialog before export: "This file contains
  your financial data. Keep it private."
- **CSP headers**: Set Content-Security-Policy in the PWA manifest to
  restrict script sources and disallow inline scripts.

### Deferred to Beta
- Biometric app lock.
- Encrypted IndexedDB (via Web Crypto API + device keychain).
- Data integrity checksums.
- Export password protection.

---

## 5. Data Flow Risks

### Data at Rest
```
Location: IndexedDB (Chrome private storage)
Risk: Readable by any app with root access
Mitigation: Android encryption at rest (FBE) — enabled on all modern Android
versions. No additional app-level encryption in alpha.
```

### Data in Transit
```
N/A — no network data transmission in alpha.
```

### Data in Use
```
Location: In-memory React state + IndexedDB transaction
Risk: Another app with debug privileges (adb) could read process memory
Mitigation: Requires USB debugging + unlocked device. Accept for alpha.
```

### Data on Export
```
Location: Device file system (user-chosen directory)
Risk: Shared with other apps, backed up to cloud, sent via messaging
Mitigation: Warning dialog. Future: password-protected PDF.
```

---

## 6. Compliance Notes

Tracklet does not transmit, process, or store user data on any server.
It is therefore outside the scope of most data protection regulations
(GDPR, CCPA, etc.) as they relate to data controllers/processors.

The user is solely responsible for:
- Device-level security (screen lock, OS updates)
- Security of exported files
- Physical device access

---

## 7. Change Log

| Date | Change | Kind |
|---|---|---|
| 2026-06-29 | Initial threat model for alpha | Creation |
