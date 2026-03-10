# Design Prototyping Kit

**A template for rapidly building KitmanLabs product prototypes.**

---

## Quick Start

1. **[Use this template](https://github.com/KitmanLabs/Design_Prototyping_Kit/generate)** — Get your own copy
2. **Clone to your machine** — Use [GitHub Desktop](https://desktop.github.com/) (friendlier than the terminal)
3. **Run locally** — `npm install` then `npm run dev`, open `http://localhost:3001`

---

## Where to Go Next

| I want to... | Link |
|--------------|------|
| Set up for the first time | [Getting Started](../../wiki/Getting-Started) |
| Understand the data in this prototype | [Understanding the Data](../../wiki/Understanding-the-Data) |
| See what components are available | [Design System](../../wiki/Design-System) (run `npm run storybook` locally) |
| Learn how to build with Claude Code | [Using Claude Code](../../wiki/Using-Claude-Code) |
| Understand why my work was rejected | [Why Was My Work Rejected](../../wiki/Why-Was-My-Work-Rejected) |

---

## How It Works

This repo uses **Claude Code** as your AI co-pilot. It reads the design system rules automatically on every session, so it:

- Only uses components that match the real product
- Applies colors and styles correctly
- Knows the file structure and data layout
- Catches common mistakes before you commit

Just ask it to build what you need — "Add a new page showing athlete injuries" or "Change the calendar to week view".

---

## Tech

- **React 18** — The UI framework
- **Material-UI (MUI)** — Component library matching the KitmanLabs design system
- **Storybook** — Interactive component catalogue (run `npm run storybook` locally)
- **Design tokens** — Automated color, typography, and spacing
- **Mock data** — JSON files that simulate a real database

No backend, no API — this is purely for prototyping.
