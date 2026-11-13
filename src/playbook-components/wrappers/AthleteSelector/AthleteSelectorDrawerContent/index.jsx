import { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import i18n from '@kitman/common/src/utils/i18n';
import { ChevronLeft } from '@mui/icons-material';

import {
  AthleteListItem,
  GroupComponent,
  SearchBar,
  BodySkeleton,
  FlatGroupComponent,
} from '../shared';
import { collectAthleteIds, filterGroup, matchesSearch } from '../shared/utils';


const AthleteSelectorDrawerContent = ({
  open,
  groups,
  selectedIds,
  setSelectedIds,
  isLoading = false,
  grouping,
  Search,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [path, setPath] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (!open) {
      setSearchInput('');
      setPath([]);
    }

    return () => {
      setSearchInput('');
      setPath([]);
    };
  }, [open, groups]);

  const currentGroup = useMemo(() => {
    if (!path.length) {
      return { key: 'root', title: 'All', children: groups, athletes: [] };
    }

    return path[path.length - 1];
  }, [path, groups]);

  const filteredGroups = useMemo(() => {
    if (!searchInput) {
      return currentGroup?.children ?? [];
    }

    return (currentGroup?.children ?? [])
      .map((group) =>
        filterGroup({
          group,
          search: searchInput,
        })
      )
      .filter(Boolean);
  }, [currentGroup, searchInput]);

  const handleToggleAthlete = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBack = () => {
    setPath((prev) => prev.slice(0, -1));
    setExpandedSections({});
  };

  const renderAthlete = (athlete) => {
    if (!matchesSearch(athlete, searchInput)) {
      return null;
    }

    return (
      <AthleteListItem
        size="md"
        key={athlete.key}
        athlete={athlete}
        selectedIds={selectedIds}
        handleToggleAthlete={handleToggleAthlete}
      />
    );
  };

  const handleGroupToggle = (groupKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const renderGroup = (group) => {
    const hasAthletes = (group?.athletes?.length ?? 0) > 0;

    if (hasAthletes) {
      return (
        <GroupComponent
          key={group.key}
          group={group}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          expandedSections={expandedSections}
          handleGroupToggle={handleGroupToggle}
          renderAthletes={(athletes) => athletes.map(renderAthlete)}
        />
      );
    }

    return (
      <FlatGroupComponent
        variant="drawer"
        group={group}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setPath={setPath}
      />
    );
  };

  const renderListHeader = () => {
    if (!path.length) {
      return null;
    }

    const groupIds = collectAthleteIds(currentGroup);
    const selectedCount = groupIds.filter((id) => selectedIds.has(id)).length;

    return (
      <>
        <Box
          onClick={handleBack}
          sx={{
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            py: 1,
            px: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            fontSize: '22px',
          }}
        >
          <ChevronLeft />
          <Typography
            sx={{
              color: "text.primary",
              fontSize: '16px',
              fontWeight: 400
            }}>
            {`${currentGroup.title} ${
              selectedCount ? `(${selectedCount})` : ''
            }`}
          </Typography>
          {currentGroup.subtitle && (
            <Typography
              variant="body2"
              sx={{ fontSize: '12px', color: 'text.secondary', opacity: 0.6 }}
            >
              {currentGroup.subtitle}
            </Typography>
          )}
        </Box>
      </>
    );
  };

  const renderLevel = () => {
    if (isLoading) {
      return <BodySkeleton variant="drawer" />;
    }

    const athletes = currentGroup?.athletes ?? [];
    const isEmpty = !filteredGroups.length && !athletes.length;

    return (
      <Stack sx={{ overflowY: 'auto' }}>
        {renderListHeader()}
        {filteredGroups.map(renderGroup)}

        {isEmpty && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              py: 2
            }}>
            {i18n.t('No results')}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <>
      <Stack direction="row" spacing={1} sx={{
        px: 2
      }}>
        <SearchBar
          Search={Search}
          onSearchChange={setSearchInput}
          grouping={grouping}
          isLoading={isLoading}
        />
      </Stack>

      <Box
        sx={{
          px: 2,
          pb: 1
        }}>
        <Chip
          size="small"
          variant="filled"
          disabled={selectedIds.size === 0}
          color="primary"
          label={`${i18n.t('Selected')} (${selectedIds.size})`}
          onDelete={
            selectedIds.size ? () => setSelectedIds(() => new Set()) : null
          }
          deleteIcon={<CloseIcon fontSize="small" />}
        />
      </Box>

      <Divider />

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          marginTop: '-8px'
        }}>
        {renderLevel()}
      </Box>
    </>
  );
};

export default AthleteSelectorDrawerContent;
