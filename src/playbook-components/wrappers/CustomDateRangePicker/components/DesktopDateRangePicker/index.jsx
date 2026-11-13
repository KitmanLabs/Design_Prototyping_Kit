import { Box, Button, Typography } from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers-pro';
import { colors } from '@kitman/common/src/variables';
import i18n from '@kitman/common/src/utils/i18n';
import QuickFilters from '../../../QuickFilters';
import {
  getButtonContainerStyles,
  getCalendarContainerStyles,
  getCalendarHeaderStyles,
  getEndCalendarHeaderStyles,
  getQuickFiltersContainerStyles,
  getStartCalendarStyles,
} from '../../styles';

// Desktop version of the date range picker - shows two calendars side by side

function DesktopDateRangePicker({
  variant,
  selectedFilter,
  handleQuickSelect,
  defaultPrimary,
  defaultContrastText,
  filters,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  dateRange,
  handleStartDateChange,
  handleEndDateChange,
  handleClearDates,
  closeCalendar,
}) {
  return (
    <Box
      sx={[{
        display: "flex"
      }, getCalendarContainerStyles(variant)]}>
      <Box sx={getQuickFiltersContainerStyles()}>
        <QuickFilters
          selectedFilter={selectedFilter}
          onQuickSelect={handleQuickSelect}
          defaultPrimary={defaultPrimary}
          defaultContrastText={defaultContrastText}
          filters={filters}
        />
      </Box>

      <Box data-calendar-type="start">
        <Typography
          variant="body2"
          sx={[{
            bgcolor: "white"
          }, getCalendarHeaderStyles()]}>
          {i18n.t('Start date')}
        </Typography>
        <StaticDatePicker
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDate={minDate}
          maxDate={maxDate}
          sx={getStartCalendarStyles()}
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={dateRange[0]}
          onChange={handleStartDateChange}
          views={['year', 'month', 'day']}
        />
      </Box>

      <Box data-calendar-type="end">
        <Typography
          variant="body2"
          sx={[{
            bgcolor: colors.white
          }, getEndCalendarHeaderStyles()]}>
          {i18n.t('End date')}
        </Typography>
        <StaticDatePicker
          disableFuture={disableFuture}
          disablePast={disablePast}
          minDate={minDate}
          maxDate={maxDate}
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={dateRange[1]}
          onChange={handleEndDateChange}
          views={['year', 'month', 'day']}
          shouldDisableDate={(date) => {
            return dateRange[0] ? date.isBefore(dateRange[0], 'day') : false;
          }}
        />

        <Box
          sx={[{
            width: "100%"
          }, getButtonContainerStyles()]}>
          <Button
            onClick={handleClearDates}
            variant="text"
            sx={{
              textTransform: 'none',
              color: colors.grey_300,
              borderColor: colors.grey_300,
            }}
          >
            {i18n.t('Cancel')}
          </Button>
          <Button
            onClick={closeCalendar}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: colors.grey_300,
            }}
          >
            {i18n.t('Apply')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default DesktopDateRangePicker;
