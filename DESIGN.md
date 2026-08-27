---
name: Tracklet
description: Financial copilot for young entrepreneurs in French-speaking West Africa
version: alpha

colors:
  primary: "#185FA5"
  primary-light: "#378ADD"
  primary-container: "#E6F1FB"
  on-primary: "#FFFFFF"
  on-primary-container: "#0C447C"

  surface: "#FFFFFF"
  surface-variant: "#F7F9FF"
  surface-muted: "#F0F4FF"
  on-surface: "#111111"
  on-surface-secondary: "#666666"
  on-surface-muted: "#999999"

  success: "#1D9E75"
  success-container: "#E1F5EE"
  on-success-container: "#085041"

  danger: "#E24B4A"
  danger-container: "#FCEBEB"
  on-danger-container: "#791F1F"

  warning: "#BA7517"
  warning-container: "#FAEEDA"
  on-warning-container: "#633806"

  border: "#E0E8F8"
  border-strong: "#B5D4F4"

typography:
  h1:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
  amount:
    fontFamily: Inter
    fontSize: 1.625rem
    fontWeight: 500
    lineHeight: 1.1
  amount-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 600
    lineHeight: 1.1

rounded:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 28px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px

components:
  balance-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: 18px 20px

  pocket-card:
    backgroundColor: "{colors.surface-variant}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.sm}"
    padding: 12px
    borderColor: "{colors.border}"

  realm-tab-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
    padding: 7px 16px

  realm-tab-inactive:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.xs}"
    padding: 7px 16px

  realm-tab-container:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.xs}"
    padding: 3px

  action-button:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    size: 44px

  insight-card:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-secondary}"
    rounded: "{rounded.sm}"
    padding: 12px 14px
    borderLeft: 3px solid {colors.primary}

  bottom-nav:
    backgroundColor: "{colors.surface}"
    borderTop: 0.5px solid {colors.border}
    padding: 12px 16px 8px

  nav-icon-active:
    textColor: "{colors.primary}"

  nav-icon-inactive:
    textColor: "{colors.border-strong}"

  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    typography: "{typography.body-md}"

  button-primary-hover:
    backgroundColor: "{colors.primary-light}"

  button-secondary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    rounded: "{rounded.full}"
    padding: 12px 24px

  badge-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.on-success-container}"
    rounded: "{rounded.full}"
    padding: 4px 10px
    typography: "{typography.label}"

  badge-danger:
    backgroundColor: "{colors.danger-container}"
    textColor: "{colors.on-danger-container}"
    rounded: "{rounded.full}"
    padding: 4px 10px
    typography: "{typography.label}"

  badge-warning:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.on-warning-container}"
    rounded: "{rounded.full}"
    padding: 4px 10px
    typography: "{typography.label}"

  section-label:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
    padding: 0 20px 8px

  divider:
    backgroundColor: "{colors.border}"
    height: 0.5px
---

# Tracklet Design System

## Overview

Tracklet is a financial copilot for young micro-entrepreneurs in French-speaking West Africa. The design must inspire **trust, clarity, and accessibility** — without ever intimidating a user with no financial background.

The aesthetic draws from modern fintech apps (Revolut, Chime) adapted to the local context: light mode by default, confident royal blue as the trust-and-authority color, bold typography readable on small Android screens, generous rounded cards.

**Guiding principle**: every screen must answer a question in under 2 seconds without the user having to search. Key financial information (balance, margin, debts) is always front and center.

## Public landing direction

The public landing page uses a Swiss editorial system distinct from the operational app shell. Its purpose is explanation and orientation, not financial data entry.

- **Surface:** pure white (`#FFFFFF`) and neutral (`#F7F7F8`).
- **Accent:** Yves Klein blue (`#002FA7`) only.
- **Typography:** Helvetica Neue or a system Helvetica/Arial fallback, left aligned with tightly tracked display headings.
- **Structure:** asymmetric sections, visible 1px grid lines, square controls, and large numerals as composition elements.
- **Restrictions:** no gradients, grain, decorative shadows, fabricated balances, customer counts, or testimonials.
- **Signature motif:** personal and business pockets remain visibly separated before converging into one cash-position explanation.

The product mockup on the landing names real Tracklet concepts but never pretends that sample balances are user data. Once the user opens `/#/dashboard`, the operational interface returns to the mobile-first tokens documented below.

## Colors

The palette is built around a single strong royal blue (`#185FA5`) as the primary color — a universal fintech trust color, readable on white backgrounds, strong in mobile contexts.

