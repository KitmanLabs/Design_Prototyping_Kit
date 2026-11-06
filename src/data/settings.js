// Sections, defaults and option lists for the Administration (Settings) page

export const settingsSections = [
  { id: 'organization', label: 'Organization' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations', label: 'Integrations' },
]

export const timezoneOptions = ['Europe/Dublin', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Australia/Sydney']

export const unitOptions = [
  { value: 'metric', label: 'Metric (kg, cm)' },
  { value: 'imperial', label: 'Imperial (lb, in)' },
]

export const defaultSettings = {
  organizationName: 'Kitman Labs FC',
  timezone: 'Europe/Dublin',
  units: 'metric',
  injuryAlerts: true,
  formReminders: true,
  weeklySummary: false,
  gpsIntegration: true,
  wellnessAppIntegration: false,
}

export const notificationSettings = [
  { id: 'injuryAlerts', label: 'Injury alerts', description: 'Tell medical staff when an injury is logged or an athlete becomes unavailable.' },
  { id: 'formReminders', label: 'Form reminders', description: 'Remind athletes about forms that are due.' },
  { id: 'weeklySummary', label: 'Weekly summary', description: 'Email staff a summary of availability and load every Monday.' },
]

export const integrationSettings = [
  { id: 'gpsIntegration', label: 'GPS tracking', description: 'Import training load from GPS units after each session.' },
  { id: 'wellnessAppIntegration', label: 'Wellness app', description: 'Import athletes’ daily wellness answers.' },
]
