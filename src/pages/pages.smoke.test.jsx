import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent, within } from '@testing-library/react'
import App from '../App'
import '../i18n'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )

// Each page renders through the real router and shell without throwing. Full data grids
// render slowly in jsdom, so these tests get a longer time limit.
describe('pages', { timeout: 30000 }, () => {
  it('renders the athletes grid with its toolbar and AI Assistant', async () => {
    renderAt('/athletes')
    expect(await screen.findByRole('grid', {}, { timeout: 15000 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /columns/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ai assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /charts/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pivot/i })).toBeInTheDocument()
  })

  it('shows the grid toolbar on the Forms page', async () => {
    renderAt('/forms')
    expect(await screen.findByRole('button', { name: /filters/i }, { timeout: 15000 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ai assistant/i })).toBeInTheDocument()
  })

  it('shows the grid toolbar on pages without the AI Assistant', async () => {
    renderAt('/forms/medical-assessment/assignments')
    expect(await screen.findByRole('button', { name: /columns/i }, { timeout: 15000 })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ai assistant/i })).not.toBeInTheDocument()
  })

  it('renders the athletes Collection with its page header and availability filters', async () => {
    renderAt('/athletes')
    expect(await screen.findByRole('button', { name: 'Add athlete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Injured' })).toBeInTheDocument()
  })

  it('swaps the page toolbar for the page selection bar when athletes are selected', async () => {
    renderAt('/athletes')
    await screen.findByRole('grid', {}, { timeout: 15000 })
    fireEvent.click(screen.getAllByRole('checkbox', { name: /select row/i })[0])
    expect(await screen.findByText(/1 selected/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Assign form' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Injured' })).not.toBeInTheDocument()
  })

  it('renders an athlete profile Record with its tabs', async () => {
    renderAt('/athletes/2')
    expect(await screen.findByText(/elena rodriguez/i)).toBeInTheDocument()
    expect(screen.getByText('2 of 8')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Medical' }))
    expect(await screen.findByText(/knee strain/i)).toBeInTheDocument()
  })

  it('edits a section of the athlete profile and confirms with a toast', async () => {
    renderAt('/athletes/1')
    const profile = await screen.findByRole('region', { name: 'Profile' })
    fireEvent.click(within(profile).getByRole('button', { name: 'Edit' }))
    fireEvent.change(within(profile).getByRole('textbox', { name: 'Height' }), { target: { value: '190cm' } })
    fireEvent.click(within(profile).getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Profile updated')).toBeInTheDocument()
    expect(within(profile).getByText('190cm')).toBeInTheDocument()
  })

  it('shows a not found state for an unknown athlete', async () => {
    renderAt('/athletes/999')
    expect(await screen.findByText("This athlete doesn't exist")).toBeInTheDocument()
  })

  it('starts Log injury from the athlete, with Next disabled until the step is complete', async () => {
    renderAt('/medical/log-injury?athleteId=2')
    expect(await screen.findByText(/log injury for elena rodriguez/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('asks before discarding a Log injury that has changes', async () => {
    renderAt('/medical/log-injury')
    fireEvent.mouseDown(await screen.findByRole('combobox', { name: 'Athlete' }))
    fireEvent.click(await screen.findByRole('option', { name: /marcus johnson/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument()
  })

  it('shows the Settings save bar only while there are unsaved changes', async () => {
    renderAt('/administration')
    const name = await screen.findByRole('textbox', { name: 'Organization name' })
    expect(screen.queryByTestId('FloorplanFooter')).not.toBeInTheDocument()
    fireEvent.change(name, { target: { value: 'New name' } })
    expect(screen.getByTestId('FloorplanFooter')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Settings saved')).toBeInTheDocument()
    expect(screen.queryByTestId('FloorplanFooter')).not.toBeInTheDocument()
  })

  it('opens Notifications on the Unread queue', async () => {
    renderAt('/notifications')
    expect(await screen.findByRole('tab', { name: /unread/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('offers Log injury from Medical', async () => {
    renderAt('/medical/rosters')
    expect(await screen.findByRole('button', { name: 'Log injury' })).toBeInTheDocument()
  })

  it('renders the Overview with today\'s availability', async () => {
    renderAt('/')
    expect(await screen.findByRole('region', { name: 'Availability today' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'To do' })).toBeInTheDocument()
  })

  it('filters Squad load to load spikes from the KPI tile', async () => {
    renderAt('/workloads')
    fireEvent.click(await screen.findByRole('button', { name: /load spikes/i }))
    expect(screen.getByText('Showing Load spikes')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show all athletes' }))
    expect(screen.queryByText('Showing Load spikes')).not.toBeInTheDocument()
  })

  it('renders a form template’s assignments with its title', async () => {
    renderAt('/forms/medical-assessment/assignments')
    expect(await screen.findByRole('heading', { name: /medical assessment/i })).toBeInTheDocument()
  })

  it('redirects the old assessment path to the assignments page', async () => {
    renderAt('/medical-assessment')
    expect(await screen.findByRole('heading', { name: /medical assessment/i })).toBeInTheDocument()
  })

  it('renders the calendar', async () => {
    renderAt('/calendar')
    expect(await screen.findByRole('button', { name: /add/i }, { timeout: 5000 })).toBeInTheDocument()
  })
})
