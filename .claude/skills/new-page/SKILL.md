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

## File location

All pages go in `src/pages/`. Use a descriptive directory name:

```
src/pages/
└── MyFeature/
    └── index.jsx    ← or MyFeature.jsx at the top level
```

## Layout wrapper — always required

Every page must be wrapped in `LayoutWithMainNav` from `src/components/`:

```jsx
import { LayoutWithMainNav } from '../components/LayoutWithMainNav'

export default function MyFeaturePage() {
  return (
    <LayoutWithMainNav>
      {/* page content here */}
    </LayoutWithMainNav>
  )
}
```

## Data — import from src/data/, never inline

```jsx
// ✅ Correct
import athletes from '../data/athletes.json'
import sessions from '../data/training_sessions.json'

// ❌ Wrong — never hardcode data inline
const athletes = [{ id: 1, name: 'John Smith' ... }]
```

Available data files in `src/data/`:
- `athletes.json` — athlete profiles (firstname, lastname, position, squad, availability_status, etc.)
- `training_sessions.json` — training session records
- `games_matches.json` — match/game fixtures
- `squads_teams.json` — squad/team definitions
- `assessments.json` — assessment records

## Page structure pattern

```jsx
import { Box, Typography } from '../playbook-components'
import { LayoutWithMainNav } from '../components/LayoutWithMainNav'

export default function MyPage() {
  return (
    <LayoutWithMainNav>
      {/* Header area */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Page title</Typography>
      </Box>

      {/* Content area */}
      <Box>
        {/* main content */}
      </Box>
    </LayoutWithMainNav>
  )
}
```

## Component import priority

1. `src/playbook-components` — DataGrid, TabBar, Toasts, SelectWrapper, etc.
2. `src/components` — AthleteDataGrid, PlayerAvatar, LogoImage, StatusChip
3. `@mui/material` — only when 1 and 2 have no equivalent

## Reference pages

Look at existing pages for patterns:
- `src/pages/` — browse for layout and data-loading patterns

## After creating

Run `npm run validate-design-system` to confirm compliance before finishing.
