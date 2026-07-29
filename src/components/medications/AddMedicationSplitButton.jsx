import { useRef, useState } from 'react'
import { ButtonGroup, Button, Menu, MenuItem, Divider } from '@mui/material'
import { KeyboardArrowDownOutlined } from '@mui/icons-material'

const primaryButtonSx = {
  backgroundColor: 'var(--button-primary-bg)',
  color: 'var(--button-primary-color)',
  textTransform: 'none',
  fontWeight: 'var(--font-weight-medium)',
  fontFamily: 'var(--font-family-primary)',
  '&:hover': { backgroundColor: 'var(--button-primary-hover-bg)' },
}

function AddMedicationSplitButton({ onAddSingle, onAddBulk }) {
  const anchorRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <ButtonGroup ref={anchorRef} variant="contained" disableElevation size="small">
        <Button size="small" variant="contained" disableElevation onClick={onAddSingle} sx={primaryButtonSx}>
          Add medication
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => setMenuOpen(true)}
          aria-label="More medication actions"
          sx={{ ...primaryButtonSx, px: 0.5, minWidth: 32, borderLeft: '1px solid rgba(255,255,255,0.24)' }}
        >
          <KeyboardArrowDownOutlined fontSize="small" />
        </Button>
      </ButtonGroup>
      <Menu anchorEl={anchorRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem
          onClick={() => { setMenuOpen(false); onAddSingle?.() }}
          sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
        >
          Add medication
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { setMenuOpen(false); onAddBulk?.() }}
          sx={{ fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)' }}
        >
          Add multiple medications
        </MenuItem>
      </Menu>
    </>
  )
}

export default AddMedicationSplitButton
