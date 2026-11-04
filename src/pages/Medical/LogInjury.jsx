import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  DatePicker,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '../../playbook-components'
import { LocalizationProvider } from '../../playbook-components/providers'
import {
  PageFrame,
  PageHeader,
  FloorplanFooter,
  GuidedFlowLayout,
  DiscardChangesDialog,
  useToasts,
} from '../../floorplans'
import athletesData from '../../data/athletes.json'
import {
  logInjurySteps,
  bodyAreaOptions,
  sideOptions,
  injuryTypeOptions,
  activityOptions,
  contactOptions,
  availabilityOptions,
  emptyInjury,
  requiredFieldsByStep,
} from '../../data/injuryOptions'

// Floorplan: Guided flow. Logging an injury is high-stakes and later steps depend on
// earlier answers, so it runs as five steps ending in Review, on its own page so it can be
// linked to and saved as a draft.

const fullName = (athlete) => `${athlete.firstname} ${athlete.lastname}`
const formatDate = (value) => (value ? value.format('ll') : '-')

function SelectField({ label, value, onChange, options }) {
  return (
    <TextField variant="filled" select fullWidth label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <MenuItem key={option.value ?? option} value={option.value ?? option}>
          {option.label ?? option}
        </MenuItem>
      ))}
    </TextField>
  )
}

function LogInjury() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast, toasts } = useToasts()

  const presetAthleteId = Number(searchParams.get('athleteId')) || ''
  const [injury, setInjury] = useState({ ...emptyInjury, athleteId: presetAthleteId })
  const [activeStep, setActiveStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(0)
  const [confirmingDiscard, setConfirmingDiscard] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const athlete = athletesData.find((a) => a.id === injury.athleteId)
  const step = logInjurySteps[activeStep]
  const isReview = step.id === 'review'
  const isDirty = Object.keys(emptyInjury).some(
    (key) => key !== 'athleteId' && injury[key] !== emptyInjury[key]
  ) || injury.athleteId !== presetAthleteId
  const stepComplete = requiredFieldsByStep[step.id].every((field) => Boolean(injury[field]))

  const set = (field) => (value) => setInjury((current) => ({ ...current, [field]: value }))
  const returnTo = presetAthleteId ? `/athletes/${presetAthleteId}` : '/medical/rosters'

  const goToStep = (index) => {
    setActiveStep(index)
    setFurthestStep((current) => Math.max(current, index))
  }

  const cancel = () => (isDirty ? setConfirmingDiscard(true) : navigate(returnTo))

  const submit = () => {
    setSubmitting(true)
    // A short delay stands in for the request, so Submit shows its loading state
    setTimeout(() => {
      navigate(returnTo, { state: { toast: `Injury logged for ${fullName(athlete)}` } })
    }, 600)
  }

  const reviewRows = [
    { stepIndex: 0, items: [['Athlete', athlete ? fullName(athlete) : '-'], ['Date of injury', formatDate(injury.occurrenceDate)]] },
    { stepIndex: 1, items: [['Body area', injury.bodyArea], ['Side', injury.side], ['Injury type', injury.injuryType]] },
    { stepIndex: 2, items: [['Activity', injury.activity], ['Contact', injury.contact], ['Notes', injury.notes || '-']] },
    { stepIndex: 3, items: [['Availability', injury.availability], ['Expected return', formatDate(injury.expectedReturn)]] },
  ]

  const stepContent = {
    athlete: (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <SelectField
          label="Athlete"
          value={injury.athleteId}
          onChange={set('athleteId')}
          options={athletesData.map((a) => ({ value: a.id, label: fullName(a) }))}
        />
        <DatePicker
          label="Date of injury"
          value={injury.occurrenceDate}
          onChange={set('occurrenceDate')}
          disableFuture
          slotProps={{ textField: { variant: 'filled', fullWidth: true } }}
        />
      </Box>
    ),
    injury: (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <SelectField label="Body area" value={injury.bodyArea} onChange={set('bodyArea')} options={bodyAreaOptions} />
        <SelectField label="Side" value={injury.side} onChange={set('side')} options={sideOptions} />
        <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
          <SelectField label="Injury type" value={injury.injuryType} onChange={set('injuryType')} options={injuryTypeOptions} />
        </Box>
      </Box>
    ),
    mechanism: (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <SelectField label="Activity" value={injury.activity} onChange={set('activity')} options={activityOptions} />
        <SelectField label="Contact" value={injury.contact} onChange={set('contact')} options={contactOptions} />
        <TextField
          variant="filled"
          label="Notes"
          multiline
          minRows={3}
          value={injury.notes}
          onChange={(e) => set('notes')(e.target.value)}
        />
      </Box>
    ),
    availability: (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <RadioGroup aria-label="Availability" value={injury.availability} onChange={(e) => set('availability')(e.target.value)}>
          {availabilityOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={
                <span>
                  {option.label}
                  <Typography component="span" variant="body2" sx={{ color: 'var(--color-text-secondary)', ml: 1 }}>
                    {option.description}
                  </Typography>
                </span>
              }
            />
          ))}
        </RadioGroup>
        <DatePicker
          label="Expected return (optional)"
          value={injury.expectedReturn}
          onChange={set('expectedReturn')}
          disablePast
          slotProps={{ textField: { variant: 'filled', fullWidth: true } }}
        />
      </Box>
    ),
    review: (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          Check the details, then submit. Changing availability updates the athlete&apos;s status for the whole staff.
        </Typography>
        {reviewRows.map((row) => (
          <Box
            key={row.stepIndex}
            sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" component="h3">{logInjurySteps[row.stepIndex].label}</Typography>
              <Button
                variant="contained"
                color="secondary"
                disableElevation={true}
                onClick={() => setActiveStep(row.stepIndex)}
                aria-label={`Edit ${logInjurySteps[row.stepIndex].label.toLowerCase()}`}
              >
                Edit
              </Button>
            </Box>
            {row.items.map(([label, value]) => (
              <Typography key={label} variant="body2">
                <Box component="span" sx={{ color: 'var(--color-text-secondary)' }}>{label}: </Box>
                {value || '-'}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    ),
  }[step.id]

  return (
    <LocalizationProvider>
      <PageFrame
        maxContentWidth={1040}
        header={<PageHeader title={athlete ? `Log injury for ${fullName(athlete)}` : 'Log injury'} onBackClick={cancel} />}
        footer={
          <FloorplanFooter
            onCancel={cancel}
            actions={[
              {
                id: 'draft',
                label: 'Save draft',
                disabled: !isDirty || submitting,
                onClick: () => showToast({ title: 'Draft saved', description: 'This prototype keeps the draft until you leave the page.' }),
              },
              ...(activeStep > 0 ? [{ id: 'back', label: 'Back', disabled: submitting, onClick: () => setActiveStep(activeStep - 1) }] : []),
            ]}
            primaryAction={
              isReview
                ? { label: 'Submit', onClick: submit, loading: submitting }
                : { label: 'Next', onClick: () => goToStep(activeStep + 1), disabled: !stepComplete }
            }
          />
        }
      >
        <GuidedFlowLayout steps={logInjurySteps} activeStep={activeStep} furthestStep={furthestStep} onStepClick={setActiveStep}>
          {stepContent}
        </GuidedFlowLayout>
        <DiscardChangesDialog
          open={confirmingDiscard}
          onKeepEditing={() => setConfirmingDiscard(false)}
          onDiscard={() => navigate(returnTo)}
          description="The injury you started logging will be lost."
        />
        {toasts}
      </PageFrame>
    </LocalizationProvider>
  )
}

export default LogInjury
