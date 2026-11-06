import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import App from './App'
import './i18n'

// Each page owns its title: one level-one heading, in its page header. The app bar shows no
// title, so nothing repeats it.
describe('App', { timeout: 30000 }, () => {
  it.each([
    ['/dashboard', /good (morning|afternoon|evening)/i],
    ['/medical/rosters', /^medical$/i],
    ['/questionnaires', /^questionnaires$/i],
    ['/analysis', /^analysis$/i],
    ['/athletes/2', /elena rodriguez/i],
  ])('gives %s exactly one page title', async (path, title) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    )

    const headings = await screen.findAllByRole('heading', { level: 1 }, { timeout: 15000 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(title)
  })
})
