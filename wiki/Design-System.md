# Design System

## What is Storybook?

**Storybook** is an interactive catalogue of every UI component in this prototype. It shows you:

- What components exist and what they're called
- What they look like
- How they behave (different sizes, states, disabled, loading, etc.)
- Code examples

This is where you go when you're not sure what component to use, or you want to see all the options before asking Claude.

**To view Storybook locally:**
```bash
npm run storybook
```

This opens Storybook at `http://localhost:6006` in your browser.

---

## Component Categories

### Inputs
Buttons, text fields, checkboxes, dropdowns, switches, date pickers, file uploads, etc.

### Navigation
Tabs, menus, breadcrumbs, pagination, drawers, sidebars, etc.

### Feedback
Dialogs, alerts, toasts (notifications), progress bars, loading spinners, etc.

### Data Display
Tables, data grids, avatars, badges, chips, lists, tooltips, etc.

### Surfaces
Cards, panels, accordions, app bars, etc.

### Layout
Grids, stacks, containers, responsive layouts, etc.

### Dates & Pickers
Calendar, date picker, date range picker, time picker, etc.

---

## How to Use This

1. **Browse Storybook** to see what's available
2. **Note the component name** (e.g., "Button", "DataGrid", "TextField")
3. **Ask Claude** to use it: "Use a Button component with the label 'Submit'"

Claude knows all these components and will import them correctly.

---

## Key Rule: Playbook Components First

There are three tiers of components:

1. **Playbook Components** — Custom wrappers that match the real product (use these first)
2. **App Components** — Pre-built composite UI (player cards, status badges, etc.)
3. **MUI** — Generic Material-UI components (fallback only)

Always ask Claude to use a Playbook Component first. Claude knows this priority and will automatically choose the right one.

---

## Design Tokens

All colors, typography, and spacing are controlled by **design tokens** — CSS variables that ensure consistency.

**Never ask Claude to:**
- "Use a blue button" ❌ (too vague, won't match the system)
- "Make the text red" ❌ (won't be approved)
- "Use the font 'Arial'" ❌ (not part of the system)

**Instead:**
- "Add a primary-colored button" ✅
- "Use the error color for this alert" ✅
- "Add a large heading" ✅

Claude knows the available colors (`--color-primary`, `--color-success`, `--color-error`, `--color-warning`) and will use them correctly.

---

## What NOT to Do

- Don't hardcode colors (hex codes, rgb, etc.) — Claude won't allow it
- Don't use non-Outlined icons (Claude only uses `*Outlined` variants)
- Don't request new npm packages — the system is locked (this protects compatibility)

---

## Questions?

- **"What components do I have?"** → Browse Storybook
- **"What does [component] look like?"** → Search Storybook
- **"Is there a component that does [thing]?"** → Ask Claude to search Storybook for you
