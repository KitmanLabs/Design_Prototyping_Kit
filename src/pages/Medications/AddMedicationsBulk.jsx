import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Button } from '../../components'
import PlayerAlertsZone from '../../components/medications/PlayerAlertsZone'
import MedicationFieldsColumn from '../../components/medications/MedicationFieldsColumn'
import AddPlayersSelector from '../../components/medications/AddPlayersSelector'
import ReviewSafetyWarningsModal from '../../components/medications/ReviewSafetyWarningsModal'
import {
  ALERT_SEVERITY,
  DEFAULT_MEDICATION_FIELDS,
  bulkMedicationPlayers,
  validateMedicationForPlayer,
} from '../../data/medicationAlerts'
import athletesData from '../../data/athletes.json'
import '../../styles/design-tokens.css'

const EXTRA_ROSTER_PLAYERS = athletesData.slice(0, 6).map((a) => ({
  id: `athlete-${a.id}`,
  name: `${a.firstname} ${a.lastname}`,
  position: a.position,
  allergies: [],
  medicalAlerts: [],
}))

const ROSTER_POOL = [...bulkMedicationPlayers, ...EXTRA_ROSTER_PLAYERS]

const COLUMN_WIDTH = 268

function buildRowsForIds(ids, previousRows = {}) {
  const next = {}
  ids.forEach((id) => {
    next[id] = previousRows[id] || { ...DEFAULT_MEDICATION_FIELDS }
  })
  return next
}

function severityForChipLabel(chipLabel) {
  return chipLabel === 'Allergy' ? ALERT_SEVERITY.SEVERE : ALERT_SEVERITY.MODERATE
}

