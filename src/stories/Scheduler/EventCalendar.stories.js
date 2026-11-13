import { useState } from 'react';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { Box } from '../../playbook-components';
import { DEFAULT_VISIBLE_DATE, schedulerEvents } from './utils';

const EventCalendarDemo = (args) => {
  const [events, setEvents] = useState(schedulerEvents);
  return (
    <Box sx={{ height: 700, width: 1100 }}>
      <EventCalendar
        events={events}
        onEventsChange={setEvents}
        defaultVisibleDate={DEFAULT_VISIBLE_DATE}
        {...args}
      />
    </Box>
  );
};

export default {
  title: 'Scheduler/EventCalendar',
  component: EventCalendar,
  render: (args) => <EventCalendarDemo {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MUI X Scheduler event calendar (community, MIT; beta). Day, week, month and agenda views with drag and drop and resizing, fed from the calendar mock data. The Scheduler is in beta, so its API may change.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {};
