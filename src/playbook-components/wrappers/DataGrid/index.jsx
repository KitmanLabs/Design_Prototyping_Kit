import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  useGridRootProps,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-pro';
import Box from '@mui/material/Box';

import i18n from '@kitman/common/src/utils/i18n';
import { Pagination, GridPagination } from '@kitman/playbook/components';
import colors from '@kitman/common/src/variables/colors';

import style from './style';
import { PaginationModes } from './types';

const defaultProps = {
  checkboxSelection: false,
  disableChildrenSorting: true,
  disableColumnFilter: true,
  disableColumnMenu: true,
  disableColumnReorder: true,
  disableColumnResize: true,
  disableColumnSelector: true,
  // disableColumnSorting: true, // TODO: available in v7
  disableDensitySelector: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  gridToolBar: [],
  isCellEditable: () => false,
  leftPinnedColumns: [],
  loading: false,
  noRowsMessage: i18n.t('No rows'),
  pageNumber: 0,
  pageSize: 25,
  pageSizeOptions: [5, 10, 25, 50],
  pagination: false,
  rightPinnedColumns: [],
  rowSelection: false,
};

function MultiplePagesDisplayPagination({ page, onPageChange, className }) {
  const {
    rowCount,
    paginationModel: { pageSize },
  } = useGridRootProps();
  return (
    <Pagination
      color="primary"
      className={className}
      // count - this is calculating the row count needed i.e (106 / 25) rounded up = 6 rows
      count={Math.ceil(rowCount / pageSize)}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return (
    <GridPagination
      ActionsComponent={MultiplePagesDisplayPagination}
      {...props}
    />
  );
}

function CustomToolbar(props) {
  const { csvOptions, printOptions, showQuickFilter } = props;

  return (
    <GridToolbarContainer
      sx={{
        button: {
          // Emulating MUI 'contained' variant styles
          background: colors.neutral_200,
          color: colors.grey_200,
          // 20px = 24px of margin - 4px of padding on toolbar container
          margin: '10px 20px',

          '&:hover': {
            background: colors.neutral_400,
          },
        },
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={csvOptions} printOptions={printOptions} />
      {showQuickFilter && (
        <>
          <Box sx={{ flex: '1 1 0%' }} />
          <GridToolbarQuickFilter />
        </>
      )}
    </GridToolbarContainer>
  );
}

// The following props will have the tag ‘CUSTOM PROP’ if it’s a prop built into
// the wrapper to manipulate the data grid.
// The following props will have the tag ‘CUSTOM FUNC’ if it’s a out of the box data grid
// prop and it has been manipulate for further functionality other wise it is an
// out of the box MUI data grid prop.
const DataGrid = ({
  // required props
  columns,
  rows,

  apiRef,
  // Props with defaults — not required.
  // asyncPagination - CUSTOM used to declare that the BE is handling the pagination
  // not MUI out of the box.
  // CUSTOM FUNC
  // 1. Sets paginationMode to "server".
  // 2. Enables pagination.
  // 3. Sets the page size options for table this is used in numbered pagination
  // not infinite scrolling.
  // 4. Sets the paginationModel
  // 5. Adds the CustomToolbar.
  asyncPagination,
  checkboxSelection,
  disableChildrenSorting,
  disableColumnMenu,
  disableColumnReorder,
  disableMultipleColumnsFiltering,
  disableMultipleColumnsSorting,
  // gridToolBar - CUSTOM used to declare what components that appear in the data grid.
  // gridToolBar options = ['enableCSV', 'enablePrint', 'showQuickFilter'],
  gridToolBar,
  // infiniteLoading - CUSTOM to set we are using infinite loading.
  infiniteLoading,
  // infiniteLoadingCall - CUSTOM call for onRowsScrollEnd when using infiniteLoading
  infiniteLoadingCall,
  isCellEditable,
  // leftPinnedColumns - CUSTOM Optional field names to pin to the left
  leftPinnedColumns,
  loading,
  // noRowsMessage - CUSTOM message to display when there is no rows
  noRowsMessage,
  onPaginationModelChange,
  onRowClick,
  // pageNumber - CUSTOM sets the page number on pagination model
  pageNumber,
  pageSize,
  pageSizeOptions,
  // rowsPerPage - CUSTOM async pagination only, pass in current rows per page value
  rowsPerPage,
  // onRowsPerPageChange - CUSTOM async pagination only, callback when rows per page is changed
  onRowsPerPageChange,
  // CUSTOM FUNC
  // 1. Pagination also sets the initial state of the paginationModel i.e pageSize
  // 2. Pagination also sets the initial pageSizeOptions
  pagination,
  // rightPinnedColumns - CUSTOM Optional field names to pin to the right
  rightPinnedColumns,
  rowCount,
  rowSelection,
  disableColumnFilter,
  disableColumnSelector,
  disableColumnSorting,
  disableDensitySelector,

  // available overrides of custom logic/props
  initialState,
  onRowsScrollEnd,
  paginationMode,
  paginationModel,
  slotProps,
  // muiDataGridProps - CUSTOM collects all props sent in not part of the
  // wrapper and spreads them into data grid
  ...muiDataGridProps
}) => {
  const paginationEnabled = asyncPagination || pagination;
  const rowsPerPageEnabled = rowsPerPage && onRowsPerPageChange;
  const defaultPaginationModel = {
    pageSize,
    page: pageNumber,
  };
  return (
    <DataGridPro
      apiRef={apiRef}
      rows={rows}
      rowCount={rowCount}
      columns={
        checkboxSelection
          ? [
              {
                // CUSTOM FUNC over riding the checkbox when using checkboxSelection
                // make it so it isn't hideable in the gird tool bar 'ColumnSelector'
                ...GRID_CHECKBOX_SELECTION_COL_DEF,
                hideable: false,
                headerName: i18n.t('Checkbox Selection'),
              },
              ...columns,
            ]
          : columns
      }
      checkboxSelection={checkboxSelection}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: () => (
          <div css={style.noRowsMessage}>
            <Box sx={{ mt: 1 }}>{noRowsMessage}</Box>
          </div>
        ),
        ...(asyncPagination ? { pagination: CustomPagination } : {}),
      }}
      loading={loading}
      paginationMode={
        paginationMode ??
        (asyncPagination || infiniteLoading
          ? PaginationModes.Server
          : PaginationModes.Client)
      }
      slotProps={
        slotProps ?? {
          toolbar: {
            csvOptions: {
              disableToolbarButton: !gridToolBar?.includes('enableCSV'),
            },
            printOptions: {
              disableToolbarButton: !gridToolBar?.includes('enablePrint'),
            },
            showQuickFilter: gridToolBar?.includes('showQuickFilter'),
          },

          // DeleteIcon in the filter has the 'width: 100%'
          // which in kitman system takes up the whole filter form
          // we overwrite the width to auto so the width is calculated.
          // @author @RHarfordKitmanLabs & @ioconnor90
          filterPanel: {
            filterFormProps: {
              deleteIconProps: {
                sx: {
                  width: 'auto',
                },
              },
            },
          },

          // rows per page overrides
          pagination: {
            labelRowsPerPage: i18n.t('Rows:'),
            ...(asyncPagination &&
              rowsPerPageEnabled && {
                rowsPerPage,
                onRowsPerPageChange: (event) =>
                  onRowsPerPageChange(event.target.value),
              }),
          },
        }
      }
      disableColumnFilter={disableColumnFilter}
      disableColumnSelector={disableColumnSelector}
      // disableColumnSorting={disableColumnSorting} // TODO: available in v7
      disableDensitySelector={disableDensitySelector}
      disableChildrenSorting={disableChildrenSorting}
      isCellEditable={isCellEditable}
      rowSelection={rowSelection}
      disableColumnMenu={disableColumnMenu}
      disableColumnReorder={disableColumnReorder}
      disableMultipleColumnsSorting={disableMultipleColumnsSorting}
      disableMultipleColumnsFiltering={disableMultipleColumnsFiltering}
      disableVirtualization // TODO: (more investigation) can't have this long term. (virtualization makes testing with RTL fail)
      initialState={
        initialState ?? {
          pinnedColumns: {
            left: leftPinnedColumns,
            right: rightPinnedColumns,
          },
          pagination: {
            paginationModel: { pageSize: pagination ? pageSize : rows.length },
          },
        }
      }
      onRowsScrollEnd={() =>
        onRowsScrollEnd ??
        (infiniteLoading &&
          infiniteLoadingCall &&
          infiniteLoadingCall(pageNumber + 1, pageSize))
      }
      onPaginationModelChange={({
        page: selectedPage,
        pageSize: selectedPageSize,
      }) =>
        onPaginationModelChange &&
        onPaginationModelChange(selectedPage, selectedPageSize)
      }
      onRowClick={onRowClick}
      pagination={paginationEnabled}
      paginationModel={
        paginationModel ??
        (asyncPagination ? defaultPaginationModel : undefined)
      }
      pageSizeOptions={paginationEnabled ? pageSizeOptions : [rows.length]}
      {...muiDataGridProps}
      sx={{
        ...muiDataGridProps.sx,
        ...style.default,
        ...(paginationEnabled && style.pagination),
        ...(rowSelection && style.rowSelection),
      }}
    />
  );
};

DataGrid.defaultProps = defaultProps;
export default DataGrid;
