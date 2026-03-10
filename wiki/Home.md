# Design Prototyping Kit Wiki

Welcome to the **Athlete Management Design System** — a production-ready design system reference implementation for KitmanLabs.

This wiki documents the architecture, design rules, component library, and development workflow for the Design Prototyping Kit.

---

## ⚡ Quick Start

**I want to...**

- **[Get started with development](Getting-Started)** — Clone repo, install dependencies, run dev server (5 min)
- **[Understand component imports](Component-Priority)** — Which component should I use? Import hierarchy explained
- **[Create a new component](Creating-Components)** — Follow the pattern, checklist, validation rules
- **[Create a new page](Creating-Pages)** — Directory structure, routing, common patterns
- **[Write a Storybook story](Writing-Stories)** — Document components in the component browser
- **[Explore all components](Playbook-Components)** — Catalog of 100+ available components
- **[Check project structure](Project-Structure)** — Architecture diagram and file organization
- **[Debug an issue](Troubleshooting)** — FAQ, common errors, solutions

---

## 📚 Documentation

### Getting Started
- **[Getting Started](Getting-Started)** — Setup, running servers, first steps
- **[Development Workflow](Development-Workflow)** — Daily commands, testing, validation, git workflow

### Design System
- **[Design Tokens](Design-Tokens)** — Color palette, typography, spacing, shadows, and when to use them
- **[Design Rules](Design-Rules)** — Component requirements, auto-enforced rules (colors, buttons, icons, text)
- **[Component Priority](Component-Priority)** — Import hierarchy (Playbook → App → MUI), with examples

### Components
- **[Playbook Components](Playbook-Components)** — Catalog of all custom MUI wrapper components
- **[Creating Components](Creating-Components)** — Patterns, checklist, how to write a component correctly
- **[Writing Stories](Writing-Stories)** — How to document components in Storybook

### Pages & Features
- **[Creating Pages](Creating-Pages)** — Page structure, routing, data conventions, form patterns

### Architecture & Reference
- **[Project Structure](Project-Structure)** — Directory layout, architecture, data layer
- **[Validation & Linting](Validation-and-Linting)** — ESLint/StyleLint rules, pre-commit hooks, how to fix errors
- **[Figma Integration](Figma-Integration)** — Code Connect workflow, design-to-code sync

### Support
- **[Troubleshooting](Troubleshooting)** — FAQ, common errors, debugging guide

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **UI Framework** | React | 18 |
| **Build Tool** | Vite | 7 |
| **Component Library** | Material-UI (MUI) | 5 |
| **Styling** | Emotion | Latest |
| **Data Grid** | MUI X (DataGrid Pro/Premium) | Latest |
| **Date Pickers** | MUI X Date Pickers Pro | Latest |
| **Calendar** | FullCalendar | 6 |
| **Rich Text** | Remirror | 2 |
| **File Upload** | FilePond | Latest |
| **Maps** | React Google Maps | Latest |
| **Forms** | React Hook Form | Latest |
| **Routing** | React Router | 6 |
| **Testing** | Vitest + React Testing Library | Latest |
| **Linting** | ESLint + Custom Plugin, StyleLint + Custom Plugin | Latest |
| **Component Browser** | Storybook | 9 |
| **Type System** | Flow (auto-stripped at build) | Latest |

---

## 🎯 Key Principles

### 1. **Design System Correctness First**
This is a **reference implementation** — correctness of design token and component usage is the primary quality bar. Every component should follow design rules.

### 2. **Three-Tier Component Priority**
Import in this order:
1. **Playbook Components** (`src/playbook-components`) — Custom MUI wrappers with design system rules
2. **App Components** (`src/components`) — Composite components for application UI
3. **MUI** (`@mui/material`) — Fallback only when no playbook/app equivalent exists

### 3. **Design Rules Are Auto-Enforced**
- **Colors**: Only design tokens (CSS custom properties), never hardcoded hex/rgb/hsl
- **Buttons**: Only `variant="contained"`, no outlined or text variants
- **Icons**: Only `*Outlined` variants (e.g., `DashboardOutlined`, not `Dashboard`)
- **Text**: Sentence case only (e.g., "Add athlete", not "ADD ATHLETE")

Enforcement happens via ESLint + StyleLint; pre-commit hooks run `npm run validate-design-system` to block non-compliant code.

### 4. **Data Lives in `src/data/`**
All mock data, constants, fixtures, form templates → single source of truth in `src/data/`.

### 5. **Separation of Concerns**
- **Playbook Components**: Design-system-compliant, re-usable MUI wrappers
- **App Components**: Business logic, composite UI (PlayerAvatar, StatusChip, Card)
- **Pages**: Screens, routing, feature-specific layouts
- **Data**: Mock data, form templates, API constants

---

## 📋 Commands at a Glance

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (http://localhost:3001) |
| `npm run build` | Production build |
| `npm run storybook` | Component browser (http://localhost:6006) |
| `npm run lint` | Check JS/JSX with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run lint:css` | Check CSS with StyleLint |
| `npm run lint:css:fix` | Auto-fix StyleLint issues |
| `npm run validate-design-system` | Full compliance check (required pre-commit) |
| `npm run test` | Run unit tests with Vitest |
| `npm run figma:publish` | Publish Code Connect snippets to Figma |

---

## 🚀 For New Developers

1. **[Getting Started](Getting-Started)** (5 min) — Clone, install, run
2. **[Development Workflow](Development-Workflow)** (10 min) — Learn commands, validation, git flow
3. **[Component Priority](Component-Priority)** (5 min) — Understand what to import
4. **[Playbook Components](Playbook-Components)** (browse) — See what's available
5. **[Creating Components](Creating-Components)** (when needed) — Follow the pattern

Then explore Storybook (`npm run storybook`) to see all components live.

---

## 🔗 External Links

- **[GitHub Repository](https://github.com/yourusername/Design_Prototyping_Kit)** — Source code
- **Storybook** — Component browser (run locally: `npm run storybook`)
- **Figma Design File** — Design tokens source (Code Connect synced)
- **[NPM Package.json](../package.json)** — Dependencies and scripts

---

## 📖 Documentation Map

```
Home (you are here)
├── Getting Started
│   ├── Development Workflow
│   │   ├── Validation & Linting
│   │   └── Troubleshooting
│   └── Design Tokens
│       ├── Design Rules
│       └── Component Priority
├── Components
│   ├── Playbook Components
│   ├── Creating Components
│   │   └── Writing Stories
│   └── Creating Pages
├── Architecture
│   ├── Project Structure
│   └── Figma Integration
└── Support
    └── Troubleshooting (FAQ)
```

---

## ❓ Need Help?

- **Setup issues?** → [Getting Started](Getting-Started)
- **Component questions?** → [Playbook Components](Playbook-Components) or [Component Priority](Component-Priority)
- **Design rule errors?** → [Validation & Linting](Validation-and-Linting) or [Design Rules](Design-Rules)
- **Creating new stuff?** → [Creating Components](Creating-Components) or [Creating Pages](Creating-Pages)
- **Can't find something?** → [Troubleshooting](Troubleshooting) or search this wiki

---

**Last updated:** March 2026 | **Maintained by:** Design System Team
