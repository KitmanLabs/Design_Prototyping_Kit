import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Button } from '../playbook-components';
import { RefreshOutlined } from '@mui/icons-material';
import { getEventTypeLabel, MOCK_SESSION_REPEAT_OPTIONS } from '../data/calendarEventOptions';

const secondaryText = { color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' };

const formatDateTime = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// "Daily", "Weekly" and so on, from the event's repeat setting; nothing for one-off events.
const getRecurrenceLabel = (repeats) => {
  if (!repeats || repeats === 'none') return null;
  return MOCK_SESSION_REPEAT_OPTIONS.find((option) => option.value === repeats)?.label || null;
};

const EventTooltip = ({
  event,
  position,
  onEdit,
  onDelete,
  onMoreDetails,
  onDuplicate
}) => {
  if (!event) return null;

  const { title, start, end, backgroundColor, extendedProps = {} } = event;
  const timeRange = `${formatTime(start)} - ${formatTime(end)}`;
  const recurrenceLabel = getRecurrenceLabel(extendedProps.repeats);
  const squadDisplay = typeof extendedProps.squad === 'string' ? extendedProps.squad : extendedProps.squad?.name;

  return (
    <Box
      className="event-tooltip"
      sx={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-dialog)',
        minWidth: '320px',
        maxWidth: '400px',
        padding: 2,
        fontFamily: 'var(--font-family-primary)',
        pointerEvents: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: '12px',
              height: '12px',
              flexShrink: 0,
              backgroundColor: backgroundColor || 'var(--color-primary)',
              borderRadius: '2px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-base)' }}>
            {title}
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" disableElevation={true} onClick={() => onDuplicate(event)}>
          Duplicate
        </Button>
      </Box>

      <Typography variant="body2" sx={{ ...secondaryText, mb: 1 }}>
        {formatDateTime(start)}
      </Typography>
      <Typography variant="body2" sx={{ ...secondaryText, mb: 2 }}>
        {timeRange}
      </Typography>

      <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1, fontWeight: 500 }}>
        {getEventTypeLabel(extendedProps)}
      </Typography>

      {squadDisplay && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
          {squadDisplay}
        </Typography>
      )}

      {recurrenceLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <RefreshOutlined sx={{ fontSize: '16px', color: 'var(--color-text-secondary)', transform: 'rotate(45deg)' }} />
          <Typography variant="body2" sx={secondaryText}>
            {recurrenceLabel}
          </Typography>
        </Box>
      )}

      {extendedProps.description && (
        <Typography variant="body2" sx={{ ...secondaryText, mb: 2 }}>
          {extendedProps.description}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Button variant="contained" color="secondary" disableElevation={true} onClick={() => onDelete(event)}>
          Delete
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" color="secondary" disableElevation={true} onClick={() => onEdit(event)}>
            Edit
          </Button>
          <Button variant="contained" color="primary" disableElevation={true} onClick={() => onMoreDetails(event)}>
            More details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EventTooltip;
