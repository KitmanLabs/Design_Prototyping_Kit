import { useState } from 'react'
import { Box, Chip, Popover, Stack, Typography } from '@mui/material'
import { ALERT_SEVERITY } from '../../data/medicationAlerts'
import MedicationAlertChip from './MedicationAlertChip'

// Variant A reserves a fixed 2-line strip under the player name; anything past
// this count collapses into a "+N more" chip so every column's fields start
// at the same y-position regardless of how many alerts a player has.
const MAX_VISIBLE_CHIPS_VARIANT_A = 3
const ZONE_HEIGHT = 52

const SEVERITY_ORDER = [ALERT_SEVERITY.SEVERE, ALERT_SEVERITY.MODERATE, ALERT_SEVERITY.INFO]
const SEVERITY_DOT_COLOR = {
  [ALERT_SEVERITY.SEVERE]: 'var(--color-error)',
  [ALERT_SEVERITY.MODERATE]: 'var(--color-warning)',
  [ALERT_SEVERITY.INFO]: 'var(--color-text-muted)',
}

function highestSeverity(alerts) {
  for (const severity of SEVERITY_ORDER) {
    if (alerts.some((a) => a.severity === severity)) return severity
  }
  return ALERT_SEVERITY.INFO
}

function AlertsPopoverList({ alerts }) {
  return (
    <Stack spacing={1} sx={{ p: 1.5, maxWidth: 260 }}>
      {alerts.map((alert) => (
        <Box key={alert.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MedicationAlertChip label={alert.type} severity={alert.severity} />
          <Typography
            variant="body2"
            sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}
          >
            {alert.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

function PlayerAlertsZone({ player, variant = 'A' }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const alerts = [...player.allergies, ...player.medicalAlerts]
  const open = Boolean(anchorEl)

  if (variant === 'B') {
    if (alerts.length === 0) return null
    const severity = highestSeverity(alerts)
    return (
      <>
        <Chip
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
          icon={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: SEVERITY_DOT_COLOR[severity],
                ml: '8px !important',
              }}
            />
          }
          label={`${alerts.length} alert${alerts.length > 1 ? 's' : ''}`}
          sx={{
            backgroundColor: 'var(--color-background-secondary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
          }}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          disableRestoreFocus
          slotProps={{ paper: { onMouseLeave: () => setAnchorEl(null) } }}
        >
          <AlertsPopoverList alerts={alerts} />
        </Popover>
      </>
    )
  }

  // Variant A — fixed-height chip strip, reserved even when a player has no alerts.
  const visible = alerts.slice(0, MAX_VISIBLE_CHIPS_VARIANT_A)
  const overflowCount = alerts.length - visible.length

  return (
    <Box sx={{ height: ZONE_HEIGHT, overflow: 'hidden', width: '100%' }}>
      {alerts.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignContent: 'flex-start' }}>
          {visible.map((alert) => (
            <MedicationAlertChip key={alert.id} label={alert.label} severity={alert.severity} />
          ))}
          {overflowCount > 0 && (
            <Chip
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              label={`+${overflowCount} more`}
              sx={{
                backgroundColor: 'var(--color-background-secondary)',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
              }}
            />
          )}
        </Box>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <AlertsPopoverList alerts={alerts} />
      </Popover>
    </Box>
  )
}

export default PlayerAlertsZone
