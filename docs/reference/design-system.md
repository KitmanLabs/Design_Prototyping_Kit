# Design system reference

The source of truth for design rules in this repo, for iP: Intelligence Platform prototypes. Other docs ([CLAUDE.md](../../CLAUDE.md), [project structure](project-structure.md) and the [guides](../README.md)) link here rather than repeating these rules.

## Component priority

1. **Playbook Components** (`src/playbook-components`): wrappers around Material UI that match iP. Use them whenever they have an equivalent: Button, DataGrid, DataGridPremium, DatePicker, Drawer, Toasts, ConfirmationModal, SelectWrapper, TabBar and so on. The barrel also re-exports the MUI primitives (Box, Typography, TextField, Chip, ...), so most imports come from here.
2. **App components** (`src/components`): prototype UI the Playbook doesn't provide, such as Icon, Card, StatusChip, PlayerAvatar, LogoImage, MainNavigation, AthleteDataGrid and LayoutWithMainNav.
3. **MUI** (`@mui/material`, `@mui/x-*`): only when neither of the above has an equivalent.

```jsx
// ✅ Playbook first
import { Button, DataGrid, Drawer } from '../playbook-components'
// ✅ App components
import { Icon, Card, PlayerAvatar } from '../components'
// ✅ MUI fallback when there is no Playbook equivalent
import { Tooltip } from '@mui/material'
// ❌ Blocked by ESLint (no-restricted-imports): Button must come from the Playbook
import { Button } from '@mui/material'
```

## Rules

All of these are checked by `npm run lint`, `npm run lint:css` and `npm run validate-design-system` (which also runs as the pre-commit hook).

### Colors: design tokens only (error)

```css
/* ✅ */
color: var(--color-primary);
background: var(--color-secondary);
/* ❌ hex, rgb() and hsl() values are blocked */
color: #3B4960;
```

Tokens live in `src/styles/design-tokens.css`. The MUI theme palette in `src/playbook-components/themes.js` mirrors them and is the only place hex values are allowed.

### Buttons: contained only (error)

Primary and secondary actions are both `variant="contained"`, distinguished by `color`.

```jsx
// ✅
<Button variant="contained" color="primary" disableElevation={true}>Save</Button>
<Button variant="contained" color="secondary" disableElevation={true}>Cancel</Button>
// ❌
<Button variant="outlined">Cancel</Button>
<Button variant="text">Cancel</Button>
```

### Icons: Outlined variants only (error)

```jsx
import { DashboardOutlined } from '@mui/icons-material' // ✅
import { Dashboard } from '@mui/icons-material'         // ❌
```

### Text: sentence case (warning)

"Add athlete", not "Add Athlete" or "ADD ATHLETE". The theme also removes MUI's default uppercase on buttons and tabs, so labels render as written. Pages under `src/pages/forms`, `src/components/forms` and `src/data` are exempt because their mock content contains proper nouns.

### Explicit MUI props

Write the variant props out so the code reads correctly. Leave size to the theme, which uses iP's defaults, unless a design calls for a different size:

| Component | Write explicitly | Theme default size (as in iP) |
|---|---|---|
| TextField, Select | `variant="filled"` | small |
| FormControl | `variant="filled"` | medium, full width |
| Button | `variant="contained" disableElevation={true}` (use the `loading` prop for a loading state) | medium |
| Chip | | medium |
| IconButton | | medium (MUI default) |

FormControl is full width by default, as in iP. Pass `fullWidth={false}` for a control that sits inline in a toolbar or filter row.

## Theme

There is one MUI theme, `rootTheme` in `src/playbook-components/themes.js`. The app (`src/main.jsx`) and Storybook (`.storybook/preview.jsx`) both use it, so components look the same in both. Change palette, typography or component defaults there, never in a second `createTheme`.

`rootTheme` mirrors the real Playbook theme (`themes/index.ts` in KitmanLabs/kitman-playbook): the same palette, type scale, component defaults and overrides, with colour values from iP's `packages/common/src/variables/colors.js`. The status tokens in `design-tokens.css` use the same iP colours. Kit-only additions (sentence case through a CSS variable, token-driven button styles, secondary buttons inside data grids) are marked `Kit:` in the file. When the Playbook theme changes, update `rootTheme` to match.

The kit runs Material UI 9 and MUI X 9 ahead of iP, which still uses Material UI 5. This is deliberate: iP is moving to MUI 9.

## MUI 9 APIs

The repo is on Material UI 9 and MUI X 9. Props that were deprecated in v5 to v7 are removed, so the old forms no longer work.

| Old | MUI 9 |
|---|---|
| TextField `InputProps` / `inputProps` / `InputLabelProps` / `SelectProps` / `FormHelperTextProps` | `slotProps={{ input, htmlInput, inputLabel, select, formHelperText }}` |
| Menu, Popover, Drawer, Dialog `PaperProps` | `slotProps={{ paper: {...} }}` |
| Menu `MenuListProps` | `slotProps={{ list: {...} }}` |
| `TransitionComponent` / `TransitionProps` | `slots={{ transition }}` / `slotProps={{ transition }}` |
| `<Grid item xs={12} sm={6}>` | `<Grid size={{ xs: 12, sm: 6 }}>` |
| `<ListItem button>` | `<ListItemButton>` |
| `LoadingButton` (`@mui/lab`) | `<Button loading>` |

