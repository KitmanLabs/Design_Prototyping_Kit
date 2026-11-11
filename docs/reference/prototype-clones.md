# Prototype clones

A prototype is never built in the kit. It starts as a clone of the kit's primitives: a complete app that runs and builds on its own. For an intent, the clone goes into the intent's `design/prototype/v1/` in `product-intents`; anywhere else, it's throwaway work. Each later version starts as a copy of the one before, so every version keeps the primitives it was cloned with and rebuilds as it was shown.

## Making a clone

```
npm run prototype:clone -- <target> --intent IN0015 --title "Session planning"
```

| Option | What it does |
|---|---|
| `<target>` | A new or empty folder. Its name gives the version (`v1`, `v2`...) unless `--version` does. |
| `--intent` | The intent id, recorded in `prototype.json`. Leave it out for throwaway work. |
| `--version` | The version, when the folder isn't named after it. |
| `--title` | The title shown on the start page and the browser tab. |
| `--no-install` | Skip `npm install` in the clone. |

The script needs nothing installed in the kit, so the `/prototype` skill can run it from a plain checkout of the kit at a pinned commit.

## What goes in

- **Whole folders:** `src/playbook-components`, `src/floorplans`, `src/styles`, `src/utils`.
- **The rest of `src/`, by import:** only the files the app components' barrel (`src/components/index.js`), the shared data module (`src/data.js`) and the template reach. The shell (`LayoutWithMainNav`, `MainNavigation`) comes; the drawers the reference pages use stay in the kit.
- **The template** in `scripts/prototype/template`: `PROTOTYPE.md` (the kit's rules), `brief.md`, `index.html`, a `vite.config.js` with relative paths, a hash-routed `src/main.jsx` and `src/App.jsx`, and `src/prototype/` (routes, pages, notes, placeholders, data).
- **The lint rules** (`eslint.config.js`, `.stylelintrc.json` and both design system plugins), `public/`, `vite.aliases.mjs` and the kit's `package-lock.json`.
- **`package.json`:** the packages the copied files import, plus their peer dependencies the kit declares, at the kit's versions. Kit-only tooling (Storybook, Vitest, Figma Code Connect) stays out.
- **`prototype.json`:** intent, version, title, the date, and the kit commit it was cloned from.

## What never goes in

Pages (`src/pages`), stories, tests, Figma Code Connect files, the AI Assistant dev server (`server/`), `.env` files, `.claude/` and `CLAUDE.md`. The kit's rules travel as `PROTOTYPE.md` instead, so sessions that read a prototype as evidence don't take them as their own instructions.

Two Playbook modules ported from iP are left out because they call iP's services, which the kit doesn't have: `OpenIssues` and the `AthleteSelector` data sources.

After copying, the script checks that every import in the clone resolves inside the clone and that every package it imports is declared, and fails if not.

## Inside a clone

`PROTOTYPE.md` in the clone is the guide. In short:

- The prototype's own code goes in `src/prototype/`. Everything else is a snapshot of the primitives.
- Routes are plain data in `src/prototype/routes.js`, literal paths with no parameters, and sit under the version: `#/v1/session/planning`.
- Typed notes (`assumption`, `question`, `deferral`) go in `src/prototype/notes.js`, and every number the specification doesn't state is a named placeholder in `src/prototype/placeholders.js`.
- The MUI X licence key comes from the environment (`VITE_MUI_X_LICENSE_KEY`) when it runs locally, and is never written into the folder.

## Changing what a clone gets

- Primitives are what the template, the barrels and the whole folders reach. A new app component that prototypes should get goes in the `src/components/index.js` barrel.
- The template is in `scripts/prototype/template`. Text in `.md` and `.html` files can use `{{INTENT}}`, `{{VERSION}}` and `{{TITLE}}`.
- `scripts/prototype/clone.test.js` clones into a temporary folder and checks the result. Run `npx vitest run scripts/prototype`.
