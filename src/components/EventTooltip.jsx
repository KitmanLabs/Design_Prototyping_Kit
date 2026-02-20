import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Refresh } from '@mui/icons-material';

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
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
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
              backgroundColor: '#8B4513',
              borderRadius: '2px',
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontSize: '16px' }}>
            {title}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onDuplicate}
          sx={{
            color: '#666',
            fontSize: '12px',
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 8px',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          Duplicate
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: '#666', mb: 1, fontSize: '14px' }}>
        {startDate}
      </Typography>
      <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '14px' }}>
        {timeRange}
      </Typography>

      <Typography variant="body2" sx={{ color: '#333', mb: 1, fontSize: '14px', fontWeight: 500 }}>
        {getEventTypeDisplay(extendedProps?.eventType)}
      </Typography>

      {squadDisplay && (
        <Typography variant="body2" sx={{ color: '#333', mb: 1, fontSize: '14px' }}>
          {squadDisplay}
        </Typography>
      )}

      {recurrenceInfo && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Refresh
            sx={{
              fontSize: '16px',
              color: '#666',
              transform: 'rotate(45deg)'
            }}
          />
          <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
            {recurrenceInfo}
          </Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{ color: '#666', mb: 2, fontSize: '14px' }}>
        Event description.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => onDelete(event)}
          sx={{
            color: '#d32f2f',
            fontSize: '12px',
            textTransform: 'none',
            minWidth: 'auto',
            padding: '4px 8px',
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
              color: '#333',
              fontSize: '12px',
              textTransform: 'none',
              minWidth: 'auto',
              padding: '4px 8px',
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
              backgroundColor: '#1976d2',
              color: '#ffffff',
              fontSize: '12px',
              textTransform: 'none',
              minWidth: 'auto',
              padding: '4px 12px',
              '&:hover': { backgroundColor: '#1565c0' }
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
