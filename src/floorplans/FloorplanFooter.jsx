import { Box, Button, Paper, Typography } from '../playbook-components'

/**
 * The footer action bar: finalizing actions for create and edit. It sticks to the bottom of
 * the page while the content scrolls.
 *
 * - Cancel sits on the left as a secondary button.
 * - The primary action (Save, Submit, Next) sits on the far right; use `loading` while it runs.
 * - Further actions (Save draft, Back) sit just left of the primary action.
 * - Show it only in create and edit, or while there are unsaved changes (`open`).
 */
function FloorplanFooter({
  open = true,
  message,
  onCancel,
  cancelLabel = 'Cancel',
  actions = [],
  primaryAction,
}) {
  if (!open) return null

  return (
    <Paper
      data-testid="FloorplanFooter"
      square
      elevation={0}
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 'var(--z-sticky)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 3,
        py: 1.5,
        borderTop: '1px solid var(--color-border-primary)',
        boxShadow: 'var(--shadow-sm)',
        bgcolor: 'var(--color-white)',
      }}
    >
      {onCancel && (
        <Button variant="contained" color="secondary" disableElevation={true} onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
      {message && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          {message}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="contained"
            color="secondary"
            disableElevation={true}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
        {primaryAction && (
          <Button
            variant="contained"
            color="primary"
            disableElevation={true}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            loading={primaryAction.loading}
          >
            {primaryAction.label}
          </Button>
        )}
      </Box>
    </Paper>
  )
}

export default FloorplanFooter
