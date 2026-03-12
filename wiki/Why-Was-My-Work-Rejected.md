# Why Was My Work Rejected?

When you try to save or commit code, the system runs automatic quality checks. These checks exist to protect the design system — they make sure the prototype always looks and behaves correctly.

If a check fails, it's not personal. It's a guardrail. Here's how to fix it.

---

## The 3 Checks

### 1. Design System Validation

**What it checks:** Colors, button styles, icon variants, text casing

**Why it fails:**
- You asked Claude to use a specific color (hex code, "blue", "red") instead of a design token
- You asked for a button style that doesn't exist (like `variant="outlined"` — only `contained` is allowed)
- You used an icon that's not the `*Outlined` variant (like `Dashboard` instead of `DashboardOutlined`)
- Text is in the wrong case (should be sentence case: "Add athlete", not "ADD ATHLETE")

**How to fix it:**
- Ask Claude to use design tokens: "Use the error color instead of red"
- Ask Claude to use the right component variant: "Button should be contained style"
- Ask Claude to use Outlined icons: "Use the DashboardOutlined icon"
- Ask Claude to fix the text case: "Make this sentence case"

**Example error:**
```
ERROR: Hardcoded color #FF0000 found in src/components/Button.jsx
Colors must use design tokens like var(--color-error)
```

**Fix:** Ask Claude "Fix this error: [paste the message]"

---

### 2. ESLint (JavaScript Errors)

**What it checks:** JavaScript code quality (syntax errors, unused variables, etc.)

**Why it fails:**
- Usually Claude made a typo or reference error
- Could be a missing import or typo in a variable name

**How to fix it:**
- Paste the error to Claude: "Fix this error: [paste]"
- Claude will correct it immediately

**Example error:**
```
ERROR: 'athlete' is not defined (src/pages/Dashboard.jsx:42)
```

**Fix:** Ask Claude "Fix this error"

---

### 3. StyleLint (CSS Errors)

**What it checks:** CSS code quality (invalid syntax, consistency, etc.)

**Why it fails:**
- Less common than JavaScript errors
- Usually a syntax error in CSS

**How to fix it:**
- Paste the error to Claude: "Fix this error: [paste]"

---

## How to See Why It Failed

### In the Terminal (while developing)

When you run `npm run dev`, errors appear as red text in the terminal. Copy the whole error message and paste it to Claude.

### When Committing

If a pre-commit hook fails, you'll see red errors. Read them, copy them, ask Claude to fix them.

---

## Security: What Never to Commit

The validator also prevents dangerous things from being committed:

### ❌ API Keys & Secrets

Never ask Claude to add:
- API keys, tokens, or passwords
- `.env` files with credentials
- Database passwords or connection strings
- Private keys or certificates

**If you need to use an API:**
- Ask Claude: "How do I safely add an API key without committing it?"
- Claude will use `.env` files (which are automatically ignored)

### ❌ Sensitive Files

Ask Claude "Is it safe to commit this file?" before committing anything unusual.

Common files that should NOT be committed:
- `.env` or `.env.local`
- `node_modules/` (too large)
- `.DS_Store` (Mac system file)
- `dist/` or `build/` (auto-generated)
- Any file with "secret", "key", or "password" in the name

### ✅ Safe to Commit

- JavaScript/JSX files
- CSS files
- JSON data files (athletes.json, games_matches.json, etc.)
- Images and assets
- Configuration files (vite.config.js, eslint.config.js, etc.)

---

## Blocked Installs

**"Cannot install new npm packages"**

This is intentional. The system is locked to prevent:
- Accidentally breaking something
- Introducing libraries that conflict with existing ones
- Changing the behavior unexpectedly

If you need a library:
1. Ask Claude why it's being blocked
2. Claude might suggest an alternative component or approach
3. If you really need a new library, ask a developer to add it (they can unlock it temporarily)

---

## It's Not Your Fault

If your work is being rejected:

1. **Read the error message** — It tells you exactly what's wrong
2. **Ask Claude to fix it** — Usually one sentence: "Fix this error: [paste]"
3. **Check the result** — If it still fails, paste again
4. **Ask a developer** — If you're stuck, share the error with a developer and they can help

The checks are guardrails, not punishment. They're there to help you succeed.

---

## Reassurance

- These errors are temporary — you can always revert or fix them
- Claude is very good at fixing validation errors
- You won't accidentally break the production system — this is a prototype, and it's just for experimenting
- If you get stuck, ask for help — don't try to work around the validators

Keep building. The system is protecting you, not blocking you.
