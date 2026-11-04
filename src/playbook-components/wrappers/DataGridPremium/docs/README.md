# DataGridPremiumWrapper

A wrapper around MUI's `DataGridPremium` component from
`@mui/x-data-grid-premium` designed to simplify its API, provide sensible
defaults, and introduce custom features tailored for Kitman Labs Playbook design
system. This wrapper enhances developer experience by offering built-in
solutions for common patterns like bulk actions, configurable toolbars, and
flexible pagination.

## Features

- **Simplified API & Sensible Defaults**: Reduces boilerplate for common
  configurations.
- **Conditional Bulk Actions Toolbar**: Automatically displays a custom toolbar
  when rows are selected and `bulkActions` are provided.
- **Configurable Standard Toolbar**: Easily control the visibility of standard
  grid toolbar buttons (Columns, Filters, Density, Export, QuickFilter).
- **Customizable Loading Overlays**: Supports different loading indicators
  (`spinner`, `skeleton`, `linear-progress`) or no visual overlay.
- **Flexible Pagination**:
  - **Client-Side (Default)**: Handles pagination internally when all data is
    provided.
  - **Server-Side**: Efficiently handles large datasets by fetching data page by
    page from a backend.
  - **Custom Pagination UI**: Utilizes a Kitman-styled pagination component
    (`MultiplePagesDisplayPagination`) when server-side pagination is active.
- **Passthrough for Advanced Features**: Use advanced `MUIDataGridPremium` props
  like `initialState`, `rowGroupingModel`, `cellSelection`, etc.

## Basic Usage

To get started, you need to provide `rows` and `columns` data:

```jsx
import DataGridPremium from '@kitman/playbook/components/wrappers/DataGridPremium';

const myColumns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', type: 'number', width: 110 },
];

const myRows = [
  { id: 1, name: 'Jon Snow', age: 35 },
  { id: 2, name: 'Cersei Lannister', age: 42 },
  { id: 3, name: 'Daenerys Targaryen', age: 30 },
];

const MyComponent = () => {
  return <DataGridPremium rows={myRows} columns={myColumns} />;
};
```

## Props API

This wrapper exposes a set of props to configure its behavior, while also
allowing any other valid `MUIDataGridPremiumProps` to be passed through.

### Core Props

- `rows: GridRowsProp` (required): Array of row data objects. Each object must
  have a unique id.
- `columns: Array<GridColDef>` (required): Array of column definition objects.
- `loading?: boolean` (default: `false`): If true, displays a loading overlay.
- `loadingVariant?: 'spinner' | 'skeleton' | 'linear-progress' | 'none'`
  (default: `'skeleton'`): Type of loading overlay to show.

### Pagination Props

- `pagination?: boolean` (default: `true`): Toggles the visibility and
  functionality of the pagination UI.
- `pageSize?: number` (default: `25` or value from `DEFAULT_INITIAL_PAGE_SIZE`
  constant):
  - Client-Side: Sets the initial number of rows per page.
  - Server-Side: Sets the current number of rows per page.
- `pageSizeOptions?: Array<number>` (default: `[5, 10, 25, 50]` or value from
  `DEFAULT_PAGE_SIZE_OPTIONS` constant): Options available in the page size
  selector.

### Server-Side Pagination Props

These props are used when `asyncPagination` is `true`.

- `asyncPagination?: boolean `(default: `false`): Set to true to enable
  server-side pagination mode.
- `rowCount?: number` (required if `asyncPagination={true}`): The total number
  of rows available on the server.
- `pageNumber?: number` (default: `0`): The current, 0-indexed page number
  (controlled by the parent when `asyncPagination={true}`).
- `onAsyncPaginationModelChange?: (page: number, pageSize: number) => void`:
  Callback fired when the page number or page size changes in server-side mode.
  The parent component should use this to fetch new data.

### Selection Props

- `checkboxSelection?: boolean` (default: `true` if `bulkActions` are provided,
  `false` otherwise): If `true`, displays checkboxes for row selection.
- `disableRowSelectionOnClick?: boolean` (default: `true`): If `true`, clicking
  a row will not select it (selection only via checkbox or other means).
- `rowSelectionModel?: GridRowSelectionModel | GridRowId[]`: Controlled state for
  selected rows. MUI X v8+ uses `{ type: 'include', ids: Set<GridRowId> }`; the
  wrapper also accepts a plain array of ids. The grid runs with
  `disableRowSelectionExcludeModel`, so `ids` are always the selected rows.
- `onRowSelectionModelChange?: (newSelectionModel: GridRowSelectionModel) => void`:
  Callback for when the row selection changes; receives the `{ type, ids }` model.

### Toolbar Configuration Props

