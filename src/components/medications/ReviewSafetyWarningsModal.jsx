import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, IconButton, Checkbox, FormControlLabel, Chip } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import { Button } from '../../components'
import MedicationAlertChip from './MedicationAlertChip'
import EditableMedicationFields from './EditableMedicationFields'
import { LOCKED_MEDICATION_FIELD_KEYS, EDITABLE_MEDICATION_FIELD_KEYS } from '../../data/medicationAlerts'

const GRID_COLUMNS = '160px 1fr 240px'

const LOCKED_FIELD_LABELS = {
  dispenser: 'Dispenser',
  dispensingDate: 'Dispensing date',
  injuryIllness: 'Injury/Illness',
}

function pickFields(source, keys) {
  const picked = {}
  keys.forEach((key) => { picked[key] = source[key] })
  return picked
}

function WarningRow({ warning, playerFields, isEditing, onStartEdit, onCancelEdit, onSaveEdit, onAcknowledge }) {
  const [draft, setDraft] = useState(() => pickFields(playerFields, EDITABLE_MEDICATION_FIELD_KEYS))

  useEffect(() => {
    if (isEditing) setDraft(pickFields(playerFields, EDITABLE_MEDICATION_FIELD_KEYS))
  }, [isEditing, playerFields])

  const acknowledged = warning.status === 'acknowledged'
  const resolved = warning.status === 'resolved'
  const locked = acknowledged || resolved

  return (
    <Box sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID_COLUMNS,
          gap: 2,
          alignItems: 'center',
          p: 1.5,
          opacity: acknowledged ? 0.5 : 1,
          backgroundColor: locked ? 'var(--color-background-secondary)' : 'transparent',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-primary)' }}>
          {warning.playerName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <MedicationAlertChip label={warning.medication.toLowerCase()} severity={warning.severity} />
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>
            {warning.reasonSuffix}
          </Typography>
        </Box>

        {resolved ? (
          <Chip
            label="Resolved"
            size="small"
            sx={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-dark)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family-primary)', justifySelf: 'start' }}
          />
        ) : isEditing ? (
          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-primary)' }}>Editing…</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
            <FormControlLabel
              disabled={acknowledged}
              control={<Checkbox size="small" checked={acknowledged} onChange={() => onAcknowledge(warning.playerId)} />}
              label={<Typography variant="body2" sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}>I acknowledge this risk</Typography>}
              sx={{ mr: 0 }}
            />
            {!acknowledged && (
              <Button variant="secondary" onClick={() => onStartEdit(warning.playerId)} style={{ padding: '2px 10px' }}>
                Edit medication
              </Button>
            )}
          </Box>
        )}
      </Box>

      {isEditing && (
        <Box sx={{ borderTop: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-secondary)', p: 2, display: 'flex', gap: 3 }}>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-primary)', fontWeight: 'var(--font-weight-medium)', mb: 1 }}>
              Locked — unrelated to the medication
            </Typography>
            {LOCKED_MEDICATION_FIELD_KEYS.map((key) => (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)' }}>
                  {LOCKED_FIELD_LABELS[key]}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-primary)' }}>
                  {playerFields[key] || '—'}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ width: 280 }}>
            <EditableMedicationFields values={draft} onChange={(field, value) => setDraft((prev) => ({ ...prev, [field]: value }))} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'flex-start' }}>
            <Button variant="primary" onClick={() => onSaveEdit(warning.playerId, draft)}>Save</Button>
            <Button variant="secondary" onClick={() => onCancelEdit(warning.playerId)}>Cancel</Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

function ReviewSafetyWarningsModal({ open, onClose, warnings, getPlayerFields, onAcknowledge, onSaveEdit, onConfirm }) {
  const [editingPlayerId, setEditingPlayerId] = useState(null)

  useEffect(() => {
    if (!open) setEditingPlayerId(null)
  }, [open])

  const hasPending = warnings.some((w) => w.status === 'pending')
  const confirmDisabled = editingPlayerId !== null || hasPending

  const handleSaveEdit = (playerId, updatedFields) => {
    setEditingPlayerId(null)
    onSaveEdit(playerId, updatedFields)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family-primary)' }}>
          Review safety warnings
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: 2, px: 1.5, pb: 1 }}>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family-primary)' }}>Player</Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family-primary)' }}>Reason</Typography>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family-primary)' }}>Acknowledge</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {warnings.map((warning) => (
            <WarningRow
              key={warning.playerId}
              warning={warning}
              playerFields={getPlayerFields(warning.playerId)}
              isEditing={editingPlayerId === warning.playerId}
              onStartEdit={setEditingPlayerId}
              onCancelEdit={() => setEditingPlayerId(null)}
              onSaveEdit={handleSaveEdit}
              onAcknowledge={onAcknowledge}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={onClose}>Back</Button>
        <Button variant="primary" disabled={confirmDisabled} onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReviewSafetyWarningsModal
