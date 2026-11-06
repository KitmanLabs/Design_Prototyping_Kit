import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import {
  Box,
  Button,
  DataGrid,
  FormControlLabel,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from '../playbook-components'
import { StatusChip } from '../components'
import { dataGridStyles } from '../components/dataGridStyles'
import { PageFrame, PageHeader, PageToolbar, KpiTile, PageState } from '../floorplans'
import { buildDailyLoad, loadRangeOptions, acwrFlagThreshold, axisDateFormat } from '../data/workloads'

// Floorplan: Analysis. Spot a pattern in the squad's load, drill into the athletes behind
// it, then open their profiles. The KPI tiles and the bar chart both filter the table.

const average = (values) => (values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0)

const columns = [
  { field: 'athleteName', headerName: 'Athlete', flex: 1, minWidth: 180, headerClassName: 'grid-cell--pad-left', cellClassName: 'grid-cell--pad-left' },
  { field: 'totalLoad', headerName: 'Total load (AU)', type: 'number', width: 150 },
  { field: 'averageLoad', headerName: 'Daily average (AU)', type: 'number', width: 170 },
  { field: 'sessions', headerName: 'Sessions', type: 'number', width: 110 },
  { field: 'acwr', headerName: 'ACWR', type: 'number', width: 100, valueFormatter: (value) => value.toFixed(2) },
  {
    field: 'flagged',
    headerName: 'Flag',
    width: 120,
    headerClassName: 'grid-cell--pad-right',
    cellClassName: 'grid-cell--pad-right',
    renderCell: ({ value }) => (value ? <StatusChip status="Load spike" type="warning" /> : null),
  },
]

function SquadLoad() {
  const navigate = useNavigate()
  const [days, setDays] = useState(28)
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [athleteFilter, setAthleteFilter] = useState(null)
  const [tableOnly, setTableOnly] = useState(false)

  const dailyLoad = useMemo(() => buildDailyLoad(), [])

  // Per-athlete totals for the selected range, plus the acute:chronic ratio (7 days : 28 days)
  const athleteRows = useMemo(() => {
    const today = moment().startOf('day')
    const inRange = (row, span) => moment(row.date).isAfter(moment(today).subtract(span, 'days'))
    const byAthlete = new Map()
    dailyLoad.forEach((row) => {
      if (!byAthlete.has(row.athleteId)) byAthlete.set(row.athleteId, { name: row.athleteName, rows: [] })
      byAthlete.get(row.athleteId).rows.push(row)
    })
    return [...byAthlete.entries()].map(([athleteId, { name, rows }]) => {
      const range = rows.filter((r) => inRange(r, days))
      const acute = average(rows.filter((r) => inRange(r, 7)).map((r) => r.load))
      const chronic = average(rows.filter((r) => inRange(r, 28)).map((r) => r.load))
      const acwr = chronic ? acute / chronic : 0
      return {
        id: athleteId,
        athleteName: name,
        totalLoad: range.reduce((sum, r) => sum + r.load, 0),
        averageLoad: Math.round(average(range.map((r) => r.load))),
        sessions: range.filter((r) => r.load > 0).length,
        acwr,
        flagged: acwr > acwrFlagThreshold,
      }
    })
  }, [dailyLoad, days])

  const squadDaily = useMemo(() => {
    const today = moment().startOf('day')
    const dates = Array.from({ length: days }, (_, i) => moment(today).subtract(days - 1 - i, 'days').format('YYYY-MM-DD'))
    const squadLoadOn = (date) => Math.round(average(dailyLoad.filter((r) => r.date === date).map((r) => r.load)))
    return dates.map((date) => {
      // 7-day rolling average, so rest days don't hide the trend
      const week = Array.from({ length: 7 }, (_, i) => squadLoadOn(moment(date).subtract(i, 'days').format('YYYY-MM-DD')))
      return { date, load: squadLoadOn(date), rollingAverage: Math.round(average(week)) }
    })
  }, [dailyLoad, days])

  const flagged = athleteRows.filter((r) => r.flagged)
  const tableRows = athleteRows.filter(
    (r) => (!flaggedOnly || r.flagged) && (!athleteFilter || r.id === athleteFilter)
  )
  const filterLabel = athleteFilter
    ? athleteRows.find((r) => r.id === athleteFilter)?.athleteName
    : flaggedOnly
      ? 'Load spikes'
      : null

  const clearFilters = () => {
    setFlaggedOnly(false)
    setAthleteFilter(null)
  }

  return (
    <PageFrame
      header={<PageHeader title="Squad load" />}
      toolbar={
        <PageToolbar
          end={
            <FormControlLabel
              control={<Switch checked={tableOnly} onChange={(e) => setTableOnly(e.target.checked)} />}
              label="Table only"
            />
          }
        >
          <TextField
            variant="filled"
            select
            label="Date range"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {loadRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          {filterLabel && (
            <>
              <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                Showing {filterLabel}
              </Typography>
              <Button variant="contained" color="secondary" disableElevation={true} onClick={clearFilters}>
                Show all athletes
              </Button>
            </>
          )}
        </PageToolbar>
      }
    >
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
          <KpiTile
            label="Squad daily average"
            value={`${Math.round(average(squadDaily.map((d) => d.load)))} AU`}
            hint={loadRangeOptions.find((o) => o.value === days)?.label}
          />
          <KpiTile
            label="Sessions"
            value={athleteRows.reduce((sum, r) => sum + r.sessions, 0)}
            hint="Across all athletes"
          />
          <KpiTile
            label="Load spikes"
            value={flagged.length}
            hint={`ACWR above ${acwrFlagThreshold}`}
            tone={flagged.length ? 'warning' : 'default'}
            selected={flaggedOnly}
            onClick={() => {
              setAthleteFilter(null)
              setFlaggedOnly(!flaggedOnly)
            }}
          />
        </Box>

        {!tableOnly && (
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 3fr) minmax(0, 2fr)' } }}>
            <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>Squad daily load</Typography>
              <LineChart
                height={260}
                xAxis={[{
                  data: squadDaily.map((d) => moment(d.date).format(axisDateFormat)),
                  scaleType: 'point',
                  // The theme's label line height needs more than the default 25px, or labels are hidden
                  height: 32,
                  tickInterval: (_value, index) => (squadDaily.length - 1 - index) % 7 === 0,
                }]}
                series={[
                  { data: squadDaily.map((d) => d.load), label: 'Daily average (AU)', color: 'var(--color-text-muted)', showMark: false, curve: 'linear' },
                  { data: squadDaily.map((d) => d.rollingAverage), label: '7-day average (AU)', color: 'var(--color-chart-1)', showMark: false, curve: 'linear' },
                ]}
              />
            </Paper>
            <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', p: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>Load by athlete</Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>Select a bar to see that athlete in the table</Typography>
              <BarChart
                height={260}
                layout="horizontal"
                yAxis={[{ data: athleteRows.map((r) => r.athleteName.split(' ')[0]), scaleType: 'band', width: 70 }]}
                xAxis={[{ height: 32 }]}
                series={[{ data: athleteRows.map((r) => r.totalLoad), label: 'Total load (AU)', color: 'var(--color-chart-1)' }]}
                onItemClick={(_event, item) => {
                  setFlaggedOnly(false)
                  setAthleteFilter(athleteRows[item.dataIndex].id)
                }}
                hideLegend
              />
            </Paper>
          </Box>
        )}

        {tableRows.length === 0 ? (
          <PageState kind="noResults" description="No athletes match this filter." action={{ label: 'Show all athletes', onClick: clearFilters }} />
        ) : (
          <Paper elevation={0} sx={{ border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <Box sx={{ ...dataGridStyles, '& .MuiDataGrid-row': { cursor: 'pointer' } }}>
              <DataGrid
                rows={tableRows}
                columns={columns}
                autoHeight
                hideFooter
                disableRowSelectionOnClick
                onRowClick={(params) => navigate(`/athletes/${params.id}`)}
                initialState={{ sorting: { sortModel: [{ field: 'acwr', sort: 'desc' }] } }}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </PageFrame>
  )
}

export default SquadLoad
