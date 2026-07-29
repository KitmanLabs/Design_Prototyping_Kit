import { useRef } from 'react'
import { Box, TextField, MenuItem, Typography } from '@mui/material'
import { AttachFileOutlined } from '@mui/icons-material'
import { Button } from '../../components'
import { DISPENSER_OPTIONS, INJURY_ILLNESS_OPTIONS } from '../../data/medicationOptions'
import EditableMedicationFields from './EditableMedicationFields'

// Full per-player field order for the bulk grid:
// Dispenser -> Dispensing date -> Injury/Illness -> [medication section] ->
// Note -> Document -> "+ Add another medication"
function MedicationFieldsColumn({ values, onChange }) {
  const set = (field) => (e) => onChange(field, e.target.value)
  const fileInputRef = useRef(null)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <TextField select variant="filled" size="small" label="Dispenser" value={values.dispenser} onChange={set('dispenser')}>
        {DISPENSER_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        variant="filled"
        size="small"
        label="Dispensing date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={values.dispensingDate}
        onChange={set('dispensingDate')}
      />

      <TextField select variant="filled" size="small" label="Injury/Illness" value={values.injuryIllness} onChange={set('injuryIllness')}>
        {INJURY_ILLNESS_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <EditableMedicationFields values={values} onChange={onChange} />

      <TextField
        variant="filled"
        size="small"
        label="Note"
        multiline
        minRows={2}
        value={values.note}
        onChange={set('note')}
      />

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={(e) => onChange('documentName', e.target.files?.[0]?.name || '')}
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()} style={{ justifyContent: 'flex-start' }}>
        <AttachFileOutlined fontSize="small" style={{ marginRight: 6 }} />
        {values.documentName || 'Attach document'}
      </Button>

      <Typography
        variant="caption"
        title="Multiple medications per order — coming soon"
        sx={{
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'not-allowed',
        }}
      >
        + Add another medication
      </Typography>
    </Box>
  )
}

export default MedicationFieldsColumn
