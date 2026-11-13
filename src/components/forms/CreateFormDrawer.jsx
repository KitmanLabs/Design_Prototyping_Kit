import React from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  TextField,
  Autocomplete,
  useMediaQuery
} from '@mui/material'
import { Button } from '../../playbook-components'
import { CloseOutlined } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import '../../styles/design-tokens.css'

function CreateFormDrawer({ open, onClose, onSubmit, categories = [] }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState(null)

  const handleClose = () => {
    onClose && onClose()
  }

  const handleCreate = () => {
    if (!title.trim()) return
    onSubmit && onSubmit({ title: title.trim(), description: description.trim(), category })
    onClose && onClose()
  }

  const options = categories && categories.length > 0 ? categories : ['Medical', 'Performance', 'Wellbeing']

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100vw' : 460,
            maxWidth: '100vw',
            height: isMobile ? '90vh' : '100vh',
            boxShadow: theme.shadows[16],
            display: 'flex'
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>Create form</Typography>
          <IconButton onClick={handleClose} aria-label="Close">
            <CloseOutlined />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ px: 3, py: 2, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            variant="filled"
            label="Template title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{
              htmlInput: { maxLength: 100 }
            }}
          />

          <TextField
            fullWidth
            size="small"
            variant="filled"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            helperText="Optional"
            slotProps={{
              htmlInput: { maxLength: 100 }
            }}
          />

          <Autocomplete
            size="small"
            options={options}
            value={category}
            onChange={(_, value) => setCategory(value)}
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Category" />
            )}
          />
          </Stack>
        </Box>

        {/* Footer */}
        <Divider />
        <Box sx={{ px: 3, py: 2, position: 'sticky', bottom: 0, bgcolor: 'var(--color-background-primary)' }}>
          <Stack direction="row" spacing={1.5} sx={{
            justifyContent: "flex-end"
          }}>
            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: 'var(--button-secondary-bg)',
                color: 'var(--button-secondary-color)',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'var(--button-secondary-hover-bg)' }
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              disabled={!title.trim()}
              sx={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--button-primary-color)',
                textTransform: 'none',
                fontFamily: 'var(--font-family-primary)',
                '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
              }}
              onClick={handleCreate}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}

CreateFormDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.string)
}

export default CreateFormDrawer


