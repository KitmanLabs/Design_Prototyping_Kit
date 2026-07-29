import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Chip,
  Switch,
  FormHelperText,
} from '@mui/material'
import {
  ArrowBackOutlined,
  ChevronRightOutlined,
  DragIndicator,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material'
import '../../styles/design-tokens.css'
import BodyMapClassicModesV3 from './BodyMapClassicModesV3'

const SYMPTOM_OPTIONS = ['Pain', 'Stiffness', 'Soreness']

function BuilderConfig({ config, onChange }) {
  const { bodyDisplay, symptomTypes, allowComment, customQuestion } = config

  const toggleSymptomType = (type) => {
    const next = symptomTypes.includes(type)
      ? symptomTypes.filter((t) => t !== type)
      : [...symptomTypes, type]
    if (next.length > 0) onChange({ ...config, symptomTypes: next })
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, color: 'var(--color-text-primary)' }}>
        Question configuration
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Question style */}
        <FormControl size="small" variant="filled" sx={{ maxWidth: 280 }}>
          <InputLabel>Question style</InputLabel>
          <Select defaultValue="body_part_map">
            <MenuItem value="attachment">Attachment</MenuItem>
            <MenuItem value="yes_no">Yes/No</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="multiple_choice">Multiple choice</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="scale_range">Scale range</MenuItem>
            <MenuItem value="single_choice">Single choice</MenuItem>
            <MenuItem value="text_input">Text input</MenuItem>
            <MenuItem value="body_part_map">Body part map</MenuItem>
          </Select>
        </FormControl>

        {/* Default player-facing copy — display only */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
            Default player-facing text
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
            Select any area on the body and indicate the severity.
          </Typography>
        </Box>

        {/* Optional custom question — light grey field, no border, placeholder only */}
        <TextField
          size="small"
          variant="filled"
          fullWidth
          placeholder="Add your own question"
          value={customQuestion}
          onChange={(e) => onChange({ ...config, customQuestion: e.target.value })}
          InputProps={{ disableUnderline: true }}
        />

        {/* Body display — two options */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 0.5, display: 'block' }}>
            Body display
          </Typography>
          <RadioGroup value={bodyDisplay} onChange={(e) => onChange({ ...config, bodyDisplay: e.target.value })}>
            <FormControlLabel value="male" control={<Radio size="small" />} label="Male only" />
            <FormControlLabel value="female" control={<Radio size="small" />} label="Female only" />
            <FormControlLabel value="male_female" control={<Radio size="small" />} label="Male or female" />
          </RadioGroup>
        </Box>

        {/* Symptom types — chips */}
        <Box>
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mb: 1, display: 'block' }}>
            Symptom types
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SYMPTOM_OPTIONS.map((type) => {
              const selected = symptomTypes.includes(type)
              const isLastSelected = selected && symptomTypes.length === 1
              return (
                <Chip
                  key={type}
                  label={type}
                  size="small"
                  onClick={() => toggleSymptomType(type)}
                  variant={selected ? 'filled' : 'outlined'}
                  onDelete={
                    selected
                      ? () => {
                          if (symptomTypes.length > 1) toggleSymptomType(type)
                        }
                      : undefined
                  }
                  sx={{
                    cursor: 'pointer',
                    ...(selected
                      ? {
                          backgroundColor: 'var(--color-primary)',
                          color: '#fff',
                          '&:hover': { backgroundColor: 'var(--color-primary-hover)' },
                          '& .MuiChip-deleteIcon': {
                            color: isLastSelected ? 'var(--color-text-disabled)' : '#fff',
                            cursor: isLastSelected ? 'default' : 'pointer',
                            '&:hover': { color: isLastSelected ? 'var(--color-text-disabled)' : '#fff' },
                          },
                        }
                      : {
                          borderColor: 'var(--color-border-primary)',
                          color: 'var(--color-text-secondary)',
                          '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
                        }),
                  }}
                />
              )
            })}
          </Box>
          <FormHelperText sx={{ mt: 1, mx: 0, color: 'warning.main' }}>
            At least one symptom type must always be selected.
          </FormHelperText>
        </Box>

        {/* Allow comment toggle */}
        <FormControlLabel
          label={
            <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              Allow user to add a comment
            </Typography>
          }
          control={
            <Switch
              checked={allowComment}
              onChange={(e) => onChange({ ...config, allowComment: e.target.checked })}
              size="small"
            />
          }
          sx={{ m: 0 }}
        />
      </Box>
    </Paper>
  )
}

function a11yProps(index) {
  return { id: `bm-cm-tab-${index}`, 'aria-controls': `bm-cm-tabpanel-${index}` }
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`bm-cm-tabpanel-${index}`} aria-labelledby={`bm-cm-tab-${index}`}>
      {value === index && children}
    </div>
  )
}

