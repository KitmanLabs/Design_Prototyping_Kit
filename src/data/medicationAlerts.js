// Mock data for the bulk "Add multiple medications" prototype.
// Severity drives chip color in MedicationAlertChip: severe = red, moderate = amber, info = grey.

export const ALERT_SEVERITY = {
  SEVERE: 'severe',
  MODERATE: 'moderate',
  INFO: 'info',
}

export const DEFAULT_MEDICATION_FIELDS = {
  // Locked in the safety-warnings modal edit view — describe the dispensing
  // event/diagnosis, not the drug, so they don't change with the medication.
  dispenser: '',
  dispensingDate: '',
  injuryIllness: '',
  // Editable in the modal edit view — the "medication section". All of these
  // move together when the drug changes, since lot/strength/dosing/route can
  // all differ between products.
  brandName: 'Ibuprofen 400mg',
  isUnlistedMedication: false,
  lot: '',
  amountDispensed: '',
  direction: '',
  dose: '',
  frequencyPerDay: '',
  route: '',
  isAsDirected: false,
  startDate: '',
  endDate: '',
  // Out of the modal edit view entirely — freeform/attachment fields unrelated
  // to resolving a flagged conflict.
  note: '',
  documentName: '',
}

// Field keys shown as plain text (read-only) in the safety-warnings modal's edit view.
export const LOCKED_MEDICATION_FIELD_KEYS = ['dispenser', 'dispensingDate', 'injuryIllness']

// Field keys that make up the editable "medication section" — shared between the
// main grid column and the modal's inline row editor.
export const EDITABLE_MEDICATION_FIELD_KEYS = [
  'brandName', 'isUnlistedMedication', 'lot', 'amountDispensed', 'direction',
  'dose', 'frequencyPerDay', 'route', 'isAsDirected', 'startDate', 'endDate',
]

export const bulkMedicationPlayers = [
  {
    id: 'player-a',
    name: 'Player A',
    position: 'Midfielder',
    allergies: [],
    medicalAlerts: [],
  },
  {
    id: 'player-b',
    name: 'Player B',
    position: 'Defender',
    allergies: [],
    medicalAlerts: [],
  },
  {
    id: 'player-c',
    name: 'Player C',
    position: 'Forward',
    allergies: [],
    medicalAlerts: [],
  },
  {
    id: 'player-d',
    name: 'Gordan Morales',
    position: 'Goalkeeper',
    allergies: [
      { id: 'd-allergy-ibuprofen', label: 'Ibuprofen', type: 'Allergy', severity: ALERT_SEVERITY.SEVERE },
    ],
    medicalAlerts: [
      { id: 'd-alert-warfarin', label: 'Warfarin', type: 'Medical alert', severity: ALERT_SEVERITY.MODERATE },
    ],
  },
  {
    id: 'player-e',
    name: 'Player E',
    position: 'Midfielder',
    allergies: [],
    medicalAlerts: [
      { id: 'e-alert-blood-thinner', label: 'Blood thinner', type: 'Medical alert', severity: ALERT_SEVERITY.MODERATE },
    ],
  },
]

// Medical-alert + drug combinations that trigger an interaction warning.
const INTERACTION_RULES = [
  { alertLabel: 'blood thinner', drugKeyword: 'ibuprofen', reasonSuffix: () => 'has a major interaction with blood thinner' },
  { alertLabel: 'warfarin', drugKeyword: 'aspirin', reasonSuffix: (player) => `has a major interaction with ${player.name}'s warfarin` },
]

// Mock safety validation: checks a player's alerts against the drug being ordered.
// Returns null when there is no conflict, or a warning descriptor when there is.
export function validateMedicationForPlayer(player, brandName) {
  const drug = (brandName || '').toLowerCase()

  const allergyConflict = player.allergies.find((a) => drug.includes(a.label.toLowerCase()))
  if (allergyConflict) {
    return {
      playerId: player.id,
      chipLabel: 'Allergy',
      medication: allergyConflict.label,
      reasonSuffix: 'conflicts with allergy',
    }
  }

  for (const rule of INTERACTION_RULES) {
    const alertHit = player.medicalAlerts.find((a) => a.label.toLowerCase() === rule.alertLabel)
    if (alertHit && drug.includes(rule.drugKeyword)) {
      return {
        playerId: player.id,
        chipLabel: 'Interaction',
        medication: (brandName || '').split(' ')[0],
        reasonSuffix: rule.reasonSuffix(player),
      }
    }
  }

  return null
}
