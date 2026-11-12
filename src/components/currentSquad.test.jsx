import React from 'react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { LayoutWithMainNav, useCurrentSquad } from '.'
import { availableSquads } from '../data/layout'

function SquadName() {
  return <p data-testid="squad">{useCurrentSquad().name}</p>
}

describe('useCurrentSquad', () => {
  it("gives pages the squad chosen in the top bar's squad selector", () => {
    render(
      <MemoryRouter>
        <LayoutWithMainNav>
          <SquadName />
        </LayoutWithMainNav>
      </MemoryRouter>
    )
    expect(screen.getByTestId('squad')).toHaveTextContent(availableSquads[0].name)

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(within(screen.getByRole('listbox')).getByText(availableSquads[1].name))
    expect(screen.getByTestId('squad')).toHaveTextContent(availableSquads[1].name)
  })

  it('is the first squad outside the layout, as in a story or a test', () => {
    render(<SquadName />)
    expect(screen.getByTestId('squad')).toHaveTextContent(availableSquads[0].name)
  })
})
