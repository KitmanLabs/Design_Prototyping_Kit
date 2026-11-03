import { Box, Chip, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { AttachFileOutlined } from '@mui/icons-material';
import { Button } from '../../playbook-components';
import { formFieldStyles } from '../formFieldStyles';
import {
  MOCK_SURFACE_TYPES,
  MOCK_SURFACE_QUALITY,
  MOCK_WEATHER,
  MOCK_REMINDER_EMAIL,
  MOCK_REMINDER_PUSH,
} from '../../data/calendarEventOptions';

// Form sections shared by the calendar event drawers (AddGameDrawer, AddSessionDrawer).
// Each takes the drawer's formData and its handleInputChange(field, value).

/** Surface type, surface quality, weather and temperature: four half-width Grid items. */
export const EventConditionsFields = ({ formData, onInputChange }) => (
  <>
      <Grid item xs={6}>
        <FormControl fullWidth variant="filled" sx={formFieldStyles}>
          <InputLabel shrink>Surface type</InputLabel>
          <Select
            value={formData.surfaceType}
            onChange={(e) =>
              onInputChange('surfaceType', e.target.value)
            }
            label="Surface type"
            displayEmpty
            renderValue={(v) => v || ''}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {MOCK_SURFACE_TYPES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="filled" sx={formFieldStyles}>
          <InputLabel shrink>Surface quality</InputLabel>
          <Select
            value={formData.surfaceQuality}
            onChange={(e) =>
              onInputChange('surfaceQuality', e.target.value)
            }
            label="Surface quality"
            displayEmpty
            renderValue={(v) => v || ''}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {MOCK_SURFACE_QUALITY.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="filled" sx={formFieldStyles}>
          <InputLabel shrink>Weather</InputLabel>
          <Select
            value={formData.weather}
            onChange={(e) =>
              onInputChange('weather', e.target.value)
            }
            label="Weather"
            displayEmpty
            renderValue={(v) => v || ''}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>
            {MOCK_WEATHER.map((w) => (
              <MenuItem key={w} value={w}>
                {w}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          variant="filled"
          label="Temperature"
          value={formData.temperature}
          onChange={(e) =>
            onInputChange('temperature', e.target.value)
          }
          placeholder="—"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">°C</InputAdornment>
            ),
          }}
          sx={formFieldStyles}
        />
      </Grid>
  </>
);

/** Reminders section (email, push, reminder type). */
export const EventRemindersSection = ({ formData, onInputChange, reminderTypes }) => (
  <>
      {/* Reminders */}
      <Grid item xs={12}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            pt: 1,
            borderTop: '1px solid var(--color-border-primary)',
          }}
        >
          Reminders
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" sx={formFieldStyles}>
              <InputLabel shrink>Email</InputLabel>
              <Select
                value={formData.reminderEmail}
                onChange={(e) =>
                  onInputChange('reminderEmail', e.target.value)
                }
                label="Email"
                displayEmpty
                renderValue={(v) => v || ''}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {MOCK_REMINDER_EMAIL.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="filled" sx={formFieldStyles}>
              <InputLabel shrink>Push</InputLabel>
              <Select
                value={formData.reminderPush}
                onChange={(e) =>
                  onInputChange('reminderPush', e.target.value)
                }
                label="Push"
                displayEmpty
                renderValue={(v) => v || ''}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {MOCK_REMINDER_PUSH.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="filled" sx={formFieldStyles}>
              <InputLabel shrink>Reminder</InputLabel>
              <Select
                value={formData.reminderType}
                onChange={(e) =>
                  onInputChange('reminderType', e.target.value)
                }
                label="Reminder"
                displayEmpty
                renderValue={(v) => v || ''}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {reminderTypes.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
  </>
);

/** File upload drop zone, attached file chips, and the title/link/add row. */
export const EventAttachmentsFields = ({
  inputId,
  formData,
  onInputChange,
  onFileUpload,
  onRemoveAttachment,
  onAddLink,
}) => (
  <>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          textAlign: 'center',
          border: '2px dashed var(--color-border-primary)',
          backgroundColor: 'var(--color-background-secondary)',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'var(--color-background-tertiary)' },
        }}
        onClick={() => document.getElementById(inputId).click()}
      >
        <AttachFileOutlined
          sx={{ fontSize: 32, color: 'var(--color-text-muted)', mb: 1 }}
        />
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          Drag & Drop your files or browse
        </Typography>
      </Paper>
      <input
        id={inputId}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={onFileUpload}
      />
      {formData.attachments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {formData.attachments.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              onDelete={() => onRemoveAttachment(index)}
              sx={{
                mr: 1,
                mb: 1,
                backgroundColor: 'var(--color-background-selected)',
                color: 'var(--color-text-primary)',
                '& .MuiChip-deleteIcon': {
                  color: 'var(--color-text-secondary)',
                },
              }}
            />
          ))}
        </Box>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            variant="filled"
            label="Title"
            value={formData.attachTitle}
            onChange={(e) =>
              onInputChange('attachTitle', e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            sx={formFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            variant="filled"
            label="Link"
            value={formData.attachLink}
            onChange={(e) =>
              onInputChange('attachLink', e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            sx={formFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'flex-end', pb: 0.5 }}>
          <Button size="small" disableElevation={true} variant="contained" color="primary" onClick={onAddLink} style={{ width: '100%' }}>
            Add
          </Button>
        </Grid>
      </Grid>
  </>
);
