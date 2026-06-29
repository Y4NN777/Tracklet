# Tracklet — Software Requirements Specification

- **Status:** Draft
- **Date:** 2026-06-29
- **Author:** Y4NN (Nathan)
- **Source:** [PRD](./PRD.md)

---

## 1. PERSO Realm

### P01 — Money Tracking
- The user can create and manage pockets: Cash, Orange Money, Moov Money
- The user can credit and debit each pocket
- The user can transfer between pockets
- Total personal balance = sum of all personal pockets

### P02 — Debts & Receivables
- The user can record a receivable: debtor name, amount, date
- The user can record a debt: creditor name, amount, date
- Status: pending / partially paid / settled
- Reminders on unsettled receivables

### P03 — Personal Goals
- The user defines a goal: name, target amount, optional source pocket
- Display: amount saved, amount remaining, estimated time at current pace

### P04 — Personal Cash Position
- Available balance = total pockets - outstanding debts + receivables due
- Displayed as one clear line: *"You have X FCFA available"*
- Breakdown: available / committed / to receive

---

## 2. BUSINESS Realm

### B01 — Business Money Tracking
- The user can create and manage pockets: Cash Desk, Orange Money, Moov Money
- The user can credit and debit each pocket
- The user can transfer between pockets
- Total business balance = sum of all business pockets

### B02 — Sales Tracking
- The user logs a sale: product/service name, quantity, unit price, receiving pocket, date (auto)
- Total sale = quantity × unit price (auto-calculated)
- Aggregation by day / week / month
- Searchable history

### B03 — Business Expense Tracking
- The user records an expense: name, amount, category (material cost / fixed cost / other), debited pocket, date (auto)
- Display by category and period

### B04 — Business Debts & Receivables
- Client receivable: name, amount, linked sale (optional), date, status
- Supplier debt: name, amount, date, status
- Status: pending / partially paid / settled
- Reminders on unsettled receivables

### B05 — Profitability Check
- Gross margin = sales - material costs
- Net result = gross margin - fixed costs
- Simple language: *"This month you earned X FCFA after expenses"*
- Current period vs previous period comparison

### B06 — Business Cash Position
- Available balance = total pockets - supplier debts + client receivables
- Displayed as: *"Your cash desk says X FCFA"*
- Breakdown: available / committed / to receive

### B07 — Business Goals
- The user defines a goal: name, target amount, optional source pocket
- Display: amount remaining, sales needed at current pace, estimated time

### B08 — Simple Report
- Summary: sales / expenses / margin / net result / debts & receivables / goals
- Selectable period
- Export as PDF or image

---

## 3. CROSS-REALM

### C01 — Contextual Learning (Free)
- Short insight after each action, tied to that action
- Maximum 1 insight per action
- No repetition of the same insight twice in a row
- Dismissable in one tap
- Tone: simple, direct, not condescending

### C02 — Native Agent (Premium)
- User chooses the agent's name and personality at setup
- Hybrid: proactive when it detects something, reactive to user questions
- Scope: app data + general finance questions
- Memory of past exchanges

### C03 — Mobile First + Offline
- All data stored locally on device
- No action requires an internet connection
- PWA installable on Android
- Every primary action accessible in max 2 taps

### C04 — Native FCFA
- FCFA displayed everywhere by default
- No currency conversion
- Local formatting: 1 500 FCFA
