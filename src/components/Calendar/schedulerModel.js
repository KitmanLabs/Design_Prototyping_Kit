// Maps the kit's calendar events (FullCalendar-shaped: id, title, start, end,
// backgroundColor, textColor, extendedProps) onto the MUI X Scheduler, without
// changing the data or the create and edit panels.
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar'

// CalendarHeader's view keys → Scheduler views. "List" is a one-week agenda.
export const VIEW_TO_SCHEDULER = {
  dayGridMonth: 'month',
  timeGridWeek: 'week',
  timeGridDay: 'day',
  listWeek: 'agenda',
}

export const SCHEDULER_TO_VIEW = Object.fromEntries(
  Object.entries(VIEW_TO_SCHEDULER).map(([kit, scheduler]) => [scheduler, kit])
)

// How far previous and next move in each view (moment units).
export const VIEW_STEP = {
  dayGridMonth: 'month',
  timeGridWeek: 'week',
  timeGridDay: 'day',
  listWeek: 'week',
}

const DEFAULT_EVENT_COLOUR = 'var(--color-primary)'
const DEFAULT_TEXT_COLOUR = 'var(--color-white)'

const eventColour = (event) => event.backgroundColor || DEFAULT_EVENT_COLOUR

// One class per distinct colour, so each event keeps its own colour as it did in FullCalendar.
const colourClass = (colour) =>
  `kit-event-colour-${colour.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`

// Reads the kit's event shape through getters, so the events array is passed in as is.
export const kitEventModel = {
  className: { getter: (event) => colourClass(eventColour(event)) },
  // The seed data has no offset; FullCalendar read it as UTC, so the Scheduler does too.
  timezone: { getter: () => 'UTC' },
}

// The Scheduler only accepts named colours, but styles events through CSS variables,
// so each colour class sets those variables from the event's own colour.
const colourVariables = (background, text) => ({
  '--event-main': background,
  '--event-surface-accent': background,
  '--event-surface-bold': background,
  '--event-surface-bold-hover': `color-mix(in srgb, ${background} 85%, var(--color-black))`,
  '--event-on-surface-bold': text,
  '--event-surface-selected': background,
  '--event-surface-selected-hover': `color-mix(in srgb, ${background} 85%, var(--color-black))`,
  '--event-on-surface-selected': text,
  '--event-surface-subtle': `color-mix(in srgb, ${background} 14%, var(--color-white))`,
  '--event-surface-subtle-hover': `color-mix(in srgb, ${background} 22%, var(--color-white))`,
  '--event-on-surface-subtle-primary': 'var(--color-text-primary)',
  '--event-on-surface-subtle-secondary': 'var(--color-text-secondary)',
})

export const buildSchedulerSx = (events) => {
  const colourRules = {}
  events.forEach((event) => {
    const background = eventColour(event)
    const selector = `& .${colourClass(background)}`
    if (!colourRules[selector]) {
      colourRules[selector] = colourVariables(background, event.textColor || DEFAULT_TEXT_COLOUR)
    }
  })
  return {
    height: '100%',
    fontFamily: 'var(--font-family-primary)',
    // CalendarHeader replaces the Scheduler's own toolbar. Going through the exported class
    // means a rename in a future version fails the import instead of the toolbar reappearing.
    [`& .${eventCalendarClasses.headerToolbar}`]: { display: 'none' },
    ...colourRules,
  }
}
