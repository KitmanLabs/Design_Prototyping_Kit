# Design Prototyping Kit

**A template for rapidly building prototypes of iP: Intelligence Platform, the Kitman Labs product.**

It runs entirely on mock data, uses the same components and design tokens as iP, and is set up for building with Claude Code, which follows the design system rules for you.

---

## Quick start

1. **[Use this template](https://github.com/KitmanLabs/Design_Prototyping_Kit/generate)** to get your own copy
2. **Clone it** with [GitHub Desktop](https://desktop.github.com/) or `git clone`
3. **Install and run:** `npm ci`, then `npm run dev`, and open http://localhost:3001

Full setup, including Node and Claude Code: [Getting started](docs/getting-started.md).

---

## Documentation

All docs live in [`docs/`](docs/README.md) and travel with the code, including into copies made from this template.

| I want to... | Read |
|---|---|
| Set up for the first time | [Getting started](docs/getting-started.md) |
| Build with Claude Code | [Using Claude Code](docs/using-claude-code.md) |
| See which components are available | [Components and Storybook](docs/components-and-storybook.md) |
| Understand the mock data | [Understanding the data](docs/understanding-the-data.md) |
| Fix a failed check or blocked commit | [Why was my work rejected?](docs/why-was-my-work-rejected.md) |
| Look up a design rule | [Design system reference](docs/reference/design-system.md) |
| Find where something lives in the code | [Project structure](docs/reference/project-structure.md) |

Claude Code reads [`CLAUDE.md`](CLAUDE.md) at the start of every session.

---

## Tech

- **React 18** and **Vite 7**
- **Material UI 9** and **MUI X 9** (Data Grid, Date Pickers, Scheduler, Chat), wrapped as Playbook Components that match iP
- **Storybook 10**: the interactive component catalogue (`npm run storybook`)
- **Design tokens** in `src/styles/design-tokens.css`, enforced by ESLint and Stylelint rules
- **Mock data** in `src/data`: no backend and no API
