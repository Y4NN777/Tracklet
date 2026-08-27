# UI release audit

Run this checklist before a UI release and after changing shared layout,
navigation, forms, dialogs, or financial summaries.

## Viewports and navigation

1. Check every route at 390 px, 768 px, and 1280 px widths.
2. On mobile, verify the four primary bottom-navigation items remain visible and
   the remaining destinations are reachable from the menu.
3. On larger screens, verify the sidebar does not cover or compress page content.
4. Switch between the personal and business realms and confirm realm-specific
   pages, categories, pockets, totals, and navigation remain isolated.

## States and interactions

1. Test first launch with no user records, normal data, and a large data set.
2. Test loading, empty, validation-error, storage-error, confirmation, and success
   states for every modified flow.
3. Verify modal focus starts inside the dialog, `Escape` closes it when safe, body
   scrolling is locked, and keyboard focus never becomes trapped behind it.
4. Confirm destructive actions require explicit confirmation and busy states
   prevent duplicate submissions.
5. Install the PWA and repeat the main transaction flow while offline.

## Visual and content checks

1. Check colors, typography, spacing, and status treatments against the tokens in
   `src/index.css`.
2. Verify text and controls meet readable contrast in the current light theme.
3. Check that French labels are short, consistent, and understandable without
   accounting jargon.
4. Confirm amounts use whole FCFA values, dates are legible, and long names do not
   overflow cards, tables, or dialogs.
5. Verify interactive controls have visible labels or accessible names and usable
   focus indicators.
