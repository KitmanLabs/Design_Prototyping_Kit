import { Box, Typography } from '../playbook-components'

/**
 * A Record's content: the main column and an optional supporting pane (timeline, notes),
 * as in Material 3's supporting pane layout. From the lg breakpoint the pane sits on the
 * right; below it, the pane moves under the main column.
 */
function RecordLayout({ children, aside, asideTitle }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 360px' },
        alignItems: 'start',
      }}
    >
      <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>{children}</Box>
      {aside && (
        <Box
          component="aside"
          aria-label={asideTitle}
          sx={{
            bgcolor: 'var(--color-white)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-md)',
            p: 2,
          }}
        >
          {asideTitle && (
            <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, mb: 1.5 }}>
              {asideTitle}
            </Typography>
          )}
          {aside}
        </Box>
      )}
    </Box>
  )
}

export default RecordLayout
