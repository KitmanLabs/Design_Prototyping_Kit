import { Box, DataGrid, GridCellExpand } from '../../playbook-components';

const rows = [
  { id: 1, athlete: 'Athlete one', note: 'Short note' },
  { id: 2, athlete: 'Athlete two', note: 'A much longer note that does not fit in the column, so hovering the cell shows the full text in a popper' },
  { id: 3, athlete: 'Athlete three', note: 'Cleared for full training after a two-week return-to-play protocol with no reported symptoms' },
];

const columns = [
  { field: 'athlete', headerName: 'Athlete', width: 160 },
  {
    field: 'note',
    headerName: 'Note',
    width: 240,
    renderCell: (params) => <GridCellExpand value={params.value} width={params.colDef.computedWidth} />,
  },
];

export default {
  title: 'Table/GridCellExpand',
  component: GridCellExpand,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'DataGrid cell renderer for long text. When the value overflows its column, hovering the cell shows the full text. Use it as a column `renderCell`.',
      },
    },
  },
  tags: ['autodocs'],
};

export const InADataGrid = {
  render: () => (
    <Box sx={{ width: 420, height: 260 }}>
      <DataGrid rows={rows} columns={columns} hideFooter />
    </Box>
  ),
};
