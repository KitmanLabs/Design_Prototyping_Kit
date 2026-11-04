// Maps the prototype's calendar mock data (src/data/calendar_events.json) onto the
// MUI X Scheduler event and resource models.
import calendarEvents from '../../data/calendar_events.json';

const squadId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const schedulerEvents = calendarEvents.map((event) => ({
  id: event.id,
  title: event.title,
  start: event.start,
  end: event.end,
  resource: event.extendedProps?.squad ? squadId(event.extendedProps.squad) : null,
}));

export const squadResources = [...new Set(calendarEvents.map((e) => e.extendedProps?.squad).filter(Boolean))]
  .map((name) => ({ id: squadId(name), title: name }));

// Most mock events fall in September 2025, which is also where the Calendar page opens.
export const DEFAULT_VISIBLE_DATE = new Date(2025, 8, 1);
// The timeline opens on a single day; 2 September 2025 has events for several squads.
export const TIMELINE_VISIBLE_DATE = new Date(2025, 8, 2);
