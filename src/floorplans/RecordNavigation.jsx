import { Box, IconButton, Tooltip, Typography } from '../playbook-components'
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material'

/**
 * Previous and next record, for a Record opened from a Collection. Sits at the right of
 * the tabs row. `position` is 0-based; `total` is the size of the Collection.
 */
function RecordNavigation({ position, total, onPrevious, onNext, noun = 'record' }) {
  if (position < 0 || total < 2) return null

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, flexShrink: 0 }}>
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mr: 0.5 }}>
        {position + 1} of {total}
      </Typography>
      <Tooltip title={`Previous ${noun}`}>
        <span>
          <IconButton aria-label={`Previous ${noun}`} onClick={onPrevious} disabled={position === 0}>
            <ChevronLeftOutlined />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={`Next ${noun}`}>
        <span>
          <IconButton aria-label={`Next ${noun}`} onClick={onNext} disabled={position === total - 1}>
            <ChevronRightOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}

export default RecordNavigation
