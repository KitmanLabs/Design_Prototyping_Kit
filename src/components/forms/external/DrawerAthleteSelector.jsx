import React from 'react'
import PropTypes from 'prop-types'
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
  InputAdornment
} from '@mui/material'
import { CloseOutlined, SearchOutlined } from '@mui/icons-material'

function DrawerAthleteSelector({ open, onClose, title = 'Assign athletes', athletes = [], selected = [], onSelectionChange }) {
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase()
    return athletes.filter(a => a.name.toLowerCase().includes(q))
  }, [athletes, query])

  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]
    onSelectionChange && onSelectionChange(next)
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseOutlined />
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
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Divider />
      <List sx={{ p: 0 }}>
        {filtered.map((a) => (
          <ListItem key={a.id} divider secondaryAction={
            <Checkbox edge="end" checked={selected.includes(a.id)} onChange={() => toggle(a.id)} />
          }>
            <ListItemAvatar>
              <Avatar src={a.avatar}>{a.name.split(' ').map(n=>n[0]).join('')}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={a.name} secondary={a.position} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

DrawerAthleteSelector.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  athletes: PropTypes.array,
  selected: PropTypes.array,
  onSelectionChange: PropTypes.func
}

export default DrawerAthleteSelector


