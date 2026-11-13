import { useMemo, useState } from 'react';
import { Box, TabBar, Typography, DataGrid } from '../../playbook-components';
import {
  PageFrame,
  PageHeader,
  PageToolbar,
  PageSearch,
  PageQuickFilters,
  FloorplanFooter,
  PageState,
} from '../../floorplans';
import { dataGridStyles } from '../../components/dataGridStyles';
import athletes from '../../data/athletes';

const availabilityFilters = [
  { key: 'Available', label: 'Available' },
  { key: 'Injured', label: 'Injured' },
];

const columns = [
  { field: 'name', headerName: 'Name', flex: 1, valueGetter: (_value, row) => `${row.firstname} ${row.lastname}` },
  { field: 'position', headerName: 'Position', width: 140 },
  { field: 'squad_name', headerName: 'Squad', width: 140 },
  { field: 'availability_status', headerName: 'Availability', width: 140 },
];

const viewTabs = [
  { tabKey: 'all', tabHash: '#all', title: `All ${athletes.length}` },
  { tabKey: 'review', tabHash: '#review', title: 'Needs review 2' },
];

// The regions of the shared page anatomy, filled the way a Collection fills them.
const AnatomyDemo = ({ showFooter, startSelected, state }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [tab, setTab] = useState('#all');
  const [selection, setSelection] = useState(startSelected ? [1, 2] : []);

  const rows = useMemo(
    () =>
      athletes.filter(
        (a) =>
          (!filter || a.availability_status === filter) &&
          `${a.firstname} ${a.lastname}`.toLowerCase().includes(search.toLowerCase())
      ),
    [filter, search]
  );

  let content;
  if (state) {
    content = <PageState kind={state} />;
  } else if (rows.length === 0) {
    content = <PageState kind="noResults" />;
  } else {
    content = (
      <Box sx={{ ...dataGridStyles, height: 420 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          hideFooter
          rowSelectionModel={{ type: 'include', ids: new Set(selection) }}
          onRowSelectionModelChange={(model) => setSelection([...model.ids])}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 760, overflow: 'auto', border: '1px dashed var(--color-border-primary)' }}>
      <PageFrame
        header={
          <PageHeader
            title="Athletes"
            primaryAction={{ id: 'add', label: 'Add athlete', onClick: () => {} }}
            secondaryAction={{ id: 'import', label: 'Import', onClick: () => {} }}
            moreActions={[{ id: 'archive', label: 'View archived', onClick: () => {} }]}
          />
        }
        tabs={<TabBar tabs={viewTabs} value={tab} onChange={setTab} />}
        toolbar={
          <PageToolbar>
            <PageSearch value={search} onChange={setSearch} placeholder="Search athletes" />
            <PageQuickFilters filters={availabilityFilters} value={filter} onChange={setFilter} />
          </PageToolbar>
        }
        selection={{
          count: selection.length,
          actions: [
            { id: 'export', label: 'Export', onClick: () => {} },
            { id: 'assign', label: 'Assign form', color: 'primary', onClick: () => {} },
          ],
        }}
        footer={
          <FloorplanFooter
            open={showFooter}
            message="Unsaved changes"
            onCancel={() => {}}
            primaryAction={{ label: 'Save', onClick: () => {} }}
          />
        }
      >
        {content}
      </PageFrame>
    </Box>
  );
};

export default {
  title: 'Floorplans/Page anatomy',
  component: PageFrame,
  render: (args) => <AnatomyDemo {...args} />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'PageFrame is the shared page anatomy under every floorplan: header (Playbook HeaderNew), tabs (TabBar), toolbar (search and QuickFilters), selection bar (GenericActionBar, which replaces the toolbar while rows are selected), content, and the footer action bar for create and edit. Pages compose these slots; see docs/reference/design-system.md, "Floorplans".',
      },
    },
  },
  tags: ['autodocs'],
  args: { showFooter: false, startSelected: false, state: undefined },
  argTypes: {
    state: { control: 'select', options: [undefined, 'loading', 'empty', 'noResults', 'noAccess', 'error'] },
  },
};

export const Default = {};

export const WithSelection = { args: { startSelected: true } };

export const WithUnsavedChanges = { args: { showFooter: true } };

export const Loading = { args: { state: 'loading' } };

export const HeaderOnly = {
  render: () => (
    <PageFrame
      header={
        <PageHeader
          title="Marcus Johnson"
          onBackClick={() => {}}
          listItems={[
            { id: 'position', label: 'Position', value: 'Forward' },
            { id: 'squad', label: 'Squad', value: 'First Team' },
            { id: 'age', label: 'Age', value: '25' },
          ]}
          badges={[{ id: 'available', label: 'Available', color: 'success' }]}
          primaryAction={{ id: 'log', label: 'Log injury', onClick: () => {} }}
        />
      }
    >
      <Typography variant="body2">Record content</Typography>
    </PageFrame>
  ),
};
