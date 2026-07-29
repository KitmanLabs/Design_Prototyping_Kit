import { Chip } from '@mui/material'
import { ALERT_SEVERITY } from '../../data/medicationAlerts'

const SEVERITY_STYLES = {
  [ALERT_SEVERITY.SEVERE]: {
    backgroundColor: 'var(--color-error-light)',
    color: 'var(--color-error-dark)',
  },
  [ALERT_SEVERITY.MODERATE]: {
    backgroundColor: 'var(--color-warning-light)',
    color: 'var(--color-warning-dark)',
  },
  [ALERT_SEVERITY.INFO]: {
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text-secondary)',
  },
}

function MedicationAlertChip({ label, severity = ALERT_SEVERITY.INFO, ...props }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 'var(--font-weight-medium)',
        fontFamily: 'var(--font-family-primary)',
        fontSize: 'var(--font-size-xs)',
        ...SEVERITY_STYLES[severity],
      }}
      {...props}
    />
  )
}

export default MedicationAlertChip
