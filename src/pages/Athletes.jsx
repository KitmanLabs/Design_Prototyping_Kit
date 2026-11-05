import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper } from '../playbook-components'
import { AthleteDataGrid } from '../components'
import {
  PageFrame,
  PageHeader,
  PageToolbar,
  PageQuickFilters,
  PageState,
  useToasts,
} from '../floorplans'
import athletesData from '../data/athletes.json'
import { availabilityFilters } from '../data/athleteViews'

// Floorplan: Collection. Find, filter and act on the squad's athletes; a row opens the
// athlete's profile (a Record). Search sits in the grid toolbar, next to the AI Assistant,
// rather than in the page toolbar.

const plural = (count) => `${count} athlete${count === 1 ? '' : 's'}`

function Athletes() {
  const navigate = useNavigate()
  const { showToast, toasts } = useToasts()
  const [availability, setAvailability] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const rows = useMemo(
    () => athletesData.filter((athlete) => !availability || athlete.availability_status === availability),
    [availability]
  )

  const completeBulkAction = (verb) => {
    showToast({ title: `${verb} ${plural(selectedIds.length)}` })
    setSelectedIds([])
  }

  const notInPrototype = (title) => () =>
    showToast({ title, description: 'This prototype does not include it yet.', status: 'info' })

  return (
    <PageFrame
      header={
        <PageHeader
          title="Athletes"
          primaryAction={{ id: 'add', label: 'Add athlete', onClick: notInPrototype('Add athlete') }}
          moreActions={[{ id: 'archived', label: 'View archived athletes', onClick: notInPrototype('Archived athletes') }]}
        />
      }
      toolbar={
        <PageToolbar>
          <PageQuickFilters filters={availabilityFilters} value={availability} onChange={setAvailability} />
        </PageToolbar>
      }
      selection={{
        count: selectedIds.length,
        actions: [
          { id: 'archive', label: 'Archive', onClick: () => completeBulkAction('Archived') },
          { id: 'assign', label: 'Assign form', color: 'primary', onClick: () => completeBulkAction('Assigned a form to') },
        ],
      }}
    >
      {rows.length === 0 ? (
        <PageState kind="noResults" action={{ label: 'Clear filter', onClick: () => setAvailability(null) }} />
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-primary)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}>
            <AthleteDataGrid
              data={rows}
              height={640}
              rowSelectionIds={selectedIds}
              onSelectionChange={setSelectedIds}
              // The Record's previous and next follow this filtered order
              onRowClick={(params) => navigate(`/athletes/${params.id}`, { state: { collectionIds: rows.map((row) => row.id) } })}
            />
          </Box>
        </Paper>
      )}
      {toasts}
    </PageFrame>
  )
}

export default Athletes
