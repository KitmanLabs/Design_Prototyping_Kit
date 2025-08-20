import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button as MuiButton,
  Divider,
  Tabs,
  Tab,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import '../../styles/design-tokens.css'
import FormBuilderHeader from '../../components/forms/builder/FormBuilderHeader'
import MenuTree from '../../components/forms/builder/MenuTree'
import QuestionEditor from '../../components/forms/builder/QuestionEditor'
// Use MUI Button for this page

// Prototype data (schema-driven). In a real app this would be fetched by formId.
import formTemplate from '../../data/formTemplates/test-toggle-switch.json'

function a11yProps(index) {
  return {
    id: `form-builder-tab-${index}`,
    'aria-controls': `form-builder-tabpanel-${index}`
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`form-builder-tabpanel-${index}`}
      aria-labelledby={`form-builder-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  )
}

export default function Screen02_FormBuilder() {
  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const { formId } = useParams()

  // For prototype, always use the example template
  const [form, setForm] = React.useState(formTemplate)
  const [tabValue, setTabValue] = React.useState(0)

  // Prototype: local settings state for Settings tab toggles
  const [settings, setSettings] = React.useState({
    canEditSubmitted: false,
    canSaveDraft: false,
    savePdfAfterSubmission: false,
    allowAthleteApp: true,
    allowKioskApp: true,
    allowAthleteWeb: true,
  })

  const handleToggleSetting = (key) => (event) => {
    const isChecked = event.target.checked
    setSettings((prev) => ({ ...prev, [key]: isChecked }))
  }

  // Design-system compliant Switch styling
  const switchSx = {
    '& .MuiSwitch-track': {
      backgroundColor: 'var(--color-border-primary)',
      opacity: 1,
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: 'var(--color-text-disabled)'
    },
    // Checked state — brand primary track, white thumb
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: 'var(--color-white)'
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--color-primary)',
      opacity: 1,
    },
    '& .MuiSwitch-switchBase:hover': {
      backgroundColor: 'transparent'
    }
  }

  // Flatten questions for simple selection
  const allQuestions = React.useMemo(() => {
    const questions = []
    for (const section of form.sections || []) {
      for (const item of section.items || []) {
        if (item.type === 'subsection') {
          for (const subItem of item.items || []) {
            if (subItem.type === 'boolean' || subItem.type === 'checkbox' || subItem.type === 'switch') {
              questions.push(subItem)
            }
          }
        } else if (item.type === 'boolean' || item.type === 'checkbox' || item.type === 'switch') {
          questions.push(item)
        }
      }
    }
    return questions
  }, [form])

  const [selectedQuestionId, setSelectedQuestionId] = React.useState(allQuestions[0]?.id)
  React.useEffect(() => {
    if (!selectedQuestionId && allQuestions.length > 0) {
      setSelectedQuestionId(allQuestions[0].id)
    }
  }, [allQuestions, selectedQuestionId])

  const selectedQuestion = React.useMemo(
    () => allQuestions.find(q => q.id === selectedQuestionId) || null,
    [allQuestions, selectedQuestionId]
  )

  const isDirty = false // Prototype: Save disabled for now

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Back link-style button above the title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, px: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate('/questionnaires')}
          aria-label="Back to forms overview"
          sx={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 0,
            '&:hover': { color: 'var(--color-text-primary)', textDecoration: 'underline' }
          }}
        >
          <ArrowBackOutlined fontSize="small" />
          <span>Forms overview</span>
        </Box>
      </Box>

      {/* Title row with Save aligned to far right */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {form.title}
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <MuiButton
            variant="contained"
            size="medium"
            disableElevation
            disabled={!isDirty}
            sx={{
              backgroundColor: 'var(--button-primary-bg)',
              color: 'var(--button-primary-color)',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'var(--button-primary-hover-bg)' }
            }}
          >
            Save
          </MuiButton>
        </Box>
      </Box>

      <Box sx={{ px: 3 }}>
        <FormBuilderHeader
          productArea={form.productArea}
          category={form.category}
          createdAt={form.createdAt}
          creator={form.creator}
          description={form.description}
        />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          aria-label="Form builder tabs"
          textColor="inherit"
          sx={{
            px: 3,
            pt: 1,
            '& .MuiTab-root': { color: 'var(--color-text-secondary)', textTransform: 'none', fontWeight: 600 },
            '& .MuiTab-root.Mui-selected': { color: 'var(--color-text-primary)' },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-primary)' }
          }}
        >
          <Tab label="Build" {...a11yProps(0)} />
          <Tab label="Preview" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
        <Divider />

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, minHeight: 'calc(100vh - var(--layout-header-height) - 120px)' }}>
            <MenuTree
              form={form}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
            />

            <QuestionEditor
              question={selectedQuestion}
              index={Math.max(0, allQuestions.findIndex(q => q.id === selectedQuestionId)) + 1}
              onChange={(updated) => {
                // Prototype: update in place minimally
                setForm((prev) => {
                  const clone = JSON.parse(JSON.stringify(prev))
                  for (const section of clone.sections) {
                    for (const item of section.items) {
                      if (item.type === 'subsection') {
                        const i = (item.items || []).findIndex(q => q.id === updated.id)
                        if (i >= 0) { item.items[i] = updated; return clone }
                      } else if (item.id === updated.id) {
                        // not used in this template
                        return clone
                      }
                    }
                  }
                  return clone
                })
              }}
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, minHeight: 'calc(100vh - var(--layout-header-height) - 120px)' }}>
            <MenuTree
              form={form}
              selectedQuestionId={selectedQuestionId}
              onSelectQuestion={setSelectedQuestionId}
            />

            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 600 }}>
                Preview
              </Typography>
              {(form.sections || []).map((section) => (
                <Box key={section.id} sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{section.title}</Typography>
                  {(section.items || []).map((item) => (
                    <Box key={item.id} sx={{ pl: 2 }}>
                      {item.type === 'subsection' && (
                        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>{item.title}</Typography>
                      )}
                      {(item.items || []).map((q) => (
                        <Box key={q.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                          <Typography sx={{ minWidth: 280 }}>{q.description}</Typography>
                          <Box>
                            {q.ui?.style === 'checkbox' && (
                              <input type="checkbox" />
                            )}
                            {q.ui?.style === 'switch' && (
                              <input type="checkbox" />
                            )}
                            {q.ui?.style === 'toggle' && (
                              <MuiButton variant="contained" size="small" sx={{ mr: 1 }}>Yes</MuiButton>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {/* Actions card */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ borderRadius: 'var(--radius-md)' }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
                      Actions
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.canEditSubmitted}
                              onChange={handleToggleSetting('canEditSubmitted')}
                            />
                          }
                          label="Athletes can edit submitted forms"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.canSaveDraft}
                              onChange={handleToggleSetting('canSaveDraft')}
                            />
                          }
                          label="Athletes can save a draft"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.savePdfAfterSubmission}
                              onChange={handleToggleSetting('savePdfAfterSubmission')}
                            />
                          }
                          label="Save form as a PDF after submission"
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                </Paper>
              </Grid>

              {/* Input method card */}
              <Grid item xs={12} sm={6}>
                <Paper elevation={1} sx={{ borderRadius: 'var(--radius-md)' }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
                      Input method for athletes to submit answer sets
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.allowAthleteApp}
                              onChange={handleToggleSetting('allowAthleteApp')}
                            />
                          }
                          label="Athlete app"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.allowKioskApp}
                              onChange={handleToggleSetting('allowKioskApp')}
                            />
                          }
                          label="Kiosk app"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              sx={switchSx}
                              checked={settings.allowAthleteWeb}
                              onChange={handleToggleSetting('allowAthleteWeb')}
                            />
                          }
                          label="Athlete Web"
                        />
                      </FormGroup>
                    </FormControl>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  )
}


