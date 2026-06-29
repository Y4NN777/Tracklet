---
description: Panim (Frontend) rules — load on frontend files
globs: ["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.js", "**/*.mjs", "**/*.cjs", "**/*.vue", "**/*.svelte", "**/*.astro", "**/*.css", "**/*.scss", "**/*.sass", "**/*.less", "**/*.html", "**/*.webmanifest", "**/components/**", "**/pages/**", "**/layouts/**", "**/composables/**", "**/stores/**", "**/hooks/**", "**/*.stories.*", "**/*.spec.{ts,tsx,js,jsx}", "**/*.test.{ts,tsx,js,jsx}", "**/.storybook/**", "**/vite.config.*", "**/vitest.config.*", "**/playwright.config.*", "**/tailwind.config.*", "**/postcss.config.*", "**/nuxt.config.*", "**/next.config.*", "**/.eslintrc*", "**/eslint.config.*"]
alwaysApply: false
---

# Panim — Frontend Rules

Load only on `.tsx`/`.jsx`/`.vue`/`.css`/`.html`. Owned by Huram (Team Lead).

- **pnpm only.** No `package-lock.json` or `yarn.lock` committed.
- **TailwindCSS utility classes** — no arbitrary CSS unless justified in a comment.
- **WCAG 2.2 AA minimum** on all interactive components.
- **Core Web Vitals budgets:** LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **TanStack Query** for all data fetching — no raw `fetch` in components.
- **TanStack Router** for routing — no `react-router` unless maintaining legacy.
- **Component co-location** — component, test, and story in the same directory.
- **No inline styles. No `!important`.**
- **WAI-ARIA roles and labels** on all interactive elements.
- **Vercel deployment config** present for frontend projects.
- Stack: HTML/CSS/Tailwind, JS/TS, React, TanStack, Vite, Storybook; Nuxt 3 / Vue 3 where used.
