import { useState, useMemo, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import { ClickAwayListener } from '@mui/material';
import i18n from '@kitman/common/src/utils/i18n';
import Popper from '@mui/material/Popper';
import { ChevronLeft } from '@mui/icons-material';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import {
  SearchBar,
  AthleteListItem,
  BodySkeleton,
  FlatGroupComponent,
} from '../shared';
import {
  filterGroup,
  matchesSearch,
  Z_INDEX_ABOVE_DRAWER,
  getSquadKey,
  getSquadIdFromKey,
  getAllAthleteIdsFromGroup,
} from '../shared/utils';


const DEFAULT_WIDTH = 400;

const AthleteSelectorDropdown = ({
  open,
  onDone,
  groups,
  selectedIds,
  setSelectedIds,
  isLoading = false,
  grouping,
  anchorEl,
  dropdownWidth,
  title,
  showSelectSquad = false,
  onSquadSelectionChange,
  initialSquadIds = [],
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [path, setPath] = useState([]);
  const [squadSelectedAthleteIds, setSquadSelectedAthleteIds] = useState(() => new Set());
  const [squadCheckedGroups, setSquadCheckedGroups] = useState(
    () => new Set()
  );
  const [initialized, setInitialized] = useState(false);
  const [showLockedWarning, setShowLockedWarning] = useState(false);

  const handleClose = () => {
    onDone();
  };

  useEffect(() => {
    if (!open) {
      setSearchInput('');
      setPath([]);
      setSquadSelectedAthleteIds(new Set());
      setSquadCheckedGroups(new Set());
      setInitialized(false);
    }

    return () => {
      if (!open) {
        setSearchInput('');
        setPath([]);
        setSquadSelectedAthleteIds(new Set());
        setSquadCheckedGroups(new Set());
        setInitialized(false);
      }
    };
  }, [open, groups]);

  // Initialize squad selections from initialSquadIds
  useEffect(() => {
    if (
      open &&
      !initialized &&
      initialSquadIds.length > 0 &&
      groups.length > 0
    ) {
      const squadKeys = new Set(initialSquadIds.map((id) => getSquadKey(id)));

      // Find all athlete IDs that belong to the initial squads
      const athleteIdsFromSquads = new Set();
      groups.forEach((group) => {
        if (squadKeys.has(group.key)) {
          const ids = getAllAthleteIdsFromGroup(group);
          ids.forEach((id) => athleteIdsFromSquads.add(id));
        }
      });

      setSquadCheckedGroups(squadKeys);
      setSquadSelectedAthleteIds(athleteIdsFromSquads);

      // Add squad athletes to selectedIds
      setSelectedIds((prev) => {
        const next = new Set(prev);
        athleteIdsFromSquads.forEach((id) => next.add(id));
        return next;
      });

      setInitialized(true);

      // Notify parent of initial squad selection
      if (onSquadSelectionChange) {
        onSquadSelectionChange(new Set(initialSquadIds), athleteIdsFromSquads);
      }
    }
  }, [
    open,
    initialized,
    initialSquadIds,
    groups,
    onSquadSelectionChange,
    setSelectedIds,
  ]);

  const currentGroup = useMemo(() => {
    if (!path.length) {
      return { key: 'root', title: 'All', children: groups, athletes: [] };
    }

    return path[path.length - 1];
  }, [path, groups]);

  // Get all valid athlete IDs from the groups population
  const allValidAthleteIds = useMemo(() => {
    const validIds = new Set();
    groups.forEach((group) => {
      const ids = getAllAthleteIdsFromGroup(group);
      ids.forEach((id) => validIds.add(id));
    });
    return validIds;
  }, [groups]);

  // Calculate the valid selected count (only IDs that exist in the population)
  const validSelectedCount = useMemo(() => {
    let count = 0;
    selectedIds.forEach((id) => {
      if (allValidAthleteIds.has(id)) {
        count += 1;
      }
    });
    return count;
  }, [selectedIds, allValidAthleteIds]);

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

  const handleBack = () => setPath((prev) => prev.slice(0, -1));

  // Check if we're at squad level (root level, path is empty)
  const isAtSquadLevel = path.length === 0;

  // Check if squad checkbox is checked (independent of selection state)
  const isSquadCheckboxChecked = (squad) => {
    return squadCheckedGroups.has(squad.key);
  };

  // Check if we're currently inside a checked squad (at any nested level)
  const isInsideCheckedSquad = useMemo(() => {
    if (!showSelectSquad || path.length === 0) {
      return false;
    }
    // The first item in the path is the squad level
    const squadGroup = path[0];
    return squadCheckedGroups.has(squadGroup.key);
  }, [showSelectSquad, path, squadCheckedGroups]);

  // Handle select/unselect squad
  const handleSelectSquad = (squad) => {
    const allIds = getAllAthleteIdsFromGroup(squad);
    const isCurrentlyChecked = isSquadCheckboxChecked(squad);
    const squadId = getSquadIdFromKey(squad.key);

    // Update squad checkbox state first
    const newSquadCheckedGroups = new Set(squadCheckedGroups);
    if (isCurrentlyChecked) {
      newSquadCheckedGroups.delete(squad.key);
    } else {
      newSquadCheckedGroups.add(squad.key);
    }
    setSquadCheckedGroups(newSquadCheckedGroups);

    // Recalculate all athlete IDs that belong to ANY checked squad
    const newSquadSelectedAthleteIds = new Set();
    groups.forEach((group) => {
      if (newSquadCheckedGroups.has(group.key)) {
        const ids = getAllAthleteIdsFromGroup(group);
        ids.forEach((id) => newSquadSelectedAthleteIds.add(id));
      }
    });

    setSquadSelectedAthleteIds(newSquadSelectedAthleteIds);

    // Update selectedIds based on the change
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (isCurrentlyChecked) {
        // Unchecking: only remove athletes that are NOT in any other checked squad
        allIds.forEach((id) => {
          const shouldRemove = !newSquadSelectedAthleteIds.has(id);

          if (shouldRemove) {
            next.delete(id);
          }
        });
      } else {
        // Checking: add all athletes from this squad
        allIds.forEach((id) => next.add(id));
      }

      return next;
    });

    // Notify parent of squad selection changes
    if (onSquadSelectionChange && squadId !== null) {
      const numericSquadIds = new Set();
      newSquadCheckedGroups.forEach((key) => {
        const id = getSquadIdFromKey(key);
        if (id !== null) {
          numericSquadIds.add(id);
        }
      });
      onSquadSelectionChange(numericSquadIds, newSquadSelectedAthleteIds);
    }
  };

  // Check if an athlete was selected via squad checkbox (disabled across all squads)
  const isAthleteDisabled = (athleteId) => {
    if (!showSelectSquad) {
      return false;
    }

    return squadSelectedAthleteIds.has(athleteId);
  };

  // Handle click on a disabled/locked athlete
  const handleLockedAthleteClick = useCallback(() => {
    setShowLockedWarning(true);
  }, []);

  useEffect(() => {
    if (showLockedWarning) {
      const timer = setTimeout(() => {
        setShowLockedWarning(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showLockedWarning]);

  const handleClearAll = useCallback(() => {
    setSelectedIds(() => new Set());
    setSquadCheckedGroups(new Set());
    setSquadSelectedAthleteIds(new Set());

    // Notify parent that all squad selections have been cleared
    if (onSquadSelectionChange) {
      onSquadSelectionChange(new Set(), new Set());
    }
  }, [setSelectedIds, onSquadSelectionChange]);

  const renderGroup = (group) => {
    const isSquadChecked = isSquadCheckboxChecked(group);

    return (
      <FlatGroupComponent
        key={group.key}
        variant="dropdown"
        group={group}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        setPath={setPath}
        hideSelectAll={
          (showSelectSquad && isAtSquadLevel && isSquadChecked) ||
          isInsideCheckedSquad
        }
        lockedAthleteIds={squadSelectedAthleteIds}
        renderLeftActions={
          showSelectSquad && isAtSquadLevel
            ? () => {
                return (
                  <Checkbox
                    size="small"
                    checked={isSquadChecked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSquad(group);
                    }}
                    sx={{ p: 0.5, mr: 1 }}
                  />
                );
              }
            : undefined
        }
      />
    );
  };

  const renderAthlete = (athlete) => {
    if (!matchesSearch(athlete, searchInput)) {
      return null;
    }

    return (
      <AthleteListItem
        size="sm"
        key={athlete.key}
        athlete={athlete}
        selectedIds={selectedIds}
        handleToggleAthlete={handleToggleAthlete}
        disabled={isAthleteDisabled(athlete.id)}
        onDisabledClick={handleLockedAthleteClick}
      />
    );
  };

  const renderListHeader = () => {
    if (!path.length) {
      return null;
    }

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          top: 0,
          backgroundColor: 'background.paper',
          zIndex: 1,
          py: 1,
          px: 2,
        }}
      >
        <Button
          onClick={handleBack}
          startIcon={<ChevronLeft fontSize="small" />}
          variant="ghost"
          size="small"
          sx={{
            justifyContent: 'start',
            marginLeft: '-0.5rem',
            px: '0.5rem',
          }}
        >
          {i18n.t('Back')}
        </Button>

        <Box>
          <Typography variant="body2" sx={{
            color: "text.primary"
          }}>
            {currentGroup.title}
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
      </Box>
    );
  };

  const renderLevel = () => {
    if (isLoading) {
      return <BodySkeleton variant="dropdown" />;
    }

    const athletes = currentGroup?.athletes ?? [];
    const isEmpty = !filteredGroups.length && !athletes.length;

    return (
      <Box sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
        {showLockedWarning && (
          <Alert
            severity="warning"
            sx={{ mx: 2, my: 1, flexShrink: 0 }}
            onClose={() => setShowLockedWarning(false)}
          >
            {i18n.t('Athlete is part of a selected squad.')}
          </Alert>
        )}
        <Stack spacing={0.5} sx={{ flex: 1, overflowY: 'auto' }}>
          {renderListHeader()}
          {filteredGroups.map(renderGroup)}
          {athletes.map(renderAthlete)}

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
      </Box>
    );
  };

  const elementWidth = useMemo(() => {
    if (dropdownWidth === 'auto') {
      return anchorEl?.getBoundingClientRect().width ?? DEFAULT_WIDTH;
    }

    if (Number.isInteger(dropdownWidth)) {
      return dropdownWidth;
    }

    return DEFAULT_WIDTH;
  }, [dropdownWidth, anchorEl]);

  return (
    <Popper
      id="athlete-selector-dropdown"
      open={open}
      anchorEl={anchorEl}
      transition
      sx={{ zIndex: Z_INDEX_ABOVE_DRAWER }}
      placement="bottom"
      disablePortal={false}
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={200}>
          <Paper sx={{ width: elementWidth }}>
            <ClickAwayListener onClickAway={handleClose}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    pt: 2
                  }}>
                  <Typography variant="h6">
                    {title ?? i18n.t('Select Athletes')}
                  </Typography>
                  <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    px: 2,
                    py: 1
                  }}>
                  <SearchBar
                    onSearchChange={setSearchInput}
                    grouping={grouping}
                    isLoading={isLoading}
                    hideGroupBy={!grouping}
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
                    disabled={validSelectedCount === 0}
                    color="primary"
                    label={`${i18n.t('Selected')} (${validSelectedCount})`}
                    onDelete={validSelectedCount ? handleClearAll : null}
                    deleteIcon={<CloseIcon fontSize="small" />}
                  />
                </Box>

                <Divider />

                <Box sx={{
                  flex: 1
                }}>{renderLevel()}</Box>

                <Divider />

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: "flex-end",
                    p: 2
                  }}>
                  <Button
                    variant="contained"
                    onClick={onDone}
                    disabled={validSelectedCount === 0}
                  >
                    {i18n.t('Done')}
                  </Button>
                </Stack>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default AthleteSelectorDropdown;