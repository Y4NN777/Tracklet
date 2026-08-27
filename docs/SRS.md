# Tracklet — Software Requirements

- **Status:** Alpha 0.2.0 baseline
- **Updated:** 2026-08-27

## Implemented requirements

### Personal and business spaces

- Users can create named money pockets and record income or expenses.
- Users can transfer money atomically between pockets in the same space.
- Personal and business queries remain isolated.
- The dashboard shows balances, cash position, recent activity, debts, and contextual tips.

### Debts and goals

- Users can record money lent or borrowed, settle it, write it off, or delete an erroneous record.
- Cash position uses active debts only.
- Users can create savings goals, link an optional same-space pocket, and update explicit progress.

### Business activity

- Users can record and search sales by day, week, or month.
- Recording a sale credits its selected business pocket.
- Profitability compares sales with expense transactions for the current and previous month.

### Reports and ownership

- Users can filter reports by date and inspect trends and categories.
- Transaction and sales CSV files can be downloaded.
- A versioned full-data JSON backup can be downloaded and restored.

### Experience

- The primary interface is French and formatted in FCFA.
- Core operations work offline after the PWA shell is cached.
- Mobile primary navigation contains four destinations; all destinations remain available in the drawer.
- Errors during user-triggered writes are reported without leaving forms permanently busy.

## Deferred requirements

- Partial debt payments and due-date notifications
- PDF or image reports
- Automatic backup or multi-device sync
- Biometric application lock or encrypted backup
- Conversational/premium agent
- Bank and mobile-money integrations
- Formal accounting and tax workflows
