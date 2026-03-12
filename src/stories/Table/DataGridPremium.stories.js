// @flow
import { useState, useEffect } from 'react';
import { Box, DataGridPremium, Typography } from '../../playbook-components';
import {
  type GridRowsProp,
  type GridRowSelectionModel,
  GridLinkOperator,
} from '@mui/x-data-grid-premium';
import { KitmanIcon, KITMAN_ICON_NAMES } from '../../playbook-components/icons';

import { baseColumns, sampleRows, allServerRows } from './utils';

const docs = {
  muiLink: 'https://v7.mui.com/x/react-data-grid/getting-started/',
  figmaLink:
    'https://www.figma.com/design/111qJweoGOlBTRcmptHEf9/The-Playbook-Master?node-id=16158-95984&t=XGfJDw03bBAYGQKC-0',
};

export default {
  title: 'Table/DataGridPremium',
  component: DataGridPremium,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A wrapper around MUI DataGridPremium to simplify its API, provide defaults, and add custom features like conditional bulk actions toolbar, configurable standard toolbar buttons, and loading overlay variants. This also demonstrates native MUI DataGridPremium features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'object',
      description: 'Array of row data objects for the grid.',
    },
    columns: {
      control: 'object',
      description: 'Array of column definition objects.',
    },
    loading: {
      control: 'boolean',
      description: 'If true, the grid shows a loading overlay.',
      defaultValue: false,
    },
    loadingVariant: {
      control: 'select',
      options: ['spinner', 'skeleton', 'linear-progress', 'none'],
      description: 'Variant of the loading overlay to display.',
      defaultValue: 'skeleton',
    },
    pageSize: {
      control: 'number',
      description:
        'Number of rows per page. Initial for client-side, current for server-side.',
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Array of page size options (e.g., [10, 25, 50]).',
    },
    pagination: {
      control: 'boolean',
      description: 'Enable pagination',
      defaultValue: true,
    },
    asyncPagination: {
      control: 'boolean',
      description: 'Enables server-side pagination mode.',
      defaultValue: false,
    },
    rowCount: {
      control: 'number',
      description: 'Total number of rows from server (for asyncPagination).',
    },
    pageNumber: {
      control: 'number',
      description: 'Current 0-indexed page (for asyncPagination).',
    },
    checkboxSelection: {
      control: 'boolean',
      description:
        "If true, checkboxes are displayed for row selection. Defaults to true if 'bulkActions' are provided.",
    },
    disableRowSelectionOnClick: { control: 'boolean', defaultValue: true },
    autoHeight: { control: 'boolean', defaultValue: false },
    height: {
      control: 'number',
      description: 'Height of the grid container when autoHeight is false.',
    },
    width: {
      control: 'text',
      description: 'Width of the grid container (e.g., "100%", "950px").',
    },
    hideFooter: {
      control: 'boolean',
      description: 'If true, the entire footer is hidden. Defaults to false.',
      defaultValue: false,
    },
    hideFooterSelectedRowCount: {
      control: 'boolean',
      description:
        'If true, the selected row count in the footer is hidden. Defaults to true if bulk actions UI is active.',
    },
    initialState: { control: 'object' },
    bulkActions: {
      control: 'object',
      description:
        'Array of BulkActionItem definitions for the bulk actions toolbar.',
    },
    excelExportOptions: {
      control: 'object',
      description: 'Options for Excel export.',
    },
    showColumnSelectorButton: {
      control: 'boolean',
      description: 'If true, shows the column selector button in the toolbar.',
      defaultValue: true,
    },
    showFilterButton: {
      control: 'boolean',
      description: 'If true, shows the filter button in the toolbar.',
      defaultValue: true,
    },
    showDensitySelectorButton: {
      control: 'boolean',
      description: 'If true, shows the density selector button in the toolbar.',
      defaultValue: true,
    },
    showExportButton: {
      control: 'boolean',
      description: 'If true, shows the export button in the toolbar.',
      defaultValue: true,
    },
    showQuickFilter: {
      control: 'boolean',
      description: 'If true, shows the quick filter input in the toolbar.',
      defaultValue: true,
    },
    rowGroupingModel: {
      control: 'object',
      description: "Controls the row grouping. Example: `['category']`",
    },
    defaultGroupingExpansionDepth: {
      control: 'number',
      description:
        'Default expansion depth for grouped rows. -1 for all, 0 for none.',
    },
    cellSelection: {
      control: 'boolean',
      description: 'If true, enables cell selection mode.',
      defaultValue: false,
    },
  },
};

