import moment from 'moment';
import { colors, withAlpha } from '@kitman/common/src/variables';


export const convertDateRangeToTuple = (range) => {
  return [
    range.start_date ? moment(range.start_date) : null,
    range.end_date ? moment(range.end_date) : null,
  ];
};

// Quick filter functions - return start and end of periods

export const getThisWeek = () => {
  const start = moment().startOf('week');
  const end = moment().endOf('week');
  return [start, end];
};

export const getThisMonth = () => {
  const start = moment().startOf('month');
  const end = moment().endOf('month');
  return [start, end];
};

export const getThisYear = () => {
  const start = moment().startOf('year');
  const end = moment().endOf('year');
  return [start, end];
};

// Extract month and year from calendar header text
export const getCurrentMonthYear = (
  calendarContainer
) => {
  const monthYearElement = calendarContainer.querySelector(
    '.MuiPickersCalendarHeader-label'
  );
  if (!monthYearElement) return null;

  const monthYearText = monthYearElement.textContent;
  if (!monthYearText) return null;

  const parts = monthYearText.trim().split(' ');
  if (parts.length !== 2) return null;

  const monthName = parts[0];
  const year = Number.parseInt(parts[1], 10);

  const testDate = moment(`${monthName} ${year}`, 'MMMM YYYY');
  if (!testDate.isValid()) {
    const testDateEn = moment(`${monthName} ${year}`, 'MMMM YYYY', 'en');
    if (!testDateEn.isValid()) return null;
    return { month: testDateEn.month(), year: testDateEn.year() };
  }

  return { month: testDate.month(), year: testDate.year() };
};

// Format user input as they type - handles partial and complete date ranges based on organization locale

export const formatDateInput = (
  input,
  locale = 'en-US'
) => {
  const numbers = input.replace(/\D/g, '');

  const inputFormat = locale === 'en-US' ? 'MMDDYYYY' : 'DDMMYYYY';
  const displayFormat = locale === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';

  if (numbers.length === 16) {
    const firstDate = numbers.slice(0, 8);
    const secondDate = numbers.slice(8, 16);

    const startDate = moment(firstDate, inputFormat);
    const endDate = moment(secondDate, inputFormat);

    if (startDate.isValid() && endDate.isValid()) {
      return {
        formatted: `${startDate.format(displayFormat)} - ${endDate.format(
          displayFormat
        )}`,
        dateRange: [startDate, endDate],
      };
    }
  }

  if (numbers.length >= 8) {
    const firstPart = numbers.slice(0, 8);
    const secondPart = numbers.slice(8);

    const firstDate = moment(firstPart, inputFormat);
    if (firstDate.isValid()) {
      let formatted = firstDate.format(displayFormat);
      if (secondPart.length > 0) {
        formatted += ' - ';
        // eslint-disable-next-line max-depth
        for (let i = 0; i < secondPart.length; i += 2) {
          formatted += secondPart.slice(i, i + 2);
          // eslint-disable-next-line max-depth
          if (i < 4 && i + 2 <= secondPart.length) formatted += '/';
        }
      }
      return { formatted, dateRange: undefined };
    }
  }

  let formatted = '';
  for (let i = 0; i < Math.min(numbers.length, 8); i += 2) {
    formatted += numbers.slice(i, i + 2);
    if (i < 4 && i + 2 <= numbers.length) formatted += '/';
  }

  return { formatted, dateRange: undefined };
};

