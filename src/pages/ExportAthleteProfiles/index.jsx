import React, { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { exportTheme } from './theme'
import AppShell from './AppShell'
import ManageAthletesPage from './ManageAthletesPage'
// ExportDrawer remains as a parallel component for comparison; the menu now opens the modal.
import ExportModal from './ExportModal'

export default function ExportAthleteProfiles() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <ThemeProvider theme={exportTheme}>
      <CssBaseline />
      <AppShell>
        <ManageAthletesPage onOpenExport={() => setModalOpen(true)} />
      </AppShell>
      <ExportModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </ThemeProvider>
  )
}
