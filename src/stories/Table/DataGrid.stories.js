// NOTE: Original file imports test data from:
//   '@kitman/playbook/components/wrappers/DataGrid/__tests__/DataGridTestData'
// This path cannot be resolved in Design_Prototyping_Kit. Placeholder data is used below.
// Replace with actual data or add the test data file to this repo.
import { Box, DataGrid } from '../../playbook-components';
import { useState } from 'react';

const docs = {
  muiLink: 'https://mui.com/x/api/data-grid/data-grid-pro/',
  figmaLink:
    'https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=216-100624&mode=design&t=UGvgdvU82QuilQbp-0',
};

// Placeholder data — replace with actual DataGridTestData if available
const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First name', width: 150, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 150, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 110, editable: true },
];

export default {
  title: 'Table/Data Grid',
  render: ({ ...args }) => (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid {...args} />
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
    },
  },
  tags: ['autodocs'],

  argTypes: {
    rows: {
      control: 'array',
      defaultValue: rows,
      description:
        'The object of rows to display in the data grid and the total amount of items',
    },
    columns: {
      control: 'array',
      defaultValue: columns,
      description: 'The array of headers to display in the data grid',
    },
    checkboxSelection: {
      control: 'boolean',
      defaultValue: false,
      description: 'Make the grid have checkbox selection',
    },
    disableRowSelectionOnClick: {
      control: 'boolean',
      defaultValue: false,
      description: 'Disable selection on click of grid row',
    },
    gridToolBar: {
      control: 'check',
      defaultValue: [],
      options: ['enableCSV', 'enablePrint', 'showQuickFilter'],
    },
    noRowsMessage: {
      control: 'text',
      defaultValue: 'No rows',
      description: 'The message that should display when there is no rows',
    },
    pageSizeOptions: {
      control: 'array',
      defaultValue: [5, 10, 25, 50],
      description:
        'The available page sizes in pagination within the data grid (works with pagination)',
    },
    pagination: {
      control: 'boolean',
      defaultValue: true,
      description: 'Make the grid have pagination',
    },
  },
};

export const Story = {
  args: {
    rows,
    columns,
    checkboxSelection: true,
    rowSelection: true,
    disableRowSelectionOnClick: false,
    gridToolBar: [],
    leftPinnedColumns: [], // no control as initial state prop (i.e needs to be present on first render)
    noRowsMessage: 'No rows',
    pageSize: 5, // no control as initial state prop (i.e needs to be present on first render)
    pageSizeOptions: [5, 10, 25, 50],
    pagination: true,
    rightPinnedColumns: [], // no control as initial state prop (i.e needs to be present on first render)
  },
};

export const WithInfiniteLoading = () => {
  const [loading, setLoading] = useState(false);
  const [displayRows, setDisplayRows] = useState(rows.slice(0, 25));
  const [paginationModel, setPaginationModel] = useState({
    pageNumber: 0,
    pageSize: 25,
  });
  const infiniteDataLoading = (nextPage, pageSize) => {
    setLoading(true);

    return new Promise((resolve) => {
      return setTimeout(
        () =>
          resolve(
            rows.slice(
              (paginationModel.pageNumber + 1) * pageSize,
              (nextPage + 1) * pageSize
            )
          ),
        1000
      );
    }).then((newRows) => {
      setLoading(false);
      setPaginationModel((prev) => {
        return {
          ...prev,
          pageNumber: prev.pageNumber + 1,
        };
      });
      setDisplayRows((prev) => {
        return prev.concat(newRows);
      });
    });
  };

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid
        columns={columns}
        rows={displayRows}
        rowCount={rows.length}
        infiniteLoadingCall={
          rows.length !== displayRows.length ? infiniteDataLoading : null
        }
        infiniteLoading
        pageSize={paginationModel.pageSize}
        pageNumber={paginationModel.pageNumber}
        loading={loading}
      />
    </Box>
  );
};
export const NumberedPagination = () => {
  const [loading, setLoading] = useState(false);
  const [displayRows, setDisplayRows] = useState(rows.slice(0, 25));
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [paginationModel, setPaginationModel] = useState({
    pageNumber: 0,
    pageSize: 25,
  });

  const onPaginationModelChange = (selectedPage, selectedPageSize) => {
    setLoading(true);

    return new Promise((resolve) => {
      return setTimeout(
        () =>
          resolve(
            rows.slice(
              selectedPage * selectedPageSize,
              (selectedPage + 1) * selectedPageSize
            )
          ),
        1000
      );
    }).then((newRows) => {
      setLoading(false);
      setPaginationModel({
        pageSize: selectedPageSize,
        pageNumber: selectedPage,
      });
      setDisplayRows(newRows);
    });
  };

  return (
    <Box sx={{ height: 400, width: 1000 }}>
      <DataGrid
        columns={columns}
        rows={displayRows}
        rowCount={rows.length}
        asyncPagination
        pageSizeOptions={[25, 50, 100]}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(perPage) => {
          setRowsPerPage(perPage);
          onPaginationModelChange(0, perPage);
        }}
        onPaginationModelChange={onPaginationModelChange}
        pageSize={paginationModel.pageSize}
        pageNumber={paginationModel.pageNumber}
        loading={loading}
      />
    </Box>
  );
};
