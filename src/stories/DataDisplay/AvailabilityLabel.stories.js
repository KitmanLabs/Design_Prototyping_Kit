import { AvailabilityLabel, Stack } from '../../playbook-components';

export default {
  title: 'Data Display/AvailabilityLabel',
  component: AvailabilityLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "Shows an athlete's availability as a coloured pill, as iP does. Pass `status.availability` (`available`, `unavailable`, `injured`, `returning`, `absent` or `ill`) and, optionally, `status.unavailable_since`: how long the athlete has been in that status, worded as iP sends it (\"12 days\"). It shows under every status but Available. `availabilityStatusEnabled` is iP's `dsr-availability-status` flag, which selects the newer wording and shows `absent` as unavailable.",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'object' },
    availabilityStatusEnabled: { control: 'boolean' },
  },
};

export const Available = {
  args: { status: { availability: 'available', unavailable_since: '0 days' } },
};

export const Unavailable = {
  args: { status: { availability: 'unavailable', unavailable_since: '12 days' } },
};

export const AllStatuses = {
  render: () => (
    <Stack spacing={2}>
      <AvailabilityLabel status={{ availability: 'available', unavailable_since: '0 days' }} />
      <AvailabilityLabel status={{ availability: 'injured', unavailable_since: '3 days' }} />
      <AvailabilityLabel status={{ availability: 'returning', unavailable_since: '1 day' }} />
      <AvailabilityLabel status={{ availability: 'unavailable', unavailable_since: '12 days' }} />
    </Stack>
  ),
};

export const NewerWording = {
  render: () => (
    <Stack spacing={2}>
      <AvailabilityLabel availabilityStatusEnabled status={{ availability: 'unavailable', unavailable_since: '12 days' }} />
      <AvailabilityLabel availabilityStatusEnabled status={{ availability: 'absent', unavailable_since: '2 days' }} />
    </Stack>
  ),
};
