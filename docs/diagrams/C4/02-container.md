# C4 Container Diagram — Tracklet

```mermaid
C4Container
  title Container Diagram — Tracklet

  Person(micro_entrepreneur, "Micro-entrepreneur", "Android user")

  System_Boundary(tracklet_pwa, "Tracklet PWA") {
    Container(web_app, "Web Application", "Next.js + React 18 + TypeScript", "UI rendering, routing, state management")
    Container(service_worker, "Service Worker", "JavaScript", "App shell caching, PWA installability")
    Container(action_handlers, "Action Handlers", "TypeScript", "Atomic write operations: credits, debits, transfers, sales, expenses")
    Container(calc_engine, "Calculation Engine", "TypeScript", "Stateless computations: balance, margin, cash position, goal progress")
    Container(insight_engine, "Insight Engine", "TypeScript", "Rule-based contextual learning dispatch")
    Container(report_gen, "Report Generator", "TypeScript", "PDF and image export from local data")
    Container(repositories, "Repositories", "TypeScript", "Data access layer: Pocket, Transaction, Sale, Expense, Debt, Goal, Insight")
    ContainerDb(indexeddb, "IndexedDB", "Browser Storage API", "Primary data store, per-origin sandboxed")
  }

  System_Ext(file_system, "Device File System", "Exported reports")
  System_Ext(android_sandbox, "Android Sandbox", "OS-level app isolation")

  Rel(micro_entrepreneur, web_app, "Interacts with", "HTTPS / touch")
  Rel(web_app, service_worker, "Registered to", "Install + cache")
  Rel(web_app, action_handlers, "Dispatches user actions to", "function call")
  Rel(action_handlers, repositories, "Writes through", "async/await")
  Rel(repositories, indexeddb, "Reads/Writes", "IndexedDB transactions")
  Rel(web_app, calc_engine, "Reads computed data from", "function call")
  Rel(calc_engine, repositories, "Queries raw data from", "read")
  Rel(web_app, insight_engine, "Requests insight after action", "function call")
  Rel(web_app, report_gen, "Triggers export from", "function call")
  Rel(report_gen, file_system, "Writes file to", "File System API")
  Rel(tracklet_pwa, android_sandbox, "Runs inside", "Chrome renderer sandbox")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Container Descriptions

| Container | Technology | Responsibility |
|---|---|---|
| Web Application | Next.js + React 18 + TypeScript | UI rendering, routing, all user-facing screens |
| Service Worker | JavaScript | PWA caching, offline loading, "Add to Home Screen" |
| Action Handlers | TypeScript | Atomic write operations — each user action maps to one handler |
| Calculation Engine | TypeScript | Stateless recomputation of balance, margin, cash position, goal progress |
| Insight Engine | TypeScript | Rule-based dispatch of contextual learning after each action |
| Report Generator | TypeScript | Reads data, renders PDF/image, writes to file system |
| Repositories | TypeScript | Data access layer — one repository per entity type, realm-scoped queries |
| IndexedDB | Browser Storage API | All persistent data — pockets, transactions, sales, expenses, debts, goals |

## Data Flow

1. User taps an action (e.g., "log sale") in the Web Application
2. Web Application renders the form → user submits
3. Action Handler validates input → calls Repository to write
4. Repository opens IndexedDB transaction → writes → confirms
5. UI reads updated data (via Calculation Engine for computed values)
6. Insight Engine fires (if applicable) → shows contextual learning
