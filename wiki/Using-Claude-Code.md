# Using Claude Code

Claude Code is your AI co-pilot. It knows the design system, the project structure, and can build entire screens for you without you writing a single line of code.

---

## How It Knows What To Do

Every time you open Claude Code, it automatically reads:

- **Component rules** — which components to use, how they're styled
- **Design tokens** — available colors, typography, spacing
- **File structure** — where to put new files, naming conventions
- **Mock data** — what athlete and game data exists
- **Linting rules** — what will be rejected in validation

You don't need to tell it any of this — it already knows.

---

## Good Prompts vs. Bad Prompts

### ✅ Good Prompts

- "Add a new page that shows injury history for the selected athlete"
- "Change the calendar to default to week view instead of day view"
- "Add a button on the dashboard that filters athletes by position"
- "Create a form for logging a new training session"
- "Add a toast notification when a form is submitted"

These are specific, describe the end result, and let Claude figure out the details.

### ❌ Bad Prompts

- "Use a blue button" — Too vague, colors are controlled by design tokens
- "Make it look good" — Too vague, no clear success criteria
- "Install [library]" — New packages aren't allowed
- "Change this CSS file" — Don't reference files unless necessary; describe what you want instead
- "Use Arial font" — Not part of the design system

---

## The Iteration Loop

1. **Ask Claude** — Describe what you want
2. **See the result** — Check localhost:3001
3. **Adjust if needed** — "Change the button color to error red" or "Add padding to this card"
4. **Repeat until happy**

Claude will make changes and immediately reload the browser so you see them.

---

## When Something Breaks

1. **Look at the terminal** — You'll see a red error message
2. **Copy the error** — Select all the red text
3. **Paste to Claude** — "Fix this error: [paste]"
4. **Claude fixes it** — Usually takes one try

---

## Useful Claude Code Shortcuts

- `/commit` — Create a git commit with your changes
- `/review` — Have Claude review the code you just changed
- `/search` — Search the codebase for something
- `/help` — Get help using Claude Code

---

## What You Can Ask Claude To Do

### Pages & Screens
- Create a new page
- Add a new section to existing page
- Change the layout of a page
- Add a sidebar or drawer

### Forms & Input
- Create a form for adding a new athlete
- Add validation to a form
- Change form field types
- Add a date picker to a form

### Data & Content
- Add new athlete data
- Change existing data
- Add a new form template
- Modify mock data

### Styling & Layout
- Change colors or spacing
- Make something full-width
- Add responsive behavior
- Hide/show elements conditionally

### Components
- Use a different component
- Change a button's size
- Add icons to buttons
- Combine components in new ways

---

## When Claude Says No

Sometimes Claude will reject your request:

- **"I can't install new npm packages"** — Correct, the system is locked. Work with existing components instead.
- **"That hardcoded color won't pass validation"** — Use design tokens instead (`--color-primary`, `--color-error`, etc.)
- **"That icon variant doesn't exist"** — Use `*Outlined` variants only (e.g., `DashboardOutlined`, not `Dashboard`)

These aren't bugs — they're protecting the design system. Claude is being helpful by stopping you before your work gets rejected by the validator.

---

## Pro Tips

- **Be specific about placement** — "Add this button next to the Search button" or "Put this below the Player Info card"
- **Ask about design** — "What components would be best for showing injury history?"
- **Ask about data** — "What fields exist in the athletes data?" or "How many athletes are in the mock data?"
- **Debug together** — "The page is blank, why?" Claude will investigate
- **Make branches** — Ask Claude to commit your work, then create a new branch for your next idea

---

## Getting Stuck?

If Claude misunderstands:

1. **Be more specific** — Instead of "Add a card", try "Add a white Card component below the heading that shows the athlete's injury status"
2. **Show an example** — "Like the player card on the dashboard, but for injuries"
3. **Reference the Design System** — "Use a playbook component" or "Check the Storybook"

Claude will ask clarifying questions if it's not sure. Answer them.
