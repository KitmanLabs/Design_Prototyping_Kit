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

## Making the next version

```
npm run prototype:clone -- <new folder> --from <previous version folder>
```

The next version starts as a copy of the previous one, not a fresh clone, so the only change between versions is the one asked for. The script copies everything except `node_modules`, `dist/` and `.env` files, then rewrites the files that carry the version: `prototype.json` (the new `version`, and `from` naming the previous one), the name in `package.json`, the Version and Previous version lines in `brief.md`, and the title in `index.html`. `prototype.json` keeps the previous version's kit commit and clone date, because the primitives are the same snapshot. Add the change asked for to the new `brief.md`.

## What goes in

- **Whole folders:** `src/playbook-components`, `src/floorplans`, `src/styles`, `src/utils`.
- **The rest of `src/`, by import:** only the files the app components' barrel (`src/components/index.js`), the shared data module (`src/data.js`) and the template reach. The shell (`LayoutWithMainNav`, `MainNavigation`) comes; the drawers the reference pages use stay in the kit.
- **The template** in `scripts/prototype/template`: `PROTOTYPE.md` (the kit's rules), `brief.md`, `index.html`, a `vite.config.js` with relative paths, a hash-routed `src/main.jsx` and `src/App.jsx`, and `src/prototype/` (routes, pages, notes, placeholders, data).
- **The lint rules** (`eslint.config.js`, `.stylelintrc.json` and both design system plugins), `public/`, `vite.aliases.mjs` and the kit's `package-lock.json`.
- **The shared data**, which is generated (`src/data/club.js`, `fake.js`, `clock.js` and the datasets built on them), so a clone's people and records are invented and dated around its own "today". `@faker-js/faker` comes with it.
- **`package.json`:** the packages the copied files import, plus their peer dependencies the kit declares, at the kit's versions. Kit-only tooling (Storybook, Vitest, Figma Code Connect) stays out.
- **`prototype.json`:** intent, version, title, the date the primitives were cloned and the date this version was made, the version it came from (`from`, `null` for a first version), and the kit commit.

## What never goes in

Pages (`src/pages`), stories, tests, Figma Code Connect files, the AI Assistant dev server (`server/`), `.env` files, `.claude/` and `CLAUDE.md`. The kit's rules travel as `PROTOTYPE.md` instead, so sessions that read a prototype as evidence don't take them as their own instructions.

The Playbook component docs (`README.md` files and `docs/` folders under `src/playbook-components`) stay in the kit too, except the HeaderNew readme that `PageHeader` points to for its props. A clone carries code, and the docs' prose drew warnings from the personal data guard.

Two Playbook modules ported from iP are left out because they call iP's services, which the kit doesn't have: `OpenIssues` and the `AthleteSelector` data sources.

After copying, the script checks that every import in the clone resolves inside the clone and that every package it imports is declared, and fails if not.

## Building for the record

```
npm run build-prototype      (inside the version folder)
```

1. Builds `dist/` in place with "today" pinned to the build date (`VITE_PROTOTYPE_TODAY`), so the generated data renders the same dates whenever the version is opened, and with the MUI X licence key forced empty, even if `.env` or `.env.local` holds one. If the key's value still turns up in `dist/`, it removes `dist/` and fails.
2. Records the build date as `built` in `prototype.json`.
3. For an intent's prototype (a clone with an intent, in a folder named `prototype`), writes `manifest.json` and `README.md` beside the version folders, describing every version.

It refuses to run if any file in `src/` is over 2 MB, because the personal data guard skips such files without checking them. It's a plain Node script with no Claude in it: the `/prototype` skill runs it, then publishes.

### The manifest

`manifest.json` (schema `kitman-prototype/1`) is generated, never hand-written. It holds the intent, the kit commit and stack, how the data was made, what the prototype doesn't do (`doesNotDo` in `prototype.json`, or a default), and:

- `versions`: id, title, `built`, `builtFrom` (`specification` or `brief`, read from `brief.md`), `supersedes` (from `prototype.json`'s `from`) and the kit commit.
- `routes`: each `routes.js` entry as `#/<version><path>`, with its title, floorplan, baseline and `scenarios`.
- `notes` and `placeholders`, with their routes prefixed by version.
- `components`: the floorplans and Playbook components `src/prototype/` imports, and `notInIp`, the packages it imports that iP doesn't ship (`NOT_IN_IP` in the build script).

Accelerate reads `schema`, `routes[].route`, `routes[].scenarios` and `components.notInIp[].name`; change those only with Accelerate.

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
