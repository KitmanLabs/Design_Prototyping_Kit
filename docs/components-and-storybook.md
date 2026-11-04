# Components and Storybook

The prototype uses pre-built components that match the design system in iP: Intelligence Platform. This page is the designer's overview; the full rules are in the [design system reference](reference/design-system.md).

---

## Storybook

**Storybook** is the interactive catalogue of the components in this prototype. For each one it shows what it's called, what it looks like, how it behaves in different states (sizes, disabled, loading and so on), and example code.

Browse it before asking Claude to build something, so you know what's available:

```bash
npm run storybook
```

It opens at **http://localhost:6006**.

---

## What's in it

Storybook's sidebar groups the components like this:

| Group | Examples |
|---|---|
| Inputs | Buttons, text fields, selects, autocomplete, checkboxes, switches, sliders, file uploads, rich text editor |
| Date & Time Pickers | Date, time and date-time pickers, date range pickers, the custom date range picker with quick filters |
| Navigation | Tabs and TabBar, menus, drawers, steppers, bottom navigation, links |
| Feedback | Dialogs, confirmation modals, alerts, toasts, snackbars, progress, skeletons |
| Data Display | Avatars, badges, chips, lists, tooltips, typography, availability labels |
| Table | DataGrid, DataGridPremium (bulk actions, row grouping), the AI Assistant, expanding cells |
| Surfaces | Cards, paper, accordions, app bars, the bulk action bar |
| Layout | Box, Grid, Stack, containers, image lists |
| Scheduler | Event calendar (day, week, month, agenda) and event timeline (beta) |
| Chat | Chat box (alpha) |
| Utils | Modals, poppers, popovers, transitions |

Scheduler and Chat are early MUI releases: fine to prototype with, but expect changes. The Event timeline and the Data Grid's AI Assistant are MUI Premium features.

---

## How to use it

1. **Browse Storybook** to see what's available
2. **Note the component's name**, such as "TabBar" or "DataGrid"
3. **Ask Claude** to use it: "Add a TabBar with Overview and Notes tabs"

Claude knows these components and imports them correctly.

---

## Playbook Components first

There are three tiers:

1. **Playbook Components**: wrappers that match iP. Always the first choice.
2. **App components**: prototype pieces the Playbook doesn't have, such as athlete avatars and status chips.
3. **Material UI**: the fallback, only when neither of the above has what you need.

Claude follows this order automatically.

---

## Design tokens

All colors, typography and spacing come from **design tokens**: named CSS variables such as `--color-primary` and `--color-error`. That's what keeps every prototype consistent with iP.

Describe purpose, not appearance:

| Instead of | Ask for |
|---|---|
| "a blue button" | "a primary button" |
| "make the text red" | "use the error color" |
| "use Arial" | "a large heading" |

---

## The rules in short

- No hardcoded colors (hex codes, `rgb()` and so on): always a token
- Buttons are always filled ("contained"); secondary actions use the secondary color
- Icons are always the `*Outlined` variants
- Labels are in sentence case: "Add athlete", not "Add Athlete"
- New npm packages only with a developer's go-ahead

Claude applies all of these, and the [automatic checks](why-was-my-work-rejected.md) catch anything that slips through. Full detail: [design system reference](reference/design-system.md).

---

## Questions

- **What components are there?** Browse Storybook.
- **What does a component look like?** Search for it in Storybook.
- **Is there a component that does something specific?** Ask Claude: "Is there a component for picking a date range?"
