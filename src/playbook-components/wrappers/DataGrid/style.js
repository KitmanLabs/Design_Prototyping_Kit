import { gridClasses } from '@mui/x-data-grid';

const style = {
  default: {
    [`.${gridClasses.columnHeader}:first-of-type, .${gridClasses.cell}:first-of-type`]:
      {
        paddingLeft: '24px',
      },
  },
  noRowsMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pagination: {
    // align pagination to the left
    '.MuiDataGrid-footerContainer > div:first-of-type': {
      display: 'none',
    },
    '.MuiTablePagination-root': {
      '.MuiTablePagination-toolbar': {
        pl: 0,
        '.MuiTablePagination-selectLabel': {
          pl: 2,
          mb: 0,
        },
        // hide displayed rows (e.g. 1–11 of 11)
        '.MuiTablePagination-displayedRows': {
          display: 'none',
        },
        '.MuiInputBase-root': {
          mr: 1,
          '.MuiTablePagination-select': {
            pb: 0,
          },
        },
        '.MuiTablePagination-actions': {
          ml: 0,
        },
      },
    },
  },
  rowSelection: {
    [`.${gridClasses.columnHeaderCheckbox}:first-of-type, .${gridClasses.cellCheckbox}:first-of-type`]:
      {
        paddingLeft: 0,
      },
  },
};

export default style;
