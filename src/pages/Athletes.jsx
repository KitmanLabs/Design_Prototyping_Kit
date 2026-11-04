import React, { useState } from 'react'
import { Box, Typography, Paper, Alert, Snackbar } from '@mui/material'
import { AthleteDataGrid } from '../components'
import athletesData from '../data/athletes.json'
import '../styles/design-tokens.css'

/**
 * Athletes page with comprehensive DataGrid
 * Displays all athletes with premium features like filtering, grouping, and export
 */
function Athletes() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleBulkAction = (action, selectedRows) => {
    const selectedAthletes = athletesData.filter(athlete => selectedRows.includes(athlete.id))
    const count = selectedAthletes.length
    
    let message = ''
    let severity = 'info'
    
    // The actions AthleteDataGrid's selection bar sends
    const athletes = `${count} athlete${count === 1 ? '' : 's'}`
    switch (action) {
      case 'delete':
        message = `Deleted ${athletes}`
        severity = 'warning'
        break
      case 'archive':
        message = `Archived ${athletes}`
        severity = 'success'
        break
      default:
        message = `Unknown action: ${action}`
        severity = 'error'
    }
    
    setSnackbar({ open: true, message, severity })
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0}
        sx={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-primary)',
          overflow: 'hidden'
        }}
      >
        <AthleteDataGrid 
          data={athletesData}
          height={700}
          onBulkAction={handleBulkAction}
        />
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Athletes