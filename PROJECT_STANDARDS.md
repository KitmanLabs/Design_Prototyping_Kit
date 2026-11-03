# Project standards

Where things live. For design rules (tokens, buttons, icons, casing, theme, dates), see `DESIGN_SYSTEM.md`.

## Layout

```
src/
├── components/            # App components (Icon, Card, StatusChip, drawers, navigation)
│   ├── Calendar/          # Calendar view, shared event drawer sections
│   ├── forms/             # Form builder and form drawers
│   └── formFieldStyles.js # Shared filled-input styling for drawer forms
├── data/                  # All mock data, option lists and fixtures
│   └── formTemplates/     # Form template JSON
├── pages/                 # Page-level views (Calendar, Medical, Messaging, forms)
├── playbook-components/   # Playbook Components ported from the iP monorepo (edit here)
├── stories/               # Storybook stories for the Playbook Components
├── styles/                # design-tokens.css and global styles
└── utils/                 # Shared helpers (pickerDates.js, assetManager.js)
```

## Data

- All mock data, constants, option lists and fixtures go in `src/data`, never inline in a component. Components import from there.
- Use one module per feature: `messaging.js`, `forms.js` (Forms pages and drawers), `calendarEventOptions.js` (Add game and Add session drawers), plus the JSON datasets (`athletes.json`, `calendar_events.json`, ...).
- Form templates go in `src/data/formTemplates/`.

## Components

- Check `src/playbook-components` first, then `src/components`. Add new app components under `src/components` (or a feature subfolder), never at the repo root.
- When two components share a block of UI, extract it once (see `src/components/Calendar/EventDrawerFields.jsx`) rather than copying it.
- Playbook source is plain JavaScript. It still imports through the monorepo package names (`@kitman/playbook/...`, `@kitman/common/...`, `@kitman/modules/...`, `@kitman/components`). `vite.config.js` aliases these onto `src/playbook-components`. Anything under `common/`, `modules/` and `kitman-components-stub/` is a small stand-in for the monorepo code, kept only while something imports it.

## Stories

- Every Playbook component that is exported from the barrel should have a story in `src/stories/<Group>/<Name>.stories.js`, using the existing group names (Data Display, Inputs, Navigation, Surfaces, Table, ...).
- `npm run build-storybook` runs in CI, so a story that doesn't build fails the pipeline.

## Quick reference

| What | Where |
|---|---|
| Mock data and option lists | `src/data` |
| Components | `src/playbook-components` first, then `src/components` |
| Theme | `src/playbook-components/themes.js` |
| Design tokens | `src/styles/design-tokens.css` |
| Design rules | `DESIGN_SYSTEM.md` |
| Setup and workflow | `DEV_GUIDE.md` |