const NAV_BTN_SX = {
  borderColor: 'var(--color-border-primary)',
  color: 'var(--color-primary)',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': { borderColor: 'var(--color-border-focus)', backgroundColor: 'var(--color-primary-light)' },
}

const META = [
  { label: 'Product Area', value: 'Medical' },
  { label: 'Category', value: 'Other' },
  { label: 'Created', value: '—' },
  { label: 'Creator', value: '—' },
  { label: 'Description', value: 'test' },
]

export default function BodyMapClassicModesBuilderV4() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(1) // Preview (body map) active by default
  const [config, setConfig] = useState({
    customQuestion: '',
    bodyDisplay: 'male',
    symptomTypes: ['Pain', 'Stiffness', 'Soreness'],
    allowComment: false,
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Top navigation breadcrumb bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid var(--color-border-primary)',
          backgroundColor: 'var(--color-background-primary)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-primary)', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/forms')}
          >
            Forms
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-secondary)' }}>
            <Box component="span" sx={{ mx: 0.5 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a3 3 0 100-6 3 3 0 000 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </Box>
            Player list
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>&gt; &gt;</Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>Active Roster</Typography>
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>▼</Typography>
          <Avatar sx={{ width: 32, height: 32, ml: 1 }} src="" />
        </Box>
      </Box>

      {/* Back link + Create */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, px: 3 }}>
        <Box
          component="button"
          type="button"
          onClick={() => navigate('/forms')}
          sx={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 0,
            fontSize: '14px',
            '&:hover': { color: 'var(--color-text-primary)', textDecoration: 'underline' },
          }}
        >
          <ArrowBackOutlined fontSize="small" />
          <span>Forms Overview</span>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            size="medium"
            disableElevation
            sx={{
              backgroundColor: 'var(--button-primary-bg)',
              color: 'var(--button-primary-color)',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'var(--button-primary-hover-bg)' },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {/* Form name + metadata */}
      <Box sx={{ px: 3, mt: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', mb: 1.5 }}>
          test
        </Typography>
        <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {META.map((m) => (
            <Box key={m.label}>
              <Typography variant="caption" sx={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                {m.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                {m.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ mt: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          aria-label="Body map builder tabs"
          textColor="inherit"
          sx={{
            px: 3,
            '& .MuiTab-root': { color: 'var(--color-text-secondary)', textTransform: 'none', fontWeight: 600 },
            '& .MuiTab-root.Mui-selected': { color: 'var(--color-black)' },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--color-black)' },
          }}
        >
          <Tab label="Build" {...a11yProps(0)} />
          <Tab label="Preview" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
          <Tab label="Summary View" {...a11yProps(3)} />
        </Tabs>
        <Divider />
      </Box>

      {/* Content: sidebar + main */}
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 320px)' }}>
        {/* Left sidebar — section / subsection nav */}
        <Box sx={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-background-primary)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 1, borderBottom: '1px solid var(--color-border-secondary)' }}>
            <ChevronRightOutlined sx={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
          </Box>
          {/* Section 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, backgroundColor: 'var(--color-background-secondary)' }}>
            <DragIndicator sx={{ color: 'var(--color-text-disabled)', fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '13px' }}>
              Section 1
            </Typography>
            <ChevronRightOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: 18, transform: 'rotate(90deg)' }} />
          </Box>
          {/* Sub-section 1.1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 4, pr: 2, py: 1.25, backgroundColor: 'var(--color-background-secondary)', borderBottom: '1px solid var(--color-border-secondary)' }}>
            <Typography variant="body2" sx={{ flex: 1, color: 'var(--color-text-secondary)', fontSize: '12px' }}>
              Sub-section 1.1
            </Typography>
            <ChevronRightOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: 16 }} />
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1 }}>
            {/* Build tab — question configuration panel */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 4, maxWidth: 640 }}>
                <BuilderConfig config={config} onChange={setConfig} />
              </Box>
            </TabPanel>

            {/* Preview tab — the existing body map, rendered unchanged */}
            <TabPanel value={tabValue} index={1}>
              <BodyMapClassicModesV3 questionTitle={config.customQuestion} />
            </TabPanel>

            {/* Settings tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 4 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>Settings</Typography>
              </Box>
            </TabPanel>

            {/* Summary View tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ p: 4 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>Summary View</Typography>
              </Box>
            </TabPanel>
          </Box>

          {/* Back / Next */}
          <Box sx={{ display: 'flex', gap: 1, px: 4, py: 2, borderTop: '1px solid var(--color-border-primary)' }}>
            <Button variant="outlined" size="medium" startIcon={<KeyboardArrowLeft />} sx={NAV_BTN_SX}>
              Back
            </Button>
            <Button variant="outlined" size="medium" endIcon={<KeyboardArrowRight />} sx={NAV_BTN_SX}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
