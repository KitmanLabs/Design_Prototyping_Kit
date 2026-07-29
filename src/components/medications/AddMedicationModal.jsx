import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, MenuItem, IconButton } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { Button } from '../../components'
import MedicationAlertChip from './MedicationAlertChip'
import { DEFAULT_MEDICATION_FIELDS } from '../../data/medicationAlerts'
import { FREQUENCY_OPTIONS, ROUTE_OPTIONS } from '../../data/medicationOptions'

function AddMedicationModal({ open, onClose, player, onSave }) {
  const [fields, setFields] = useState(DEFAULT_MEDICATION_FIELDS)

  useEffect(() => {
    if (open) setFields(DEFAULT_MEDICATION_FIELDS)
  }, [open, player])

  if (!player) return null

  const alerts = [...player.allergies, ...player.medicalAlerts]
  const setField = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => {
    onSave?.(fields)
    onClose?.()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family-primary)' }}>
          Add medication
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-primary)' }}>
            {player.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)' }}>
            {player.position}
          </Typography>
          {alerts.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {alerts.map((alert) => (
                <MedicationAlertChip key={alert.id} label={`${alert.type}: ${alert.label}`} severity={alert.severity} />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField variant="filled" size="small" label="Dispenser" value={fields.dispenser} onChange={setField('dispenser')} />
          <TextField
            variant="filled"
            size="small"
            label="Dispensing date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fields.dispensingDate}
            onChange={setField('dispensingDate')}
          />
          <TextField variant="filled" size="small" label="Injury/Illness" value={fields.injuryIllness} onChange={setField('injuryIllness')} />
          <TextField variant="filled" size="small" label="Brand name/drug" value={fields.brandName} onChange={setField('brandName')} />
          <TextField variant="filled" size="small" label="Lot" value={fields.lot} onChange={setField('lot')} />
          <TextField variant="filled" size="small" label="Amount dispensed" value={fields.amountDispensed} onChange={setField('amountDispensed')} />
          <TextField variant="filled" size="small" label="Direction" value={fields.direction} onChange={setField('direction')} />
          <TextField variant="filled" size="small" label="Dose" value={fields.dose} onChange={setField('dose')} />
          <TextField
            select
            variant="filled"
            size="small"
            label="Frequency per day"
            value={fields.frequencyPerDay}
            onChange={setField('frequencyPerDay')}
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField select variant="filled" size="small" label="Route" value={fields.route} onChange={setField('route')}>
            {ROUTE_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMedicationModal
