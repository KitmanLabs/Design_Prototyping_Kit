# Design Prototyping Kit

**A template for rapidly building KitmanLabs product prototypes — no coding experience required.**

This repo is set up for designers to prototype new features using the actual design system. It stays in sync with the product through our component library, and Claude Code can help you build screens without coding.

---

## Quick Start

1. **[Use this template](https://github.com/KitmanLabs/Design_Prototyping_Kit/generate)** — Get your own copy
2. **Clone to your machine** — Use [GitHub Desktop](https://desktop.github.com/) (friendlier than the terminal)
3. **Run locally** — `npm install` then `npm run dev`, open `http://localhost:3001`

---

## Where to Go Next

| I want to... | Link |
|--------------|------|
| Set up for the first time | [Getting Started](wiki/Getting-Started.md) |
| Understand the data in this prototype | [Understanding the Data](wiki/Understanding-the-Data.md) |
| See what components are available | [Live Storybook](https://KitmanLabs.github.io/Design_Prototyping_Kit/) |
| Learn how to build with Claude Code | [Using Claude Code](wiki/Using-Claude-Code.md) |
| Understand why my work was rejected | [Why Was My Work Rejected](wiki/Why-Was-My-Work-Rejected.md) |

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
- **Storybook** — Interactive component catalogue (see link above)
- **Design tokens** — Automated color, typography, and spacing
- **Mock data** — JSON files that simulate a real database

No backend, no API — this is purely for prototyping.
