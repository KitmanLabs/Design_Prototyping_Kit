// Notifications for the Notifications queue

export const notificationsData = [
  {
    id: 1,
    title: 'Form submission received',
    description: 'Marcus Johnson submitted Daily Wellness Check',
    timestamp: 'Sep 27, 2025 · 2:45 PM',
    category: 'Submission',
    status: 'Unread'
  },
  {
    id: 2,
    title: 'Medical assessment due',
    description: 'Pre-Season Medical Screening deadline approaching for 5 athletes',
    timestamp: 'Sep 26, 2025 · 10:30 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 3,
    title: 'Form updated',
    description: 'Training Load Monitoring form was modified by Performance team',
    timestamp: 'Sep 25, 2025 · 4:15 PM',
    category: 'Update',
    status: 'Read'
  },
  {
    id: 4,
    title: 'New form assigned',
    description: 'Concussion Protocol assigned to 12 athletes',
    timestamp: 'Sep 24, 2025 · 9:00 AM',
    category: 'Assignment',
    status: 'Read'
  },
  {
    id: 5,
    title: 'Compliance deadline',
    description: 'End of Season Survey submissions due in 3 days',
    timestamp: 'Sep 23, 2025 · 11:20 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 6,
    title: 'Form submission received',
    description: 'Elena Rodriguez completed Pre-Season Medical Screening',
    timestamp: 'Sep 22, 2025 · 3:30 PM',
    category: 'Submission',
    status: 'Read'
  },
  {
    id: 7,
    title: 'Schedule created',
    description: 'Weekly Wellness Check schedule has been published',
    timestamp: 'Sep 21, 2025 · 8:00 AM',
    category: 'Schedule',
    status: 'Read'
  },
  {
    id: 8,
    title: 'Form template published',
    description: 'New Injury Assessment form is now available',
    timestamp: 'Sep 20, 2025 · 2:00 PM',
    category: 'Update',
    status: 'Read'
  },
  {
    id: 9,
    title: 'Overdue submission',
    description: 'David Chen has not completed Training Load Monitoring',
    timestamp: 'Sep 19, 2025 · 9:15 AM',
    category: 'Deadline',
    status: 'Unread'
  },
  {
    id: 10,
    title: 'Form submission received',
    description: 'James Wilson submitted Scholarship Reviews',
    timestamp: 'Sep 18, 2025 · 1:45 PM',
    category: 'Submission',
    status: 'Read'
  },
  {
    id: 11,
    title: 'New form assigned',
    description: 'Post-Game RPE assigned to 8 athletes after match',
    timestamp: 'Sep 17, 2025 · 6:30 PM',
    category: 'Assignment',
    status: 'Read'
  },
  {
    id: 12,
    title: 'Compliance reminder',
    description: 'Ethan Walker has 3 pending compliance forms',
    timestamp: 'Sep 16, 2025 · 10:00 AM',
    category: 'Deadline',
    status: 'Read'
  }
]

export const notificationCategoryFilters = [
  { key: 'Submission', label: 'Submissions' },
  { key: 'Deadline', label: 'Deadlines' },
  { key: 'Update', label: 'Updates' },
  { key: 'Assignment', label: 'Assignments' },
  { key: 'Schedule', label: 'Schedule' },
]