// Apply visual styles to calendar days to show selected range;
// This is the most complex function - directly manipulates DOM for styling
export const applyRangeStyles = (
  dateRange,
  hoveredDate,
  isMobile
) => {
  // First, clear all existing styles
  document.querySelectorAll('.MuiPickerDay-root').forEach((day) => {
    const dayElement = day;
    dayElement.style.backgroundColor = '';
    dayElement.style.color = '';
    dayElement.style.borderRadius = '';
  });

  // Find all calendar containers (start and end calendars)
  const calendarContainers = document.querySelectorAll('[data-calendar-type]');

  calendarContainers.forEach((container) => {
    const calendarType = container.getAttribute('data-calendar-type');
    const daysInCalendar = container.querySelectorAll('.MuiPickerDay-root');

    // Get the month/year this calendar is showing
    const currentMonthYear = getCurrentMonthYear(container);
    if (!currentMonthYear) return;

    daysInCalendar.forEach((day) => {
      const dayElement = day;
      const dayText = dayElement.textContent;
      if (!dayText) return;

      const dayNumber = Number.parseInt(dayText, 10);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(dayNumber)) return;

      // Create a moment object for this calendar day
      const currentDate = moment()
        .year(currentMonthYear.year)
        .month(currentMonthYear.month)
        .date(dayNumber);

      // Apply styles based on calendar type (start or end)
      if (calendarType === 'start') {
        // Highlight start date with a circular background
        if (dateRange[0] && currentDate.isSame(dateRange[0], 'day')) {
          dayElement.style.backgroundColor = colors.grey_300;
          dayElement.style.color = colors.white;
          dayElement.style.borderRadius = '50%';
        }
        // Highlight dates in the selected range
        else if (
          dateRange[0] &&
          dateRange[1] &&
          currentDate.isAfter(dateRange[0], 'day') &&
          currentDate.isBefore(dateRange[1], 'day')
        ) {
          dayElement.style.backgroundColor = withAlpha(colors.grey_300, 0.08);
          dayElement.style.color = colors.grey_300;
          dayElement.style.borderRadius = '0';
        }

        // Show hover preview when start date selected but no end date (desktop only)
        if (!isMobile && dateRange[0] && !dateRange[1] && hoveredDate) {
          if (
            currentDate.isAfter(dateRange[0], 'day') &&
            currentDate.isBefore(hoveredDate, 'day') &&
            hoveredDate.isAfter(dateRange[0], 'day')
          ) {
            dayElement.style.backgroundColor = withAlpha(colors.grey_300, 0.08);
            dayElement.style.color = colors.grey_300;
            dayElement.style.borderRadius = '0';
          }
        }
      } else if (calendarType === 'end') {
        // Highlight end date with a circular background
        if (dateRange[1] && currentDate.isSame(dateRange[1], 'day')) {
          dayElement.style.backgroundColor = colors.grey_300;
          dayElement.style.color = colors.white;
          dayElement.style.borderRadius = '50%';
        }
        // Highlight dates in the selected range
        else if (
          dateRange[0] &&
          dateRange[1] &&
          currentDate.isAfter(dateRange[0], 'day') &&
          currentDate.isBefore(dateRange[1], 'day')
        ) {
          dayElement.style.backgroundColor = withAlpha(colors.grey_300, 0.08);
          dayElement.style.color = colors.grey_300;
          dayElement.style.borderRadius = '0';
        }

        // Show hover preview on the end calendar (desktop only)
        if (!isMobile && dateRange[0] && !dateRange[1] && hoveredDate) {
          if (
            currentDate.isSame(hoveredDate, 'day') &&
            hoveredDate.isAfter(dateRange[0], 'day')
          ) {
            // Highlight hovered end date
            dayElement.style.backgroundColor = withAlpha(colors.grey_300, 0.08);
            dayElement.style.color = colors.grey_300;
            dayElement.style.borderRadius = '50%';
          } else if (
            currentDate.isAfter(dateRange[0], 'day') &&
            currentDate.isBefore(hoveredDate, 'day') &&
            hoveredDate.isAfter(dateRange[0], 'day')
          ) {
            // Highlight dates between start and hovered date
            dayElement.style.backgroundColor = withAlpha(colors.grey_300, 0.08);
            dayElement.style.color = colors.grey_300;
            dayElement.style.borderRadius = '0';
          }
        }
      }
    });
  });
};

export const formatDateRange = (
  startDate,
  endDate
) => {
  return {
    start_date:
      startDate && startDate.isValid() ? startDate.format('YYYY-MM-DD') : '',
    end_date: endDate && endDate.isValid() ? endDate.format('YYYY-MM-DD') : '',
  };
};
