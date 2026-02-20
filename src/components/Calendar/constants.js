// Calendar constants matching the original injuryprofiler.com implementation

export const CALENDAR_EVENT_TYPES = {
  TRAINING_SESSION: 'TRAINING_SESSION',
  GAME: 'GAME',
  MEETING: 'MEETING',
  EVENT: 'EVENT',
  CUSTOM_EVENT: 'CUSTOM_EVENT',
  UNKNOWN: 'UNKNOWN',
};

export const CALENDAR_VIEW_OPTIONS = {
  dayGridMonth: 'dayGridMonth',
  timeGridWeek: 'timeGridWeek',
  timeGridDay: 'timeGridDay',
  listWeek: 'listWeek',
};

export const HEADER_TOOLBAR = {
  start: 'prev,next today',
  center: 'title',
  end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
};

export const EVENT_TIME_FORMAT = {
  hour: 'numeric',
  minute: '2-digit',
  meridiem: 'short',
};

export const CALENDAR_VIEWS = {
  dayGridMonth: {
    dayMaxEvents: 3,
    fixedWeekCount: true,
    showNonCurrentDates: false,
  },
  timeGrid: {
    eventMinHeight: 15,
    dayHeaderFormat: { weekday: 'short', day: 'numeric' },
  },
  timeGridDay: {
    dayHeaderFormat: { weekday: 'short' },
  },
  list: {
    listDayFormat: {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    },
    listDaySideFormat: false,
  },
};

// Color palette matching the original Kitman design system
export const COLORS = {
  // Primary colors
  p01: '#3a8dee',
  p02: '#0e478a',
  p03: '#1c1c1c',
  p04: '#bec3c7',
  p05: '#ecf0f1',
  p06: '#ffffff',

  // Secondary colors
  s01: '#1bbc9c',
  s02: '#15a086',
  s03: '#2ecc70',
  s04: '#29ae61',
  s05: '#9b58b5',
  s06: '#8f44ad',
  s07: '#f1c410',
  s08: '#f39c11',
  s09: '#e77e23',
  s10: '#d25400',
  s11: '#e74d3d',
  s12: '#c0392b',
  s13: '#f3f3f3',
  s14: '#dedede',
  s15: '#bec3c7',
  s16: '#969696',
  s17: '#676767',
  s18: '#3f4448',
  s19: '#34495e',
  s20: '#2d3e50',
  s21: '#082e5a',
  s22: '#969696',
  s23: '#fafafa',
  s24: '#e424b0',
  s25: '#ff2a2a',

  // Neutrals
  neutral_300: '#e8eaed',
};
