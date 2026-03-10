# Design Prototyping Kit Wiki

Welcome to the **Design Prototyping Kit** — a template for building product prototypes that match the real KitmanLabs design system.

## Where to Start

**New to this repo?** Pick the one that matches your situation:

| You want to... | Read this |
|---|---|
| Set up the repo for the first time | [Getting Started](Getting-Started) |
| Understand where the data comes from | [Understanding the Data](Understanding-the-Data) |
| See what UI components are available | [Design System](Design-System) — or run `npm run storybook` |
| Learn how to build with Claude Code | [Using Claude Code](Using-Claude-Code) |
| Understand why your work was rejected | [Why Was My Work Rejected](Why-Was-My-Work-Rejected) |

---

## The Basics

**This prototype uses mock data** — there's no real server or database. All the athlete names, games, injuries, and other information lives in JSON files inside the repo. You can ask Claude Code to modify these files, and the changes show up instantly in the running prototype.

**Claude Code knows the design system** — when you ask it to build something, it automatically follows the color rules, component choices, and styling conventions. You don't need to know these rules — Claude enforces them.

**Everything auto-validates** — when you save code, it runs automatic checks to make sure it matches the design system. If something's wrong, the error message tells you exactly how to fix it.

---

## Quick Reference

| Command | What it does |
|---|---|
| `npm run dev` | Start the prototype (http://localhost:3001) |
| `npm run storybook` | Browse all available components (http://localhost:6006) |
| `npm run build` | Create a production-ready build |

---

**Last updated:** March 2026
