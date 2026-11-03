# Design system guide

The single source of truth for design rules in this repo. Other docs (CLAUDE.md, PROJECT_STANDARDS.md, the wiki) link here rather than repeating these rules.

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
<Button variant="contained" color="primary" size="small" disableElevation={true}>Save</Button>
<Button variant="contained" color="secondary" size="small" disableElevation={true}>Cancel</Button>
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

The theme sets these defaults, but write them out so the code reads correctly:

| Component | Props |
|---|---|
| TextField, Select, FormControl | `variant="filled" size="small"` |
| Button, LoadingButton | `variant="contained" size="small" disableElevation={true}` |
| Autocomplete, Chip, IconButton | `size="small"` |

## Theme

There is one MUI theme, `rootTheme` in `src/playbook-components/themes.js`. The app (`src/main.jsx`) and Storybook (`.storybook/preview.jsx`) both use it, so components look the same in both. Change palette, typography or component defaults there, never in a second `createTheme`.

## Dates

moment is the only date library. Wrap date pickers in a `LocalizationProvider` with `AdapterMoment`, or use the Playbook's preset one from `@kitman/playbook/providers`.

Pickers take and return moment objects. If a component keeps its state as plain `Date` objects, convert at the picker with `src/utils/pickerDates.js`:

```jsx
import { toMoment, withDate } from '../utils/pickerDates'

<DatePicker value={toMoment(startDate)} onChange={withDate(setStartDate)} />
```

## Drawer form fields

Drawer forms (calendar event drawers, form drawers) style their filled inputs with the shared `formFieldStyles` from `src/components/formFieldStyles.js`. Pass it as `sx`. Don't copy it into a component.

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
+ <Button variant="contained" color="secondary" size="small" disableElevation={true}>Cancel</Button>

- import { Button } from '@mui/material'
+ import { Button } from '../playbook-components'

- import { Dashboard } from '@mui/icons-material'
+ import { DashboardOutlined } from '@mui/icons-material'

- "Add Athlete"
+ "Add athlete"
```
