import { createContext, useContext, useState } from 'react'
import { infoCategories } from '../data/mockData'

// Holds the in-progress "Share Record" configuration and drawer state so the
// Share Setup drawer and the Prepare Shared Record page share one source of truth.
const ShareContext = createContext(null)

const emptyConfig = () => ({
  athlete: null,
  physician: '',
  organization: '',
  reason: '',
  // category name -> included (boolean). All included by default.
  categories: infoCategories.reduce((acc, c) => ({ ...acc, [c]: true }), {}),
})

export function ShareProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [config, setConfig] = useState(emptyConfig())

  const openDrawer = (athlete) => {
    // Preserve config when reopening for the same athlete (e.g. Back from Prepare).
    setConfig((prev) =>
      prev.athlete?.id === athlete.id ? prev : { ...emptyConfig(), athlete }
    )
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)
  const updateConfig = (patch) => setConfig((prev) => ({ ...prev, ...patch }))
  const resetConfig = () => setConfig(emptyConfig())

  return (
    <ShareContext.Provider
      value={{ drawerOpen, config, openDrawer, closeDrawer, updateConfig, resetConfig }}
    >
      {children}
    </ShareContext.Provider>
  )
}

export function useShare() {
  const ctx = useContext(ShareContext)
  if (!ctx) throw new Error('useShare must be used within a ShareProvider')
  return ctx
}
