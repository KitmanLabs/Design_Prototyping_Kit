// Shared DataGrid styling for app pages. Spread it into the sx of the Box that wraps a
// DataGrid, next to that container's own sizing:
//
//   <Box sx={{ ...dataGridStyles, height: 560, width: '100%' }}>
//     <DataGrid ... />
//   </Box>
//
// For a 24px inset that keeps the grid full-bleed, give the first column
// headerClassName/cellClassName 'grid-cell--pad-left' and the last 'grid-cell--pad-right'.
export const dataGridStyles = {
  '& .MuiDataGrid-root': { border: 'none' },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'var(--color-background-primary)',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'var(--font-weight-semibold)',
      fontSize: 'var(--font-size-sm)',
      fontFamily: 'var(--font-family-primary)',
    },
  },
  '& .MuiDataGrid-cell': {
    borderBottom: '1px solid var(--color-border-secondary)',
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-family-primary)',
  },
  '& .grid-cell--pad-left': { pl: 3, paddingLeft: '24px !important' },
  '& .grid-cell--pad-right': { pr: 3, paddingRight: '24px !important' },
  '& .MuiDataGrid-footerContainer': { px: 3 },
}
