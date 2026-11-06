import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Messaging from './index'
import '../../i18n'

// The test environment matches no media queries, so the page renders the compact
// List-detail layout: one pane at a time.
describe('Messaging page', () => {
  it('opens on the selected conversation, and Back returns to the list', () => {
    render(<Messaging />)

    expect(screen.getByRole('button', { name: 'New message' })).toBeInTheDocument()
    expect(screen.queryByText('All messages')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('All messages')).toBeInTheDocument()
  })
})
