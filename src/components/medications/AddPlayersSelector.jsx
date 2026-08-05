import { useEffect, useMemo, useState } from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material'
import { CloseOutlined, SearchOutlined } from '@mui/icons-material'
import { Button } from '../../components'

function AddPlayersSelector({ open, onClose, players, selectedIds, onDone }) {
  const [query, setQuery] = useState('')
  const [draftSelected, setDraftSelected] = useState(selectedIds)
  const [autoSync, setAutoSync] = useState(false)

  useEffect(() => {
    if (open) setDraftSelected(selectedIds)
  }, [open, selectedIds])

  const filtered = useMemo(
    () => players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [players, query]
  )

  const toggle = (id) => {
    setDraftSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleDone = () => {
    onDone(draftSelected, autoSync)
    onClose()
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 380, display: 'flex', flexDirection: 'column' } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontFamily: 'var(--font-family-primary)' }}>
          Add players
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseOutlined fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          variant="filled"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchOutlined fontSize="small" sx={{ color: 'var(--color-primary)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {filtered.map((p) => (
            <ListItem
              key={p.id}
              divider
              secondaryAction={<Checkbox edge="end" checked={draftSelected.includes(p.id)} onChange={() => toggle(p.id)} />}
            >
              <ListItemAvatar>
                <Avatar>{p.name.split(' ').map((n) => n[0]).join('')}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={p.name}
                secondary={p.position}
                primaryTypographyProps={{ sx: { fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 } }}
                secondaryTypographyProps={{ sx: { fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-xs)' } }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Chip
          label={`Selected (${draftSelected.length})`}
          size="small"
          sx={{ backgroundColor: 'var(--color-background-secondary)', fontFamily: 'var(--font-family-primary)', fontWeight: 500 }}
        />
        <FormControlLabel
          control={<Switch size="small" checked={autoSync} onChange={(e) => setAutoSync(e.target.checked)} />}
          label={<Typography variant="caption" sx={{ fontFamily: 'var(--font-family-primary)', color: 'var(--color-text-secondary)' }}>Auto sync</Typography>}
        />
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <Button variant="primary" onClick={handleDone} style={{ width: '100%', justifyContent: 'center' }}>
          Done
        </Button>
      </Box>
    </Drawer>
  )
}

export default AddPlayersSelector
