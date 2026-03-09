// NOTE: Original file imports DummyTablePage from '../../../components/DummyTablePage'.
// This path cannot be resolved in Design_Prototyping_Kit as it references an internal
// monorepo component. The import has been updated to point to playbook-components,
// but DummyTablePage may need to be added to that export if it does not already exist.
import { DummyTablePage } from '../../playbook-components';

export default {
  title: 'Layout/Dummy Table Page',
  component: DummyTablePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => <DummyTablePage />,
};
