import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { StaticDatePicker } from '@mui/x-date-pickers-pro';
import i18n from '@kitman/common/src/utils/i18n';
import QuickFilters from '../../../QuickFilters';
import {
  getMobileHeaderStyles,
  getMobileQuickFiltersStyles,
} from '../../styles';

// Mobile version - shows one calendar at a time with step navigation

function MobileDateRangePicker({
  mobileStep,
  setMobileStep,
  setCurrentView,
  dateRange,
  handleMobileDateChange,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  selectedFilter,
  handleQuickSelect,
  defaultPrimary,
  defaultContrastText,
  filters,
}) {
  return (
    <>
      {mobileStep === 'start' && (
        <Box
          data-calendar-type="start"
          display="flex"
          flexDirection="column"
          sx={{ mt: 2 }}
        >
          <Box display="flex" alignItems="center" sx={getMobileHeaderStyles()}>
            <Typography bgcolor="white" variant="body1">
              {i18n.t('Start date')}
            </Typography>
          </Box>
          <Box display="flex" sx={getMobileQuickFiltersStyles()}>
            <QuickFilters
              selectedFilter={selectedFilter}
              onQuickSelect={handleQuickSelect}
              defaultPrimary={defaultPrimary}
              defaultContrastText={defaultContrastText}
              filters={filters}
            />
          </Box>
          <StaticDatePicker
            disableFuture={disableFuture}
            disablePast={disablePast}
            minDate={minDate}
            maxDate={maxDate}
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={dateRange[0]}
            views={['year', 'month', 'day']}
            onViewChange={setCurrentView}
            onChange={handleMobileDateChange}
          />
        </Box>
      )}

      {mobileStep === 'end' && (
        <Box
          data-calendar-type="end"
          display="flex"
          flexDirection="column"
          sx={{ mt: 2 }}
        >
          <Box display="flex" alignItems="center" sx={getMobileHeaderStyles()}>
            <IconButton onClick={() => setMobileStep('start')} size="small">
              <ChevronLeft />
            </IconButton>
            <Typography bgcolor="white" variant="body1" sx={{ ml: 1 }}>
              {i18n.t('End date')}
            </Typography>
          </Box>
          <Box sx={getMobileQuickFiltersStyles()}>
            <QuickFilters
              selectedFilter={selectedFilter}
              onQuickSelect={handleQuickSelect}
              defaultPrimary={defaultPrimary}
              defaultContrastText={defaultContrastText}
              filters={filters}
            />
          </Box>
          <StaticDatePicker
            disableFuture={disableFuture}
            disablePast={disablePast}
            minDate={minDate}
            maxDate={maxDate}
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={dateRange[1]}
            views={['year', 'month', 'day']}
            onViewChange={setCurrentView}
            shouldDisableDate={(date) =>
              dateRange[0] ? date.isBefore(dateRange[0], 'day') : false
            }
            onChange={handleMobileDateChange}
          />
        </Box>
      )}
    </>
  );
}

export default MobileDateRangePicker;
