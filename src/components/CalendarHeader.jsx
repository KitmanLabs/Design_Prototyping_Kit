import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge, Popover, Menu, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from 'playbook-components';
import { ArrowDropDown, ChevronLeft, ChevronRight, FilterAltOutlined, Settings } from '@mui/icons-material';
import Button from './Button';
import CopyCalendarUrl from './CopyCalendarUrl';

const CalendarHeader = ({
  currentView,
  onViewChange,
  onAddEvent,
  onAddSession,
  onAddGame,
  onToggleFilters,
  showFilters,
  onNavigate,
  currentDate,
  onDateChange,
  activeFilterCount = 0
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate || new Date('2025-09-01'));
  const [datePickerAnchor, setDatePickerAnchor] = useState(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [copyUrlOpen, setCopyUrlOpen] = useState(false);

  const VIEW_LABELS = {
    dayGridMonth: 'Month',
    timeGridDay: 'Day',
    timeGridWeek: 'Week',
    listWeek: 'List',
  };
  const viewLabel = VIEW_LABELS[currentView] || 'Month';

  useEffect(() => {
    if (currentDate) {
      setSelectedDate(currentDate);
    }
  }, [currentDate]);

  const handleDateClick = (event) => {
    setDatePickerAnchor(event.currentTarget);
  };

  const handleDatePickerClose = () => {
    setDatePickerAnchor(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleDateAccept = (newDate) => {
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
    handleDatePickerClose();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleAddMenuClick = (event) => {
    setAddMenuAnchor(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchor(null);
  };

  const handleMenuItemClick = (type) => {
    handleAddMenuClose();
    if (type === 'event' && onAddEvent) {
      onAddEvent();
    } else if (type === 'session' && onAddSession) {
      onAddSession();
    } else if (type === 'game' && onAddGame) {
      onAddGame();
    }
  };

  const handleViewMenuClick = (event) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleOpenCopyUrl = () => setCopyUrlOpen(true);
  const handleCloseCopyUrl = () => setCopyUrlOpen(false);

  const handleViewSelect = (viewType) => {
    handleViewMenuClose();
    if (onViewChange) {
      onViewChange(viewType);
    }
  };

  const baseButtonStyle = {
    alignItems: 'center',
    border: 0,
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    height: '32px',
    outline: 'none',
    padding: '4px 12px',
    textDecoration: 'none',
    transition: 'background 0.15s ease-out 0s',
    fontFamily: 'var(--font-family-primary)',
  }

  const secondaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-primary)',
    fontWeight: 600,
  };

  const primaryButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontWeight: 600,
  };

  const navButtonStyle = {
    ...secondaryButtonStyle,
    padding: '4px 8px',
    minWidth: 'auto',
  };

  const todayButtonStyle = {
    ...secondaryButtonStyle,
    marginLeft: 8,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: 'var(--color-background-primary)',
        minHeight: '56px',
        borderBottom: 'none',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
        <Badge
            badgeContent={activeFilterCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'var(--color-text-secondary)',
                color: 'white',
                fontSize: '10px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                right: '6px',
                top: '6px',
              },
            }}
          >
            <Button
              variant="secondary"
              onClick={onToggleFilters}
              style={{ ...secondaryButtonStyle, gap: '4px' }}
            >
              Show filters
              <FilterAltOutlined sx={{ fontSize: 18 }} />
            </Button>
          </Badge>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 1 }}>
          <Button
            variant="secondary"
            onClick={() => onNavigate && onNavigate('prev')}
            style={navButtonStyle}
            type="button"
          >
            <ChevronLeft sx={{ fontSize: 20 }} />
          </Button>

          <Button
            variant="secondary"
            onClick={() => onNavigate && onNavigate('next')}
            style={navButtonStyle}
            type="button"
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </Button>

          <Button
            variant="secondary"
            onClick={() => onNavigate && onNavigate('today')}
            style={todayButtonStyle}
          >
            Today
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 700,
            fontFamily: 'var(--font-family-primary)',
            textAlign: 'center',
          }}
        >
          {formatMonthYear(selectedDate)}
        </Typography>
        <IconButton
          onClick={handleDateClick}
          size="small"
          sx={{
            color: 'var(--color-primary)',
            padding: '2px',
            '&:hover': {
              backgroundColor: 'var(--color-background-secondary)',
            },
          }}
        >
          <ArrowDropDown />
        </IconButton>
        <IconButton
          onClick={handleSettingsClick}
          size="small"
          sx={{
            color: 'var(--color-primary)',
            padding: '4px',
            ml: 0.5,
            '&:hover': {
              backgroundColor: 'var(--color-background-secondary)',
            },
          }}
        >
          <Settings />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="secondary"
          onClick={handleViewMenuClick}
          style={secondaryButtonStyle}
        >
          {viewLabel}
          <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '4px' }} />
        </Button>

        <Button
          variant="primary"
          onClick={handleAddMenuClick}
          style={primaryButtonStyle}
        >
          Add
          <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '4px' }} />
        </Button>
      </Box>

      <Menu
        anchorEl={addMenuAnchor}
        open={Boolean(addMenuAnchor)}
        onClose={handleAddMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            '& .MuiMenuItem-root': {
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              padding: '10px 16px',
              '&:hover': {
                backgroundColor: 'var(--color-background-secondary)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('event')}>Event</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('session')}>Session</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('game')}>Game</MenuItem>
      </Menu>

      <Menu
        anchorEl={viewMenuAnchor}
        open={Boolean(viewMenuAnchor)}
        onClose={handleViewMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            '& .MuiMenuItem-root': {
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              padding: '10px 16px',
              '&:hover': {
                backgroundColor: 'var(--color-background-secondary)',
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => handleViewSelect('dayGridMonth')}>Month</MenuItem>
        <MenuItem onClick={() => handleViewSelect('timeGridDay')}>Day</MenuItem>
        <MenuItem onClick={() => handleViewSelect('timeGridWeek')}>Week</MenuItem>
        <MenuItem onClick={() => handleViewSelect('listWeek')}>List</MenuItem>
      </Menu>

      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={handleSettingsClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            '& .MuiMenuItem-root': {
              fontFamily: 'var(--font-family-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              padding: '10px 16px',
              '&:hover': { backgroundColor: 'var(--color-background-secondary)' },
            },
          },
        }}
      >
        <MenuItem onClick={() => { handleSettingsClose(); handleOpenCopyUrl(); }}>Copy calendar URL</MenuItem>
        <MenuItem onClick={() => { handleSettingsClose(); /* placeholder */ }}>Calendar settings</MenuItem>
      </Menu>

      <CopyCalendarUrl
        open={copyUrlOpen}
        onClose={handleCloseCopyUrl}
        calendarUrl={'https://calendar.com/calendar/ical/dcarroll%40kitmanlabs.com/public/'}
      />

      <Popover
        open={Boolean(datePickerAnchor)}
        anchorEl={datePickerAnchor}
        onClose={handleDatePickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{
          '& .MuiPopover-paper': {
            padding: 0,
            overflow: 'visible',
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            onAccept={handleDateAccept}
            views={['year', 'month', 'day']}
            openTo="day"
            displayStaticWrapperAs="desktop"
            slotProps={{
              actionBar: {
                actions: ['today', 'accept'],
              },
            }}
            sx={{
              '& .MuiPickersCalendarHeader-root': {
                paddingLeft: 2,
                paddingRight: 2,
              },
              '& .MuiPickersCalendarHeader-label': {
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family-primary)',
                textTransform: 'none',
                '&:hover': {
                  color: 'var(--color-primary-hover)',
                },
              },
              '& .MuiPickersYear-yearButton': {
                cursor: 'pointer',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 14,
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersMonth-monthButton': {
                cursor: 'pointer',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 14,
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersDay-dayButton': {
                cursor: 'pointer',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-family-primary)',
                fontSize: 14,
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersActionBar-root': {
                padding: 16,
                borderTop: '1px solid var(--color-border-primary)',
              },
              '& .MuiButton-root': {
                fontFamily: 'var(--font-family-primary)',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                '&.MuiButton-textPrimary': {
                  color: 'var(--color-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-light)',
                  },
                },
                '&.MuiButton-containedPrimary': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Popover>
    </Box>
  );
};

export default CalendarHeader;
