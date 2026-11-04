# Getting started

How to get your own copy of the prototype running, start building with Claude Code, and save and share your work. Designers can follow the GitHub Desktop path; developers can use the terminal throughout.

---

## Before you start

You need:

- **Node.js 20.19 or later.** CI uses Node 24. Check with `node --version` in a terminal; if it's missing or older, install the LTS version from [nodejs.org](https://nodejs.org/).
- **VS Code** (or another editor) with the **Claude Code** extension: in VS Code, open Extensions, search for "Claude Code", and install the one by Anthropic.
- **GitHub Desktop** (optional): [desktop.github.com](https://desktop.github.com/), if you'd rather not use the terminal for git.

---

## 1. Create your copy

1. Open the [Design Prototyping Kit repository](https://github.com/KitmanLabs/Design_Prototyping_Kit)
2. Click **Use this template**, then **Create a new repository**
3. Give it a name, such as `injury-history-prototype`

You now have your own copy and can experiment without affecting the original. (If you're working on the kit itself, clone `KitmanLabs/Design_Prototyping_Kit` directly instead.)

---

## 2. Get it on your machine

**With GitHub Desktop:** choose **File > Clone repository**, pick your new repository, then open the folder in VS Code.

**With the terminal:**

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
```

---

## 3. Install dependencies

In VS Code, open the terminal (`Ctrl` + `` ` ``) and run:

```bash
npm ci
```

This installs exactly the package versions the project was tested with, and sets up the pre-commit check (Husky). Run it again whenever you pull changes that touch `package.json`.

---

## 4. Run the prototype

```bash
npm run dev
```

Open **http://localhost:3001** to see the athlete management prototype. Press `Ctrl` + `C` in the terminal to stop it.

To browse the components instead:

```bash
npm run storybook
```

This opens Storybook at **http://localhost:6006**. See [Components and Storybook](components-and-storybook.md).

---

## 5. Build something with Claude

Open the Claude Code panel in VS Code and describe what you want, for example:

> Add a card to the Athletes page that shows each athlete's injury history

> Create a page that lists all upcoming training sessions for the squad

Claude writes the code, follows the design system rules, asks when something is unclear, and the browser at localhost:3001 updates as it works. More in [Using Claude Code](using-claude-code.md).

Ask Claude to change components rather than editing them yourself. Playbook Components (`src/playbook-components`) match iP, so Claude only changes them when you ask it to change how a component works.

---

## 6. Save and share your work

### Branches

Start each experiment on its own branch, so `main` stays clean.

- **GitHub Desktop:** **Current branch > New branch**, then name it, such as `injury-history-card`
- **Terminal:** `git checkout -b injury-history-card`

### Commits

A commit is a checkpoint you can go back to. Ask Claude to "commit these changes", or:

- **GitHub Desktop:** write a summary, then **Commit to injury-history-card**
- **Terminal:** `git add .` then `git commit -m "Add injury history card"`

Each commit runs the design system checks first. If it's blocked, see [Why was my work rejected?](why-was-my-work-rejected.md)

### Pull requests

When it's ready to share, push the branch and open a pull request:

- **GitHub Desktop:** **Push origin**, then **Create pull request**
- **Terminal:** `git push -u origin injury-history-card`, then open the pull request on GitHub

CI runs lint, the design system checks, the tests and both builds on every pull request.

---

## Checks and tests

```bash
npm run validate-design-system   # lint, CSS lint and design checks (what the pre-commit hook runs)
npm test                         # Vitest smoke tests
```

Tests are small smoke tests: does it render, route, or respond to a click. When you add or change an important page or component, add or update a test next to it (for example `MainNavigation.test.jsx`) with one or two happy-path assertions.

---

## Optional: publish Figma Code Connect

The Code Connect templates (`src/playbook-components/*.figma.js`) link Figma components to code snippets. Publishing needs a Figma access token:

```bash
FIGMA_ACCESS_TOKEN=<your token> npm run figma:publish
```

---

## Troubleshooting

**Port 3001 is already in use:** `npm run dev -- --port 3002`

**Something broke and you want to start over:** switch back to `main` (in GitHub Desktop or with `git checkout main`). Your experiment is still on its branch.

**Errors about missing packages, or things that work for you but not in CI:** run `npm ci` to reinstall from the lockfile. It removes leftovers from earlier installs that can hide real problems.

**Commits aren't being checked:** run `npm ci` (or `npm install`), which sets up the pre-commit hook.

**Can't find something in the code:** ask Claude, for example "Where is the calendar filter sidebar?"

---

## Quick reference

| Task | Command |
|---|---|
| Install | `npm ci` |
| Run the prototype | `npm run dev` (http://localhost:3001) |
| Run Storybook | `npm run storybook` (http://localhost:6006) |
| Run the checks | `npm run validate-design-system` |
| Run the tests | `npm test` |
| New branch | `git checkout -b <name>` |
| Commit and push | `git add .`, `git commit -m "..."`, `git push` |
