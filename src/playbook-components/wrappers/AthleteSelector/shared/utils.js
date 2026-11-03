
const STATUS_MAP = {
  available: 'available',
  injured: 'injured',
  unavailable: 'unavailable',
};

export const Z_INDEX_ABOVE_DRAWER = 2147483007;

export const matchesSearch = (athlete, search) => {
  if (!search) {
    return true;
  }

  return athlete.name?.toLowerCase().includes(search.toLocaleLowerCase());
};

export const filterGroup = ({
  group,
  search,
  filterAthletes = false,
}) => {
  const filteredAthletes =
    group.athletes?.filter((athlete) => matchesSearch(athlete, search)) ?? [];
  const filteredChildren =
    group.children
      ?.map((childGroup) =>
        filterGroup({
          group: childGroup,
          search,
          filterAthletes,
        })
      )
      .filter(Boolean) ?? [];

  if (filteredAthletes.length === 0 && filteredChildren.length === 0) {
    return null;
  }

  return {
    ...group,
    children: filteredChildren,
    athletes: filterAthletes ? filteredAthletes : group.athletes,
  };
};

export const collectGroupKeys = (groups) =>
  groups.flatMap((group) => [
    group.key,
    ...(group.children ? collectGroupKeys(group.children) : []),
  ]);

export const collectAthleteIds = (g) => [
  ...(g.athletes?.map((a) => Number(a.id)) ?? []),
  ...(g.children ? g.children.flatMap(collectAthleteIds) : []),
];

/**
 * Get all athlete IDs from a group recursively.
 * Similar to collectAthleteIds but returns a mutable array.
 */
export const getAllAthleteIdsFromGroup = (group) => {
  const ids = [];

  (group.athletes || []).forEach((athlete) => {
    ids.push(athlete.id);
  });

  (group.children || []).forEach((child) => {
    ids.push(...getAllAthleteIdsFromGroup(child));
  });

  return ids;
};

const SQUAD_KEY_PREFIX = 'squad';

export const getSquadKey = (squadId) =>
  `${SQUAD_KEY_PREFIX}-${squadId}`;

export const getSquadIdFromKey = (key) => {
  const match = key.match(new RegExp(`^${SQUAD_KEY_PREFIX}-(\\d+)$`));
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Get the first uppercase character for avatar fallback.
 */
export function getInitial(name) {
  return name && name.length > 0 ? name[0].toUpperCase() : '';
}

/**
 * Normalize the backend status to a canonical key used in the UI.
 */
export function normalizeStatus(
  status
) {
  if (!status) return 'unknown';
  const key = String(status).toLowerCase();
  return STATUS_MAP[key] || 'unknown';
}

/**
 * Map normalized status to MUI Chip color.
 */
export const chipColorFor = (
  status
) => {
  const s = normalizeStatus(status);
  if (s === 'available') return 'success';
  if (s === 'injured') return 'error';
  if (s === 'unavailable') return 'default';
  return 'default';
};
