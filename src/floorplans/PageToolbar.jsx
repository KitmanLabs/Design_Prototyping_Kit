import { Box, TextField, InputAdornment } from '../playbook-components'
import QuickFilters from '../playbook-components/wrappers/QuickFilters'
import { SearchOutlined } from '@mui/icons-material'

/**
 * The page toolbar region, under the header and tabs. It stays in view while the content
 * scrolls. Lay out search and filters on the left (children) and view-level controls on the
 * right (end). While rows are selected, PageFrame swaps it for the selection bar.
 */
function PageToolbar({ children, end }) {
  return (
    <Box
      data-testid="PageToolbar"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        px: 3,
        py: 1.5,
        minHeight: 64,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, flex: 1, minWidth: 0 }}>
        {children}
      </Box>
      {end && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{end}</Box>}
    </Box>
  )
}

/** The toolbar's search field: filled, small (the theme default), with a search icon. */
export function PageSearch({ value, onChange, placeholder = 'Search', label = 'Search', sx }) {
  return (
    <TextField
      variant="filled"
      hiddenLabel
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      sx={{ width: 280, ...sx }}
      slotProps={{
        htmlInput: { 'aria-label': label },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

/**
 * Quick filter chips (the Playbook QuickFilters). Filters are { key, label }; selecting
 * the selected chip again clears it, so 'all' never needs its own chip.
 */
export function PageQuickFilters({ filters, value, onChange }) {
  return (
    <QuickFilters
      filters={filters}
      selectedFilter={value}
      onQuickSelect={(key) => onChange(key === value ? null : key)}
    />
  )
}

export default PageToolbar
