import React from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, Button, Divider, Chip, Link } from '@mui/material';
import { RefreshOutlined, AttachFileOutlined, PersonOutlined, LocationOnOutlined } from '@mui/icons-material';

const EventDetailsDialog = ({ open, event, onClose, onEdit, athletes = [], staff = [] }) => {
  if (!event) return null;

  const { title, start, end, extendedProps, backgroundColor } = event;

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

  const startDate = formatDateTime(start);
  const startTime = formatTime(start);
  const endTime = formatTime(end);
  const timeRange = `${startTime} - ${endTime}`;

  const squadDisplay = typeof extendedProps?.squad === 'string' ? extendedProps.squad : extendedProps?.squad?.name;

  const resolveAthletes = () => {
    const list = extendedProps?.selectedAthletes || extendedProps?.attendeeIds || extendedProps?.attendees || [];
    if (!list || !list.length) return [];
    return list.map(item => {
      if (typeof item === 'number' || typeof item === 'string') {
        const found = athletes.find(a => String(a.id) === String(item));
        return found ? `${found.firstname} ${found.lastname}` : String(item);
      }
      if (item && (item.firstname || item.name)) {
        return `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.name;
      }
      return String(item);
    });
  };

  const resolveStaff = () => {
    const list = extendedProps?.selectedStaff || extendedProps?.staffIds || extendedProps?.staff || [];
    if (!list || !list.length) return [];
    return list.map(item => {
      if (typeof item === 'number' || typeof item === 'string') {
        const found = staff.find(s => String(s.id) === String(item));
        return found ? `${found.firstname} ${found.lastname}` : String(item);
      }
      if (item && (item.firstname || item.name)) {
        return `${item.firstname || ''} ${item.lastname || ''}`.trim() || item.name;
      }
      return String(item);
    });
  };

  const getAttachments = () => {
    const atts = extendedProps?.attachments || [];
    if (!atts || !atts.length) return [];
    return atts.map(a => {
      if (typeof a === 'string') return { name: a, url: a };
      if (a && a.name) return { name: a.name, url: a.url || a.path || a.href };
      return { name: String(a), url: undefined };
    });
  };

  const getCustomFields = () => {
    return extendedProps?.customFields || extendedProps?.custom_fields || extendedProps?.fields || null;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: 'var(--shadow-dialog)',
        }
      }}
    >
      <Box sx={{ px: 3, pt: 2, pb: 1, borderBottom: '1px solid var(--color-border-primary)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: backgroundColor || (extendedProps?.backgroundColor) || 'var(--color-primary)', 
                borderRadius: '2px' 
              }} 
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '16px' }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>
          {startDate}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
          {timeRange}
        </Typography>

        <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1, fontSize: '14px', fontWeight: 500 }}>
          {extendedProps?.eventType || 'Event'}
        </Typography>

        {squadDisplay && (
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 1, fontSize: '14px' }}>
            {squadDisplay}
          </Typography>
        )}

        {extendedProps?.location && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                width: '100%',
                height: 140,
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--color-border-primary)',
                mb: 1,
                position: 'relative',
                background: 'var(--color-secondary)',
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 19px, var(--color-border-primary) 20px),
                  repeating-linear-gradient(90deg, transparent, transparent 19px, var(--color-border-primary) 20px)
                `,
              }}
            >
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
                <LocationOnOutlined sx={{ fontSize: 32, color: 'var(--color-error)' }} />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', fontSize: '11px' }}>
                  {extendedProps.location}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              {extendedProps.location}
            </Typography>
          </Box>
        )}

        {extendedProps?.description && (
          <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2, fontSize: '14px' }}>
            {extendedProps.description}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Attendees */}
        {resolveAthletes().length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>Attendees</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {resolveAthletes().map((name, i) => (
                <Chip key={`a-${i}`} icon={<PersonOutlined />} label={name} size="small" />
              ))}
            </Box>
          </Box>
        )}

        {/* Staff */}
        {resolveStaff().length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>Staff</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {resolveStaff().map((name, i) => (
                <Chip key={`s-${i}`} icon={<PersonOutlined />} label={name} size="small" />
              ))}
            </Box>
          </Box>
        )}

        {/* Attachments */}
        {getAttachments().length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>Attachments</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {getAttachments().map((att, i) => (
                <Box key={`att-${i}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachFileOutlined sx={{ color: 'var(--color-text-secondary)', fontSize: 18 }} />
                  {att.url ? (
                    <Link href={att.url} target="_blank" rel="noreferrer" underline="hover">{att.name}</Link>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>{att.name}</Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Custom fields */}
        {getCustomFields() && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', mb: 1 }}>Custom fields</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(getCustomFields()).map(([key, val]) => (
                <Typography key={key} variant="body2" sx={{ color: 'var(--color-text-secondary)' }}><strong>{key}:</strong> {String(val)}</Typography>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, borderTop: '1px solid var(--color-border-primary)' }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'var(--color-text-primary)', 
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: 'var(--color-background-secondary)' 
            }
          }}
        >
          Close
        </Button>
        <Button 
          onClick={() => onEdit && onEdit(event)} 
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--color-primary)', 
            color: 'var(--color-white)',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: 'var(--color-primary-hover)' 
            }
          }}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsDialog;

