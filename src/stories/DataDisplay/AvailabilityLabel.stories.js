import { AvailabilityLabel, Stack } from '../../playbook-components';

export default {
  title: 'Data Display/AvailabilityLabel',
  component: AvailabilityLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shows an athlete availability status with a colored indicator. Pass `status.availability` (`available`, `unavailable`, `injured` or `returning`) and, optionally, `status.unavailable_since`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'object' },
  },
};

export const Available = {
  args: { status: { availability: 'available' } },
};

export const Unavailable = {
  args: { status: { availability: 'unavailable', unavailable_since: 'Since 12 Oct 2026' } },
};

export const AllStatuses = {
  render: () => (
    <Stack spacing={2}>
      <AvailabilityLabel status={{ availability: 'available' }} />
      <AvailabilityLabel status={{ availability: 'injured' }} />
      <AvailabilityLabel status={{ availability: 'returning' }} />
      <AvailabilityLabel status={{ availability: 'unavailable', unavailable_since: 'Since 12 Oct 2026' }} />
    </Stack>
  ),
};