- `bulkActions?: Array<BulkActionItem>`: Array of action definitions for the
  Bulk Actions Toolbar.
  - `BulkActionItem: { key: string, label: string, icon?: React.ReactNode, onAction: (selectedRowIds: GridRowId[]) => void }`
- `showColumnSelectorButton?: boolean` (default: `true`): Toggles visibility of
  the column selector button.
- `showFilterButton?: boolean` (default: `true`): Toggles visibility of the
  filter button.
- `showDensitySelectorButton?: boolean` (default: `true`): Toggles visibility of
  the density selector button.
- `showExportButton?: boolean` (default: `true`): Toggles visibility of the
  export button.
- `showQuickFilter?: boolean` (default: `true`): Toggles visibility of the quick
  filter input in the standard toolbar.
- `excelExportOptions?: GridExcelExportOptions`: Options for Excel export (e.g.,
  fileName, fields, includeHeaders).

### Layout & Appearance Props

- `autoHeight?: boolean` (default: `false`): If `true`, the grid's height
  adjusts to its content.
- `hideFooter?: boolean` (default: `false`): If `true`, the entire footer
  (including pagination and selected row count) is hidden.
- `hideFooterSelectedRowCount?: boolean` (default: `true` if bulk actions UI is
  active, false otherwise): If `true`, the "N rows selected" message in the
  footer is hidden.
- `initialState?: $Shape<GridInitialStateCommunity>`: Allows passing a partial
  initial state to the underlying MUI DataGrid (e.g., for sorting, filtering,
  pinned columns).
- `sx?: SxProps<Theme>`: MUI sx prop for custom styling of the root component.

Any other props not listed here will be passed directly to the underlying
MUIDataGridPremium component.

## Key Features in Detail

### Toolbar Configuration

#### Standar Toolbar (`ConfigurableGridToolbar`)

This toolbar is shown by default when no rows are selected or when bulkActions
are not provided. You can control which buttons appear:

```jsx
<DataGridPremium
  rows={myRows}
  columns={myColumns}
  showFilterButton={false}
  showDensitySelectorButton={false}
  showQuickFilter={true}
/>
```

If all `show...Button` props and `showQuickFilter` are false, and no
`bulkActions` are defined, no toolbar will be rendered.

#### Bulk Actions Toolbar (`BulkActionsToolbar`)

This toolbar automatically appears when:

1. The bulkActions prop is provided with at least one action.
2. One or more rows are selected.

The bulkActions prop takes an array of objects:

```jsx
import DeleteIcon from '@mui/icons-material/DeleteOutlined'; // Example icon (Outlined only)
import ArchiveIcon from '@mui/icons-material/ArchiveOutlined'; // Example icon (Outlined only)

const myBulkActions = [
  {
    key: 'delete',
    label: 'Delete Selected',
    icon: <DeleteIcon />,
    onAction: (selectedIds) => {
      console.log('Delete rows:', selectedIds);
      // Implement deletion logic here
    },
  },
  {
    key: 'archive',
    label: 'Archive Selected',
    icon: <ArchiveIcon />,
    onAction: (selectedIds) => {
      console.log('Archive rows:', selectedIds);
      // Implement archive logic here
    },
  },
];

<DataGridPremium
  rows={myRows}
  columns={myColumns}
  bulkActions={myBulkActions}
  // checkboxSelection will default to true
/>;
```

#### Loading Overlays

Control the loading state using the `loading` prop. The visual appearance can be
changed with `loadingVariant`:

```jsx
// Skeleton (default)
<DataGridPremium rows={[]} columns={myColumns} loading={true} />

// Spinner
<DataGridPremium rows={[]} columns={myColumns} loading={true} loadingVariant="spinner" />

// No visual overlay, but still in loading state (e.g., for background updates)
<DataGridPremium rows={myRows} columns={myColumns} loading={true} loadingVariant="none" />
```

### Pagination

#### 1. Client-Side Pagination (Default)

This is the default mode when asyncPagination is false. The grid expects all
rows to be provided from the BE at once and handles paging internally.

```jsx
const clientSideRows = [
  /* ... all 100 of your rows ... */
];

<DataGridPremium
  rows={clientSideRows}
  columns={myColumns}
  pagination={true} // Enabled by default
  pageSize={10} // Show 10 rows per page initially
  pageSizeOptions={[5, 10, 20, 50]}
  // asyncPagination={false} // This is the default
/>;
```

The standard MUI pagination controls will be used unless overridden by passing a
`slots.pagination` prop.

#### 2. Server-Side Pagination

Enable this mode by setting `asyncPagination={true}`. This is suitable for large
datasets where data is fetched from a BE on demand.

