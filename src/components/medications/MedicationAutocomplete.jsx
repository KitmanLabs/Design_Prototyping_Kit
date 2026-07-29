import { Autocomplete, TextField } from '@mui/material'
import { DRUG_OPTIONS } from '../../data/medicationOptions'

// Shared brand name/drug picker — used in the main bulk grid columns and in the
// safety-warnings modal's inline row editor, so both surfaces stay in sync.
function MedicationAutocomplete({ value, onChange, label = 'Brand name/drug', size = 'small', ...props }) {
  return (
    <Autocomplete
      size={size}
      options={DRUG_OPTIONS}
      value={value || null}
      onChange={(_, newValue) => onChange(newValue || '')}
      renderInput={(params) => (
        <TextField {...params} variant="filled" size={size} label={label} />
      )}
      {...props}
    />
  )
}

export default MedicationAutocomplete
