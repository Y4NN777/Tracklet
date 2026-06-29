# Tracklet — Architecture

- **Status:** Draft
- **Date:** 2026-06-29
- **Authors:** Bezalel, Nathan

---

## 1. System Overview

Tracklet is a **local-first, offline-capable PWA** — a single-user financial
copilot that runs entirely on the user's Android device. There is no backend
server, no cloud sync, and no network dependency for any core operation.

The architecture follows three structural decisions:

1. **Local-first.** All data is created, read, updated, and deleted on-device.
   The device is the source of truth.
2. **Realm isolation.** Personal and Business finances are separate data
   partitions within the same storage engine, never mixed at query time.
3. **Action-driven.** Every user action (log a sale, record an expense, transfer
   between pockets) is a single atomic write. The UI updates reactively from
   the same local store.

---

## 2. Container Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Android Device                         │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Home    │  │Analytics │  │  Goals   │  │ Settings │  │
│  │  Screen  │  │  View    │  │  View    │  │  View    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │       │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐  │
│  │              PWA Shell (Next.js / React)              │  │
│  │  - App Router                                         │  │
│  │  - Client Components only (no server)                 │  │
│  │  - Service Worker (cache, installability)             │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              Application Logic Layer                  │  │
│  │  - Action handlers (atomic write operations)          │  │
│  │  - Calculation engine (margin, balance, cash pos.)   │  │
│  │  - Insight engine (contextual learning dispatch)     │  │
│  │  - Report generator (PDF/image export)               │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              Data Access Layer                        │  │
│  │  - IndexedDB (or SQLite via opfs)                    │  │
│  │  - Repository pattern (per entity)                   │  │
│  │  - Transactional writes                              │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                           │                                 │
│  ┌────────────────────────┴─────────────────────────────┐  │
│  │              Local Database                           │  │
│  │  - IndexedDB (primary store)                         │  │
│  │  - Persisted after every mutation                    │  │
│  │  - No sync, no remote copy                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Device Capabilities                      │  │
│  │  - File system (PDF/image export)                     │  │
│  │  - Local notifications (reminders)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### 3.1 Presentation Layer (React Components)

| Component | Responsibility |
|---|---|
| `BalanceCard` | Hero display of total balance per realm |
| `RealmTabs` | Perso/Business switcher |
| `PocketCardGrid` | 3-column grid (Cash, OM, Moov) |
| `QuickActions` | Income/Expense/Transfer/Debt buttons |
| `InsightCard` | Contextual learning banner (dismissable) |
| `TransactionForm` | Modal form for credits/debits/transfers |
| `SaleForm` | Business-only: log a sale |
| `ExpenseForm` | Business-only: log an expense |
| `DebtForm` | Record debt or receivable |
| `GoalForm` | Set a goal |
| `MarginView` | Business-only: margin breakdown |
| `CashPositionView` | Available / committed / to receive |
| `ReportView` | Period selector + export |
| `BottomNav` | Home / Analytics / Goals / Agent / Settings |

### 3.2 Application Logic Layer

**Action Handlers** (one per user operation):
- `createPocket`, `creditPocket`, `debitPocket`, `transferBetweenPockets`
- `createSale`, `createExpense`
- `createDebt`, `createReceivable`, `updateDebtStatus`
- `createGoal`
- `dismissInsight`

**Calculation Engine** (stateless, recomputes on read):
- `calculateBalance(pocketId)` — sum credits − sum debits
- `calculateTotalBalance(realm)` — sum of all pocket balances
- `calculateCashPosition(realm)` — available / committed / receivables
- `calculateGrossMargin(period)` — sales − material costs
- `calculateNetResult(period)` — gross margin − fixed costs
- `calculateGoalProgress(goalId)` — saved / target / remaining

**Insight Engine**:
- Maps action type → insight template
- Tracks which insights have been shown (session scoped)
- Enforces non-repetition rule

### 3.3 Data Access Layer (Repository Pattern)

```
┌─────────────────────────────────────────────────────┐
│                   Repository                         │
├─────────────────────────────────────────────────────┤
│ PocketRepository    — CRUD + balance query           │
│ TransactionRepo     — ledger by pocket               │
│ SaleRepository      — CRUD + aggregation by period   │
│ ExpenseRepository   — CRUD + aggregation by category │
│ DebtRepository      — CRUD + status transitions      │
│ GoalRepository      — CRUD + progress queries        │
│ InsightRepository   — read/dismiss/session state     │
└─────────────────────────────────────────────────────┘
```

Each repository operates within a **realm scope** — all queries include
`WHERE realm = 'perso' | 'business'` to enforce isolation.

---

## 4. Data Model

### Entity Relationships

```
Realm (perso | business)
  ├── Pocket (3 per realm: cash, orange_money, moov_money)
  │     └── Transaction (ledger entries: credit, debit, transfer)
  ├── Debt / Receivable
  ├── Goal
  └── [Business only] Sale
      └── Expense
```

