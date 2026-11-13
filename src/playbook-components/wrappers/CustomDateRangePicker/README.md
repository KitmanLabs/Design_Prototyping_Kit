# CustomDateRangePicker

A date range picker component with quick filters support, mobile and desktop versions. Built on top of Material-UI and
moment.js.

## Description

`CustomDateRangePicker` is a flexible date range selection component that provides:

- **Responsive interface**: automatically switches between mobile and desktop versions
- **Quick filters**: preset periods (this week, this month, this year)
- **Custom filters**: ability to add custom quick filters
- **Visual feedback**: highlighting selected range on hover
- **Keyboard input**: ability to input dates in DD/MM/YYYY format
- **Validation**: min/max date constraints

## Project Structure

```plaintext
CustomDateRangePicker/
├── index.jsx # Main component
├── constants.js # Constants (default filters)
├── utils.js # Date utilities
├── styles.js # Component styles
├── hooks/
│   ├── useDateInput.js # Hook for date input handling
│   ├── useIsMobile.js # Hook for mobile device detection
│   └── useClickOutside.js # Hook for closing calendar on outside click
└── components/
    ├── DesktopDateRangePicker/index.jsx # Desktop version
    └── MobileDateRangePicker/index.jsx # Mobile version
```

## API

### Props

| Prop            | Type                     | Required       | Description                   |
|-----------------|--------------------------|----------------|-------------------------------|
| `initialValue`  | DateRangeOutput          | ❌              | Initial value                 |
| `onChange`      | `(range: DateRangeOutput | null) => void` | ✅                             | Callback called when date range changes |
| `disableFuture` | `boolean`                | ❌              | Disables future date selection |
| `disablePast`   | `boolean`                | ❌              | Disables past date selection  |
| `variant`       | `'default'               | 'menuFilters'` | ❌                             | Display variant (default 'default') |
| `minDate`       | `MomentType`             | ❌              | Minimum selectable date       |
| `maxDate`       | `MomentType`             | ❌              | Maximum selectable date       |
| `customFilters` | `Array<CustomFilter>`    | ❌              | Array of custom quick filters |
| `label`         | `string`                 | ❌              | Input label                   |

### Return Data

Component returns an object of type `DateRangeOutput`:

```javascript
{
  start_date: string // Start date in 'YYYY-MM-DD' format 
  end_date: string // End date in 'YYYY-MM-DD' format
}
```

Returns `null` when range is cleared.

## Main Files and Their Purpose

### index.js - Main Component

Contains the main component logic:

- State management (calendar open/close, selected dates)
- Event handling (clicks, keyboard input, mouse hover)
- Mobile/desktop version switching
- Style application for range visualization

### utils.js - Utilities

Key functions:

- `getThisWeek/Month/Year()` - generate preset periods
- `formatDateInput()` - format user input
- `applyRangeStyles()` - apply styles for range highlighting
- `getCurrentMonthYear()` - get current month/year from DOM

### hooks/ - Custom Hooks

- `useDateInput` - handle keyboard date input
- `useIsMobile` - detect mobile device
- `useClickOutside` - close calendar on outside click

## How Components Work Together

### 1. Initialization

```js
// index.js
const isMobile = useIsMobile(); // Detect device type
const [dateRange, setDateRange] = useState([null, null]); // Date state
const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Calendar state
```

### 2. Rendering

Renders appropriate component based on device type:

```js
{
  isCalendarOpen && !isMobile && (
      <DesktopDateRangePicker {...props} />
  )
}

{
  isCalendarOpen && isMobile && (
      <MobileDateRangePicker {...props} />
  )
}
```

### 3. Change Handling

All date changes go through `updateDateRange` function:

```js
const updateDateRange = (newRange) => {
  setDateRange(newRange);
  if (onChange) {
// Format and send data to parent component
    const formatted = formatDateRange(newRange[0], newRange[1]);
    onChange(formatted);
  }
};
```

### 4. Visual Feedback

Styles are applied through `applyRangeStyles` on every change:

```js
useEffect(() => {
  if (!isCalendarOpen) return;
  const timer = setTimeout(() => {
    applyRangeStyles(dateRange, hoveredDate, isMobile);
  }, 40);
  return () => clearTimeout(timer);
}, [dateRange, hoveredDate, isCalendarOpen, isMobile]);
```

## Adding Custom Filters

### Creating Custom Filter

```js

import i18n from '@kitman/common/src/utils/i18n';

const getCustomFilters = () => [
  {
    key: i18n.t('last7days'),
    label: i18n.t('Last 7 Days'),
    getDateRange: () => {
      const end = moment();
      const start = moment().subtract(7, 'days');
      return [start, end];
    }
  },
  {
    key: i18n.t('lastMonth'),
    label: i18n.t('Last Month'),
    getDateRange: () => {
      const start = moment().subtract(1, 'month').startOf('month');
      const end = moment().subtract(1, 'month').endOf('month');
      return [start, end];
    }
  },
  {
    key: i18n.t('quarter'),
    label: i18n.t('Current Quarter'),
    getDateRange: () => {
      const start = moment().startOf('quarter');
      const end = moment().endOf('quarter');
      return [start, end];
    }
  }
]

```

### Using Custom Filters

```js
<CustomDateRangePicker
    onChange={handleDateChange}
    customFilters={getCustomFilters()}
/>
```

### CustomFilter Structure

