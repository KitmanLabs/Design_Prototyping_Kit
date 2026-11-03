import { useCallback, useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import colors from '@kitman/common/src/variables/colors';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@kitman/playbook/components';
import DataGrid from '@kitman/playbook/components/wrappers/DataGrid';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { InputAdornment } from '@mui/material';
import {
  availabilityChip,
  exportAthletesToCsv,
  getInitials,
  printAthletesTable,
} from './utils';

// ----- Types


const AthletesListNew = (props) => {
  const { t, athletes } = props;

  // ---- UI state
  const [search, setSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState(
    'all'
  );
  const [positionsFilter, setPositionsFilter] = useState([]);

  // ---- Data projection -> grid rows
  const rows = useMemo(
    () =>
      athletes.map((a) => ({
        id: a.id,
        avatarUrl: a.avatar_url || '',
        fullname: a.fullname || '',
        position: a.position || '',
        availability: a.availability,
      })),
    [athletes]
  );

  // ---- Filters + sorting (client-side)
  const filteredSortedRows = useMemo(() => {
    const out = rows.filter((r) => {
      const s = search.trim().toLowerCase();
      const passSearch =
        !s ||
        r.fullname.toLowerCase().includes(s) ||
        r.position.toLowerCase().includes(s);

      const passLabel = labelFilter === 'all' || r.availability === labelFilter;

      const passPosition =
        positionsFilter.length === 0 ||
        (r.position && positionsFilter.includes(r.position));

      return passSearch && passLabel && passPosition;
    });
    return out;
  }, [rows, search, labelFilter, positionsFilter]);

  // ---- Navigation on row click
  const handleRowClick = useCallback((params) => {
    const id = params?.id;
    if (id != null) window.location.href = `/athletes/${id}`;
  }, []);

  // ---- Columns
  const columns = useMemo(
    () => [
      {
        field: 'avatar',
        headerName: '',
        width: 88,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Avatar
            alt={params.row.fullname}
            src={params.row.avatarUrl}
            sx={{ width: 40, height: 40 }}
          >
            {(!params.row.avatarUrl || params.row.avatarUrl === '') &&
              getInitials(params.row.fullname)}
          </Avatar>
        ),
      },
      {
        field: 'username',
        headerName: t('Full Name'),
        flex: 1,
        minWidth: 160,
        valueGetter: (params) => params.row.username || params.row.fullname,
        renderCell: (params) => (
          <Stack direction="column" spacing={0}>
            <Box sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {params.row.fullname}
            </Box>
          </Stack>
        ),
      },
      {
        field: 'position',
        headerName: t('Position'),
        flex: 0.7,
        minWidth: 120,
      },
      {
        field: 'availability',
        headerName: t('Availability'),
        flex: 0.9,
        minWidth: 180,
        renderCell: (params) => availabilityChip(t, params.row.availability),
      },
    ],
    [t]
  );

  return (
    <>
      <Box sx={{ p: 2, mx: 'auto' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: '16px' }}>
          {t('Athletes List')}
        </Typography>

        {/* Top filter panel */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            label={t('Search')}
            placeholder={t('Search athletes')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ width: 320 }}>
            <InputLabel>{t('Availability')}</InputLabel>
            <Select
              label={t('Availability')}
              value={labelFilter}
              onChange={(e) => setLabelFilter((e.target.value))}
            >
              <MenuItem value="all">{t('All')}</MenuItem>
              <MenuItem value="available">{t('Available')}</MenuItem>
              <MenuItem value="unavailable">{t('Unavailable')}</MenuItem>
              <MenuItem value="injured">{t('Injured')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: 320 }}>
            <InputLabel>{t('Position')}</InputLabel>
            <Select
              multiple
              value={positionsFilter}
              onChange={(e) => setPositionsFilter((e.target.value))}
              renderValue={(selected) => (selected).join(', ')}
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 300 },
                },
              }}
            >
              {[...new Set(rows.map((r) => r.position).filter(Boolean))].map(
                (pos) => (
                  <MenuItem key={pos} value={pos}>
                    <Checkbox checked={positionsFilter.indexOf(pos) > -1} />
                    <ListItemText primary={pos} />
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              size="large"
              onClick={() => exportAthletesToCsv(t, filteredSortedRows)}
            >
              {t('Export CSV')}
            </Button>
            <Button size="large" onClick={printAthletesTable}>
              {t('Print')}
            </Button>
          </Stack>
        </Stack>

        <DataGrid
          rows={filteredSortedRows}
          columns={columns}
          checkboxSelection={false}
          rowSelection={false}
          disableColumnMenu
          disableColumnReorder
          disableMultipleColumnsFiltering
          disableMultipleColumnsSorting
          disableDensitySelector
          // no exports/buttons, just a plain table
          gridToolBar={[]}
          pagination /* client-side pagination with default 25 */
          pageSize={25}
          pageSizeOptions={[25, 50]}
          onRowClick={handleRowClick} /* open athlete profile */
          noRowsMessage={t('There are no athletes within this squad')}
          sx={{
            '&, & .MuiDataGrid-main, & .MuiDataGrid-columnHeaders, & .MuiDataGrid-virtualScroller, & .MuiDataGrid-virtualScrollerContent, & .MuiDataGrid-row, & .MuiDataGrid-cell':
              {
                backgroundColor: colors.p06,
              },
            '.MuiDataGrid-row': { cursor: 'pointer' },
            '.MuiDataGrid-columnHeaders': {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
          }}
        />
      </Box>
    </>
  );
};

export const AthletesListNewTranslated = withTranslation()(AthletesListNew);
export default AthletesListNew;
