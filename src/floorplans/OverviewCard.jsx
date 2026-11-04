import { Box, Button, Paper, Typography } from '../playbook-components'

/**
 * A card on an Overview. Cards summarize and link out to where the work happens; they
 * never hold editing or filters. Give the highest-priority card `priority`, and place it
 * first (top left, the widest column).
 *
 * The five kinds of card: status count, trend, to-do list, events and details.
 */
function OverviewCard({ title, subtitle, action, priority = false, children }) {
  return (
    <Paper
      component="section"
      aria-label={title}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
        ...(priority && { borderTop: '3px solid var(--color-primary)' }),
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
      {action && (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="secondary" disableElevation={true} onClick={action.onClick}>
            {action.label}
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default OverviewCard