```js
type CustomFilter = {
  key: string, // Unique filter key
  label: string, // Display name
  getDateRange: () => [MomentType, MomentType], // Function returning date range
};
```

## Adding Additional Logic

### 1. Custom Date Validation

```js
// In parent component
const handleDateChange = (range) => {
  if (range) {
    const start = moment(range.start_date);
    const end = moment(range.end_date);

    // Check that range doesn't exceed 90 days
    if (end.diff(start, 'days') > 90) {
      alert('Range cannot exceed 90 days');
      return;
    }

    // Check business days
    if (start.day() === 0 || start.day() === 6) {
      alert('Start date must be a business day');
      return;
    }

  }

  setSelectedRange(range);
};
```

### 2. External State Integration

```js
// Redux/Context synchronization
const dispatch = useDispatch();

const handleDateChange = useCallback((range) => {
  dispatch(setDateRange(range));

// Auto-load data when range changes
  if (range) {
    dispatch(fetchDataForRange(range));
  }
}, [dispatch]);
```

### 3. Custom Formatting

```js
// Modify utils.js for different format
export const formatDateRange = (startDate, endDate) => {
  return {
    start_date: startDate ? startDate.format('DD.MM.YYYY') : '',
    end_date: endDate ? endDate.format('DD.MM.YYYY') : '',
// Add additional fields
    formatted_range: startDate && endDate
        ? `${startDate.format('DD.MM.YY')} - ${endDate.format('DD.MM.YY')}`
        : '',
    days_count: startDate && endDate
        ? endDate.diff(startDate, 'days') + 1
        : 0
  };
};
```

## Complex Parts Explained

### 1. Range Style Application (applyRangeStyles)

This is the most complex part of the component. The function works as follows:

```js
export const applyRangeStyles = (dateRange, hoveredDate, isMobile) => {
// 1. First clear all styles
  document.querySelectorAll('.MuiPickerDay-root').forEach((day) => {
    day.style.backgroundColor = '';
    day.style.color = '';
    day.style.borderRadius = '';
  });

// 2. Find all calendars (start and end)
  const calendarContainers = document.querySelectorAll('[data-calendar-type]');

  calendarContainers.forEach((container) => {
    const calendarType = container.getAttribute('data-calendar-type');

    // 3. For each day in calendar determine its position relative to range
    daysInCalendar.forEach((day) => {
      const currentDate = moment()
          .year(currentMonthYear.year)
          .month(currentMonthYear.month)
          .date(dayNumber);

      // 4. Apply different styles based on date position:
      // - Start/end date: circular background
      // - Dates within range: rectangular background
      // - Hover effect: temporary highlighting
    });

  });
};
```

**Why it's complex:**

- Direct DOM manipulation (not React way)
- Working with two calendars simultaneously
- Handling hover effects
- Synchronization with React state

### 2. Keyboard Input Handling (formatDateInput)

```js
export const formatDateInput = (input) => {
  const numbers = input.replace(/\D/g, ''); // Remove everything except digits

// Full input: 16 digits = two dates
  if (numbers.length === 16) {
    const firstDate = numbers.slice(0, 8); // DDMMYYYY
    const secondDate = numbers.slice(8, 16); // DDMMYYYY

    const startDate = moment(firstDate, 'DDMMYYYY');
    const endDate = moment(secondDate, 'DDMMYYYY');

    if (startDate.isValid() && endDate.isValid()) {
      return {
        formatted: `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`,
        dateRange: [startDate, endDate]
      };
    }

  }

// Partial input: format as user types
// 12345678 -> 12/34/5678
// 1234567890123456 -> 12/34/5678 - 90/12/3456
};
```

**Complexities:**

- Real-time formatting
- Partial date validation
- Backspace handling
- Component state synchronization

### 3. Mobile Navigation

Mobile devices use step-by-step navigation:

```js
const [mobileStep, setMobileStep] = useState('start'); // 'start' | 'end'

const handleMobileDateChange = (newValue) => {
  if (mobileStep === 'start') {
    updateDateRange([newValue, dateRange[1]]);
// Automatically move to end date selection
    if (currentView === 'day') {
      setMobileStep('end');
    }
  } else {
    updateDateRange([dateRange[0], newValue]);
// Close calendar after end date selection
    if (currentView === 'day') {
      closeCalendar();
    }
  }
};
```

**Features:**

- Two-step selection process
- Automatic transitions between steps
- Different logic for different views (year/month/day)

## Usage Examples

### Basic Usage

```js
import CustomDateRangePicker from './CustomDateRangePicker';

function MyComponent() {
  const [dateRange, setDateRange] = useState(null);

  const handleDateChange = (range) => {
    console.log('Selected range:', range);
    setDateRange(range);
  };

  return (
      <CustomDateRangePicker
          onChange={handleDateChange}
      />
  );
}
```

### With Constraints and Custom Filters

```js
const customFilters = [
  {
    key: 'last30days',
    label: 'Last 30 Days',
    getDateRange: () => [
      moment().subtract(30, 'days'),
      moment()
    ]
  }
];

<CustomDateRangePicker
    onChange={handleDateChange}
    disableFuture={true}
    minDate={moment().subtract(1, 'year')}
    maxDate={moment()}
    customFilters={customFilters}
    variant="menuFilters"
/>
```

## Dependencies

- `@mui/material` - UI components
- `@mui/x-date-pickers-pro` - Calendar components
- `moment` - Date manipulation
- `@kitman/common` - Internal styles and variables