Data Grid:
- `valueGetter`, `valueFormatter` and friends take positional arguments: `(value, row, column, apiRef)`.
- `rowSelectionModel` is `{ type: 'include' | 'exclude', ids: Set }`. Pass `disableRowSelectionExcludeModel` when you need the ids to always be the selected rows, and convert with `[...model.ids]`.
- The toolbar slot only renders with `showToolbar`. Custom toolbars must render toolbar parts (quick filter, buttons) inside `GridToolbarContainer` or the grid's `Toolbar`.
- Grid-internal buttons are contained secondary, set once in the theme (`MuiDataGrid` default `slotProps.baseButton`).
- `@mui/x-data-grid-premium` is installed, so Premium features (row grouping, aggregation, Excel export, the AI Assistant) work. Without a Premium license key they show a watermark and log a license warning; with a Pro key they log a plan-mismatch error but keep working.

## Scheduler, Chat and the Data Grid AI Assistant

These MUI X packages are installed; each has a story showing minimal, offline usage.

| Package | Tier | Status | Story |
|---|---|---|---|
| `@mui/x-scheduler` (`EventCalendar`) | Community (MIT) | Beta | `Scheduler/EventCalendar` |
| `@mui/x-scheduler-premium` (`EventTimelinePremium`, recurring events) | Premium | Beta | `Scheduler/EventTimelinePremium` |
| `@mui/x-chat` (`ChatBox`) | MIT | Alpha | `Chat/ChatBox` |
| `@mui/x-data-grid-premium` AI Assistant | Premium | Stable (prompt resolver helper is `unstable_`) | `Table/DataGridAiAssistant` |

- Beta and alpha versions are pinned exactly in `package.json`; expect API changes when bumping them.
- Scheduler events take ISO `start`/`end` strings (no date adapter); give the component an explicit height.
- Chat needs an `adapter`. The stories use `createEchoAdapter()`; a real one streams replies from a backend (there is an AI SDK adapter in `@mui/x-chat/headless`).
- The AI Assistant does not call a model itself: `onPrompt` must return a `PromptResponse` (filters, sorting, grouping, aggregation). In iP that means a server route that asks a language model, with keys kept on the server. Prototypes here use the offline stub in `src/stories/Table/utils/aiPromptStub.js`.
- The Playbook DataGridPremium wrapper's toolbar has no AI Assistant trigger; use MUI's `DataGridPremium` with `showToolbar` for AI Assistant screens.

Date pickers:
- Range pickers default to a single input in v9. For separate Start and End fields, pass `slots={{ field: MultiInputDateRangeField }}`.
- Picker text-field props go under `slotProps={{ textField: { slotProps: { input, htmlInput } } }}`.

Icons: bare `*Outline` icons (for example `DeleteOutline`) were removed; use the `*Outlined` variant.

The theme also overrides `react-is` to React 18's version (`overrides` in `package.json`), as the MUI guides advise for React 18.

## Dates

moment is the only date library. Wrap date pickers in a `LocalizationProvider` with `AdapterMoment`, or use the Playbook's preset one from `@kitman/playbook/providers`.

Pickers take and return moment objects. If a component keeps its state as plain `Date` objects, convert at the picker with `src/utils/pickerDates.js`:

```jsx
import { toMoment, withDate } from '../utils/pickerDates'

<DatePicker value={toMoment(startDate)} onChange={withDate(setStartDate)} />
```

## Drawer form fields

Drawer forms (calendar event drawers, form drawers) style their filled inputs with the shared `formFieldStyles` from `src/components/formFieldStyles.js`. Pass it as `sx`. Don't copy it into a component.

## Data grid styling

Pages style the Box that wraps a `DataGrid` with the shared `dataGridStyles` from `src/components/dataGridStyles.js`, spread next to the container's own sizing: `sx={{ ...dataGridStyles, height: 560, width: '100%' }}`. Don't copy grid styles into a page. Add page-specific rules after the spread.

## Playbook components and lint

`src/playbook-components` and `src/stories` are excluded from ESLint. The components were ported from the iP monorepo and keep its conventions. For example, the shared icon map uses some filled MUI icons where the filled and outlined versions mean different things (`Star` and `StarBorder`). New code in `src/pages` and `src/components` follows every rule above.

## Tooling

| Tool | Config | Notes |
|---|---|---|
| ESLint 9 | `eslint.config.js` (flat config) | Custom rules in `eslint-plugin-design-system/` (`no-hardcoded-colors`, `button-variant-compliance`, `icon-type-compliance`, `text-casing-compliance`), plus a restricted import for MUI Button |
| Stylelint | `.stylelintrc.json` | Custom rules in `stylelint-plugin-design-system/` (`no-hardcoded-colors`, `use-design-tokens`, `font-usage`) |
| Validation | `scripts/validate-design-system.js` | Lint, CSS lint, token and file checks; run by the Husky pre-commit hook and in CI |
| Figma Code Connect | `figma.config.json`, `src/playbook-components/*.figma.js` | Template files; `npm run figma:publish` needs a `FIGMA_ACCESS_TOKEN` |

```bash
npm run validate-design-system   # everything (what pre-commit runs)
npm run lint                     # JS/JSX
npm run lint:css                 # CSS
npm run lint:fix                 # apply ESLint fixes (design rules only suggest fixes; they never auto-fix)
```

## Common fixes

```diff
- color: #3B4960;
+ color: var(--color-primary);

- <Button variant="outlined">Cancel</Button>
+ <Button variant="contained" color="secondary" disableElevation={true}>Cancel</Button>

- import { Button } from '@mui/material'
+ import { Button } from '../playbook-components'

- import { Dashboard } from '@mui/icons-material'
+ import { DashboardOutlined } from '@mui/icons-material'

- "Add Athlete"
+ "Add athlete"
```
