# C4 Level 3 — Components

```mermaid
flowchart LR
  landing[Public landing page]
  pages[Financial pages and forms]
  hooks[React data hooks]
  calcs[Domain calculations]
  tips[Rule-based tips]
  backup[Backup/restore]
  repositories[Entity repositories]
  validation[Input validation]
  db[(IndexedDB)]

  landing --> pages
  pages --> hooks
  pages --> backup
  pages --> repositories
  hooks --> calcs
  hooks --> repositories
  calcs --> repositories
  tips --> calcs
  repositories --> validation
  repositories --> db
  backup --> db
```

High-risk multi-store operations—transfers, sales, and restore—use a single IndexedDB transaction.
