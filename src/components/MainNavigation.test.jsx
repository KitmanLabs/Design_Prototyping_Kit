import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import MainNavigation from './MainNavigation'

describe('MainNavigation', () => {
  it('renders a Medical nav item', () => {
    render(
      <MemoryRouter>
        <MainNavigation isOpen onToggle={() => {}} />
      </MemoryRouter>
    )

    expect(screen.getByText('Medical')).toBeInTheDocument()
  })
})

