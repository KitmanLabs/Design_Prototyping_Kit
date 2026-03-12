---
name: new-component
description: Scaffold a new reusable component in src/playbook-components or src/components. Triggered when creating, building, or adding a new UI component to the design system.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# New Component Guide

## Which directory?

**`src/playbook-components/`** — for MUI wrappers and design system primitives
- Use when wrapping or extending an MUI component with project-specific defaults
- Must be exported from `src/playbook-components/index.js`

**`src/components/`** — for app-level UI components
- Use for composite components unique to this application (PlayerAvatar, AthleteDataGrid, etc.)
- May or may not be exported depending on reuse scope

## File structure

```
src/playbook-components/ComponentName/
├── index.jsx       ← main component
└── index.js        ← re-export (if needed for barrel)
```

Or for simple components, a single file:
```
src/playbook-components/ComponentName.jsx
```

## Required prop patterns

Always write MUI variant and size props explicitly, even though the theme enforces them as defaults:

```jsx
// TextFields
<TextField variant="filled" size="small" label="Search" />

// Buttons
<Button variant="contained" size="small" disableElevation>
  Save
</Button>

// Selects
<Select variant="filled" size="small" />
<FormControl variant="filled" size="small">...</FormControl>

// Chips, IconButtons, Autocomplete
<Chip size="small" label="Tag" />
<IconButton size="small"><CloseOutlined /></IconButton>
<Autocomplete size="small" ... />
```

## Colors — always use CSS custom properties

```jsx
// ✅ Correct
sx={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-secondary)' }}

// ❌ Wrong — ESLint will block commit
sx={{ color: '#3b4960' }}
```

## Icons — Outlined only

```jsx
// ✅ Correct
import { AddOutlined, CloseOutlined, SearchOutlined } from '@mui/icons-material'

// ❌ Wrong
import { Add, Close, Search } from '@mui/icons-material'
```

## Export to barrel

After creating a new component in `src/playbook-components/`, add it to the barrel:

```js
// src/playbook-components/index.js — add your export
export { default as MyComponent } from './MyComponent'
```

## Pattern reference

- MUI wrapper pattern: `src/playbook-components/TabBar/index.jsx`
- App component pattern: `src/components/Button.jsx`, `src/components/PlayerAvatar.jsx`

## After creating

Run `npm run lint` to confirm no design system violations before finishing.
