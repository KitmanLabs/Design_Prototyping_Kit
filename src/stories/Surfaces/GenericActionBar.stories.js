import { Box, GenericActionBar } from '../../playbook-components';

export default {
  title: 'Surfaces/GenericActionBar',
  component: GenericActionBar,
  render: (args) => (
    <Box sx={{ width: 700 }}>
      <GenericActionBar {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Bulk-action bar shown when rows are selected. Renders nothing when `selectedCount` is 0. Each action is a contained button; `color` defaults to secondary.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    selectedCount: 3,
    // The untranslated export expects a t() function; GenericActionBarTranslated supplies one.
    t: (text) => text,
    actions: [
      { id: 'export', label: 'Export', onClick: () => {} },
      { id: 'archive', label: 'Archive', onClick: () => {} },
      { id: 'assign', label: 'Assign form', color: 'primary', onClick: () => {} },
    ],
  },
  argTypes: {
    selectedCount: { control: { type: 'number', min: 0 } },
    actions: { control: 'object' },
  },
};

export const Default = {};

export const NothingSelected = {
  args: { selectedCount: 0 },
};