Required Props for Server-Side Pagination:

- `asyncPagination={true}`
- `rows`: An array containing only the data for the current page.
- `rowCount`: The total number of items available on the server.
- `pageNumber`: The current 0-indexed page number (this should be managed by
  your component's state).
- `pageSize`: The number of items per page (this should also be managed by your
  component's state).
- `onAsyncPaginationModelChange`: A callback function
  `(page: number, pageSize: number) => void`. This function is triggered when
  the user tries to change the page or page size. You should use it to:
  1. Fetch the data for the newPage and newPageSize from your backend.
  2. Update your component's state with the new rows, pageNumber, pageSize, and
     rowCount (if it changed).

### Advanced MUI Features

Many advanced features of `MUIDataGridPremium` like row grouping, aggregation,
tree data, and cell selection can be used by passing the relevant props
directly.

```jsx
<DataGridPremium
  rows={myRows}
  columns={myColumns}
  rowGroupingModel={['category']} // Example: Enable row grouping
  initialState={{
    // Example: Pin a column
    pinnedColumns: { left: ['id'] },
  }}
/>
```

For detailed information on these advanced features, please refer to the
official
[MUI DataGridPremium documentation](https://v7.mui.com/x/api/data-grid/data-grid-premium/)
.

### Toolbar Features and Data Operations: Client-Side vs. Server-Side

The behavior of toolbar features like Quick Filter and Column Filters (and also
sorting) changes significantly based on the pagination mode.

#### Client-Side (`asyncPagination={false}`)

- Quick Filter (`GridToolbarQuickFilter`): When `showQuickFilter` is `true`, the
  input filters the data currently loaded in the grid. Since all data is present
  on the client, it effectively searches across the entire dataset.
- Column Filters (`GridToolbarFilterButton`): When `showFilterButton` is `true`,
  users can open the filter panel and apply filters to columns. These filters
  operate on the full dataset available on the client.
- Sorting: Clicking column headers sorts the entire client-side dataset.

All these operations are performed instantly in the browser as they act on the
locally available `rows`.

**Performance Note**: The built-in Quick Filter, Column Filters, and client-side
sorting mechanisms provided by the MUI DataGrid toolbar are highly performant
when operating in client-side pagination mode (`asyncPagination={false}`). This
is because they are designed to work directly on the entire dataset, which is
already available in the browser's memory, allowing for instantaneous filtering
and sorting responses. However, we need to be careful with performance and
memory usage when the dataset is too large.

### Server-Side (`asyncPagination={true}`)

When data is paginated from the server, the grid only holds one page of data at
a time. Therefore, built-in MUI client-side operations for filtering and sorting
will only act on that single visible page, which is usually not the desired
behavior.

- Quick Filter (`GridToolbarQuickFilter`):

  - If enabled, by default, it will only filter the rows on the current page.
  - To filter the entire dataset: You need to capture the quick filter's value
    (e.g., by customizing the toolbar or listening to `onFilterModelChange` if
    it generates a compatible model or use a dedicated input component outside
    the grid) and send this search term to the BE. The BE API must then perform
    the search logic across all data and return the filtered (and paginated)
    results. The `pageNumber` should typically be reset to `0` for a new search.

- Column Filters (`GridToolbarFilterButton`):

  - The filter panel will allow users to define filter criteria. The
    `DataGridPremium` needs to be set to `filterMode="server"`.
  - You must use the `onFilterModelChange={(model) => ...}` callback to get the
    `GridFilterModel`.
  - This model (containing filter rules like
    `{ field: 'name', operator: 'contains', value: 'Jon' }`) must be sent to
    backend.
  - The backend then translates this model into a database query to filter the
    entire dataset before pagination.
  - When filters change, the `pageNumber` should typically be reset to `0`.

- Sorting:
  - Similarly, for server-side sorting, set `sortingMode="server"`.
  - Use the `onSortModelChange={(model) => ...}` callback to get the
    `GridSortModel`.
  - Send this model to the backend to order the entire dataset before
    pagination.

### Developer Responsibility for Server-Side Operations:

For` asyncPagination={true}`, the `DataGridPremiumWrapper` provides the UI
elements for these toolbar actions. However, it is the developer's
responsibility to:

1. Set the appropriate mode (e.g., `filterMode="server"`,
   `sortingMode="server"`).
2. Implement the callback functions (`onFilterModelChange`, `onSortModelChange`,
   and handling the quick filter value).
3. Send the filter/sort/search parameters to the backend API.
4. Ensure the backend API can process these parameters.
5. Update the `rows`, `rowCount`, `pageNumber`, etc., props of the
   `DataGridPremiumWrapper` based on the backend's response.
