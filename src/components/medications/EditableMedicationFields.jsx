import { Box, TextField, MenuItem, Typography, Checkbox, FormControlLabel } from '@mui/material'
import { FREQUENCY_OPTIONS, ROUTE_OPTIONS } from '../../data/medicationOptions'
import MedicationAutocomplete from './MedicationAutocomplete'

// The "medication section" — every field that has to move together when the
// drug changes (lot, strength, dosing, course length, route). Shared by the
// main bulk grid column and the safety-warnings modal's inline row editor, so
// the two surfaces can never drift apart.
// Order: Brand name/drug -> Lot -> Amount dispensed -> Directions -> Dose ->
// Frequency per day -> Route -> As directed -> Start date -> End date.
function EditableMedicationFields({ values, onChange }) {
  const set = (field) => (e) => onChange(field, e.target.value)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {values.isUnlistedMedication ? (
        <TextField variant="filled" size="small" label="Brand name/drug" value={values.brandName} onChange={set('brandName')} />
      ) : (
        <MedicationAutocomplete value={values.brandName} onChange={(newValue) => onChange('brandName', newValue)} />
      )}
      <Typography
        variant="caption"
        onClick={() => onChange('isUnlistedMedication', !values.isUnlistedMedication)}
        sx={{
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 'var(--font-weight-medium)',
          cursor: 'pointer',
          mt: -0.75,
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {values.isUnlistedMedication ? '← Choose from list' : '+ Unlisted medication'}
      </Typography>

      <TextField variant="filled" size="small" label="Lot" value={values.lot} onChange={set('lot')} />
      <TextField variant="filled" size="small" label="Amount dispensed" value={values.amountDispensed} onChange={set('amountDispensed')} />
      <TextField variant="filled" size="small" label="Directions" value={values.direction} onChange={set('direction')} />

      {!values.isAsDirected && (
        <>
          <TextField variant="filled" size="small" label="Dose" value={values.dose} onChange={set('dose')} />
          <TextField select variant="filled" size="small" label="Frequency per day" value={values.frequencyPerDay} onChange={set('frequencyPerDay')}>
            {FREQUENCY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </>
      )}

      <TextField select variant="filled" size="small" label="Route" value={values.route} onChange={set('route')}>
        {ROUTE_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        control={<Checkbox size="small" checked={values.isAsDirected} onChange={(e) => onChange('isAsDirected', e.target.checked)} />}
        label={<Typography variant="body2" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>As directed</Typography>}
        sx={{ mr: 0 }}
      />

      <TextField
        variant="filled"
        size="small"
        label="Start date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={values.startDate}
        onChange={set('startDate')}
      />
      <TextField
        variant="filled"
        size="small"
        label="End date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={values.endDate}
        onChange={set('endDate')}
      />
    </Box>
  )
}

export default EditableMedicationFields
