

const mapAthletesToOrganizationGroups =
  ({ identifier }) =>
  (hierarchy) => {
    const association = hierarchy.association;
    const groups = [];
    const athleteMap = new Map(); // to skip duplicates

    const athleteIdKey = identifier === 'userId' ? 'user_id' : 'id';

    association.organisations.forEach((organization) => {
      const orgChildren = organization.squads.map((squad) => {
        const mappedAthletes = squad.athletes.map((athlete) => {
          const mapped = {
            key: `org-${organization.id}-squad-${squad.id}-athlete-${athlete[athleteIdKey]}`,
            id: athlete[athleteIdKey],
            name: athlete.fullname,
            firstname: athlete.firstname,
            lastname: athlete.lastname,
            squadId: squad.id,
            squadName: squad.name,
            position: athlete.position?.name,
          };

          if (!athleteMap.has(athlete[athleteIdKey])) {
            athleteMap.set(athlete[athleteIdKey], mapped);
          }

          return mapped;
        });

        return {
          key: `org-${organization.id}-squad-${squad.id}`,
          title: squad.name,
          athletes: mappedAthletes,
          children: [],
        };
      });

      groups.push({
        key: `org-${organization.id}`,
        title: organization.name,
        children: orgChildren,
      });
    });

    return {
      groups,
      athletes: Array.from(athleteMap.values()),
    };
  };

const mapAthleteToSquadGroups =
  ({ identifier }) =>
  (hierarchy) => {
    const { association } = hierarchy;
    const athleteMap = new Map();

    const athleteIdKey = identifier === 'userId' ? 'user_id' : 'id';

    const squads = association.organisations.flatMap((organization) =>
      organization.squads.map((squad) => ({
        organizationId: organization.id,
        organizationName: organization.name,
        id: squad.id,
        name: squad.name,
        athletes: squad.athletes,
      }))
    );

    const uniqueSquads = Array.from(
      new Map(squads.map((squad) => [squad.id, squad])).values()
    );

    const groups = uniqueSquads.map((squad) => {
      const mappedAthletes = squad.athletes.map((athlete) => {
        const mapped = {
          key: `squad-${squad.id}-athlete-${athlete[athleteIdKey]}`,
          id: athlete[athleteIdKey],
          name: athlete.fullname,
          firstname: athlete.firstname,
          lastname: athlete.lastname,
          squadId: squad.id,
          squadName: squad.name,
          position: athlete.position?.name,
        };

        if (!athleteMap.has(athlete[athleteIdKey])) {
          athleteMap.set(athlete[athleteIdKey], mapped);
        }

        return mapped;
      });

      return {
        key: `squad-${squad.id}`,
        title: squad.name,
        subtitle: squad.organizationName,
        athletes: mappedAthletes,
        children: [],
      };
    });

    return {
      groups,
      athletes: Array.from(athleteMap.values()),
    };
  };

export { mapAthletesToOrganizationGroups, mapAthleteToSquadGroups };
