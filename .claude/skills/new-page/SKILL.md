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

## 1. Choose a floorplan

Every page starts from one of the eight floorplans. Work out what the user is trying to do on the page, then take the first match in the decision list in `docs/reference/design-system.md` → "Floorplans" → "Choosing a floorplan". Read that section; don't work from memory.

If the request doesn't make the job clear, ask which floorplan fits, offering the one or two the decision list points to. Say which floorplan you chose and why when you report back.

If none fits, build the page anyway and put the reason in a comment at the top: `// Floorplan: none. <reason>`.

## 2. Create the page

Pages go in `src/pages/`, as `MyFeature.jsx` or `MyFeature/index.jsx`.

A page renders **only its own content**. `src/App.jsx` already wraps every route in `LayoutWithMainNav` (the sidebar and app bar), so don't wrap the page in it again.

Compose the page from `src/floorplans`. Use only the regions the floorplan needs, and never build a page-specific header, toolbar or footer:

```jsx
import { useState } from 'react'
import { PageFrame, PageHeader, PageToolbar, PageSearch, PageState, useToasts } from '../floorplans'

export default function MyFeaturePage() {
  const [search, setSearch] = useState('')
  const { showToast, toasts } = useToasts()

  return (
    <PageFrame
      header={<PageHeader title="Page title" primaryAction={{ id: 'add', label: 'Add item', onClick: () => showToast({ title: 'Item added' }) }} />}
      toolbar={<PageToolbar><PageSearch value={search} onChange={setSearch} /></PageToolbar>}
    >
      {/* the floorplan's content; PageState covers empty, no results, no access, error and loading */}
      {toasts}
    </PageFrame>
  )
}
```

`PageFrame` slots: `header`, `tabs` (a `TabBar`), `toolbar`, `selection` (`{ count, actions }`, which swaps the toolbar for the selection bar), `footer` (a `FloorplanFooter`, only for create and edit) and `fill` (for content that scrolls on its own). The rules for each region are in the "Page anatomy" table in the design system reference.

Because the page has its own header, add its path to `pagesWithOwnHeader` in `src/data/layout.js`.

## 3. Add the route

In `src/App.jsx`, import the page and add a `<Route>` inside the existing `<Routes>`:

```jsx
import MyFeaturePage from './pages/MyFeature'
// ...
<Route path="/my-feature" element={<MyFeaturePage />} />
```

## 4. Add it to the navigation (if it needs a sidebar item)

- Sidebar item: add an entry to `navigationItems` in `src/components/MainNavigation.jsx` (label in sentence case, an `*Outlined` icon, the route path)
- App bar title: add the path to `pageTitles` in `src/data/layout.js`

## 5. Data: import from src/data/, never inline

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

## 6. Data grids: use the shared styles

Style the Box that wraps a `DataGrid` with the shared `dataGridStyles` from `src/components/dataGridStyles.js`. Don't copy grid styles into the page; add page-specific rules after the spread.

```jsx
import { DataGrid } from '../../playbook-components'
import { dataGridStyles } from '../../components/dataGridStyles'

<Box sx={{ ...dataGridStyles, height: 560, width: '100%' }}>
  <DataGrid rows={rows} columns={columns} />
</Box>
```

## Component import priority

0. `src/floorplans`: the page frame and its regions
1. `src/playbook-components`: Button, DataGrid, TabBar, Drawer, Toasts, SelectWrapper, and the MUI primitives (Box, Typography, ...)
2. `src/components`: AthleteDataGrid, PlayerAvatar, LogoImage, StatusChip, Card, Icon
3. `@mui/material`: only when 1 and 2 have no equivalent

Follow the MUI 9 APIs and design rules in `docs/reference/design-system.md`.

## Reference pages

Follow the reference page for your floorplan, listed in the "The eight floorplans" table in the design system reference. The Storybook stories under **Floorplans** show each region on its own.

## After creating

Run `npm run validate-design-system`, then open the route at http://localhost:3001 to check it renders.
