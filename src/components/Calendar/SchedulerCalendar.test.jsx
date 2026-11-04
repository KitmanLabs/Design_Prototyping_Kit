import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SchedulerCalendar from './SchedulerCalendar'
import { buildSchedulerSx } from './schedulerModel'

const events = [
  {
    id: 'e1',
    title: 'Squad training',
    start: '2025-09-02T10:00:00',
    end: '2025-09-02T11:00:00',
    backgroundColor: 'var(--color-chart-2)',
    textColor: 'var(--color-white)',
    extendedProps: { eventType: 'TRAINING_SESSION', squad: 'Academy' },
  },
]

describe('SchedulerCalendar', () => {
  it('opens the page tooltip, not the Scheduler dialog, when an event is clicked', async () => {
    const onEventClick = vi.fn()
    render(
      <SchedulerCalendar
        events={events}
        view="timeGridWeek"
        date={new Date('2025-09-01')}
        onEventClick={onEventClick}
      />
    )

    // The first render of the Scheduler can be slow on a cold test run.
    fireEvent.click(await screen.findByText('Squad training', {}, { timeout: 5000 }))

    expect(onEventClick).toHaveBeenCalledTimes(1)
    const [event, anchor] = onEventClick.mock.calls[0]
    expect(event).toBe(events[0])
    expect(anchor).toBeInstanceOf(HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  }, 10000)

  it('gives each event colour its own class with the Scheduler colour variables', () => {
    const sx = buildSchedulerSx(events)
    const rule = sx['& .kit-event-colour-var-color-chart-2']
    expect(rule['--event-surface-bold']).toBe('var(--color-chart-2)')
    expect(rule['--event-on-surface-bold']).toBe('var(--color-white)')
  })
})