const fetchServerPageData = async (page, pageSize) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const start = page * pageSize;
  const end = start + pageSize;
  const paginatedRows = allServerRows.slice(start, end);
  return { rows: paginatedRows, totalRows: allServerRows.length };
};

const ServerSidePaginationTemplate = (args, { updateArgs }) => {
  const [serverRows, setServerRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(args.pageNumber || 0);
  const [pageSize, setPageSize] = useState(args.pageSize || 10);
  const [loading, setLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const fetchData = async (currentPage, currentPageSize) => {
    setLoading(true);
    try {
      const { rows: newRows, totalRows } = await fetchServerPageData(currentPage, currentPageSize);
      setServerRows(newRows);
      setRowCount(totalRows);
      setPageNumber(currentPage);
      setPageSize(currentPageSize);
      updateArgs({ rows: newRows, rowCount: totalRows, pageNumber: currentPage, pageSize: currentPageSize });
    } catch (error) {
      console.error('Failed to fetch server data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(pageNumber, pageSize); }, []);

  const handlePaginationModelChange = (newPage, newPageSize) => { fetchData(newPage, newPageSize); };

  const storyLayout = args.layout || 'fullscreen';
  const calculateHeight = (storyArgs, layout) => {
    if (storyArgs.autoHeight) return undefined;
    if (storyArgs.height) return storyArgs.height;
    return layout === 'fullscreen' ? 'calc(100vh - 80px)' : 600;
  };
  const calculatedWidth = args.width || (storyLayout === 'fullscreen' ? '100%' : '950px');
  const calculatedPadding = args.noPadding ? 0 : 2;
  const boxStyles = { height: calculateHeight(args, storyLayout), width: calculatedWidth, p: calculatedPadding, boxSizing: 'border-box' };

  return (
    <Box sx={boxStyles}>
      {args.storyTitle && !args.noTitle && (
        <Typography variant="h6" gutterBottom sx={{ p: storyLayout === 'fullscreen' ? 2 : 0, mb: 1 }}>
          {args.storyTitle}
        </Typography>
      )}
      <DataGridPremium
        columns={args.columns || baseColumns}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newSelectionModel) => setRowSelectionModel(newSelectionModel)}
        pageSizeOptions={args.pageSizeOptions || [5, 10, 20, 50]}
        loadingVariant={args.loadingVariant || 'skeleton'}
        checkboxSelection={args.checkboxSelection}
        {...args}
        pagination
        rows={serverRows}
        loading={loading}
        asyncPagination
        rowCount={rowCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        onAsyncPaginationModelChange={handlePaginationModelChange}
      />
    </Box>
  );
};

const Template = (args, { updateArgs }) => {
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [currentRows, setCurrentRows] = useState(args.rows || sampleRows);
  const initialRowGroupingModel = args.rowGroupingModel || (args.initialState && args.initialState.rowGrouping && args.initialState.rowGrouping.model);
  const [rowGroupingModelState, setRowGroupingModelState] = useState(initialRowGroupingModel);

  useEffect(() => { if (args.rows) { setCurrentRows(args.rows); } }, [args.rows]);
  useEffect(() => { setRowGroupingModelState(args.rowGroupingModel); }, [args.rowGroupingModel]);

  const commonProps = {
    columns: args.columns || baseColumns,
    rowSelectionModel,
    onRowSelectionModelChange: (newSelectionModel) => setRowSelectionModel(newSelectionModel),
    pageSize: args.pageSize || 10,
    pageSizeOptions: args.pageSizeOptions || [5, 10, 20, 50, 100],
    loading: args.loading || false,
    loadingVariant: args.loadingVariant || 'skeleton',
    checkboxSelection: args.checkboxSelection,
    excelExportOptions: args.excelExportOptions || { fileName: 'story-export' },
    rowGroupingModel: rowGroupingModelState,
    onRowGroupingModelChange: (newModel) => { setRowGroupingModelState(newModel); updateArgs({ rowGroupingModel: newModel }); },
    defaultGroupingExpansionDepth: args.defaultGroupingExpansionDepth === undefined ? 0 : args.defaultGroupingExpansionDepth,
    cellSelection: args.cellSelection,
  };

  const updateRowsForStory = (updatedRows) => { setCurrentRows(updatedRows); updateArgs({ rows: updatedRows }); };

  let storyBulkActions = args.bulkActions;
  if (args.bulkActions && args.onBulkAction) {
    storyBulkActions = args.bulkActions.map((action) => ({
      ...action,
      onAction: (selectedIds) => args.onBulkAction(action.key, selectedIds, currentRows, updateRowsForStory, setRowSelectionModel),
    }));
  }

  const storyLayout = args.layout || 'fullscreen';
  const calculateHeight = (storyArgs, layout) => {
    if (storyArgs.autoHeight) return undefined;
    if (storyArgs.height) return storyArgs.height;
    return layout === 'fullscreen' ? 'calc(100vh - 80px)' : 600;
  };
  const calculatedWidth = args.width || (storyLayout === 'fullscreen' ? '100%' : '950px');
  const calculatedPadding = args.noPadding ? 0 : 2;
  const boxStyles = { height: calculateHeight(args, storyLayout), width: calculatedWidth, p: calculatedPadding, boxSizing: 'border-box' };

  return (
    <Box sx={boxStyles}>
      {args.storyTitle && !args.noTitle && (
        <Typography variant="h6" gutterBottom sx={{ p: storyLayout === 'fullscreen' ? 2 : 0, mb: 1 }}>
          {args.storyTitle}
        </Typography>
      )}
      <DataGridPremium {...commonProps} {...args} rows={currentRows} bulkActions={storyBulkActions} />
    </Box>
  );
};

export const Default = {
  render: Template,
  args: { storyTitle: 'Default Configuration (Standard Toolbar)', rows: sampleRows, columns: baseColumns, height: 450, layout: 'centered', width: '950px', asyncPagination: false },
};

export const WithBulkActions = {
  render: Template,
  args: {
    storyTitle: 'With Bulk Actions Toolbar',
    rows: [...sampleRows],
    columns: baseColumns,
    layout: 'centered',
    height: 450,
    width: '950px',
    checkboxSelection: true,
    bulkActions: [
      { key: 'delete', label: 'Delete', icon: <KitmanIcon name={KITMAN_ICON_NAMES.Delete} fontSize="small" /> },
      { key: 'archive', label: 'Archive', icon: <KitmanIcon name={KITMAN_ICON_NAMES.ArchiveOutlined} fontSize="small" /> },
    ],
    onBulkAction: (actionKey, selectedIds, currentStoryRows, setStoryRows, setStorySelectionModel) => {
      alert(`Action: ${actionKey} on IDs: ${selectedIds.join(', ')}`);
      let newRows = [...currentStoryRows];
      if (actionKey === 'delete') { newRows = currentStoryRows.filter((row) => !selectedIds.includes(row.id)); }
      else if (actionKey === 'archive') { newRows = currentStoryRows.map((row) => selectedIds.includes(row.id) ? { ...row, status: 'Archived (Bulk)' } : row); }
      setStoryRows(newRows);
      setStorySelectionModel([]);
    },
    excelExportOptions: { fileName: 'bulk-action-export' },
  },
};

export const LoadingSpinner = {
  render: Template,
  args: { storyTitle: 'Loading State - Spinner Overlay', rows: [], columns: baseColumns, loading: true, loadingVariant: 'spinner', height: 300, layout: 'centered', width: '950px' },
};

export const LoadingSkeleton = {
  render: Template,
  args: { storyTitle: 'Loading State - Skeleton Overlay', rows: [...sampleRows], columns: baseColumns, loading: true, loadingVariant: 'skeleton', height: 500, layout: 'centered', width: '950px' },
};

export const ServerSidePaginationWithCustomComponent = {
  render: ServerSidePaginationTemplate,
  args: {
    storyTitle: 'Server-Side Pagination (with Custom Pagination Component)',
    columns: baseColumns,
    pageNumber: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    showQuickFilter: false,
    showColumnSelectorButton: true,
    showFilterButton: false,
    showDensitySelectorButton: true,
    showExportButton: false,
    height: 550,
    layout: 'centered',
    width: '950px',
  },
};

export const RowGroupingByCategory = {
  render: Template,
  args: { storyTitle: 'Row Grouping - Grouped by Category (Initially Collapsed)', rows: sampleRows, columns: baseColumns, rowGroupingModel: ['category'], defaultGroupingExpansionDepth: 0, height: 'calc(100vh - 100px)' },
};
