import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { SparkLineChart } from '@mui/x-charts/SparkLineChart'
import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '../playbook-components'
import { StatusChip } from '../components'
import { PageFrame, PageHeader, OverviewCard } from '../floorplans'
import allAthletes from '../data/athletes'
import { TODAY } from '../data/clock'
import injuriesData from '../data/injuries_medical'
import calendarEvents from '../data/calendar_events.json'
import { notificationsData } from '../data/notifications'
import { currentUser } from '../data/layout'
import { buildAvailabilityTrend } from '../data/workloads'

// Floorplan: Overview. Where a practitioner starts the day: who is available, what needs
// attention, and what is on today. Cards summarize and link out; editing happens elsewhere.

const fullName = (athlete) => `${athlete.firstname} ${athlete.lastname}`

function greeting(now) {
  const hour = now.hour()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function Stat({ value, label }) {
  return (
    <Box>
      <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </Typography>
    </Box>
  )
}

function Overview() {
  const navigate = useNavigate()
  const now = moment()
  const firstName = currentUser.name.replace(/^Dr\.\s*/, '').split(' ')[0]

  // The First Team, as on Squad load: the squad a practitioner starts the day with
  const athletesData = allAthletes.filter((a) => a.squad_id === 1)
  const unavailable = athletesData.filter((a) => a.availability_status !== 'Available')
  const available = athletesData.length - unavailable.length
  const squadIds = new Set(athletesData.map((a) => a.id))
  const squadInjuries = injuriesData.filter((i) => squadIds.has(i.athlete_id))
  const openInjuries = squadInjuries.filter((i) => i.status !== 'Returned')
  const deadlines = notificationsData.filter((n) => n.category === 'Deadline' && n.status === 'Unread')
  const trend = useMemo(() => buildAvailabilityTrend(14), [])

  const upcoming = useMemo(() => {
    const today = TODAY
    return calendarEvents
      .filter((event) => moment(event.start).isSameOrAfter(today))
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 4)
  }, [])

  const todo = [
    ...openInjuries.map((injury) => ({
      id: `injury-${injury.id}`,
      primary: `Review ${injury.athlete_name}'s ${injury.injury_type.toLowerCase()}`,
      secondary: `Injury · ${injury.status}`,
      onClick: () => navigate(`/athletes/${injury.athlete_id}`, { state: { initialTab: '#medical' } }),
    })),
    ...deadlines.map((n) => ({
      id: `deadline-${n.id}`,
      primary: n.title,
      secondary: n.description,
      onClick: () => navigate('/notifications'),
    })),
  ]

  return (
    <PageFrame
      header={
        <PageHeader
          title={`${greeting(now)}, ${firstName}`}
          listItems={[{ id: 'date', label: 'Today', value: now.format('dddd, LL') }]}
        />
      }
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <OverviewCard
            priority
            title="Availability today"
            subtitle={`${available} of ${athletesData.length} athletes can train and play`}
            action={{ label: 'View athletes', onClick: () => navigate('/athletes') }}
          >
            <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
              <Stat value={available} label="Available" />
              <Stat value={unavailable.length} label="Unavailable" />
            </Box>
            <List dense disablePadding>
              {unavailable.map((athlete) => (
                <ListItemButton key={athlete.id} onClick={() => navigate(`/athletes/${athlete.id}`)} sx={{ borderRadius: 'var(--radius-sm)' }}>
                  <ListItemText primary={fullName(athlete)} secondary={athlete.injury_status} />
                  <StatusChip status={athlete.availability_status} type="error" />
                </ListItemButton>
              ))}
            </List>
          </OverviewCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <OverviewCard title="To do" subtitle={`${todo.length} items`}>
            <List dense disablePadding>
              {todo.map((item) => (
                <ListItemButton key={item.id} onClick={item.onClick} sx={{ borderRadius: 'var(--radius-sm)' }}>
                  <ListItemText primary={item.primary} secondary={item.secondary} slotProps={{ secondary: { noWrap: true } }} />
                </ListItemButton>
              ))}
            </List>
          </OverviewCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <OverviewCard
            title="Squad availability"
            subtitle="Last 14 days"
            action={{ label: 'View squad load', onClick: () => navigate('/workloads') }}
          >
            <Typography variant="h4" component="p" sx={{ fontWeight: 600 }}>
              {trend[trend.length - 1].percentAvailable}%
            </Typography>
            <SparkLineChart
              data={trend.map((d) => d.percentAvailable)}
              height={64}
              curve="linear"
              yAxis={{ min: 50, max: 100 }}
              color="var(--color-chart-1)"
              showTooltip
              showHighlight
              xAxis={{ data: trend.map((d) => moment(d.date).format('ll')), scaleType: 'point' }}
              valueFormatter={(value) => `${value}%`}
            />
          </OverviewCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <OverviewCard
            title="Open injuries"
            action={{ label: 'View medical', onClick: () => navigate('/medical/rosters') }}
          >
            <Stat value={openInjuries.length} label={`${squadInjuries.length - openInjuries.length} returned this season`} />
          </OverviewCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <OverviewCard
            title="Coming up"
            action={{ label: 'View calendar', onClick: () => navigate('/calendar') }}
          >
            {upcoming.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                Nothing scheduled.
              </Typography>
            ) : (
              <List dense disablePadding>
                {upcoming.map((event) => (
                  <ListItemText
                    key={event.id}
                    primary={event.title}
                    secondary={moment(event.start).calendar()}
                    sx={{ my: 0.75 }}
                  />
                ))}
              </List>
            )}
          </OverviewCard>
        </Grid>
      </Grid>
    </PageFrame>
  )
}

export default Overview
