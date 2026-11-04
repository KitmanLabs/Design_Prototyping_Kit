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

// Each page renders through the real router and shell without throwing.
describe('pages', () => {
  it('renders the athletes grid', async () => {
    renderAt('/athletes')
    expect(await screen.findByRole('grid')).toBeInTheDocument()
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
