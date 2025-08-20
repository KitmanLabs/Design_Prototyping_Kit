import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material'
import { EditOutlined, DeleteOutlined } from '@mui/icons-material'

export default function QuestionEditor({ question, index, onChange }) {
  if (!question) return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        Select a question from the menu.
      </Typography>
    </Box>
  )

  const handleUpdate = (patch) => {
    const updated = { ...question, ...patch }
    onChange?.(updated)
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: 'var(--radius-md)', px: 3, pt: 2, pb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Question {index}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button 
            variant="contained" 
            size="medium" 
            sx={{ 
              textTransform: 'none', 
              backgroundColor: 'var(--button-secondary-bg)', 
              color: 'var(--button-secondary-color)', 
              boxShadow: 'none',
              '&:hover': { backgroundColor: 'var(--button-secondary-hover-bg)', boxShadow: 'none' }
            }}
          >
            Add follow up question
          </Button>
          <FormControlLabel
            label="Mandatory"
            labelPlacement="start"
            control={<Switch color="default" checked={Boolean(question.mandatory)} onChange={(e) => handleUpdate({ mandatory: e.target.checked })} />}
          />
          <IconButton aria-label="delete" color="default"><DeleteOutlined /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item>
          <Box sx={{ minWidth: 240 }}>
            <FormControl fullWidth size="small" variant="filled">
              <InputLabel id="qs-label">Question style</InputLabel>
              <Select
                labelId="qs-label"
                value={question.type === 'boolean' ? 'Forms::Elements::Inputs::Boolean' : 'Forms::Elements::Inputs::Boolean'}
                onChange={() => {}}
              >
                <MenuItem value="Forms::Elements::Inputs::Boolean">Yes/No</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ minWidth: 320 }}>
            <TextField
              size="small"
              variant="filled"
              fullWidth
              label="Question"
              value={''}
              onChange={() => {}}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} direction="column" sx={{ mt: 0.5 }}>
        <Grid item>
          <TextField
            size="small"
            variant="filled"
            fullWidth
            label="Description"
            value={question.description || ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </Grid>
        <Grid item>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl fullWidth sx={{ maxWidth: 220 }} size="small" variant="filled">
              <InputLabel id="style-label">Style</InputLabel>
              <Select
                labelId="style-label"
                value={question.ui?.style || 'toggle'}
                label="Style"
                onChange={(e) => handleUpdate({ ui: { ...(question.ui || {}), style: e.target.value } })}
              >
                <MenuItem value="toggle">Toggle</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="switch">Switch</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              variant="filled"
              disabled
              label="Option 1"
              value={question.ui?.labels?.[0] || 'Yes'}
              sx={{ maxWidth: 220 }}
            />
            <TextField
              size="small"
              variant="filled"
              disabled
              label="Option 2"
              value={question.ui?.labels?.[1] || 'No'}
              sx={{ maxWidth: 220 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}


