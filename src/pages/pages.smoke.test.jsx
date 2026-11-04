import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import App from '../App'

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
