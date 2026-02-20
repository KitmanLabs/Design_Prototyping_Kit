import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from './Button';

/**
 * Stub Add Session drawer – same API as original (open, onClose, onSave, athletes, staff).
 * Creates a single calendar event and calls onSave.
 */
const AddSessionDrawer = ({ open, onClose, onSave, athletes = [], staff = [] }) => {
  const [title, setTitle] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [duration, setDuration] = useState(90);

  const handleSave = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      title: title || 'New session',
      start: startDateTime.toISOString(),
      end: new Date(startDateTime.getTime() + duration * 60000).toISOString(),
      backgroundColor: 'var(--color-chart-1)',
      borderColor: 'var(--color-chart-1)',
      textColor: '#ffffff',
      extendedProps: {
        eventType: 'TRAINING_SESSION',
        squad: 'First Team',
        location: '',
        coach: 'Coach',
      },
    };
    onSave(newSession);
    onClose();
    setTitle('');
    setStartDateTime(new Date());
    setDuration(90);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: '420px', maxWidth: '90vw' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background-primary)', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              New session
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="filled"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ '& .MuiInputBase-root': { backgroundColor: 'var(--color-background-secondary)' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="Start date and time"
                value={startDateTime}
                onChange={setStartDateTime}
                slotProps={{ textField: { fullWidth: true, variant: 'filled' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="filled"
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 90)}
                sx={{ '& .MuiInputBase-root': { backgroundColor: 'var(--color-background-secondary)' } }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default AddSessionDrawer;