function AddMedicationsBulk() {
  const navigate = useNavigate()

  const [alertsVariant, setAlertsVariant] = useState('A')
  const [selectedIds, setSelectedIds] = useState(bulkMedicationPlayers.map((p) => p.id))
  const [medicationRows, setMedicationRows] = useState(() => buildRowsForIds(selectedIds))
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [warnings, setWarnings] = useState([])
  const [warningsModalOpen, setWarningsModalOpen] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '' })

  const selectedPlayers = useMemo(
    () => selectedIds.map((id) => ROSTER_POOL.find((p) => p.id === id)).filter(Boolean),
    [selectedIds]
  )

  const handleFieldChange = (playerId, field, value) => {
    setMedicationRows((prev) => ({
      ...prev,
      [playerId]: { ...(prev[playerId] || DEFAULT_MEDICATION_FIELDS), [field]: value },
    }))
  }

  const getPlayerFields = (playerId) => medicationRows[playerId] || DEFAULT_MEDICATION_FIELDS

  const handleSelectorDone = (newSelectedIds) => {
    setSelectedIds(newSelectedIds)
    setMedicationRows((prev) => buildRowsForIds(newSelectedIds, prev))
  }

  const handleAcknowledgeWarning = (playerId) => {
    setWarnings((prev) => prev.map((w) => (w.playerId === playerId ? { ...w, status: 'acknowledged' } : w)))
  }

  // Inline "Edit medication" save, from within the safety-warnings modal.
  // Syncs the whole medication section (drug + lot/dose/route/dates, etc.)
  // straight into the grid, then re-validates that one player: a clean
  // result resolves the row (no acknowledgment needed), a fresh conflict
  // updates the row's reason in place and keeps it pending.
  const handleSaveEditWarning = (playerId, updatedFields) => {
    setMedicationRows((prev) => ({
      ...prev,
      [playerId]: { ...(prev[playerId] || DEFAULT_MEDICATION_FIELDS), ...updatedFields },
    }))

    const player = ROSTER_POOL.find((p) => p.id === playerId)
    const conflict = validateMedicationForPlayer(player, updatedFields.brandName)

    if (!conflict) {
      setWarnings((prev) => prev.map((w) => (w.playerId === playerId ? { ...w, status: 'resolved' } : w)))
      setTimeout(() => {
        setWarnings((prev) => prev.filter((w) => w.playerId !== playerId))
      }, 1200)
      return
    }

    setWarnings((prev) =>
      prev.map((w) =>
        w.playerId === playerId
          ? {
              ...w,
              chipLabel: conflict.chipLabel,
              medication: conflict.medication,
              reasonSuffix: conflict.reasonSuffix,
              severity: severityForChipLabel(conflict.chipLabel),
              status: 'pending',
            }
          : w
      )
    )
  }

  const handleConfirmWarnings = () => {
    const count = warnings.length
    setWarningsModalOpen(false)
    setWarnings([])
    setToast({ open: true, message: `${count} medication${count !== 1 ? 's' : ''} ordered after acknowledgement` })
  }

  const handleSave = () => {
    const results = selectedPlayers.map((player) => {
      const brandName = medicationRows[player.id]?.brandName || ''
      return { player, conflict: validateMedicationForPlayer(player, brandName) }
    })

    const clean = results.filter((r) => !r.conflict)
    const conflicted = results.filter((r) => r.conflict)

    if (clean.length > 0) {
      setToast({ open: true, message: `${clean.length} medication${clean.length !== 1 ? 's' : ''} ordered` })
    }

    if (conflicted.length === 0) return

    setWarnings(
      conflicted.map(({ player, conflict }) => ({
        playerId: player.id,
        playerName: player.name,
        chipLabel: conflict.chipLabel,
        medication: conflict.medication,
        reasonSuffix: conflict.reasonSuffix,
        severity: severityForChipLabel(conflict.chipLabel),
        status: 'pending',
      }))
    )
    setWarningsModalOpen(true)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background-primary)' }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: '1px solid var(--color-border-primary)', flexShrink: 0 }}>
        <Breadcrumbs sx={{ mb: 1, '& .MuiBreadcrumbs-separator': { color: 'var(--color-text-muted)' } }}>
          <Link
            component="button"
            underline="hover"
            onClick={() => navigate('/medical')}
            sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}
          >
            Medical
          </Link>
          <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Medications
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
            Add medications
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-primary)' }}>
            Add medications
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Dev-only toggle to compare the two alert-zone layouts */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, border: '1px dashed var(--color-border-primary)', borderRadius: 'var(--radius-md)' }}>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-family-primary)' }}>
                Dev: alerts layout
              </Typography>
              <ToggleButtonGroup
                value={alertsVariant}
                exclusive
                size="small"
                onChange={(_, v) => v && setAlertsVariant(v)}
                sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontFamily: 'var(--font-family-primary)', px: 1.25, py: 0.25 } }}
              >
                <ToggleButton value="A">A</ToggleButton>
                <ToggleButton value="B">B</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Button variant="primary" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Box>

      {/* Add players row */}
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border-secondary)', flexShrink: 0 }}>
        <Button variant="secondary" onClick={() => setSelectorOpen(true)}>Add players</Button>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)' }}>
          {selectedIds.length} player{selectedIds.length !== 1 ? 's' : ''} selected
        </Typography>
      </Box>

      {/* Player columns */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 3 }}>
        {selectedPlayers.length === 0 ? (
          <Typography sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)' }}>
            Add players to begin prescribing medications.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
            {selectedPlayers.map((player) => (
              <Box
                key={player.id}
                sx={{
                  width: COLUMN_WIDTH,
                  flexShrink: 0,
                  p: 2,
                  border: '1px solid var(--color-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background-primary)',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {alertsVariant === 'B' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-primary)' }}>
                        {player.name}
                      </Typography>
                      <PlayerAlertsZone player={player} variant="B" />
                    </Box>
                  ) : (
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-primary)' }}>
                      {player.name}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-primary)', display: 'block', mb: alertsVariant === 'A' ? 0.5 : 0 }}>
                    {player.position}
                  </Typography>
                  {alertsVariant === 'A' && <PlayerAlertsZone player={player} variant="A" />}
                </Box>

                <MedicationFieldsColumn
                  values={medicationRows[player.id] || DEFAULT_MEDICATION_FIELDS}
                  onChange={(field, value) => handleFieldChange(player.id, field, value)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <AddPlayersSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        players={ROSTER_POOL}
        selectedIds={selectedIds}
        onDone={handleSelectorDone}
      />

      <ReviewSafetyWarningsModal
        open={warningsModalOpen}
        onClose={() => setWarningsModalOpen(false)}
        warnings={warnings}
        getPlayerFields={getPlayerFields}
        onAcknowledge={handleAcknowledgeWarning}
        onSaveEdit={handleSaveEditWarning}
        onConfirm={handleConfirmWarnings}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ fontFamily: 'var(--font-family-primary)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AddMedicationsBulk
