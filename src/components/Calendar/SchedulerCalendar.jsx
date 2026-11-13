import React, { useMemo } from 'react'
import { EventCalendar } from '@mui/x-scheduler/event-calendar'
import { Box } from '@mui/material'
import {
  VIEW_TO_SCHEDULER,
  SCHEDULER_TO_VIEW,
  kitEventModel,
  buildSchedulerSx,
} from './schedulerModel'

const VIEWS = ['month', 'week', 'day', 'agenda']
const VIEW_CONFIG = { agenda: { dayCount: 7 } }
// Monday start, and no Scheduler side panel: the page has its own filters pane.
const PREFERENCES = { weekStartsOn: 1, isSidePanelOpen: false }

/**
 * The Calendar page's grid, on the MUI X Scheduler (EventCalendar).
 *
 * The page keeps its own header, filters, tooltip and create panels: the view and date are
 * controlled from CalendarHeader, and a click on an event cancels the Scheduler's built-in
 * dialog and calls onEventClick with the original event and an element to anchor the tooltip to.
 */
export default function SchedulerCalendar({
  events,
  view,
  date,
  onViewChange,
  onDateChange,
  onEventClick,
}) {
  const eventsById = useMemo(() => new Map(events.map((event) => [String(event.id), event])), [events])
  const sx = useMemo(() => buildSchedulerSx(events), [events])

  const handleEditingStart = (occurrence, details) => {
    details.cancel()
    const event = eventsById.get(String(occurrence.id))
    if (event && onEventClick) onEventClick(event, details.anchor)
  }

  return (
    // The tooltip positions itself against this container.
    <Box className="calendar" sx={{ flex: 1, minHeight: 0, minWidth: 0, height: '100%' }}>
      <EventCalendar
        events={events}
        eventModelStructure={kitEventModel}
        views={VIEWS}
        view={VIEW_TO_SCHEDULER[view] || 'month'}
        onViewChange={(schedulerView) => onViewChange?.(SCHEDULER_TO_VIEW[schedulerView])}
        viewConfig={VIEW_CONFIG}
        visibleDate={date}
        onVisibleDateChange={(newDate) => onDateChange?.(new Date(newDate))}
        preferences={PREFERENCES}
        preferencesMenuConfig={false}
        displayTimezone="UTC"
        // Read-only matches FullCalendar's editable={false}, and makes a click open straight away
        // on touch screens too, rather than first selecting the event.
        readOnly
        eventCreation={false}
        onEventEditingStart={handleEditingStart}
        sx={sx}
      />
    </Box>
  )
}
