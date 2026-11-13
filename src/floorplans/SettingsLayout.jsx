import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '../playbook-components'

/**
 * Settings: section navigation on the left (a select below the md breakpoint) and the
 * section's groups on the right. Pair it with a FloorplanFooter that opens only while
 * there are unsaved changes.
 *
 * sections: [{ id, label }]
 */
function SettingsLayout({ sections, activeSection, onSectionChange, children }) {
  const theme = useTheme()
  const isWide = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '220px minmax(0, 760px)' },
        alignItems: 'start',
      }}
    >
      {isWide ? (
        <Box component="nav" aria-label="Settings sections">
          <List disablePadding>
            {sections.map((section) => (
              <ListItemButton
                key={section.id}
                selected={section.id === activeSection}
                aria-current={section.id === activeSection ? 'page' : undefined}
                onClick={() => onSectionChange(section.id)}
                sx={{ borderRadius: 'var(--radius-sm)' }}
              >
                <ListItemText primary={section.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ) : (
        <TextField
          variant="filled"
          select
          label="Section"
          value={activeSection}
          onChange={(event) => onSectionChange(event.target.value)}
        >
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.label}
            </MenuItem>
          ))}
        </TextField>
      )}
      <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>{children}</Box>
    </Box>
  )
}

/** One group of settings: a heading, a short description and its controls. */
export function SettingsGroup({ title, description, children }) {
  return (
    <Paper
      component="section"
      aria-label={title}
      elevation={0}
      sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 3 }}
    >
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 0.5 }}>
          {description}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>{children}</Box>
    </Paper>
  )
}

export default SettingsLayout
