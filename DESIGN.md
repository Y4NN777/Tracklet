---
name: Tracklet
description: Local-first financial copilot for francophone micro-entrepreneurs
version: alpha

colors:
  primary: "#465024"
  primary-hover: "#30351F"
  primary-container: "#D4B895"
  on-primary: "#E8DCC7"
  surface: "#D4B895"
  card: "#E8DCC7"
  surface-alt: "#C7AA83"
  on-surface: "#30351F"
  on-surface-muted: "#504B38"
  success: "#37562F"
  success-container: "#A9B8A0"
  danger: "#6F2D1C"
  danger-container: "#D98E69"
  warning: "#57330F"
  warning-container: "#D6A752"
  info: "#465024"
  info-container: "#B7C0A8"
  border: "#8B755E"
  border-light: "#B69B79"

typography:
  family: "Epilogue Variable"
  display-weight: 700
  body-weight: 400
  label-weight: 600

rounded:
  control: 16px
  compact-surface: 20px
  card: 24px
  feature-surface: 32px
---

# Tracklet Design System

## Product direction

Tracklet uses one Organic design system across the public landing and the operational product. The visual language is warm and grounded because the product handles everyday cash, not abstract financial markets. It must feel trustworthy without resembling a generic blue fintech dashboard.

The interface is designed for francophone micro-entrepreneurs who may use a mid-range Android phone, have intermittent connectivity, and manage household and business money on the same device.

**Core product promise:** help the user answer what is available, what the activity earns, and what still has to move.

## Visual anchor

- **Anchor:** Organic.
- **Surfaces:** sand (`#E8DCC7`) and oat (`#D4B895`). Pure white, pure black, cold grey, and blue fintech palettes are excluded.
- **Accents:** deep moss, sage, clay, ochre, and terracotta.
- **Typography:** Epilogue Variable, bundled and precached for offline use.
- **Structure:** 16–32px radii, generous reading space, and clear left-aligned hierarchy.
- **Texture:** SVG grain at 1–3%; it never conveys information.
- **Motion:** one 300–500ms arrival transition. Reduced-motion preferences remove it.
- **Signature motif:** personal and business money remain visibly separate before their values converge in the cash-position view.

## UX principles

### Minimize time to value

The empty dashboard narrows activation to two steps:

1. Create the first pocket.
2. Record the next real movement.

Do not require an account, tutorial carousel, preference survey, or fabricated sample data before the user can act.

### Retention through utility

Retention comes from reliable recurring value, not streaks, urgency, unread badges, or artificial rewards.

- Keep frequent actions in a stable position.
- Show contextual guidance only when it is supported by local data.
- Make cash position and recent activity easy to revisit.
- Preserve honest empty states instead of filling screens with fake balances.
- Use success feedback after completed actions and specific recovery instructions after errors.

### Recognition over recall

- Navigation is grouped as **Au quotidien** and **À suivre**.
- The current **Personnel** or **Activité** context remains visible.
- Desktop uses a persistent navigation panel; compact layouts use four stable bottom destinations plus a complete drawer.
- Page titles, primary actions, filters, summaries, and lists follow the same order across routes.

### Progressive disclosure

The dashboard shows decisions first and details second. Explanations, filters, backup limits, and calculation formulas remain available without competing with the primary task.

## Color semantics

- **Primary / deep moss:** navigation, primary actions, and the single cash-position hero.
- **Success:** income, positive result, recovered receivables, achieved goals.
- **Danger:** destructive actions, negative result, and real financial risk only.
- **Warning:** active commitments and items requiring attention.
- **Info:** neutral financial guidance.

Color never carries meaning alone. Labels, signs, and icons remain present. Normal text maintains at least 4.5:1 contrast; interactive graphics and focus indicators maintain at least 3:1.

## Typography

Epilogue Variable is used across landing and product. It is warm, compact, and remains readable on mobile.

- Page title: 30–36px, weight 700, tight tracking.
- Section title: 20px, weight 700.
- Body: 14–16px with relaxed line height.
- Financial amount: 20–74px depending on hierarchy; always tabular in meaning and never truncated without another way to read it.
- Avoid decorative uppercase labels and letter-spaced filler text.
- Do not go below 11px for meaningful interface copy.

## Surfaces and shapes

- Product canvas: oat.
- Cards, dialogs, drawers, headers, and navigation: sand.
- Secondary grouping: oat or clay-derived surface.
- Primary cash-position surface: deep moss with sand text.
- Controls: minimum 16px radius and 44px target height.
- Cards: 20–24px radius.
- Feature and dialog surfaces: 32px radius.
- Shadows are reserved for overlays and floating guidance; page hierarchy relies on color and borders.
- Gradients are not used.

## Product shell

### Desktop

- Persistent 288px navigation panel.
- Realm switch appears before route navigation.
- Routes are grouped by recurring task rather than implementation domain.
- Main content is capped at 1408px and keeps readable line lengths.

### Mobile

- Header identifies the current page and financial realm.
- Bottom navigation contains four stable destinations.
- The drawer exposes every route and manages focus on open/close.
- Safe-area padding prevents navigation from colliding with device chrome.
- Fixed guidance and toast surfaces sit above the bottom navigation.

## Shared components

### Primary action

Deep moss background, sand text, 16px radius, and at least 44px height. Use one primary action per local task area. Repeated buttons may exist when they lead to the same task from different responsive positions.

### Cards and lists

Use cards for a coherent decision or object, not for every label/value pair. Related list rows share one containing surface and dividers when possible.

### Forms

- Inputs use the sand surface, visible border, explicit label, and at least 44px height.
- Keep the user’s entered data after validation failures.
- Error messages explain what failed and how to fix it.
- Saving states use direct labels such as `Enregistrement…`.
- Long forms remain in dialogs for this alpha; inline editing is out of scope.

### Dialogs

- Bottom sheet on compact screens and centered modal on larger screens.
- Focus moves into the dialog, remains trapped, and returns to the trigger.
- Escape and outside click close non-destructive dialogs.
- Destructive actions use an alert dialog with explicit consequence copy.

### Empty states

Every empty state explains why the screen is empty and offers the next useful action. The first-run dashboard is a guided activation surface; later empty states stay compact.

### Toasts and status

- Success, information, and error messages include a Lucide icon and text.
- Error announcements use `role="alert"`; other messages use `role="status"`.
- Notifications can be dismissed manually and never rely only on color.

### Contextual guidance

`Repères utiles` uses only the current device’s data. It has no red attention badge and does not imply urgency. Dismissing a tip is always available.

## Content rules

**Do**

- Use direct French labels and FCFA units.
- Name the current realm whenever a switch could change the interpretation of data.
- Explain local storage and unencrypted backups precisely.
- Keep the next action visible.

**Do not**

- Fabricate balances, customers, testimonials, or progress.
- Use accounting jargon when everyday language is more accurate.
- Use Unicode glyphs as interface icons; use Lucide.
- Use streaks, artificial deadlines, celebratory confetti, or manipulative notifications for retention.
- Hide essential routes behind horizontal scrolling.

## Accessibility and release gates

- WCAG 2.2 AA contrast for text and essential graphics.
- Visible two-tone focus ring across light and dark surfaces.
- 44px product controls and at least 24px WCAG minimum targets.
- Keyboard access for navigation, drawers, dialogs, filters, and forms.
- Focus is not obscured by fixed bottom navigation or guidance.
- Layout reflows at 320px and at 400% zoom without two-dimensional page scrolling.
- `prefers-reduced-motion` removes route and hero transitions.
- Production QA covers empty and populated data, both realms, offline start, backup/restore messaging, direct hash routes, desktop, and mobile.
