import { Box } from '../../playbook-components';
import { FloorplanFooter } from '../../floorplans';

export default {
  title: 'Floorplans/Footer action bar',
  component: FloorplanFooter,
  render: (args) => (
    <Box sx={{ width: 800 }}>
      <FloorplanFooter {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Finalizing actions for create and edit, sticky at the bottom of the page. Cancel on the left as secondary; the primary action on the far right, with `loading` while it runs; further actions (Save draft, Back) just left of it. Show it only in create and edit, or while there are unsaved changes.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onCancel: () => {},
    primaryAction: { label: 'Save', onClick: () => {} },
  },
};

export const Edit = {};

export const UnsavedChanges = {
  args: { message: 'Unsaved changes', cancelLabel: 'Discard' },
};

export const Saving = {
  args: { primaryAction: { label: 'Save', loading: true, onClick: () => {} } },
};

export const GuidedFlow = {
  args: {
    actions: [
      { id: 'draft', label: 'Save draft', onClick: () => {} },
      { id: 'back', label: 'Back', onClick: () => {} },
    ],
    primaryAction: { label: 'Next', onClick: () => {} },
  },
};
