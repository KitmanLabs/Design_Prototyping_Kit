import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the Dashboard page title for /dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /Dashboard/i })).toBeInTheDocument()
  })
})

