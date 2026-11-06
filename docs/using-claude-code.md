# Using Claude Code

Claude Code is your AI co-pilot. It knows the design system and the project structure, and it can build whole screens without you writing code.

---

## How it knows the rules

At the start of every session Claude reads [`CLAUDE.md`](../CLAUDE.md), which pulls in the [design system reference](reference/design-system.md) and the [project structure](reference/project-structure.md). From those it knows:

- **Which components to use**: Playbook Components first, then the app's own components, then plain Material UI
- **The design tokens**: the colors, typography and spacing it's allowed to use
- **Where things go**: pages, components, mock data and stories
- **What the checks reject**: hardcoded colors, outlined or text buttons, non-outlined icons, Title Case labels

It also checks its own work as it goes: each file it edits is linted straight away, and it runs the design system checks before it finishes a task.

---

## Good prompts and bad prompts

### Good prompts

- "Add a page that shows injury history for the selected athlete"
- "Add a Collection page for sessions, opening each one as a Record": naming the [floorplan](reference/design-system.md#floorplans) gets the layout right first time
- "Change the calendar to open in week view"
- "Add a filter on the Athletes page for position"
- "Create a form for logging a new training session"
- "Show a toast when the form is submitted"

These describe the result you want and leave the details to Claude.

### Prompts that won't work well

- "Use a blue button": colors come from design tokens, so describe the purpose instead ("a primary button")
- "Make it look good": there's nothing to check the result against
- "Install [library]": Claude doesn't add npm packages unless a developer asks it to
- "Edit this CSS file": describe what you want to change rather than which file
- "Use Arial": fonts come from the design system

---

## The build loop

1. **Ask Claude**: describe what you want
2. **Check the result** at http://localhost:3001 (or in Storybook)
3. **Adjust**: "Move the filter above the table" or "Make the card full width"
4. **Repeat** until you're happy, then commit

---

## When something breaks

1. Look for the red error in the terminal or in the browser
2. Copy it
3. Paste it to Claude: "Fix this error: [paste]"

---

## Commands and skills

Type `/` in the Claude Code panel to see what's available. The useful ones here:

| Command | What it does |
|---|---|
| `/help` | Help with Claude Code itself |
| `/clear` | Start a fresh conversation (handy between unrelated tasks) |
| `/new-page` | This project's guide for adding a page: it picks a floorplan first, then the route, navigation item and data |
| `/new-component` | This project's guide for adding a component, with its story |

For everything else, including commits, ask in plain language: "commit these changes", "open a pull request", "what changed on this branch?"

---

## What you can ask for

- **Pages and screens:** a new page, a new section, a different layout, a drawer or side panel
- **Forms:** a new form, validation, a date picker, different field types
- **Data:** new athletes, changes to existing mock data, a new form template
- **Layout:** spacing, full-width sections, responsive behavior, showing or hiding things
- **Components:** swapping components, button sizes, icons, combining components

---

## When Claude says no

Sometimes Claude will push back:

- **"I won't add an npm package without a developer's go-ahead":** the project keeps its dependencies deliberate. Ask what existing component could do the job, or ask a developer.
- **"That hardcoded color won't pass the checks":** use a design token instead, such as `--color-primary` or `--color-error`.
- **"That icon isn't an Outlined variant":** only `*Outlined` icons are allowed, such as `DashboardOutlined`.

That's Claude stopping work that would fail the checks later, not refusing to help.

---

## Tips

- **Be specific about placement:** "Add this button next to Search" or "Put this below the athlete profile card"
- **Ask about design:** "Which components would suit an injury history timeline?"
- **Ask about the data:** "What fields does the athletes data have?"
- **Debug together:** "The page is blank. Why?"
- **Use branches:** commit, then start a new branch for the next idea

If Claude misunderstands, be more specific ("Add a Card below the heading that shows the athlete's injury status"), point to an example ("like the athlete card on the Athletes page"), or point to Storybook ("use the TabBar from Storybook"). Claude asks clarifying questions when it isn't sure; answer them.
