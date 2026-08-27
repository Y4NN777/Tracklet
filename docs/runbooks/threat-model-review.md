# Threat-model review

Run this checklist before a major release and after any feature changes stored
data, data flow, exports, imports, or browser permissions.

## Procedure

1. Re-run the STRIDE analysis against the current architecture and feature set.
2. Confirm user-controlled text is rendered through React text nodes and cannot
   introduce HTML, script, or unsafe URLs.
3. Inspect the browser Network panel. Financial records must not leave the device;
   only application assets and development tooling may use the network.
4. Verify the production Content Security Policy, service-worker scope, and cache
   contents match `vite.config.ts` and `index.html`.
5. Export a backup and every CSV type. Confirm the UI warns that exported files
   are sensitive and unencrypted.
6. Try malformed, oversized, and newer-schema backup files. Restore must reject
   them before replacing any local records.
7. Review dependencies with `npm audit` and investigate every reported issue.
8. Record new threats, mitigations, accepted risks, and verification evidence in
   `docs/THREAT_MODEL.md`.
