import { ButtonBase, Typography } from '../playbook-components'

/**
 * A KPI tile on an Analysis page. Each tile also acts as a filter: selecting it narrows the
 * chart and table to what it counts, and selecting it again clears the filter. Show at most
 * three.
 */
function KpiTile({ label, value, hint, selected = false, onClick, tone = 'default' }) {
  const accent = tone === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'

  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      disabled={!onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        width: '100%',
        p: 2,
        bgcolor: selected ? 'var(--color-background-selected)' : 'var(--color-white)',
        border: '1px solid',
        borderColor: selected ? accent : 'var(--color-border-primary)',
        borderRadius: 'var(--radius-md)',
        '&:hover': { borderColor: accent },
        '&.Mui-disabled': { color: 'inherit' },
      }}
    >
      <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </Typography>
      <Typography variant="h5" component="p" sx={{ fontWeight: 600, color: tone === 'warning' ? accent : 'var(--color-text-primary)' }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
          {hint}
        </Typography>
      )}
    </ButtonBase>
  )
}

export default KpiTile
