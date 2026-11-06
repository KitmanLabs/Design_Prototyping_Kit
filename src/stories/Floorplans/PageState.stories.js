import { Box } from '../../playbook-components';
import { PageState } from '../../floorplans';

export default {
  title: 'Floorplans/Page states',
  component: PageState,
  render: (args) => (
    <Box sx={{ width: 640, border: '1px dashed var(--color-border-primary)' }}>
      <PageState {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One component for empty, no results, no access, error and loading. Each kind supplies an icon and a default message; pass `title`, `description` and `action` to fit the page.',
      },
    },
  },
  tags: ['autodocs'],
  args: { kind: 'empty' },
  argTypes: {
    kind: { control: 'select', options: ['empty', 'noResults', 'noAccess', 'error', 'loading'] },
  },
};

export const Empty = {
  args: {
    title: 'No athletes yet',
    description: 'Add the athletes in this squad to start tracking availability.',
    action: { label: 'Add athlete', onClick: () => {} },
  },
};

export const NoResults = { args: { kind: 'noResults' } };

export const NoAccess = { args: { kind: 'noAccess' } };

export const ErrorState = { args: { kind: 'error', action: { label: 'Try again', onClick: () => {} } } };

export const Loading = { args: { kind: 'loading' } };