### Key Entity Shapes

**Pocket**
```
{
  id: "pocket_xxx",
  realm: "perso" | "business",
  type: "cash" | "orange_money" | "moov_money",
  name: string,
  balance: number,          // computed, not stored
  created_at: string        // ISO 8601
}
```

**Transaction**
```
{
  id: "txn_xxx",
  pocket_id: string,
  type: "credit" | "debit" | "transfer",
  amount: number,            // FCFA minor units
  source_pocket_id?: string, // for transfers
  dest_pocket_id?: string,   // for transfers
  description?: string,
  created_at: string
}
```

**Debt / Receivable**
```
{
  id: "debt_xxx",
  realm: "perso" | "business",
  type: "debt" | "receivable",
  counterparty_name: string,
  amount: number,
  amount_paid: number,       // 0 to amount
  status: "pending" | "partially_paid" | "settled",
  linked_sale_id?: string,   // business receivables only
  due_date?: string,
  created_at: string
}
```

**Sale** (business only)
```
{
  id: "sale_xxx",
  product_name: string,
  quantity: number,
  unit_price: number,
  total: number,             // computed: quantity × unit_price
  pocket_id: string,
  created_at: string
}
```

**Expense** (business only)
```
{
  id: "expense_xxx",
  name: string,
  amount: number,
  category: "material_cost" | "fixed_cost" | "other",
  pocket_id: string,
  created_at: string
}
```

**Goal**
```
{
  id: "goal_xxx",
  realm: "perso" | "business",
  name: string,
  target_amount: number,
  source_pocket_id?: string,
  created_at: string
}
```

---

## 5. Key Design Decisions

### D01 — No backend server
Tracklet is a single-user offline app. No data leaves the device. This
eliminates the entire surface area of auth, sync conflicts, latency, CORS,
rate limiting, and server costs. The trade-off: no multi-device, no cloud
backup, no collaborative features.

### D02 — Realm isolation at the query layer
Personal and Business data live in the same database but are separated by
a `realm` discriminator on every entity. The repository layer enforces this
— no query ever crosses realms. This avoids two databases (simpler code)
while maintaining the hard separation the user needs.

### D03 — Computed values over stored
Balance, margin, cash position, and goal progress are computed on read
from transaction data, not stored as pre-aggregated fields. This guarantees
consistency (no stale aggregate) at the cost of recomputation. Acceptable
because the data volume per user is low (thousands of transactions, not
millions).

### D04 — Atomic transfers
A transfer between pockets is either fully committed or fully rolled back.
This prevents money disappearing from the system due to partial writes.

### D05 — Insight engine is rule-based, not ML
Insights are hand-written templates mapped to action types. No ML model,
no API call, no latency. The non-repetition guarantee is enforced by a
session-scoped seen-IDs set.

### D06 — Export is file-system only
PDF and image export writes to the device's file system. No email, no
cloud upload, no share-by-link in alpha.

---

## 6. Offline / PWA Strategy

- **Service Worker:** caches app shell for instant loading. No dynamic
  caching (no network requests to cache).
- **Installability:** manifest.json + service worker → "Add to Home Screen"
  on Android.
- **Storage:** IndexedDB is the primary data store. All mutations go through
  a thin repository wrapper that opens a transaction, writes, and confirms.
- **No online mode:** The app has no concept of "online." It works the same
  way whether the device has connectivity or not.

---

## 7. Security Model

- **No authentication.** Single-user device-local app. Device-level security
  (screen lock) is the user's responsibility.
- **No data leaves the device.** No network requests, no telemetry, no
  analytics.
- **Export files** are written to the app's private directory (or user-chosen
  location) and may contain sensitive financial data. The user is responsible
  for securing exported files.

---

## 8. Performance Constraints

- Target: all operations complete in < 50ms on a mid-range Android device
  (4GB RAM, Snapdragon 6-series).
- Pocket balance queries: indexed by pocket_id, O(n) over transaction count
  for that pocket (acceptable for < 10k transactions per pocket).
- Aggregation queries (monthly sales): filtered by date range, computed in
  JavaScript from the full result set (acceptable for < 5k records).
- No pagination needed — local data is always sub-10k records per entity.

---

## 9. Future Considerations (not in alpha)

- **Export sync** (Google Drive / OneDrive backup) — would require adding
  an online mode and a sync protocol.
- **Multi-device** — would require a backend, conflict resolution, and
  authentication. Architectural impact is large.
- **Agent (premium)** — the Native Agent feature (C02 in SRS) will add an
  on-device LLM or prompt-based reasoning engine that works offline. The
  memory store will be an extension of the existing IndexedDB schema.
- **Biometrics** — app-level lock via fingerprint / face unlock on supported
  devices.
