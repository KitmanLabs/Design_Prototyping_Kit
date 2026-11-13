// Mock option lists for the calendar event drawers (Add game, Add session). No backend.
// All mock data lives in src/data (see docs/reference/project-structure.md).

// Event types, as in iP (kitman-frontend components/src/Calendar/utils/enum-likes.js).
// Custom events keep their user-chosen kind (Meeting, Assessment, ...) in extendedProps.customEventType.
export const CALENDAR_EVENT_TYPES = {
  TRAINING_SESSION: 'TRAINING_SESSION',
  GAME: 'GAME',
  CUSTOM_EVENT: 'CUSTOM_EVENT',
};

export const CALENDAR_EVENT_TYPE_LABELS = {
  TRAINING_SESSION: 'Training session',
  GAME: 'Game',
  CUSTOM_EVENT: 'Event',
};

// The label shown for an event in the tooltip and details dialog.
export const getEventTypeLabel = (extendedProps = {}) =>
  extendedProps.customEventType ||
  CALENDAR_EVENT_TYPE_LABELS[extendedProps.eventType] ||
  'Event';

// Placeholder iCal subscription address for the "Copy calendar URL" dialog.
export const MOCK_CALENDAR_SUBSCRIPTION_URL = 'https://calendar.example.com/ical/team-calendar/basic.ics';

// Shared by both drawers
export const MOCK_SURFACE_TYPES = ['Pitch', 'Court', 'Track', 'Gymnasium', 'Pool', 'Field'];

export const MOCK_SURFACE_QUALITY = ['Excellent', 'Good', 'Fair', 'Poor', 'New', 'Worn'];

export const MOCK_WEATHER = [
  'Sunny',
  'Partly cloudy',
  'Overcast',
  'Rainy',
  'Snowy',
  'Windy',
  'Foggy',
];

export const MOCK_REMINDER_EMAIL = [
  '1 hour before',
  '2 hours before',
  '1 day before',
  '2 days before',
  'Custom',
  'Never',
];

export const MOCK_REMINDER_PUSH = [
  '15 minutes before',
  '30 minutes before',
  '1 hour before',
  'Custom',
  'Never',
];

export const DESCRIPTION_MAX = 250;

// AddGameDrawer
export const MOCK_GAME_TEAMS = [
  { id: '1', name: 'First Team' },
  { id: '2', name: 'U21' },
  { id: '3', name: 'Reserves' },
  { id: '4', name: 'Academy' },
];

export const MOCK_GAME_OPPOSITION = [
  'Arsenal FC',
  'Chelsea FC',
  'Liverpool FC',
  'Manchester United',
  'Manchester City',
  'Tottenham Hotspur',
  'Newcastle United',
  'Aston Villa',
  'Brighton & Hove Albion',
  'West Ham United',
];

export const MOCK_GAME_COMPETITIONS = [
  'Premier League',
  'FA Cup',
  'Champions League',
  'Europa League',
  'League Cup',
  'Friendly',
  'International',
];

export const MOCK_GAME_VENUES = [
  'Home Stadium',
  'Away',
  'Neutral venue',
  'Training ground',
  'Wembley Stadium',
  'Old Trafford',
];

export const MOCK_GAME_TIMEZONES = [
  'Europe/Dublin',
  'UTC',
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
];

export const MOCK_GAME_REMINDER_TYPES = [
  'General',
  'Pre-game check-in',
  'Post-game feedback',
  'Injury update',
  'Custom',
];

// AddSessionDrawer
export const MOCK_SESSION_TYPES = [
  "Strength training",
  "Cardio training",
  'Tactical',
  'Recovery',
  'Technical',
  'Conditioning',
  'Warm-up',
  'Cool-down',
  'Other',
];

export const MOCK_SESSION_REPEAT_OPTIONS = [
  { value: 'none', label: "Doesn't repeat" },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const MOCK_SESSION_TIMEZONES = [
  'Europe/Dublin',
  "Utc",
  'Europe/London',
  'America/New_York',
  'Europe/Paris',
  'Australia/Sydney',
];

export const MOCK_SESSION_GAME_DAY = [
  '-3',
  '-2',
  '-1',
  '0',
  '+1',
  '+2',
  '+3',
];

export const MOCK_SESSION_REMINDER_TYPES = [
  'General',
  'Pre-session check-in',
  'Post-session feedback',
  'Injury update',
  'Custom',
];