- **Primary (`#185FA5`)** : Royal blue — all primary actions, balance cards, active tabs, CTA buttons, insight accents.
- **Primary Light (`#378ADD`)** : Hover/active variant for primary.
- **Primary Container (`#E6F1FB`)** : Pale blue tint — muted surface backgrounds, action buttons, realm tab container.
- **Surface (`#FFFFFF`)** : Main background. Light mode only.
- **Surface Variant (`#F7F9FF`)** : Secondary cards (pocket cards, etc.).
- **Surface Muted (`#F0F4FF`)** : Backgrounds for non-primary interactive elements.
- **Success (`#1D9E75`)** : Money inflows, receivables collected, goals achieved.
- **Danger (`#E24B4A`)** : Debts, alerts, negative balance.
- **Warning (`#BA7517`)** : Reminders, overdue receivables, budget exceeded.
- **Border (`#E0E8F8`)** : Hairlines between elements. Always 0.5px.

Never use red for anything other than real financial danger — red creates unnecessary anxiety. Overdue debt reminders use warning (amber), not danger.

## Typography

Single typeface: **Inter**. Readable on all mid-range Android screens, free, available on Google Fonts.

Financial amounts (`amount`, `amount-lg`) get special treatment: weight 500-600, generous size. An amount must be readable at a glance without effort.

Section labels (`label`) are uppercase with letter-spacing — clear visual separation between sections without relying on dividers.

Never go below 11px on mobile. Prefer reducing content over reducing font size.

## Layout

Mobile-first. Reference viewport 390px (standard mid-range Android).

Standard screen structure:
1. Status bar (system)
2. Header (greeting + action icon) — 56px
3. Balance card (hero metric) — variable height, min 90px
4. Realm tabs (Personal / Business) — 40px
5. Content sections (scrollable)
6. Bottom navigation — 64px fixed

Every primary action must be reachable in **max 2 taps** from the home screen.

Vertical scrolling only. No hidden horizontal scroll.

Global horizontal padding: 16px each side.
Section gap: 16px.
Card gap within a section: 8px.

## Elevation & Depth

No shadows. Visual hierarchy is created purely by background color:
- `surface` (#FFF) → main content
- `surface-variant` (#F7F9FF) → pocket cards, secondary elements
- `surface-muted` (#F0F4FF) → action buttons, tab containers, insight cards
- `primary` (#185FA5) → balance card hero (only element with strong colored background)

No gradients. No blur. Flat only.

## Shapes

Generous border radius — rounded shapes reduce anxiety and make the app feel accessible.

- Inline components (badges, pills, tabs) : `rounded.xs` (8px) or `rounded.full`
- Pocket cards, action buttons, insight cards : `rounded.sm` (12px)
- Balance card, modal cards : `rounded.lg` (20px) to `rounded.xl` (28px)

No right angles except for dividers and borders.

## Components

### Balance Card
The most important component in the app. `primary` background, white text. Displayed as hero on the home screen.
Structure: muted label at top → main amount (amount-lg) → sub-labels (receivables / committed) in body-sm.
Always full width with `margin: 12px 16px`.

### Realm Tabs
Personal / Business switcher always visible below the balance card.
Container: `surface-muted`, border-radius `rounded.xs`, padding 3px.
Active tab: `primary` background, white text.
Inactive tab: transparent background, `on-surface-muted` text.

### Pocket Cards
3-column grid for Cash / Orange Money / Moov Money.
Background `surface-variant`, border `border` 0.5px, radius `rounded.sm`.
Icon at top (18px), muted label, amount in body-md bold.

### Quick Actions
Grid of 4 horizontal actions (Income, Expense, Transfer, Debts).
Each action: icon button 44x44 (`surface-muted`, `primary` icon) + centered `body-sm` label.
Spacing: `justify-content: space-around`.

### Insight Card
Background `surface-muted`, border-left 3px solid `primary`.
Text `on-surface-secondary`, body-sm, line-height 1.5.
Amounts and names in `primary`, font-weight 500.
Dismissable. Only one insight visible at a time.

### Bottom Navigation
5 items: Home, Analytics, Goals, Agent (premium), Settings.
Icons 20px. Active: `primary`. Inactive: `border-strong`.
Active indicator: 4px `primary` dot below the icon.

## Do's and Don'ts

**Do**
- Always show the total balance first
- Use simple, direct French labels (no jargon)
- Format amounts with spaces: `47 500 FCFA` (not `47,500`)
- Keep insights short — max 2 lines
- Use success/danger/warning consistently and semantically

**Don't**
- Never use gradients or decorative shadows
- Never show two balance cards on the same screen
- Never go below 11px font size
- Never use red for anything other than a critical financial situation
- Never hide important information behind horizontal scroll
- Never use the word "accounting" in the UI — prefer "tracking", "management", "cash flow"
