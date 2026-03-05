import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Messaging from './index'

describe('Messaging page', () => {
  it('renders the All messages header', () => {
    render(<Messaging />)

    expect(screen.getByText('All messages')).toBeInTheDocument()
  })
})

