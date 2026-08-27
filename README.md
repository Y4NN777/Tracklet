# Tracklet

Tracklet is a local-first financial copilot for young micro-entrepreneurs in Burkina Faso and French-speaking West Africa. It helps a single user separate personal and business money, track cash and mobile-money pockets, record debts and sales, and understand their real cash position without requiring an internet connection.

## Product principles

- **Offline by default:** core operations use IndexedDB and never require a server.
- **Personal/business separation:** every record belongs to one financial space.
- **FCFA-native:** all amounts are positive whole FCFA values.
- **Actionable language:** the French-first interface explains money without accounting jargon.
- **User-owned data:** a complete JSON backup can be exported and restored from Settings.

## Alpha features

- Public French landing page with a direct entry into the local application
- Pockets and balances
- Income, expenses, and atomic transfers between pockets
- Debts and receivables
- Savings goals
- Business sales that credit the receiving pocket
- Cash-position and profitability summaries
- Date-filtered reports and CSV export
- Contextual, rules-based financial tips
- Installable PWA shell

## Development

Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev
```

Before pushing a change:

```bash
npm run check
```

This runs linting, the Vitest unit/integration suite, TypeScript, and the production PWA build.

## Architecture

The app uses React 19, Vite, TypeScript, Tailwind CSS, React Router, and IndexedDB through `idb`. There is no backend, authentication, analytics, or cloud synchronization in the alpha. See [the architecture guide](docs/ARCHITECTURE.md) and [the current product contract](docs/CONTRACT.md).

## Data safety

Browser storage is the source of truth. Clearing site data or uninstalling the PWA can remove local records. Use **Réglages → Télécharger une sauvegarde** regularly and keep the resulting file private.

## Intentional alpha limits

- One user and one device
- No bank or mobile-money integrations
- No automatic cloud backup
- No partial debt-payment schedule
- CSV reporting only
- Goal contributions track progress but do not move pocket balances
- Contextual tips are local rules, not an LLM

The legacy Next.js/Supabase application remains in Git history and on the `legacy/tracklet-finance-app` branch. The local-first product is the current direction on `main`.
