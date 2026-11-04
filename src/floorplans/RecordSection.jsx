import { Box, Button, Paper, Typography } from '../playbook-components'

/**
 * A section of a Record, with section-level editing: each section has its own Edit, and
 * while editing, its own Cancel and Save. The page keeps the field values; pass the read
 * view or the edit fields as children depending on `isEditing`.
 *
 * Use the footer action bar instead for create mode and long forms.
 */
function RecordSection({ title, isEditing = false, onEdit, onCancel, onSave, saving = false, children }) {
  return (
    <Paper
      component="section"
      aria-label={title}
      elevation={0}
      sx={{
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, minHeight: 36 }}>
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {onEdit && !isEditing && (
          <Button variant="contained" color="secondary" disableElevation={true} onClick={onEdit}>
            Edit
          </Button>
        )}
      </Box>
      {children}
      {isEditing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="contained" color="secondary" disableElevation={true} onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" disableElevation={true} onClick={onSave} loading={saving}>
            Save
          </Button>
        </Box>
      )}
    </Paper>
  )
}

/** Read view for a section: label and value pairs in a responsive grid. */
export function RecordFields({ fields }) {
  return (
    <Box
      component="dl"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
        m: 0,
      }}
    >
      {fields.map((field) => (
        <Box key={field.id}>
          <Typography component="dt" variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
            {field.label}
          </Typography>
          <Typography component="dd" variant="body2" sx={{ m: 0 }}>
            {field.value ?? '-'}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default RecordSection
