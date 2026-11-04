# Design system reference

The source of truth for design rules in this repo, for iP: Intelligence Platform prototypes. Other docs ([CLAUDE.md](../../CLAUDE.md), [project structure](project-structure.md) and the [guides](../README.md)) link here rather than repeating these rules.

## Component priority

Pages start from a floorplan in `src/floorplans` (see [Floorplans](#floorplans)), then fill it in this order:

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

## Floorplans

Every page starts from a floorplan: one of eight standard page types, each named for the job the page does. Floorplans keep prototypes alike, so differences between them are deliberate, and give design reviews and tickets shared names ("a Record", "a Collection"). The [floorplans proposal](https://claude.ai/artifact/688zS64Gjio2uRWdZQrrjG) has the research behind them and the equivalent page types in other design systems.

The shared regions live in `src/floorplans/` and have stories under **Floorplans** in Storybook. Floorplans are layouts that pages compose from these regions, not components that hide the page: a page assembles `PageFrame` with its own content, so it can still make an exception where the design needs one.

### Choosing a floorplan

Ask what the user is trying to do, not which data the page shows. Take the first match:

1. Making or arranging something directly, on a calendar, form or plan? **Workspace**
2. Configuring how the organization or account behaves? **Settings**
3. Creating something with 3 or more dependent steps? **Guided flow**
4. Looking at or changing one specific thing? **Record**
5. Asking why, or how something has changed over time? **Analysis**
6. Working through items one after another and reading each? **List-detail**
7. Finding, filtering or acting on many records, or processing a queue? **Collection**
8. Arriving with no specific task? **Overview**

If none fits, say why in a comment at the top of the page (`// Floorplan: none. <reason>`), so the exception is deliberate and easy to find.

### The eight floorplans

| Floorplan | Job | Reference page |
|---|---|---|
| Overview | Where a role starts the day: what needs attention, and where to go next | Planned |
| Collection | Find, filter and act on many records of one kind. The queue variant swaps the filters for tabs with counts | Planned |
| Record | Everything about one athlete, injury, session or response, and the actions on it | Planned |
| List-detail | Work through items one after another without losing your place | Planned |
| Analysis | Spot a pattern, drill into its cause, act on the records behind it | Planned |
| Guided flow | A long, unfamiliar or high-stakes task in 3 to 8 steps | Planned |
| Workspace | Make or arrange something directly: schedules, forms, plans | `/calendar`, `/forms/:formId/build` (both predate `PageFrame`) |
| Settings | Configure how the organization, squad or account behaves | Planned |

### Page anatomy

`PageFrame` lays out the regions under the app shell (`LayoutWithMainNav`, which already supplies the main navigation and the app bar). Each floorplan decides which regions it needs.

| Region | Build it from | Rules |
|---|---|---|
| Page header | `PageHeader` (the Playbook's HeaderNew) | One primary action, one secondary, the rest in the overflow menu. At most four key facts. Page-level actions only, never Save. |
| Tabs | Playbook `TabBar` | For views of a Collection or facets of a Record. Tabs show counts when they act as queues. |
| Page toolbar | `PageToolbar`, `PageSearch`, `PageQuickFilters` (the Playbook QuickFilters) | Stays in view while the content scrolls. Search and quick filters on the left; the full set of filters lives in a right drawer, with active ones shown as chips. |
| Selection bar | `PageFrame`'s `selection` prop (the Playbook GenericActionBar) | Replaces the toolbar while rows are selected. Selection actions only. |
| Content | the floorplan | Pass `fill` when the content scrolls on its own (List-detail, Workspace). |
| Footer action bar | `FloorplanFooter` | Only in create and edit, or while there are unsaved changes. Cancel on the left; the primary action on the far right, with `loading` while it runs. |
| Page states | `PageState` | Empty, no results, no access, error and loading, each with a message and an optional action. |
| Feedback | `useToasts` (the Playbook Toasts), `ConfirmationModal` | A toast after every completed action. A confirmation before destructive actions and before discarding unsaved changes. |

When a page has its own header, add its path to `pagesWithOwnHeader` in `src/data/layout.js`, so the app bar shows its title as a quieter section label.

### Create and edit surfaces

Use the smallest surface that fits the task without scrolling.

| Surface | Use when | Build |
|---|---|---|
| Inline | One value, changed in place | DataGrid cell edit, or an Edit button on a section of a Record |
| Dialog | 1 to 4 fields, or the user goes somewhere else afterwards | MUI `Dialog`, `ConfirmationModal` |
| Drawer | Medium complexity, where the user needs to see the page behind | Playbook `Drawer`, right side, 480px wide, `formFieldStyles` |
| Large dialog | Sectioned content that would scroll in a drawer, or 2 to 4 steps tied to this page | MUI `Dialog` with `maxWidth="lg"`, full screen below `sm` |
| Full page | A complex object, drafts, something people link to, or 3 to 8 steps | Record in create mode, or a Guided flow |

- Edit on the surface you created on. If the fields would scroll there, move one size up.
- Unsaved data is never lost silently: Cancel, close and navigating away all go through the same discard confirmation.
- Finish with feedback: a toast, plus either the new row highlighted in the list or the new Record opened.
- High-impact edits (availability, diagnosis, permissions) show a summary of the changes before saving.

### Responsive behaviour

MUI's breakpoints line up with Material 3's window size classes: `xs` compact, `sm` medium, `md` expanded, `lg` and up large. Collection grids scroll sideways below `md`; List-detail shows one pane at a time below `md`; Workspace and Analysis are desktop-first and show a read-only view below `md`.

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
- The Calendar page runs on `EventCalendar`, wrapped in `src/components/Calendar/SchedulerCalendar.jsx`. The page keeps its own header, filters pane, tooltip and create panels:
  - View and date are controlled from `CalendarHeader`; the Scheduler's toolbar and side panel are hidden.
  - `onEventEditingStart` cancels the built-in event dialog and opens the page's tooltip at `eventDetails.anchor`.
  - `eventModelStructure` reads the existing event shape, so `calendar_events.json` and the panels are unchanged.
  - The Scheduler only accepts named colours, so `schedulerModel.js` gives each event a class that sets the Scheduler's `--event-*` colour variables from the event's own colour.
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
