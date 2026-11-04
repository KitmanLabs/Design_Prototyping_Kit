// This component wraps MUI's DataGridPremium to provide a simplified API,
// props defaults, and custom features like a conditional bulk actions toolbar
// and configurable loading overlay variants.

import { useState, useMemo, } from 'react';
import { DataGridPremium as MUIDataGridPremium } from '@mui/x-data-grid-premium';
import {
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_INITIAL_PAGE_SIZE,
} from './constants';
import style from './style'; // Custom styles for DataGridPremium wrapper
import BulkActionsToolbar, {
} from './components/BulkActionsToolbar'; // Custom toolbar for bulk actions
import ConfigurableGridToolbar from './components/ConfigurableGridToolbar'; // MUI default Grid toolbar for configurable buttons
import CustomPagination from './components/CustomPagination'; // Custom pagination component




const toSelectionModel = (model) =>
  Array.isArray(model) ? { type: 'include', ids: new Set(model) } : model;

const DataGridPremium = ({
  rows,
  columns,
  loading = false,
  loadingVariant = 'skeleton',
  pagination = true,
  pageSize: pageSizeProp = DEFAULT_INITIAL_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  asyncPagination = false,
  rowCount: rowCountProp,
  pageNumber: pageNumberProp = 0,
  onAsyncPaginationModelChange,
  checkboxSelection: checkboxSelectionProp,
  disableRowSelectionOnClick = true,
  autoHeight = false,
  initialState,
  bulkActions,
  rowSelectionModel: rowSelectionModelProp,
  onRowSelectionModelChange: onRowSelectionModelChangeProp,
  hideFooter: hideFooterProp,
  hideFooterSelectedRowCount: hideFooterSelectedRowCountProp,
  excelExportOptions,
  showColumnSelectorButton = true,
  showFilterButton = true,
  showDensitySelectorButton = true,
  showExportButton = true,
  showQuickFilter = true,
  slots: slotsProp, // Custom slots for toolbar, pagination, etc.
  sx: sxProp, // Deconstructing sx to merge with internal styles
  ...rest // Spread any other valid DataGridPremiumProps
}) => {
  // Row Selection State Management
  // MUI X v8+ models selection as { type: 'include' | 'exclude', ids: Set }. The grid runs with
  // disableRowSelectionExcludeModel, so ids are always the selected rows. Callers may still
  // pass an array of ids; selectedIds is the array the rest of the wrapper works with.
  const [internalSelectionModel, setInternalSelectionModel] = useState(
    () => toSelectionModel([])
  );
  const isSelectionControlled = rowSelectionModelProp !== undefined;
  const currentSelectionModel = isSelectionControlled
    ? toSelectionModel(rowSelectionModelProp)
    : internalSelectionModel;
  const selectedIds = [...currentSelectionModel.ids];

  const handleRowSelectionModelChange = (newSelectionModel) => {
    if (!isSelectionControlled) {
      setInternalSelectionModel(newSelectionModel);
    }
    if (onRowSelectionModelChangeProp) {
      onRowSelectionModelChangeProp(newSelectionModel);
    }
  };

  // Determine Final Prop Values with Defaults
  const checkboxSelection =
    checkboxSelectionProp ?? (!!bulkActions && bulkActions.length > 0);
  const hideFooter = hideFooterProp ?? false;
  const shouldDefaultHideSelectedCountFooter =
    selectedIds.length > 0 && !!bulkActions && bulkActions.length > 0;
  const hideFooterSelectedRowCount =
    hideFooterSelectedRowCountProp ?? shouldDefaultHideSelectedCountFooter;

  // Pagination Logic
  const finalPaginationMode = asyncPagination ? 'server' : 'client';

  // Construct paginationModel for MUI DataGrid if in async mode or controlled
  // This is the 'controlled' model passed directly as a prop to MUIDataGridPremium
  const muiPaginationModel = useMemo(() => {
    if (asyncPagination) {
      return {
        page: pageNumberProp,
        pageSize: pageSizeProp,
      };
    }
    // If not async, and user passes paginationModel via `...rest`, it will be used.
    // Otherwise, pagination is uncontrolled (or controlled via initialState).
    return rest.paginationModel; // Pass through if provided directly
  }, [asyncPagination, pageNumberProp, pageSizeProp, rest.paginationModel]);

  // Adapt the onAsyncPaginationModelChange callback for MUI's expected signature
  const handleMuiPaginationModelChange = useMemo(() => {
    if (asyncPagination && onAsyncPaginationModelChange) {
      return (newModel) => {
        // newModel is { page: number, pageSize: number }
        onAsyncPaginationModelChange(newModel.page, newModel.pageSize);
      };
    }
    // If not async, and user passes onPaginationModelChange via `...rest`, it will be used.
    return rest.onPaginationModelChange; // Pass through if provided directly
  }, [
    asyncPagination,
    onAsyncPaginationModelChange,
    rest.onPaginationModelChange,
  ]);

  const finalInitialState = useMemo(() => {
    const baseState = { ...initialState };

    // If not using asyncPagination (i.e., client-side) AND pagination is not directly controlled by muiPaginationModel
    // set up the initial pagination model from props.
    if (!asyncPagination && !muiPaginationModel) {
      baseState.pagination = {
        ...initialState?.pagination,
        paginationModel: {
          pageSize:
            pageSizeProp ?? // Use the unified pageSizeProp
            initialState?.pagination?.paginationModel?.pageSize ??
            DEFAULT_INITIAL_PAGE_SIZE, // Fallback if pageSizeProp is undefined
          page: initialState?.pagination?.paginationModel?.page ?? 0,
          // Spread any other paginationModel fields from initialState
          ...(initialState?.pagination?.paginationModel || {}),
        },
      };
    }
    // If asyncPagination is true, muiPaginationModel will be passed as a direct prop,
    // and MUI prioritizes direct props over initialState for controlled components.
    return baseState;
  }, [initialState, pageSizeProp, asyncPagination, muiPaginationModel]);

  // Conditional Toolbar and Overlay Logic
  const showBulkActionUI =
    selectedIds.length > 0 && bulkActions && bulkActions.length > 0;

  const calculatedSlots = useMemo(() => {
    const determinedSlots = {};
    const noStandardToolbarButtons =
      !showColumnSelectorButton &&
      !showFilterButton &&
      !showDensitySelectorButton &&
      !showExportButton &&
      !showQuickFilter;

    if (!bulkActions && noStandardToolbarButtons) {
      determinedSlots.toolbar = () => null; // No toolbar if no actions or buttons
    } else {
      determinedSlots.toolbar = showBulkActionUI
        ? BulkActionsToolbar
        : ConfigurableGridToolbar;
    }

    if (loading && loadingVariant === 'none') {
      determinedSlots.loadingOverlay = () => null;
    }
    return determinedSlots;
  }, [
    showBulkActionUI,
    bulkActions,
    showColumnSelectorButton,
    showFilterButton,
    showDensitySelectorButton,
    showExportButton,
    showQuickFilter,
    loading,
    loadingVariant,
  ]);

  // Modify finalSlots to conditionally include CustomPagination
  const finalSlots = useMemo(() => {
    const determinedSlots = { ...calculatedSlots };

    if (asyncPagination) {
      determinedSlots.pagination = CustomPagination;
    }
    // If slotsProp is provided, merge it with the determined slots
    // This allows users to override or extend the default slots
    return {
      ...determinedSlots,
      ...(slotsProp || {}),
    };
  }, [calculatedSlots, asyncPagination, slotsProp]);

  const slotProps = useMemo(() => {
    let toolbarSpecificProps;
    if (showBulkActionUI) {
      toolbarSpecificProps = {
        selectedRowIds: selectedIds,
        bulkActions: bulkActions || [],
        // Allow user to pass additional props to BulkActionsToolbar
        ...(rest.slotProps?.toolbar || {}),
      };
    } else {
      // Props for the ConfigurableGridToolbar
      const configurableGridToolbarProps = {
        showColumnSelectorButton,
        showFilterButton,
        showDensitySelectorButton,
        showExportButton,
        showQuickFilter,
        excelExportOptions,
        quickFilterProps: {
          debounceMs: 500,
          variant: 'filled',
          size: 'small',
          hiddenLabel: true,
        },
      };
      // Merge with user-provided slotProps.toolbar, allowing override of quickFilterProps etc.
      toolbarSpecificProps = {
        ...configurableGridToolbarProps,
        ...(rest.slotProps?.toolbar || {}),
      };
    }

    const loadingOverlayConfig = {};
    if (loading && loadingVariant !== 'none' && loadingVariant !== 'spinner') {
      loadingOverlayConfig.variant = loadingVariant;
    }

    const commonSlotProps = {
      filterPanel: {
        // Styling for the filter panel to match our design system
        filterFormProps: {
          deleteIconProps: { sx: { width: 'auto' } },
          logicOperatorInputProps: { sx: { width: 'auto' } },
          columnInputProps: { sx: { mr: 0.5 } },
          operatorInputProps: { sx: { mr: 0.5 } },
          valueInputProps: { InputComponentProps: { variant: 'filled' } },
        },
      },
      baseButton: {
        variant: 'contained',
        color: 'secondary',
        size: 'small',
      },
    };

    let finalSlotPropsConfig = {
      toolbar: toolbarSpecificProps,
      ...commonSlotProps,
      // Merge other user-defined slotProps, ensuring they don't overwrite toolbar or commonSlotProps already handled
      ...Object.keys(rest.slotProps || {}).reduce((acc, key) => {
        if (
          key !== 'toolbar' &&
          key !== 'loadingOverlay' &&
          !(key in commonSlotProps)
        ) {
          acc[key] = rest.slotProps[key];
        }
        return acc;
      }, {}),
    };

    if (Object.keys(loadingOverlayConfig).length > 0) {
      finalSlotPropsConfig = {
        ...finalSlotPropsConfig,
        loadingOverlay: {
          ...(rest.slotProps?.loadingOverlay || {}),
          ...loadingOverlayConfig,
        },
      };
    } else if (rest.slotProps?.loadingOverlay) {
      finalSlotPropsConfig = {
        ...finalSlotPropsConfig,
        loadingOverlay: rest.slotProps.loadingOverlay,
      };
    }

    return finalSlotPropsConfig;
  }, [
    showBulkActionUI,
    currentSelectionModel,
    bulkActions,
    excelExportOptions,
    loading,
    loadingVariant,
    rest.slotProps,
    showColumnSelectorButton,
    showFilterButton,
    showDensitySelectorButton,
    showExportButton,
    showQuickFilter,
  ]);

  return (
    <MUIDataGridPremium
      rows={rows}
      columns={columns}
      loading={loading}
      // Pagination Props for MUIDataGridPremium
      pagination={pagination} // General enable/disable
      pageSizeOptions={pageSizeOptions} // Options for page size selector
      paginationMode={finalPaginationMode} // 'server' or 'client'
      initialState={finalInitialState} // For client-side initial setup if uncontrolled
      // For server-side pagination (and controlled client-side)
      {...(asyncPagination && { rowCount: rowCountProp })}
      {...(muiPaginationModel && { paginationModel: muiPaginationModel })} // Controlled page & pageSize
      {...(handleMuiPaginationModelChange && {
        onPaginationModelChange: handleMuiPaginationModelChange,
      })}
      checkboxSelection={checkboxSelection}
      rowSelectionModel={currentSelectionModel}
      onRowSelectionModelChange={handleRowSelectionModelChange}
      disableRowSelectionExcludeModel
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      autoHeight={autoHeight}
      slots={finalSlots}
      slotProps={slotProps}
      hideFooter={hideFooter}
      hideFooterSelectedRowCount={hideFooterSelectedRowCount}
      // MUI X v8+ only renders the toolbar slot when showToolbar is set.
      showToolbar
      sx={{
        ...style.gridToolBar,
        ...style.pagination,
        ...sxProp,
      }}
      {...rest}
    />
  );
};

export default DataGridPremium;
