// The invented club every mock dataset belongs to: its squads, the sport's positions, its venues
// and the clubs it plays. Change the club here; the generators build everything else from it.
import { fakerFor } from './fake'
import { season } from './clock'

export const ORGANISATION = { id: 1, name: 'Medinah FC', domain: 'medinah-fc.example' }

export const SPORT = 'Football'

// Positions, in the order a squad list shows them, with how many of each a squad of 18 has.
export const POSITIONS = [
  { position: 'Goalkeeper', position_group: 'Goalkeeper', share: 2 },
  { position: 'Defender', position_group: 'Defence', share: 6 },
  { position: 'Midfielder', position_group: 'Midfield', share: 6 },
  { position: 'Forward', position_group: 'Attack', share: 4 },
]

export const HOME_VENUE = 'Medinah Park'

// The squads, with the athletes each has and their ages.
export const SQUAD_PLAN = [
  {
    id: 1, name: 'First Team', short: 'FT', squad_type: 'Senior', division: 'Premier Division',
    gender: 'Male', size: 18, ages: [20, 34], parent_squad_id: null, formation: '4-3-3',
    home_venue: HOME_VENUE, training_ground: 'Training Centre A', logo: 'arsenal',
  },
  {
    id: 2, name: 'Reserve Team', short: 'RES', squad_type: 'Reserve', division: 'Reserve League',
    gender: 'Male', size: 8, ages: [18, 23], parent_squad_id: 1, formation: '4-4-2',
    home_venue: 'Training Centre Stadium', training_ground: 'Training Centre B', logo: 'chelsea',
  },
  {
    id: 3, name: 'Youth Team', short: 'U18', squad_type: 'Youth', division: 'Youth League',
    gender: 'Male', size: 6, ages: [16, 18], parent_squad_id: 1, formation: '4-2-3-1',
    home_venue: 'Academy Stadium', training_ground: 'Youth Academy', logo: 'manchester-united',
  },
  {
    id: 4, name: "Women's Team", short: 'WT', squad_type: "Women's", division: "Women's Premier Division",
    gender: 'Female', size: 12, ages: [19, 33], parent_squad_id: null, formation: '4-3-3',
    home_venue: HOME_VENUE, training_ground: 'Training Centre C', logo: 'manchester-city',
  },
]

export const SEASON = season()

const clubFaker = fakerFor('clubs')
const PLACE_STARTS = ['Ash', 'Brook', 'Castle', 'Elm', 'Fair', 'Green', 'Kings', 'Mill', 'Oak', 'Stone', 'West', 'North', 'Hollin', 'Marsh', 'Red']
const PLACE_ENDS = ['bury', 'field', 'ford', 'ham', 'ley', 'mouth', 'ton', 'wick', 'combe', 'dale']
const SUFFIXES = ['Athletic', 'Rovers', 'Town', 'Albion', 'Wanderers', 'United', 'City', 'Rangers']

// Invented clubs to play against, each with a home ground.
const places = clubFaker.helpers.uniqueArray(
  () => `${clubFaker.helpers.arrayElement(PLACE_STARTS)}${clubFaker.helpers.arrayElement(PLACE_ENDS)}`,
  10,
)
export const OPPONENTS = places.map((place, i) => ({
  name: `${place} ${SUFFIXES[i % SUFFIXES.length]}`,
  venue: `${place} ${clubFaker.helpers.arrayElement(['Park', 'Road', 'Stadium', 'Lane'])}`,
}))
