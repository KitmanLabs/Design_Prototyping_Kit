# Getting Started

## Step 1: Create Your Copy

1. Go to the [Design Prototyping Kit repository](https://github.com/KitmanLabs/Design_Prototyping_Kit)
2. Click the green **"Use this template"** button at the top
3. Name it something like `my-product-prototype`
4. Click **"Create repository from template"**

You now have your own copy — you can experiment without affecting the original.

---

## Step 2: Clone to Your Machine

1. **Download [GitHub Desktop](https://desktop.github.com/)** — it's easier than the terminal
2. In GitHub Desktop: **File → Clone Repository**
3. Find your new repo and clone it
4. Open the folder in VS Code

---

## Step 3: Install Dependencies

Open the terminal in VS Code (`Ctrl` + `` ` ``) and run:

```bash
npm install
```

This installs all the code libraries the prototype needs.

---

## Step 4: Start the Prototype

```bash
npm run dev
```

Wait a few seconds, then open **http://localhost:3001** in your browser. You should see the athlete management dashboard.

---

## Step 5: Install Claude Code Extension

1. In VS Code, go to **Extensions** (left sidebar, icon with 4 squares)
2. Search for **"Claude Code"**
3. Click **Install** (by Anthropic)
4. Reload VS Code

Now you can ask Claude to help you build.

---

## Step 6 (Optional): Browse Available Components

If you want to see what UI components are available before asking Claude to build:

```bash
npm run storybook
```

This opens an interactive component browser at **http://localhost:6006**. You can browse all the buttons, forms, tables, dialogs, etc. that are available to use. But this is optional — Claude knows what's available and will use the right components automatically.

---

## Your First Build

Ask Claude something like:

> "Add a new card on the dashboard that shows the current athlete's injury history"

Or:

> "Create a new page that shows all upcoming training sessions for this squad"

Claude will:
- Write the code automatically
- Follow the design system rules
- Ask you questions if it's unclear
- Run the changes so you can see them instantly at localhost:3001

---

## Important Note

Never edit the `src/playbook-components-build/` folder — it's auto-generated. Claude knows this and won't touch it. If you need to change how components work, Claude will edit the source files instead.

---

## Next Steps

- [Browse the Design System](Design-System) to see what components are available
- [Learn about the data](Understanding-the-Data) (where athlete names, games, etc. come from)
- [Read about Claude Code workflow](Using-Claude-Code)
- [GitHub tips for designers](#github-tips-for-designers)

---

## GitHub Tips for Designers

### Branches (Save States)

Each time you start a new prototype experiment, create a branch:

1. In GitHub Desktop: **Current Branch → New Branch**
2. Name it something descriptive: `feature/injury-history` or `experiment/new-dashboard`
3. Make your changes
4. When done, ask Claude: "commit these changes with message: Add injury history card"

If something breaks, you can always go back to `main` (the original state).

### Commits (Checkpoints)

Think of commits like game checkpoints — a saved point you can return to. Claude Code can create them for you. Just ask: "commit these changes with message: [description]"

### Pull Requests (Reviews)

When your prototype is ready, use a PR to share it with others:

1. In GitHub Desktop: **Current Branch → Create Pull Request**
2. Describe what you changed
3. Teammates can review and comment

---

## Troubleshooting

**Port 3001 is already in use?**
```bash
npm run dev -- --port 3002
```

**Something broke and you want to start over?**

In GitHub Desktop, go back to `main` branch. All your experiment changes are still in your feature branch.

**Can't find something in the code?**

Ask Claude: "Search the codebase for [keyword]" — it's better at searching than you are.
