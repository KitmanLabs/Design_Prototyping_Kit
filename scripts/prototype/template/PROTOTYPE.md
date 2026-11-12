# PROTOTYPE.md

The rules for building in this folder. It's one version of a prototype of iP: Intelligence Platform, cloned from the Design Prototyping Kit's primitives on the date and at the kit commit in `prototype.json`. It runs and builds on its own, without the kit.

This file is named `PROTOTYPE.md`, not `CLAUDE.md`, on purpose: sessions that read the prototype as evidence (writing or checking a specification) must not take these rules as theirs. Read it before changing anything here.

## What's here

```
prototype.json        intent, version, title, and the kit commit this was cloned from
brief.md              what this version was built from: the specification's commit, or a person's summary
src/prototype/        this prototype's own code. Build here.
  routes.js           every route, as plain data
  pages/              the pages, exported by name from pages/index.js
  notes.js            typed notes: assumptions, questions, deferrals
  placeholders.js     named numbers the specification doesn't state
  data/               data only this prototype needs
src/floorplans/       the kit's page types (primitives)
src/playbook-components/  the Playbook components iP uses (primitives)
src/components/       the app shell and app components (primitives)
src/data/, src/data.js    shared mock data (primitives)
src/styles/, src/utils/   design tokens and utilities (primitives)
```

Everything outside `src/prototype/` is a snapshot of the kit's primitives. Change it only when the prototype can't be built otherwise, and record why in a note.

## Commands

```
npm install          once, after cloning
npm run dev          the prototype at localhost:3001
npm run build        a static build in dist/
npm run lint         the design system rules (also run on every edit)
npm run build-prototype   the build for the record: dist/ with today pinned and no licence key, then
                     ../manifest.json and ../README.md for an intent's prototype
```

`build-prototype` checks this version first and lists everything it would record wrongly: a route that isn't a literal path in single quotes, or whose page `pages/index.js` doesn't export, a note or placeholder naming a route that isn't in `routes.js`, an unknown note type, and template placeholders left in `brief.md`. Fix each one and run it again.

The MUI X licence key comes from the environment when running locally (`VITE_MUI_X_LICENSE_KEY`). Never write it, or any other key, into a file in this folder.

## Pages

- Every page starts from the iP page closest to the problem (an iP baseline) or from a floorplan: `PageFrame` with `PageHeader`, `PageToolbar`, `FloorplanFooter` and `PageState`. Each page owns one title, in its `PageHeader`.
- Component priority: Playbook components from `src/playbook-components` first, then app components from `src/components`, then `@mui/material` only where neither has an equivalent. Import `Button` from the Playbook only.
- Write variant props explicitly: `TextField`, `Select` and `FormControl` take `variant="filled"`; `Button` takes `variant="contained" disableElevation={true}`, with `color="secondary"` for secondary actions. Leave sizes to the theme.
- MUI 9 APIs: `slotProps`, not the removed `InputProps`, `inputProps`, `InputLabelProps`, `SelectProps` or `PaperProps`; `<Grid size={{ xs: 12 }}>`; DataGrid `valueGetter(value, row)`.
- Colors only through tokens (`var(--color-primary)`), never hex, rgb or hsl. Icons only in `*Outlined` variants. Sentence case for every label. Dates with moment.
- One theme: `rootTheme`. Never add a second `createTheme`.
- Use the words of the specification or the brief. Follow the Kitman Labs naming rules in copy: "athlete", not "player", and no em dashes.

## Routes

- Add every route to `src/prototype/routes.js`, never to `src/App.jsx`. A fresh clone has no routes and no pages: write each page as a new file in `src/prototype/pages/`, list it in `pages/index.js`, and add its route. There's no placeholder page to replace or delete.
- A page that stands in for an item in the main navigation takes that item's path, or a path under it: `/athletes` or `/athletes/no-results` for Athletes. The paths are in `src/components/MainNavigation.jsx`. The navigation then reaches the page and highlights it.
- The version opens on the first route in `routes.js`, unless one has the path `/`.
- Paths are literal, with no parameters, and written as single-quoted strings (`path: '/...'`): Accelerate's checks read `routes.js` as text. Each state a scenario needs is a path of its own, for example `/session/planning/save-fails`, never a query string.
- Routes sit under the version in `prototype.json`, so in v2 `/session/planning` is served at `#/v2/session/planning`. Link with paths that start from `/`, and the router adds the version.
- Once a specification exists, list the `scenario_id`s each route shows in its `scenarios`.

## Notes and placeholders

- Every choice the brief or the specification doesn't support goes in `src/prototype/notes.js` as an `assumption`, a `question` or a `deferral`, with the route it's about.
- Every number on a screen comes from the specification or from a named placeholder in `src/prototype/placeholders.js`, one name per concept. Never repeat a literal number.

## Data

- Every name, squad, date and figure is invented or generated. Never paste anything from a customer, an export, a real person or a production system, even to "make it realistic".
- Shared data comes from `src/data`, where the club's people and records are generated. Data only this prototype needs goes in `src/prototype/data`, generated the same way: `fakerFor('<dataset>')` from `src/data/fake.js` for values, `namesFor()` for names, and `src/data/clock.js` for dates, never `moment()` or a fixed date. A build for the record pins "today", so every date must come from `clock.js`.
- For an athlete's availability, read `availability`, not the older `availability_status`. `availability` holds iP's four statuses, the values the Playbook's `AvailabilityLabel` takes, and `availabilityOf()` in `src/data/athletes.js` sets it so it agrees with the rest of the generated data. `AvailabilityLabel` also reads `unavailable_since`, the days the athlete has been in that status, worded as iP sends it ("12 days"). `availability_status` has only two values, and its second means out, which is iP's `unavailable`.
- Lists scoped to a squad, as iP's are, follow the squad chosen in the top bar: read it with `useCurrentSquad()` from `src/components` (`{ id, name, short }`) and keep the athletes whose `squad_id` matches its `id`. Don't change the shell to get it.
- No credentials or keys anywhere in this folder. `.env` files stay out of Git.

## The brief

`brief.md` says what this version was built from. Its "Built from" line counts as the specification only when it names the commit ("the specification at commit 3f2c1a9"); any other wording is read as a summary. Name people by role, never by name, and give the date of the session each line was heard in. For a new version, keep the previous brief and add the change asked for.

## Boundaries

- Never add an npm dependency unless the person asks for it.
- A version that has been published never changes. A later change goes in a new version.
- What the prototype doesn't do (saving, a server, permissions) is listed in the manifest. To change the list, set `doesNotDo` in `prototype.json`.
- Run `npm run lint` after changes, and fix every error.
