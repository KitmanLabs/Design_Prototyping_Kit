import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ArrowBackOutlined } from '@mui/icons-material'
import { Box, Button } from '../playbook-components'
import PageState from './PageState'

/**
 * List-detail: a list pane (one third) and a detail pane (two thirds), as in Material 3's
 * list-detail canonical layout. Below the md breakpoint only one pane shows: the list until
 * something is selected, then the detail with a Back button.
 *
 * Use inside PageFrame with `fill`, so each pane scrolls on its own.
 */
function ListDetailLayout({
  list,
  detail,
  hasSelection,
  onBack,
  emptyDetail,
  listWidth = '33%',
  minListWidth = 280,
}) {
  const theme = useTheme()
  const isTwoPane = useMediaQuery(theme.breakpoints.up('md'))

  const detailContent = hasSelection
    ? detail
    : emptyDetail || <PageState kind="empty" title="Nothing selected" description="Choose an item from the list to see it here." />

  if (!isTwoPane) {
    return (
      <Box data-testid="ListDetailLayout" sx={{ height: '100%', minHeight: 0, overflow: 'auto' }}>
        {hasSelection ? (
          <>
            {onBack && (
              <Box sx={{ p: 2, borderBottom: '1px solid var(--color-border-primary)' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation={true}
                  startIcon={<ArrowBackOutlined />}
                  onClick={onBack}
                >
                  Back
                </Button>
              </Box>
            )}
            {detail}
          </>
        ) : (
          list
        )}
      </Box>
    )
  }

  return (
    <Box data-testid="ListDetailLayout" sx={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <Box
        component="nav"
        aria-label="List"
        sx={{
          width: listWidth,
          minWidth: minListWidth,
          flexShrink: 0,
          overflow: 'auto',
          borderRight: '1px solid var(--color-border-primary)',
          bgcolor: 'var(--color-white)',
        }}
      >
        {list}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>{detailContent}</Box>
    </Box>
  )
}

export default ListDetailLayout
