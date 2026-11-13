import { describe, it, expect } from 'vitest'
import moment from 'moment'
import athletes from './athletes'
import injuries, { currentInjuries } from './injuries_medical'
import staff from './users_staff'
import squads from './squads_teams'
import games from './games_matches'
import training from './training_sessions'
import assessments from './assessments'
import questionnaires from './questionnaires_wellbeing'
import { currentUser, availableSquads } from './layout'
import { fakerFor } from './fake'
import { TODAY } from './clock'

const byId = new Map(athletes.map((a) => [a.id, a]))
const name = (a) => `${a.firstname} ${a.lastname}`

describe('generated mock data', () => {
  it('is the same every time a dataset is generated', () => {
    const one = fakerFor('check')
    const two = fakerFor('check')
    expect([one.number.int(1000), one.string.alpha(8)]).toEqual([two.number.int(1000), two.string.alpha(8)])
  })

  it('gives every record a unique id', () => {
    for (const rows of [athletes, injuries, staff, squads, games, training, assessments, questionnaires]) {
      expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length)
    }
  })

  it('agrees on who is injured: availability, return dates and squad counts', () => {
    const injured = new Set(currentInjuries.map((i) => i.athlete_id))
    expect(injured.size).toBeGreaterThan(0)
    for (const athlete of athletes) {
      expect(athlete.availability_status).toBe(injured.has(athlete.id) ? 'Injured' : 'Available')
    }
    for (const record of currentInjuries) {
      expect(byId.get(record.athlete_id).rtp_date).toBe(record.rtp_date)
      expect(moment(record.rtp_date).isAfter(TODAY)).toBe(true)
      expect(moment(record.occurrence_date).isBefore(TODAY)).toBe(true)
    }
    for (const squad of squads) {
      const members = athletes.filter((a) => a.squad_id === squad.id)
      expect(squad.squad_size).toBe(members.length)
      expect(squad.injured_players).toBe(members.filter((a) => injured.has(a.id)).length)
      expect(squad.players.map((p) => p.athlete_id)).toEqual(members.map((a) => a.id))
    }
  })

  it('names athletes the same way everywhere', () => {
    const records = [...injuries, ...assessments, ...questionnaires]
    for (const record of records) {
      expect(record.athlete_name).toBe(name(byId.get(record.athlete_id)))
    }
    for (const game of games) {
      for (const p of game.player_performances) expect(p.athlete_name).toBe(name(byId.get(p.athlete_id)))
    }
  })

  it('only picks athletes who were available on the day of a game', () => {
    for (const game of games) {
      const day = moment(game.date)
      for (const p of game.player_performances) {
        const out = injuries.some((i) => i.athlete_id === p.athlete_id && day.isSameOrAfter(i.occurrence_date, 'day') && day.isBefore(i.rtp_date, 'day'))
        expect(out, `${p.athlete_name} on ${game.date}`).toBe(false)
      }
    }
  })

  it('dates everything around today', () => {
    const completed = games.filter((g) => g.match_status === 'Completed')
    const upcoming = games.filter((g) => g.match_status === 'Upcoming')
    expect(completed.every((g) => moment(g.date).isBefore(TODAY))).toBe(true)
    expect(upcoming.every((g) => !moment(g.date).isBefore(TODAY))).toBe(true)
    expect(training.every((t) => moment(t.date).isBetween(TODAY.clone().subtract(14, 'days'), TODAY, 'day', '[)'))).toBe(true)
    expect(athletes.every((a) => moment(a.last_assessment).isBetween(TODAY.clone().subtract(31, 'days'), TODAY))).toBe(true)
  })

  it('gives staff contact details that reach nobody', () => {
    for (const person of staff) {
      expect(person.email).toMatch(/@[a-z-]+\.example$/)
      expect(person.phone).toMatch(/^\+44 20 7946 0\d{3}$/)
      expect(person.emergency_contact).toMatch(/^\+44 20 7946 0\d{3}$/)
    }
  })

  it('takes the signed-in user and the squad switcher from the same data', () => {
    expect(staff.some((s) => `${s.firstname} ${s.lastname}` === currentUser.name)).toBe(true)
    expect(availableSquads.map((s) => s.name)).toEqual(squads.map((s) => s.name))
  })
})
