# Dev guide (step by step)

How to get the repo on your machine, run it, and save your work. For where things live, see `PROJECT_STANDARDS.md`. For design rules, see `DESIGN_SYSTEM.md`.

---

## 1. Check Node

You need Node 20.19 or later (CI uses Node 24). Check with:

```bash
node --version
```

---

## 2. Clone the repo

In a terminal, go to the folder where you keep projects and run:

```bash
git clone https://github.com/KitmanLabs/Design_Prototyping_Kit.git
cd Design_Prototyping_Kit
```

(Use the SSH URL instead if you clone over SSH.)

---

## 3. Install dependencies

```bash
npm install
```

Run this once after cloning, and again whenever you pull changes that touch `package.json`. It also sets up the Git pre-commit hook (Husky), which runs the design system checks before each commit.

---

## 4. Run the app

```bash
npm run dev
```

Open `http://localhost:3001`. Press `Ctrl+C` in the terminal to stop the server.

To browse the component library instead:

```bash
npm run storybook
```

This opens Storybook at `http://localhost:6006`.

---

## 5. Run the checks and tests

```bash
npm run validate-design-system   # lint, CSS lint and design checks (what pre-commit runs)
npm test                         # Vitest + React Testing Library
```

Tests are small smoke tests: does it render, route, or respond to a click. When you add or change a critical page or component, add or update a test next to it (for example `MainNavigation.test.jsx` or `Messaging.test.jsx`) with one or two happy-path assertions. Avoid complex mocks.

---

## 6. Create a branch

Don't work on `main`. Create a branch for your change:

```bash
git checkout -b your-name-feature
```

---

## 7. Commit and push

```bash
git status                          # see what changed
git add .                           # or: git add path/to/file.jsx
git commit -m "Add athlete availability card"
git push -u origin your-name-feature
```

After the first push, `git push` on its own is enough. If the commit is blocked, the pre-commit hook found a design system issue. Fix it (see "Common fixes" in `DESIGN_SYSTEM.md`) and commit again.

---

## Optional: publish Figma Code Connect

The Code Connect templates (`src/playbook-components/*.figma.js`) link Figma components to code snippets. Publishing needs a Figma access token:

```bash
FIGMA_ACCESS_TOKEN=<your token> npm run figma:publish
```

---

## Quick recap

| Step | Command |
|---|---|
| Install | `npm install` |
| Run app | `npm run dev` (http://localhost:3001) |
| Storybook | `npm run storybook` (http://localhost:6006) |
| Checks | `npm run validate-design-system` |
| Tests | `npm test` |
| New branch | `git checkout -b your-name-feature` |
| Commit and push | `git add .`, `git commit -m "..."`, `git push` |
