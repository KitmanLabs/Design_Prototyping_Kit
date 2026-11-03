import { useEffect, useMemo, useState } from 'react';
import getAssociationHierarchy from '@kitman/services/src/services/athlete/associationHierarchy/getAssociationHierarchy';
import i18n from '@kitman/common/src/utils/i18n';
import {
  mapAthletesToOrganizationGroups,
  mapAthleteToSquadGroups,
} from './mappers';

const AssociationGroups = {
  ORGANISATION: 'organisation',
  SQUAD: 'squad',
};



const getMapper = (identifier) => ({
  [AssociationGroups.ORGANISATION]: mapAthletesToOrganizationGroups({
    identifier,
  }),
  [AssociationGroups.SQUAD]: mapAthleteToSquadGroups({ identifier }),
});

const labels = {
  [AssociationGroups.ORGANISATION]: i18n.t('Club') ?? 'Club',
  [AssociationGroups.SQUAD]: i18n.t('Squad') ?? 'Squad',
};

const useAssociationAthletes = (params) => {
  const [groupMode, setGroupMode] = useState(
    AssociationGroups.ORGANISATION
  );
  const [isLoading, setIsLoading] = useState(!params?.skip);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const identifier = params?.identifier ?? 'athleteId';

  useEffect(() => {
    let cancelled = false;

    if (!params?.skip) {
      (async () => {
        setIsLoading(true);
        setError(null);

        try {
          const associationData = await getAssociationHierarchy();
          setData(associationData);
          setIsLoading(false);
        } catch (err) {
          if (!cancelled) {
            setError(err?.message || 'Failed to load athletes');
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const mappedData = useMemo(() => {
    if (!data) {
      return {
        groups: [],
        athletes: [],
      };
    }

    return getMapper(identifier)[groupMode](data);
  }, [identifier, data, groupMode]);

  const grouping = {
    options: (Object.keys(labels)).map((key) => ({
      value: key,
      label: labels[key],
    })),
    current: groupMode,
    setCurrent: setGroupMode,
  };

  return {
    isLoading,
    groups: mappedData.groups,
    athletes: mappedData.athletes,
    error,
    grouping,
  };
};

export { useAssociationAthletes };
