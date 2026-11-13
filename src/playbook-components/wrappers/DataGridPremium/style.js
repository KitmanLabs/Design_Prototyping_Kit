import { STANDARD_TOOLBAR_HEIGHT } from './constants';

const style = {
  gridToolBar: {
    // setting the height of the toolbar to a standard value, so that it doesn't jump
    // when the bulk actions toolbar is shown or hidden
    '& .MuiDataGrid-toolbarContainer': {
      minHeight: STANDARD_TOOLBAR_HEIGHT,
      px: 1,
    },
  },
  pagination: {
    // align pagination to the left to avoid intercom
    '.MuiDataGrid-footerContainer': {
      display: 'flex',
      justifyContent: 'flex-start',
    },
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
};

export default style;
