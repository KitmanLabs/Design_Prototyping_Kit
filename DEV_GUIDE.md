# Dev guide (step-by-step)

Simple steps to get the repo on your machine, run it, and save your work.

**Project structure and standards** (where data, components, and design rules live) are in **`PROJECT_STANDARDS.md`**. Use that for data vs components vs design conventions.

---

## 1. Clone the repo

Open a terminal and go to the folder where you want the project (e.g. your `dev` or `projects` folder). Then run:

```bash
git clone <REPO_URL>
cd Design_Prototyping_Kit
```

Replace `<REPO_URL>` with the real URL. On GitHub it looks like:
`https://github.com/your-org/Design_Prototyping_Kit.git`  
(or the SSH version if you use SSH).

After that you’re inside the project folder.

---

## 2. Install dependencies (npm install)

Still in the project folder, run:

```bash
npm install
```

This downloads all packages the app needs. Wait until it finishes. Do this once after cloning, and again if someone adds new dependencies.

---

## 3. Run the app (npm run dev)

Start the dev server:

```bash
npm run dev
```

The app will run and show a URL like `http://localhost:5173`. Open that in your browser. To stop the server, press `Ctrl+C` in the terminal.

---

## 4. Run tests (npm test)

We keep tests **very simple and focused** so they are easy to maintain and always pass reliably.

- **Test command**: run all tests with:

```bash
npm test
```

- **For every new critical component or page**:
  - Add a **small test file** next to it (for example: `App.test.jsx`, `MainNavigation.test.jsx`, `Messaging.test.jsx`).
  - The test should cover **only the most basic “does it render / route / click” behaviour**.
  - Avoid complex mocks or flows; these are **smoke tests** to catch obvious breakages.

- **For existing critical components and pages**:
  - When you touch a component/page, add or update a **similarly small test** if it doesn’t exist yet.
  - Prefer one or two assertions that reflect the main happy-path behaviour (e.g. “Dashboard title renders”, “Medical nav item is visible”, “Messaging header shows ‘All messages’”).

Tests are powered by **Vitest + React Testing Library**, configured so that `npm test` “just works” without extra flags.

## 4. Create your own branch to code

Don’t code on `main`. Create a branch with your name or feature name:

```bash
git checkout -b your-name
```

Examples: `git checkout -b johnroche` or `git checkout -b john-fixes`.

You’re now on your branch. All your commits will go here until you switch or merge.

---

## 5. Commit and push

When you’ve changed files and want to save them to the repo:

**See what changed:**
```bash
git status
```

**Stage the files you want to commit** (or everything):
```bash
git add .
```
(or `git add path/to/file.js` for a single file)

**Commit with a short message:**
```bash
git commit -m "Add new dashboard widget"
```

**Push your branch to the remote:**
```bash
git push -u origin my-feature
```

Use your real branch name instead of `my-feature`. The first time you push a new branch, `-u origin my-feature` links it to the remote; after that you can just run `git push`.

---

## Quick recap

| Step            | Command                |
|-----------------|------------------------|
| Clone           | `git clone <REPO_URL>` then `cd Design_Prototyping_Kit` |
| Install         | `npm install`          |
| Run app         | `npm run dev`          |
| New branch      | `git checkout -b my-feature` |
| Stage changes   | `git add .`            |
| Commit          | `git commit -m "Your message"` |
| Push branch     | `git push -u origin my-feature` |

Done. You’re set to clone, install, run, branch, commit, and push.
