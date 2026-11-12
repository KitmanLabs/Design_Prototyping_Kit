import { createContext, useContext } from 'react'
import { availableSquads } from '../data/layout'

// The squad chosen in the top bar's squad selector, as iP scopes its lists. LayoutWithMainNav
// provides it; a page reads it with useCurrentSquad() and filters by athlete.squad_id === squad.id.
// Outside the layout (a story, a test) it's the first squad.
export const CurrentSquadContext = createContext(availableSquads[0])

// { id, name, short } for the chosen squad.
export function useCurrentSquad() {
  return useContext(CurrentSquadContext)
}
