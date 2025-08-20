import React from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Box, Paper, Typography, Divider, Switch, Checkbox, FormControlLabel, Button as MuiButton, IconButton } from '@mui/material'
import { ArrowBackOutlined } from '@mui/icons-material'
import '../../styles/design-tokens.css'
import { Button, Icon, StatusChip } from '../../components'
import testToggleTemplate from '../../data/formTemplates/test-toggle-switch.json'
import MenuTree from '../../components/forms/builder/MenuTree'

function getTemplateForAnswerSet(answerSetId) {
  // Prototype mapping: use the test toggle template for all
  return testToggleTemplate
}

function buildStubAnswers(template) {
  // Build a stub answers object keyed by question id
  const answers = {}
  for (const section of template.sections || []) {
    for (const item of section.items || []) {
      if (item.type === 'subsection') {
        for (const q of item.items || []) {
          // Alternate true/false for demo
          answers[q.id] = Math.random() > 0.5
        }
      }
    }
  }
  return answers
}

export default function Screen04_FormAnswerSet() {
  const navigate = useNavigate()
  const { answerSetId } = useParams()
  const location = useLocation()

  const template = React.useMemo(() => getTemplateForAnswerSet(answerSetId), [answerSetId])
  const [isEditMode, setIsEditMode] = React.useState(false)
  const [answers, setAnswers] = React.useState(() => buildStubAnswers(template))

  // Flatten questions for navigation
  const allQuestions = React.useMemo(() => {
    const questions = []
    for (const section of template.sections || []) {
      for (const item of section.items || []) {
        if (item.type === 'subsection') {
          for (const subItem of item.items || []) {
            if (['boolean','checkbox','switch'].includes(subItem.type)) {
              questions.push(subItem)
            }
          }
        } else if (['boolean','checkbox','switch'].includes(item.type)) {
          questions.push(item)
        }
      }
    }
    return questions
  }, [template])

  const [selectedQuestionId, setSelectedQuestionId] = React.useState(allQuestions[0]?.id)
  React.useEffect(() => {
    if (!selectedQuestionId && allQuestions.length > 0) {
      setSelectedQuestionId(allQuestions[0].id)
    }
  }, [allQuestions, selectedQuestionId])

  const hasMountedRef = React.useRef(false)
  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (selectedQuestionId) {
      const el = document.getElementById(`answer-q-${selectedQuestionId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedQuestionId])

  const handleToggleAnswer = (questionId) => (event) => {
    const isChecked = event?.target?.checked ?? !answers[questionId]
    setAnswers(prev => ({ ...prev, [questionId]: isChecked }))
  }

  return (
    <Box sx={{ py: 2, bgcolor: 'var(--color-background-primary)', height: '100%' }}>
      <Paper elevation={0} sx={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Box sx={{ px: 3, height: 72, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="Back" size="small" onClick={() => navigate('/forms/form_answers_sets', { state: { initialTab: 'completed' } })} sx={{ color: 'var(--color-text-secondary)' }}>
            <ArrowBackOutlined fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
            {location.state?.athleteName || 'Athlete'}
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <MuiButton
              variant="contained"
              size="small"
              disableElevation
              onClick={() => setIsEditMode(v => !v)}
              sx={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-color)', textTransform: 'none', '&:hover': { backgroundColor: 'var(--button-primary-hover-bg)' } }}
            >
              {isEditMode ? 'Done' : 'Edit'}
            </MuiButton>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, height: 'calc(100vh - var(--layout-header-height) - 72px)' }}>
          <MenuTree
            form={template}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={(id) => setSelectedQuestionId(id)}
            mode="review"
            completionByQuestionId={React.useMemo(() => {
              const map = {}
              for (const q of allQuestions) { map[q.id] = Boolean(answers[q.id]) }
              return map
            }, [allQuestions, answers])}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ flex: '1 1 auto', overflowY: 'auto', px: 3, py: 2 }}>

            {(template.sections || []).map((section) => (
              <Box key={section.id} sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{section.title}</Typography>
                {(section.items || []).map((item) => (
                  <Box key={item.id} sx={{ pl: 2 }}>
                    {item.type === 'subsection' && (
                      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>{item.title}</Typography>
                    )}
                    {(item.items || []).map((q) => {
                      const answer = Boolean(answers[q.id])
                      const isSelected = selectedQuestionId === q.id
                      return (
                        <Box
                          key={q.id}
                          id={`answer-q-${q.id}`}
                          sx={{ py: 1, px: 1, borderRadius: 'var(--radius-sm)', backgroundColor: isSelected ? 'var(--color-background-secondary)' : 'transparent' }}
                        >
                          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>{q.description || q.label}</Typography>
                          {!isEditMode && (
                            <StatusChip status={answer ? 'Yes' : 'No'} type={answer ? 'success' : 'default'} />
                          )}
                          {isEditMode && (
                            <Box>
                              {q.ui?.style === 'checkbox' && (
                                <FormControlLabel control={<Checkbox checked={answer} onChange={handleToggleAnswer(q.id)} />} label={answer ? 'Yes' : 'No'} />
                              )}
                              {q.ui?.style === 'switch' && (
                                <FormControlLabel control={<Switch color="default" checked={answer} onChange={handleToggleAnswer(q.id)} />} label={answer ? 'Yes' : 'No'} />
                              )}
                              {q.ui?.style === 'toggle' && (
                                <Button size="small" variant={answer ? 'primary' : 'secondary'} onClick={handleToggleAnswer(q.id)}>
                                  {answer ? 'Yes' : 'No'}
                                </Button>
                              )}
                            </Box>
                          )}
                        </Box>
                      )
                    })}
                  </Box>
                ))}
              </Box>
            ))}
            </Box>

            {/* Bottom question paginator affixed to questions container */}
            <Box sx={{ borderTop: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-primary)', px: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1.5 }}>
                <Button
                  size="small"
                  variant="secondary"
                  disabled={!selectedQuestionId || allQuestions.findIndex(q => q.id === selectedQuestionId) <= 0}
                  onClick={() => {
                    const idx = allQuestions.findIndex(q => q.id === selectedQuestionId)
                    if (idx > 0) setSelectedQuestionId(allQuestions[idx - 1].id)
                  }}
                >
                  Previous
                </Button>
                <Button
                  size="small"
                  variant="primary"
                  disabled={!selectedQuestionId || allQuestions.findIndex(q => q.id === selectedQuestionId) >= allQuestions.length - 1}
                  onClick={() => {
                    const idx = allQuestions.findIndex(q => q.id === selectedQuestionId)
                    if (idx < allQuestions.length - 1) setSelectedQuestionId(allQuestions[idx + 1].id)
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}


