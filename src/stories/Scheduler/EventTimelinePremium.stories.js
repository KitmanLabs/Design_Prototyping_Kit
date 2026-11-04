import { useState } from 'react';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { Box } from '../../playbook-components';
import { TIMELINE_VISIBLE_DATE, schedulerEvents, squadResources } from './utils';

const EventTimelineDemo = (args) => {
  const [events, setEvents] = useState(schedulerEvents);
  return (
    <Box sx={{ height: 500, width: 1100 }}>
      <EventTimelinePremium
        events={events}
        onEventsChange={setEvents}
        resources={squadResources}
        defaultVisibleDate={TIMELINE_VISIBLE_DATE}
        {...args}
      />
    </Box>
  );
};

export default {
  title: 'Scheduler/EventTimelinePremium',
  component: EventTimelinePremium,
  render: (args) => <EventTimelineDemo {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'MUI X Scheduler event timeline (Premium; beta): events laid out per resource, here one row per squad. Needs a Premium licence key; without one it shows a watermark. The Scheduler is in beta, so its API may change.',
      },
    },
  },
  tags: ['autodocs'],
};

export const BySquad = {};
