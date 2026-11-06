import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  MobileStepper,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '../playbook-components'

/**
 * A Guided flow's content: a step rail on the left and the current step on the right.
 * Below the md breakpoint the rail becomes a compact "Step 2 of 5" bar.
 *
 * steps: [{ id, label }]. Completed steps can be revisited through onStepClick; steps
 * ahead of the furthest one reached can't. The last step is always Review.
 * Put Cancel, Save draft, Back and Next in a FloorplanFooter on the PageFrame.
 */
function GuidedFlowLayout({ steps, activeStep, furthestStep = activeStep, onStepClick, children }) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('md'))
  const current = steps[activeStep]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '240px minmax(0, 720px)' },
        alignItems: 'start',
      }}
    >
      {isWide ? (
        <Box component="nav" aria-label="Steps">
          <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
            {steps.map((step, index) => (
              <Step key={step.id} completed={index < activeStep}>
                {onStepClick && index <= furthestStep ? (
                  <StepButton onClick={() => onStepClick(index)}>{step.label}</StepButton>
                ) : (
                  <StepLabel>{step.label}</StepLabel>
                )}
              </Step>
            ))}
          </Stepper>
        </Box>
      ) : (
        <MobileStepper
          variant="progress"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          backButton={null}
          nextButton={
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', ml: 2 }}>
              Step {activeStep + 1} of {steps.length}
            </Typography>
          }
          sx={{ bgcolor: 'transparent', px: 0, '& .MuiMobileStepper-progress': { flex: 1 } }}
        />
      )}

      <Paper
        component="section"
        aria-label={current?.label}
        elevation={0}
        sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 3 }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {current?.label}
        </Typography>
        {children}
      </Paper>
    </Box>
  )
}

export default GuidedFlowLayout
