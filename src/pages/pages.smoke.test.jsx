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

// Each page renders through the real router and shell without throwing.
describe('pages', () => {
  it('renders the athletes grid', async () => {
    renderAt('/athletes')
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })

  it('renders the athletes Collection with its page header', async () => {
    renderAt('/athletes')
    expect(await screen.findByRole('button', { name: 'Add athlete' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Search athletes' })).toBeInTheDocument()
  })

  it('shows no results, with a way out, when the search matches nobody', async () => {
    renderAt('/athletes')
    fireEvent.change(await screen.findByRole('textbox', { name: 'Search athletes' }), { target: { value: 'zzz' } })
    expect(screen.getByText('No results')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByRole('grid')).toBeInTheDocument()
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
  }, 10000)
})
