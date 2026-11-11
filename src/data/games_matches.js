// The First Team's recent and upcoming games, generated: weekly fixtures against invented clubs,
// with line-ups and events drawn from athletes available on the day.
import { fakerFor, namesFor } from './fake'
import { day, isoDateTime } from './clock'
import { HOME_VENUE, OPPONENTS, ORGANISATION } from './club'
import athletes from './athletes'
import injuries from './injuries_medical'
import { athleteName } from './roster'

const faker = fakerFor('games')
const names = namesFor(faker, 'England')
const SQUAD_ID = 1
const squad = athletes.filter((a) => a.squad_id === SQUAD_ID)

// Saturdays: the four before today and the two after.
const lastSaturday = day(0).day() === 6 ? day(-7) : day(0).day(-1)
const fixtures = [-21, -14, -7, 0, 7, 14].map((offset) => lastSaturday.clone().add(offset, 'days'))

const unavailableOn = (date) => new Set(
  injuries
    .filter((i) => date.isSameOrAfter(i.occurrence_date, 'day') && date.isBefore(i.rtp_date, 'day'))
    .map((i) => i.athlete_id)
)

function lineUp(date) {
  const out = unavailableOn(date)
  const pick = (position, count) => faker.helpers.shuffle(squad.filter((a) => a.position === position && !out.has(a.id))).slice(0, count)
  return [...pick('Goalkeeper', 1), ...pick('Defender', 4), ...pick('Midfielder', 3), ...pick('Forward', 3)]
}

const games = fixtures.map((date, index) => {
  const opponent = OPPONENTS[index % OPPONENTS.length]
  const home = index % 2 === 0
  const completed = date.isBefore(day(0), 'day')
  const competition = index === 2 ? 'Cup' : 'League'
  const base = {
    id: index + 1,
    date: date.format('YYYY-MM-DD'),
    time: faker.helpers.arrayElement(['12:30', '15:00', '17:30', '19:45']),
    competition: competition === 'Cup' ? 'County Cup' : 'Premier Division',
    home_team: home ? ORGANISATION.name : opponent.name,
    away_team: home ? opponent.name : ORGANISATION.name,
    venue: home ? HOME_VENUE : opponent.venue,
    match_type: competition,
    squad_id: SQUAD_ID,
    squad_name: 'First Team',
    referee: `${names.firstName('male')} ${names.lastName()}`,
    surface: 'Natural Grass',
    created_at: isoDateTime(-28, 10),
  }
  if (!completed) {
    return {
      ...base, result: 'Scheduled', score: 'vs', home_score: null, away_score: null, attendance: null,
      weather: 'TBD', temperature: 'TBD', match_status: 'Upcoming',
      player_performances: [], team_stats: {}, events: [],
      notes: 'Upcoming fixture. Opponent analysis to follow.',
      updated_at: isoDateTime(-1, 10),
    }
  }
  const ours = faker.number.int({ min: 0, max: 3 })
  const theirs = faker.number.int({ min: 0, max: 2 })
  const players = lineUp(date)
  const scorers = faker.helpers.arrayElements(players.filter((p) => p.position !== 'Goalkeeper'), ours)
  const performances = players.map((p) => {
    const goals = scorers.filter((s) => s.id === p.id).length
    const shots = goals + faker.number.int({ min: 0, max: p.position === 'Forward' ? 4 : 2 })
    return {
      athlete_id: p.id,
      athlete_name: athleteName(p),
      position: p.position,
      minutes_played: faker.helpers.weightedArrayElement([{ weight: 8, value: 90 }, { weight: 2, value: faker.number.int({ min: 55, max: 85 }) }]),
      goals,
      assists: goals ? 0 : faker.helpers.weightedArrayElement([{ weight: 9, value: 0 }, { weight: 1, value: 1 }]),
      shots,
      shots_on_target: Math.min(shots, goals + faker.number.int({ min: 0, max: 2 })),
      passes: faker.number.int({ min: 18, max: 70 }),
      pass_accuracy: faker.number.int({ min: 72, max: 93 }),
      tackles: faker.number.int({ min: 0, max: p.position === 'Defender' ? 6 : 3 }),
      yellow_cards: faker.helpers.weightedArrayElement([{ weight: 9, value: 0 }, { weight: 1, value: 1 }]),
      red_cards: 0,
      rating: faker.number.float({ min: 6, max: goals ? 9 : 8, fractionDigits: 1 }),
    }
  })
  const events = [
    ...scorers.map((s) => ({ minute: faker.number.int({ min: 3, max: 90 }), type: 'Goal', player: athleteName(s), description: faker.helpers.arrayElement(['Header from a cross', 'Finish from the edge of the box', 'Penalty', 'Tap-in at the far post']) })),
    ...performances.filter((p) => p.yellow_cards).map((p) => ({ minute: faker.number.int({ min: 10, max: 89 }), type: 'Yellow Card', player: p.athlete_name, description: 'Tactical foul' })),
  ].sort((a, b) => a.minute - b.minute)
  const result = ours > theirs ? 'Win' : ours < theirs ? 'Loss' : 'Draw'
  const homeScore = home ? ours : theirs
  const awayScore = home ? theirs : ours
  return {
    ...base,
    result,
    score: `${homeScore}-${awayScore}`,
    home_score: homeScore,
    away_score: awayScore,
    attendance: home ? faker.number.int({ min: 18000, max: 32000 }) : faker.number.int({ min: 9000, max: 26000 }),
    weather: faker.helpers.arrayElement(['Clear', 'Overcast', 'Rain', 'Windy']),
    temperature: `${faker.number.int({ min: 4, max: 16 })}°C`,
    match_status: 'Completed',
    player_performances: performances,
    team_stats: {
      possession: faker.number.int({ min: 38, max: 64 }),
      total_shots: performances.reduce((sum, p) => sum + p.shots, 0),
      shots_on_target: performances.reduce((sum, p) => sum + p.shots_on_target, 0),
      corners: faker.number.int({ min: 2, max: 10 }),
      fouls: faker.number.int({ min: 6, max: 16 }),
      offsides: faker.number.int({ min: 0, max: 5 }),
      pass_accuracy: faker.number.int({ min: 76, max: 90 }),
    },
    events,
    notes: { Win: 'Strong performance. Good cohesion and defensive stability.', Draw: 'Solid performance. Good defensive organisation throughout.', Loss: 'Tough result. Review the second-half shape.' }[result],
    updated_at: isoDateTime(date.diff(day(0), 'days'), 20),
  }
})

export default games
