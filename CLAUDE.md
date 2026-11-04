# CLAUDE.md

## Project overview
Athlete management design system prototype for Kitman Labs. React 18, Vite 7, Material UI 9 and MUI X 9, Emotion, Storybook 10, ESLint 9.
This repo is a **design system reference implementation**: correct use of design tokens and components is the primary quality bar.

## Common commands
```
npm run dev                     # Dev server at localhost:3001
npm run build                   # Production build
npm run storybook               # Component browser at localhost:6006
npm run build-storybook         # Static Storybook build (runs in CI)
npm test                        # Vitest
npm run lint                    # ESLint (JS/JSX), config in eslint.config.js
npm run lint:css                # Stylelint (CSS)
npm run validate-design-system  # Full design system check (runs pre-commit and in CI)
npm run figma:publish           # Publish Code Connect templates to Figma (needs FIGMA_ACCESS_TOKEN)
```

## Architecture
```
src/
├── components/            # App components (Icon, Card, PlayerAvatar, MainNavigation, drawers)
├── data/                  # All mock data, option lists, fixtures, form templates
├── pages/                 # Page-level views (Calendar, Medical, Messaging, forms)
├── playbook-components/   # Playbook Components (MUI wrappers ported from the iP monorepo); edit here
├── stories/               # Storybook stories for the Playbook Components
├── styles/                # design-tokens.css and global styles
└── utils/                 # Shared utilities (pickerDates.js for date pickers)
```

## Component priority (critical)
1. **Playbook Components first**: import from `src/playbook-components` (Button, DataGrid, DataGridPremium, DatePicker, Drawer, Toasts, ConfirmationModal, TabBar, SelectWrapper, Autocomplete, and MUI primitives re-exported by the barrel)
2. **App components**: import from `src/components` (Icon, Card, PlayerAvatar, LogoImage, StatusChip, AthleteDataGrid, LayoutWithMainNav)
3. **MUI fallback**: `@mui/material` only when 1 and 2 have no equivalent

```jsx
// ✅ Playbook first
import { Button, DataGrid, Drawer, TabBar } from '../playbook-components'
// ✅ App components
import { Icon, Card, PlayerAvatar } from '../components'
// ✅ Fallback when there is no Playbook equivalent
import { Tooltip } from '@mui/material'
// ❌ Blocked by ESLint: Button comes from the Playbook only
import { Button } from '@mui/material'
```

## MUI component defaults (non-negotiable)

Always write these props explicitly. The theme sets them at runtime, but explicit props keep code readable:

| Component     | Required props                                             |
|---------------|------------------------------------------------------------|
| TextField     | `variant="filled" size="small"`                            |
| Button        | `variant="contained" size="small" disableElevation={true}` |
| Select        | `variant="filled" size="small"`                            |
| FormControl   | `variant="filled" size="small"`                            |
| Autocomplete  | `size="small"`                                             |
| Chip          | `size="small"`                                             |
| IconButton    | `size="small"`                                             |

For a loading state, use Button's `loading` prop (there is no LoadingButton in MUI 9).

## MUI 9 APIs (critical)
- **slotProps, not the removed props**: `InputProps` → `slotProps.input`, `inputProps` → `slotProps.htmlInput`, `InputLabelProps` → `slotProps.inputLabel`, `SelectProps` → `slotProps.select`, Menu/Popover/Drawer/Dialog `PaperProps` → `slotProps.paper`, `MenuListProps` → `slotProps.list`
- **Grid**: `<Grid size={{ xs: 12, sm: 6 }}>`; no `item`, no `xs=`/`sm=` props
- **DataGrid**: `valueGetter`/`valueFormatter` take `(value, row)`; `rowSelectionModel` is `{ type, ids: Set }`; a toolbar slot only shows with `showToolbar`
- Details and the full list: `DESIGN_SYSTEM.md` → "MUI 9 APIs"
- Also installed: MUI X Scheduler (beta), Chat (alpha) and Data Grid Premium with the AI Assistant. Usage notes and stories: `DESIGN_SYSTEM.md` → "Scheduler, Chat and the Data Grid AI Assistant". The AI Assistant needs an `onPrompt` resolver; there is no model behind it in this prototype.

## Design rules (enforced by linting)
- **Colors**: always `var(--color-primary)` and other tokens, never hardcoded hex/rgb/hsl
- **Buttons**: `variant="contained"` only; secondary actions use `color="secondary"`
- **TextFields/Selects**: `variant="filled"` only
- **Icons**: `*Outlined` variants only, e.g. `DashboardOutlined`, not `Dashboard`
- **Text casing**: sentence case, "Add athlete", not "Add Athlete" or "ADD ATHLETE"
- **Design tokens**: `src/styles/design-tokens.css`
- **Theme**: one MUI theme, `rootTheme` in `src/playbook-components/themes.js`, used by the app and Storybook. Never add a second `createTheme`.
- **Dates**: moment only, with `AdapterMoment`. Components holding `Date` state convert at the picker with `toMoment()` / `withDate()` from `src/utils/pickerDates.js`.

## Data conventions
- All mock data, constants, option lists and fixtures go in `src/data/`, never inline in components
- Form templates go in `src/data/formTemplates/`

## Boundaries
🚫 NEVER hardcode colors (linting blocks the commit)
🚫 NEVER use non-Outlined MUI icon variants in app code
🚫 NEVER add npm dependencies without explicit instruction
⚠️  Always run `npm run validate-design-system` after changes
✅ Edit `src/playbook-components/` to change Playbook component behavior; it is plain JavaScript (no Flow, no build step)

## References
- Full design rules: `@DESIGN_SYSTEM.md`
- Project structure: `@PROJECT_STANDARDS.md`
- Dev setup: `@DEV_GUIDE.md`
