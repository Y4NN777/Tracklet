# PWA deployment runbook

1. Use Node.js 20+ and run `npm ci`.
2. Run `npm run check`; lint, tests, type checking, and production build must pass.
3. Confirm `npm audit` reports no known vulnerabilities.
4. Deploy the generated `dist/` directory to an HTTPS static host.
5. Configure unknown routes to serve `index.html` if the host requires it. HashRouter keeps in-app paths static-host safe.
6. Install the PWA in a clean browser profile and verify offline launch after the first online load.
7. Export a JSON backup, create a record, restore the backup, and verify the newer record is replaced.
8. Confirm the service worker precaches only application assets and no arbitrary runtime network cache exists.

`dist/` is generated output and must not be committed.
