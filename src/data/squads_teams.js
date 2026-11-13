// Squads and teams, built from the club, the athletes, the staff and the games, so every count
// and name agrees with the other datasets.
import { fakerFor } from './fake'
import { isoDateTime } from './clock'
import { ORGANISATION, SEASON, SPORT, SQUAD_PLAN } from './club'
import athletes from './athletes'
import games from './games_matches'
import { athleteName } from './roster'
import staff, { fullName } from './users_staff'

const faker = fakerFor('squads')

const coachFor = (squadId, role) => staff.find((s) => s.squads.some((sq) => sq.squad_id === squadId && sq.role === role))

const squads = SQUAD_PLAN.map((plan) => {
  const members = athletes.filter((a) => a.squad_id === plan.id)
  const outfield = members.filter((a) => a.position !== 'Goalkeeper' && a.availability_status === 'Available')
  const [captain, vice] = [...outfield].sort((a, b) => b.age - a.age)
  const played = faker.number.int({ min: 10, max: 16 })
  const wins = faker.number.int({ min: 3, max: played - 4 })
  const draws = faker.number.int({ min: 1, max: played - wins - 1 })
  const losses = played - wins - draws
  const ourGames = games.filter((g) => g.squad_id === plan.id)
  const next = ourGames.find((g) => g.match_status === 'Upcoming')
  const form = ourGames.filter((g) => g.match_status === 'Completed').map((g) => g.result[0])
  return {
    id: plan.id,
    name: plan.name,
    sport: SPORT,
    division: plan.division,
    organisation_id: ORGANISATION.id,
    organisation_name: ORGANISATION.name,
    is_active: true,
    is_locked: false,
    parent_squad_id: plan.parent_squad_id,
    squad_type: plan.squad_type,
    season: SEASON,
    coach: coachFor(plan.id, 'Head Coach') ? fullName(coachFor(plan.id, 'Head Coach')) : null,
    assistant_coach: coachFor(plan.id, 'Assistant Coach') ? fullName(coachFor(plan.id, 'Assistant Coach')) : null,
    captain: captain ? athleteName(captain) : null,
    vice_captain: vice ? athleteName(vice) : null,
    formation: plan.formation,
    home_venue: plan.home_venue,
    training_ground: plan.training_ground,
    squad_size: members.length,
    active_players: members.filter((a) => a.availability_status === 'Available').length,
    injured_players: members.filter((a) => a.availability_status === 'Injured').length,
    suspended_players: 0,
    stats: {
      matches_played: played,
      wins,
      draws,
      losses,
      goals_for: wins * 2 + draws + faker.number.int({ min: 0, max: 6 }),
      goals_against: losses * 2 + draws + faker.number.int({ min: 0, max: 4 }),
      points: wins * 3 + draws,
      league_position: faker.number.int({ min: 1, max: 8 }),
    },
    players: members.map((a, index) => ({
      athlete_id: a.id,
      name: athleteName(a),
      position: a.position,
      jersey_number: index + 1,
      status: a.availability_status === 'Injured' ? 'Injured' : 'Active',
    })),
    recent_form: form.length ? form : Array.from({ length: 5 }, () => faker.helpers.arrayElement(['W', 'D', 'L'])),
    next_match: next
      ? {
          date: next.date,
          opponent: next.home_team === ORGANISATION.name ? next.away_team : next.home_team,
          opponent_logo: null,
          venue: next.home_team === ORGANISATION.name ? 'Home' : 'Away',
          competition: next.competition,
        }
      : null,
    logo: plan.logo,
    league: 'premier-league',
    created_at: isoDateTime(-120, 10),
    updated_at: isoDateTime(-1, 14, 30),
  }
})

export default squads
