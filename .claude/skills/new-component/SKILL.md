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

**`src/playbook-components/`**: for MUI wrappers and design system primitives
- Use when wrapping or extending an MUI component with project-specific defaults
- Must be exported from `src/playbook-components/index.js`

**`src/components/`**: for app-level UI components
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

Always write MUI variant props explicitly. Leave size to the theme, which uses iP's Playbook defaults (TextField and Select small; Button, Chip, IconButton and FormControl medium), unless a design calls for a different size:

```jsx
// TextFields
<TextField variant="filled" label="Search" />

// Buttons: import from playbook-components; secondary actions use color="secondary"
<Button variant="contained" color="primary" disableElevation={true}>
  Save
</Button>

// Selects: FormControl is full width by default, as in iP
<FormControl variant="filled">
  <Select variant="filled" />
</FormControl>
<FormControl variant="filled" fullWidth={false}>...</FormControl> // inline in a toolbar

// Chips and IconButtons
<Chip label="Tag" />
<IconButton><CloseOutlined /></IconButton>
```

## Colors: always use CSS custom properties

```jsx
// ✅ Correct
sx={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-secondary)' }}

// ❌ Wrong: ESLint will block the commit
sx={{ color: '#3b4960' }}
```

## Icons: Outlined only

```jsx
// ✅ Correct
import { AddOutlined, CloseOutlined, SearchOutlined } from '@mui/icons-material'

// ❌ Wrong
import { Add, Close, Search } from '@mui/icons-material'
```

## Export to barrel

After creating a new component in `src/playbook-components/`, add it to the barrel. `src/playbook-components/index.js` imports each component at the top and lists it in the single `export { ... }` block at the bottom:

```js
import MyComponent from './MyComponent';
// ...
export {
  // ...
  MyComponent,
};
```

Then add a story in `src/stories/<Group>/MyComponent.stories.js`. CI builds Storybook, so the story must build.

## Pattern reference

- MUI wrapper pattern: `src/playbook-components/TabBar/index.jsx`
- App component pattern: `src/components/PlayerAvatar.jsx`, `src/components/StatusChip.jsx`
- Story pattern: `src/stories/Navigation/TabBar.stories.js`
- Mock data or option lists go in `src/data/`, never inline in the component

## After creating

Run `npm run validate-design-system` to confirm no design system violations before finishing.
