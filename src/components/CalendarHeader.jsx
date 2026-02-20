import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Badge, Popover, Menu, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { ArrowDropDown, ChevronLeft, ChevronRight, FilterList } from '@mui/icons-material';
import Button from './Button';

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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        minHeight: '64px',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            >
              <FilterList sx={{ fontSize: '18px', marginRight: '8px' }} />
              Show filters
            </Button>
          </Badge>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => onNavigate && onNavigate('prev')}
            sx={{
              color: '#666666',
              padding: '8px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={() => onNavigate && onNavigate('next')}
            sx={{
              color: '#666666',
              padding: '8px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ChevronRight />
          </IconButton>

          <Button
            variant="secondary"
            onClick={() => onNavigate && onNavigate('today')}
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
            color: '#333333',
            fontSize: '20px',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {formatMonthYear(selectedDate)}
        </Typography>
        <IconButton
          onClick={handleDateClick}
          size="small"
          sx={{
            color: '#666666',
            padding: '2px',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <ArrowDropDown />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="secondary"
        >
          Month
          <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '8px' }} />
        </Button>

        <Button
          variant="primary"
          onClick={handleAddMenuClick}
        >
          Add
          <ArrowDropDown sx={{ fontSize: '16px', marginLeft: '8px' }} />
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
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#333333',
                fontFamily: 'Open Sans, sans-serif',
                textTransform: 'none',
                '&:hover': {
                  color: 'var(--color-primary)',
                },
              },
              '& .MuiPickersYear-yearButton': {
                cursor: 'pointer',
                color: '#333333',
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f2f3f5',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersMonth-monthButton': {
                cursor: 'pointer',
                color: '#333333',
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f2f3f5',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersDay-dayButton': {
                cursor: 'pointer',
                color: '#333333',
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f2f3f5',
                  color: 'var(--color-primary)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                },
              },
              '& .MuiPickersActionBar-root': {
                padding: '16px',
                borderTop: '1px solid #e0e0e0',
              },
              '& .MuiButton-root': {
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                '&.MuiButton-textPrimary': {
                  color: 'var(--color-primary)',
                  '&:hover': {
                    backgroundColor: '#f2f3f5',
                  },
                },
                '&.MuiButton-containedPrimary': {
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
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
