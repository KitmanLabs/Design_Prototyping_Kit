import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';

const EventTooltip = ({
  event,
  position,
  onClose,
  onEdit,
  onDelete,
  onMoreDetails,
  onDuplicate
}) => {
  if (!event) return null;

  const { title, start, end, extendedProps } = event;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-GB', options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeDisplay = (eventType) => {
    switch (eventType) {
      case 'TRAINING_SESSION':
        return 'Training Session';
      case 'TEST_SESSION':
        return 'Test Session';
      case 'RECURRING_EVENT':
        return 'Recurring Event';
      case 'SERIES_EVENT':
        return 'Series Event';
      default:
        return eventType || 'Event';
    }
  };

  const getRecurrenceInfo = (event) => {
    if (extendedProps?.eventType === 'RECURRING_EVENT') {
      return 'Every Tuesday';
    }
    return null;
  };

  const startDate = formatDateTime(start);
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  const timeRange = `${startTime} - ${endTime}`;
  const recurrenceInfo = getRecurrenceInfo(event);
  const squadDisplay = typeof extendedProps?.squad === 'string' ? extendedProps.squad : extendedProps?.squad?.name;

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
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '320px',
        maxWidth: '400px',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
        pointerEvents: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: '12px',
              height: '12px',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              backgroundColor: '#8B4513',
              borderRadius: '2px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '16px' }}>
            {title}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onDuplicate}
          sx={{
            // eslint-disable-next-line design-system/no-hardcoded-colors
            color: '#666',
            fontSize: '12px',
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 8px',
            // eslint-disable-next-line design-system/no-hardcoded-colors
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Duplicate
        </Button>
      </Box>

      <Typography variant="body2" sx={{ /* eslint-disable-line design-system/no-hardcoded-colors */ color: '#666', mb: 1, fontSize: '14px' }}>
        {startDate}
      </Typography>
      <Typography variant="body2" sx={{ /* eslint-disable-line design-system/no-hardcoded-colors */ color: '#666', mb: 2, fontSize: '14px' }}>
        {timeRange}
      </Typography>

      <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1, fontSize: '14px', fontWeight: 500 }}>
        {getEventTypeDisplay(extendedProps?.eventType)}
      </Typography>

      {squadDisplay && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1, fontSize: '14px' }}>
          {squadDisplay}
        </Typography>
      )}

      {recurrenceInfo && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <RefreshOutlined
            sx={{
              fontSize: '16px',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              color: '#666',
              transform: 'rotate(45deg)'
            }}
          />
          <Typography variant="body2" sx={{ /* eslint-disable-line design-system/no-hardcoded-colors */ color: '#666', fontSize: '14px' }}>
            {recurrenceInfo}
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{ /* eslint-disable-line design-system/no-hardcoded-colors */ color: '#666', mb: 2, fontSize: '14px' }}>
        Event description.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => onDelete(event)}
          sx={{
            // eslint-disable-next-line design-system/no-hardcoded-colors
            color: '#d32f2f',
            fontSize: '12px',
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 8px',
            // eslint-disable-next-line design-system/no-hardcoded-colors
            '&:hover': { backgroundColor: '#ffebee' }
          }}
        >
          Delete
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={() => onEdit(event)}
            sx={{
              color: 'var(--color-text-primary)',
              fontSize: '12px',
              textTransform: 'none',
              minWidth: 'auto',
              padding: '4px 8px',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={() => onMoreDetails(event)}
            variant="contained"
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              fontSize: '12px',
              textTransform: 'none',
              minWidth: 'auto',
              padding: '4px 12px',
              // eslint-disable-next-line design-system/no-hardcoded-colors
              '&:hover': { backgroundColor: '#2D3A4A' }
            }}
          >
            More details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EventTooltip;
