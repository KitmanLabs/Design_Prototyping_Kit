import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';
import { RefreshOutlined, ContentCopyOutlined, CheckOutlined } from '@mui/icons-material';

const CopyCalendarUrl = ({ 
  open = false, 
  onClose = () => {}, 
  calendarUrl: propUrl = 'https://calendar.com/calendar/ical/dcarroll%40kitmanlabs.com/public/' 
}) => {
  const [url, setUrl] = useState(propUrl || '');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setUrl(propUrl || '');
  }, [propUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore
    }
  };

  const handleRefresh = () => {
    // Placeholder: in a real app this might request a new public URL from the server.
    setRefreshing(true);
    setTimeout(() => {
      // Toggle a tiny change to simulate refresh (no-op if same)
      setUrl((u) => u);
      setRefreshing(false);
    }, 600);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Copy this link to connect your calendar</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 1,
            padding: 1,
          }}
        >
          <TextField
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            size="small"
            InputProps={{ readOnly: false }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'transparent',
              },
            }}
          />

          <Tooltip title={refreshing ? 'Refreshing...' : 'Refresh'}>
            <span>
              <IconButton onClick={handleRefresh} size="small" disabled={refreshing}>
                <RefreshOutlined />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={copied ? 'Copied' : 'Copy'}>
            <span>
              <IconButton onClick={handleCopy} size="small">
                {copied ? <CheckOutlined sx={{ color: 'var(--color-success)' }} /> : <ContentCopyOutlined />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', mt: 1 }}>
          Use this link to subscribe to the calendar in other apps. Keep it private if the calendar is not public.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CopyCalendarUrl.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  calendarUrl: PropTypes.string,
};

export default CopyCalendarUrl;
