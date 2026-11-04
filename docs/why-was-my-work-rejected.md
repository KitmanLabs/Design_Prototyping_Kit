# Why was my work rejected?

The project runs automatic checks to keep every prototype consistent with the design system. If one fails, it's a guardrail, not a judgment. This page explains where the checks run, what each error means, and how to fix it.

---

## Where the checks run

| When | What runs |
|---|---|
| While Claude works | Each file Claude edits is linted straight away, and the design system checks run before Claude finishes a task. Claude fixes what they find. |
| When you commit | The pre-commit hook runs `npm run validate-design-system`: ESLint, Stylelint and the design checks. A failure blocks the commit. |
| On every pull request | CI runs lint, the design checks, the tests, the app build and the Storybook build. A failure marks the pull request with a red cross. |

You can run the commit checks yourself at any time:

```bash
npm run validate-design-system
```

---

## The design system checks

**What they check:** colors, button styles, icons and text casing.

**Why they fail:**
- A color is hardcoded (a hex code, "blue", `rgb()`) instead of using a design token
- A button uses `variant="outlined"` or `variant="text"`: only `contained` is allowed
- An icon isn't the `*Outlined` variant (`Dashboard` instead of `DashboardOutlined`)
- A Button is imported from Material UI instead of from the Playbook Components
- A label isn't in sentence case ("ADD ATHLETE" instead of "Add athlete"); this one is a warning, not a failure

**Example:**

```
src/components/StatusChip.jsx
  42:18  error  Hardcoded color "#FF0000" found. Use design tokens instead: var(--color-primary), var(--color-secondary), etc.  design-system/no-hardcoded-colors
```

**How to fix it:** paste the message to Claude: "Fix this error: [paste]". Or be specific: "Use the error color instead of red", "Make that button contained", "Use the DashboardOutlined icon".

---

## ESLint (JavaScript)

**What it checks:** JavaScript and JSX problems, such as references to things that don't exist, misused React hooks, and the design rules above.

**Example:**

```
src/pages/Athletes.jsx
  42:7  error  'Athlete' is not defined  react/jsx-no-undef
```

**How to fix it:** "Fix this error: [paste]". It's usually a typo or a missing import.

---

## Stylelint (CSS)

**What it checks:** CSS files: hardcoded colors, colors that should use tokens, and fonts other than the design system's.

**How to fix it:** "Fix this error: [paste]".

---

## Tests and builds (pull requests)

**What they check:** that the prototype still renders and routes (the smoke tests), and that the app and Storybook both build.

**How to fix it:** open the failed check on the pull request, copy the red error, and paste it to Claude.

---

## Secrets: what never to commit

**Nothing scans your commits for secrets**, so this one is up to you:

- Never commit API keys, tokens, passwords or private keys
- Put them in a `.env` file instead. `.env` files are already ignored by git, and Claude won't edit them.
- If you're unsure about a file, ask Claude: "Is it safe to commit this file?"

Other things that shouldn't be committed are ignored automatically: `node_modules/`, `dist/`, build output and `.DS_Store` files.

---

## "Claude won't add a package"

Claude doesn't add npm packages unless a developer asks it to. It's a project rule rather than a technical lock, because every package has to work with the design system and be kept up to date.

If you think you need one:

1. Ask Claude whether an existing component can do the job; it usually can
2. If not, ask a developer, who can add it deliberately

---

## If you're stuck

1. **Read the error**: it usually says exactly what's wrong
2. **Ask Claude to fix it**: "Fix this error: [paste]"
3. **Check again**: if it still fails, paste the new error
4. **Ask a developer**: share the error and they'll help

These errors are always fixable, and this is a prototype: you can't break anything in production. Don't try to work around the checks; they're what keep your prototype looking like iP.
