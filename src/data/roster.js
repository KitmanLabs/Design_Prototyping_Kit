// Who is in each squad: identity, squad, position and build. The other athlete fields depend on
// injuries and assessments, so athletes.js adds them; import athletes from there, not from here.
import { fakerFor, namesFor, NATIONALITIES } from './fake'
import { day, isoDate, isoDateTime } from './clock'
import { ORGANISATION, POSITIONS, SQUAD_PLAN } from './club'

// Positions for a squad of `size`, spread in the proportions POSITIONS gives.
function positionsFor(size) {
  const total = POSITIONS.reduce((sum, p) => sum + p.share, 0)
  const out = []
  for (const p of POSITIONS) {
    const count = Math.max(1, Math.round((p.share / total) * size))
    for (let i = 0; i < count; i++) out.push(p)
  }
  while (out.length > size) out.splice(out.findLastIndex((p) => p.position !== 'Goalkeeper'), 1)
  while (out.length < size) out.push(POSITIONS[2])
  return out
}

const BUILD = {
  Male: { height: [172, 194], weight: [66, 90] },
  Female: { height: [158, 180], weight: [52, 72] },
}

const picker = fakerFor('roster')
const nameFakers = new Map(NATIONALITIES.map((n) => [n.country, namesFor(fakerFor(`names-${n.country}`), n.country)]))

let nextId = 1
const roster = SQUAD_PLAN.flatMap((squad) =>
  positionsFor(squad.size).map((pos, index) => {
    const nationality = picker.helpers.weightedArrayElement(NATIONALITIES.map((n) => ({ weight: n.weight, value: n })))
    const names = nameFakers.get(nationality.country)
    const sex = squad.gender === 'Female' ? 'female' : 'male'
    const firstname = names.firstName(sex)
    const lastname = names.lastName()
    const age = picker.number.int({ min: squad.ages[0], max: squad.ages[1] })
    const birthday = day(-picker.number.int({ min: 0, max: 364 })).subtract(age, 'years')
    const build = BUILD[squad.gender]
    const tall = pos.position === 'Goalkeeper' ? 6 : 0
    const height = picker.number.int({ min: build.height[0] + tall, max: build.height[1] })
    const weight = Math.round(build.weight[0] + ((height - build.height[0]) / (build.height[1] - build.height[0])) * (build.weight[1] - build.weight[0]) + picker.number.int({ min: -3, max: 3 }))
    const joinedDaysAgo = picker.number.int({ min: 120, max: 2400 })
    return {
      id: nextId++,
      firstname,
      lastname,
      alias: `${firstname[0]}${lastname[0]}`.toUpperCase(),
      date_of_birth: birthday.format('YYYY-MM-DD'),
      age,
      gender: squad.gender,
      height: `${height}cm`,
      weight: `${weight}kg`,
      country: nationality.country,
      position: pos.position,
      position_group: pos.position_group,
      jersey_number: index + 1,
      squad_id: squad.id,
      squad_name: squad.name,
      organisation_id: ORGANISATION.id,
      is_active: true,
      is_removed: false,
      created_at: isoDateTime(-joinedDaysAgo, 10, 30),
      joined: isoDate(-joinedDaysAgo),
    }
  })
)

export const athleteName = (athlete) => `${athlete.firstname} ${athlete.lastname}`

export default roster
