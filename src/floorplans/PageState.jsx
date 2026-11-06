import { Box, Button, Skeleton, Stack, Typography } from '../playbook-components'
import {
  InboxOutlined,
  SearchOffOutlined,
  LockOutlined,
  ErrorOutlineOutlined,
} from '@mui/icons-material'

const KINDS = {
  empty: { icon: InboxOutlined, title: 'Nothing here yet' },
  noResults: { icon: SearchOffOutlined, title: 'No results', description: 'Try a different search or clear the filters.' },
  noAccess: { icon: LockOutlined, title: 'You do not have access', description: 'Ask an administrator for permission to see this.' },
  error: { icon: ErrorOutlineOutlined, title: 'Something went wrong', description: 'Try again. If it keeps happening, contact support.' },
}

/**
 * One component for every page state: empty, no results, no access, error and loading.
 * Pass a title, description and action to fit the page; the kind supplies the icon and
 * a default message. `loading` shows skeleton rows in place of the content.
 */
function PageState({ kind = 'empty', title, description, action, icon, rows = 6 }) {
  if (kind === 'loading') {
    return (
      <Stack spacing={1.5} data-testid="PageState-loading" aria-busy="true">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} variant="rounded" height={40} />
        ))}
      </Stack>
    )
  }

  const preset = KINDS[kind] || KINDS.empty
  const StateIcon = icon || preset.icon
  const text = description ?? preset.description

  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 1,
        py: 8,
        px: 3,
        height: '100%',
      }}
    >
      <StateIcon sx={{ fontSize: 48, color: 'var(--color-text-muted)', mb: 1 }} />
      <Typography variant="h6" component="p">
        {title || preset.title}
      </Typography>
      {text && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', maxWidth: 420 }}>
          {text}
        </Typography>
      )}
      {action && (
        <Button variant="contained" color="primary" disableElevation={true} onClick={action.onClick} sx={{ mt: 2 }}>
          {action.label}
        </Button>
      )}
    </Box>
  )
}

export default PageState
