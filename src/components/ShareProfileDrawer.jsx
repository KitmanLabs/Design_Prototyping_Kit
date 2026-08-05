import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import { PlayerAvatar } from './index'

const PHYSICIANS = ['Dr. Sarah Chen', 'Dr. Amara Okafor', 'Dr. Liam Fitzgerald', 'Dr. Priya Nair']
const ORGANIZATIONS = ['City General Hospital', 'Sportsmed Clinic', 'National Performance Institute']
const INFO_CATEGORIES = ['Medical history', 'Imaging', 'Assessment reports', 'Treatment notes']

function ShareProfileDrawer({ open, athletes = [], onClose, onShare }) {
  const [physician, setPhysician] = useState('')
  const [organization, setOrganization] = useState('')
  const [reason, setReason] = useState('')
  const [categories, setCategories] = useState({})

  useEffect(() => {
    if (open) {
      setPhysician('')
      setOrganization('')
      setReason('')
      setCategories({})
    }
  }, [open])

  const toggleCategory = (cat) => {
    setCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const canContinue = physician && organization && Object.values(categories).some(Boolean)
  const isBulk = athletes.length > 1

  const handleShare = () => {
    onShare?.({ athletes, physician, organization, reason, categories })
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>Share profile</Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            {isBulk ? (
              <>
                <Box sx={{ display: 'flex' }}>
                  {athletes.slice(0, 4).map((a, i) => (
                    <Box key={a.id} sx={{ ml: i === 0 ? 0 : -1 }}>
                      <PlayerAvatar playerId={a.id} playerName={`${a.firstname} ${a.lastname}`} size="small" />
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{athletes.length} athletes selected</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {athletes.map((a) => `${a.firstname} ${a.lastname}`).join(', ')}
                  </Typography>
                </Box>
              </>
            ) : (
              athletes[0] && (
                <>
                  <PlayerAvatar playerId={athletes[0].id} playerName={`${athletes[0].firstname} ${athletes[0].lastname}`} size="medium" />
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{athletes[0].firstname} {athletes[0].lastname}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{athletes[0].position} · {athletes[0].squad_name}</Typography>
                  </Box>
                </>
              )
            )}
          </Box>

          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1.5 }}>Recipient</Typography>
          <FormControl variant="filled" size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Physician</InputLabel>
            <Select value={physician} onChange={(e) => setPhysician(e.target.value)}>
              {PHYSICIANS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl variant="filled" size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Organization</InputLabel>
            <Select value={organization} onChange={(e) => setOrganization(e.target.value)}>
              {ORGANIZATIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            variant="filled"
            size="small"
            fullWidth
            multiline
            minRows={2}
            label="Reason for sharing (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>Information to include</Typography>
          <FormGroup>
            {INFO_CATEGORIES.map((cat) => (
              <FormControlLabel
                key={cat}
                control={<Checkbox size="small" checked={!!categories[cat]} onChange={() => toggleCategory(cat)} />}
                label={<Typography sx={{ fontSize: 14 }}>{cat}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2.5 }}>
          <Button variant="contained" size="small" disableElevation color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" size="small" disableElevation disabled={!canContinue} onClick={handleShare}>
            Share profile
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}

ShareProfileDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  athletes: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onShare: PropTypes.func,
}

export default ShareProfileDrawer
