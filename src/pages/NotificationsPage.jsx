import React, { useMemo, useState } from 'react'
import { Box, DataGrid, Paper, TabBar, Typography } from '../playbook-components'
import { StatusChip } from '../components'
import { dataGridStyles } from '../components/dataGridStyles'
import {
  PageFrame,
  PageHeader,
  PageToolbar,
  PageSearch,
  PageQuickFilters,
  PageState,
  useToasts,
} from '../floorplans'
import { notificationsData, notificationCategoryFilters } from '../data/notifications'

// Floorplan: Collection, queue variant. Tabs with counts split what needs attention
// (Unread) from everything; marking items as read moves them out of the Unread queue.

const columns = [
  {
    field: 'title',
    headerName: 'Title',
    width: 240,
    headerClassName: 'grid-cell--pad-left',
    cellClassName: 'grid-cell--pad-left',
    renderCell: ({ value, row }) => (
      <Typography variant="body2" sx={{ fontWeight: row.status === 'Unread' ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)' }}>
        {value}
      </Typography>
    ),
  },
  { field: 'description', headerName: 'Description', flex: 1, minWidth: 300 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'timestamp', headerName: 'Date', width: 190 },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    headerClassName: 'grid-cell--pad-right',
    cellClassName: 'grid-cell--pad-right',
    renderCell: ({ value }) => <StatusChip status={value} type={value === 'Unread' ? 'primary' : 'default'} />,
  },
]

export default function NotificationsPage() {
  const { showToast, toasts } = useToasts()
  const [notifications, setNotifications] = useState(notificationsData)
  const [tab, setTab] = useState('#unread')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length
  const tabs = [
    { tabKey: 'unread', tabHash: '#unread', title: `Unread ${unreadCount}` },
    { tabKey: 'all', tabHash: '#all', title: `All ${notifications.length}` },
  ]

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return notifications.filter(
      (n) =>
        (tab === '#all' || n.status === 'Unread') &&
        (!category || n.category === category) &&
        (!query || `${n.title} ${n.description}`.toLowerCase().includes(query))
    )
  }, [notifications, tab, search, category])

  const markAsRead = () => {
    const ids = new Set(selectedIds)
    setNotifications((current) => current.map((n) => (ids.has(n.id) ? { ...n, status: 'Read' } : n)))
    showToast({ title: `Marked ${ids.size} notification${ids.size === 1 ? '' : 's'} as read` })
    setSelectedIds([])
  }

  const clearFilters = () => {
    setSearch('')
    setCategory(null)
  }

  let content
  if (rows.length === 0 && !search && !category) {
    content = <PageState kind="empty" title="You're all caught up" description="New notifications will appear here." />
  } else if (rows.length === 0) {
    content = <PageState kind="noResults" action={{ label: 'Clear filters', onClick: clearFilters }} />
  } else {
    content = (
      <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <Box sx={{ ...dataGridStyles, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            hideFooter
            rowSelectionModel={{ type: 'include', ids: new Set(selectedIds) }}
            onRowSelectionModelChange={(model) => setSelectedIds([...model.ids])}
          />
        </Box>
      </Paper>
    )
  }

  return (
    <PageFrame
      header={<PageHeader title="Notifications" />}
      tabs={<TabBar tabs={tabs} value={tab} onChange={(value) => { setTab(value); setSelectedIds([]) }} />}
      toolbar={
        <PageToolbar>
          <PageSearch value={search} onChange={setSearch} placeholder="Search notifications" label="Search notifications" />
          <PageQuickFilters filters={notificationCategoryFilters} value={category} onChange={setCategory} />
        </PageToolbar>
      }
      selection={{
        count: selectedIds.length,
        actions: [{ id: 'read', label: 'Mark as read', color: 'primary', onClick: markAsRead }],
      }}
    >
      {content}
      {toasts}
    </PageFrame>
  )
}
