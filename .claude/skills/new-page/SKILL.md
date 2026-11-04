---
name: new-page
description: Create a new page or view in src/pages/. Triggered when building a new screen, route, or full-page layout for the prototype.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# New Page Guide

## 1. Create the page

Pages go in `src/pages/`, as `MyFeature.jsx` or `MyFeature/index.jsx`.

A page renders **only its own content**. `src/App.jsx` already wraps every route in `LayoutWithMainNav` (the sidebar and header), so don't wrap the page in it again.

```jsx
import { Box, Typography } from '../../playbook-components'

export default function MyFeaturePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Page title</Typography>
      </Box>
      <Box>{/* main content */}</Box>
    </Box>
  )
}
```

## 2. Add the route

In `src/App.jsx`, import the page and add a `<Route>` inside the existing `<Routes>`:

```jsx
import MyFeaturePage from './pages/MyFeature'
// ...
<Route path="/my-feature" element={<MyFeaturePage />} />
```

## 3. Add it to the navigation (if it needs a sidebar item)

- Sidebar item: add an entry to `navigationItems` in `src/components/MainNavigation.jsx` (label in sentence case, an `*Outlined` icon, the route path)
- Header title: add the path to `pageTitles` in `src/data/layout.js`

## 4. Data: import from src/data/, never inline

```jsx
// ✅ Correct
import athletes from '../../data/athletes.json'

// ❌ Wrong: never hardcode mock data inside a component
const athletes = [{ id: 1, name: 'Jordan Lee' }]
```

Existing data in `src/data/`:
- `athletes.json`: athlete profiles (name, position, squad, availability, ...)
- `squads_teams.json`, `users_staff.json`: squads and staff
- `calendar_events.json`, `training_sessions.json`, `games_matches.json`: schedule
- `injuries_medical.json`, `assessments.json`, `questionnaires_wellbeing.json`: medical and wellbeing
- `forms_templates.json`, `formTemplates/`, `forms.js`: forms
- `messaging.js`, `layout.js`, `calendarEventOptions.js`: feature mock data and option lists

New mock data for the page goes in a new or existing module in `src/data/`. Run `npm run docs:data` afterwards to refresh `docs/understanding-the-data.md`.

## 5. Data grids: use the shared styles

Style the Box that wraps a `DataGrid` with the shared `dataGridStyles` from `src/components/dataGridStyles.js`. Don't copy grid styles into the page; add page-specific rules after the spread.

```jsx
import { DataGrid } from '../../playbook-components'
import { dataGridStyles } from '../../components/dataGridStyles'

<Box sx={{ ...dataGridStyles, height: 560, width: '100%' }}>
  <DataGrid rows={rows} columns={columns} />
</Box>
```

## Component import priority

1. `src/playbook-components`: Button, DataGrid, TabBar, Drawer, Toasts, SelectWrapper, and the MUI primitives (Box, Typography, ...)
2. `src/components`: AthleteDataGrid, PlayerAvatar, LogoImage, StatusChip, Card, Icon
3. `@mui/material`: only when 1 and 2 have no equivalent

Follow the MUI 9 APIs and design rules in `docs/reference/design-system.md`.

## Reference pages

- `src/pages/Athletes.jsx`: a simple page around a data grid
- `src/pages/Medical/index.jsx`: tabs, filters and a grid
- `src/pages/Calendar/index.jsx`: a full-page feature with drawers

## After creating

Run `npm run validate-design-system`, then open the route at http://localhost:3001 to check it renders.
