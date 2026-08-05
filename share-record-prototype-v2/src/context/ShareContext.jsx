import { createContext, useContext, useState, useCallback } from 'react'
import { infoCategories } from '../data/mockData'

// Holds the in-progress "Share Record" configuration, drawer state, and the
// global snackbar so the drawer, the Prepare page, and the roster share one
// source of truth. `athletes` is an array: length 1 for a single share, >1 for
// a bulk share.
const ShareContext = createContext(null)

const emptyConfig = () => ({
  athletes: [],
  physician: '',
  organization: '',
  reason: '',
  // category name -> included (boolean). All included by default.
  categories: infoCategories.reduce((acc, c) => ({ ...acc, [c]: true }), {}),
  permission: 'view',
  duration: '7d',
  customDate: '',
  // Off by default — sender must explicitly enable comments for this share.
  allowComments: false,
})

export function ShareProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [config, setConfig] = useState(emptyConfig())
  const [snackbar, setSnackbar] = useState(null)
  // Snapshot of the config as of the last completed share — survives resetConfig()
  // so the recipient-facing view can still read settings like allowComments.
  const [lastShare, setLastShare] = useState(null)

  // Open the drawer for one athlete or a list. Preserves config when the same
  // set is reopened (e.g. Back from the Prepare page).
  const openDrawer = (athleteOrList) => {
    const list = Array.isArray(athleteOrList) ? athleteOrList : [athleteOrList]
    setConfig((prev) => {
      const sameSet =
        prev.athletes.length === list.length &&
        prev.athletes.every((a, i) => a.id === list[i].id)
      return sameSet ? prev : { ...emptyConfig(), athletes: list }
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => setDrawerOpen(false)
  const updateConfig = (patch) => setConfig((prev) => ({ ...prev, ...patch }))
  const resetConfig = () => setConfig(emptyConfig())
  const completeShare = () => {
    setLastShare(config)
    setConfig(emptyConfig())
  }

  const showSnackbar = useCallback((message) => setSnackbar(message), [])
  const hideSnackbar = useCallback(() => setSnackbar(null), [])

  return (
    <ShareContext.Provider
      value={{
        drawerOpen,
        config,
        openDrawer,
        closeDrawer,
        updateConfig,
        resetConfig,
        completeShare,
        lastShare,
        snackbar,
        showSnackbar,
        hideSnackbar,
      }}
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
