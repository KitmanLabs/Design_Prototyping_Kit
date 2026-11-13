// Wellbeing questionnaires, generated: the latest daily questionnaire for the first squad's
// athletes, plus an injury recovery questionnaire for each athlete injured now.
import { fakerFor } from './fake'
import { isoDate, isoDateTime } from './clock'
import athletes from './athletes'
import { currentInjuries } from './injuries_medical'
import { athleteName } from './roster'

const faker = fakerFor('questionnaires')
const score = (min = 4, max = 9) => faker.number.int({ min, max })

const daily = () => [
  { question: 'How did you sleep last night?', variable: 'sleep_quality', response: score(), scale: '1-10', category: 'Sleep' },
  { question: 'How are your energy levels?', variable: 'energy_level', response: score(), scale: '1-10', category: 'Energy' },
  { question: 'Any muscle soreness?', variable: 'muscle_soreness', response: score(1, 7), scale: '1-10', category: 'Physical' },
  { question: 'How is your mood?', variable: 'mood', response: score(5, 10), scale: '1-10', category: 'Psychological' },
]

const recovery = () => [
  { question: 'Pain level in injured area', variable: 'pain_level', response: score(1, 6), scale: '1-10', category: 'Pain' },
  { question: 'Range of motion improvement', variable: 'rom_improvement', response: score(4, 9), scale: '1-10', category: 'Physical' },
  { question: 'Confidence in injured area', variable: 'confidence', response: score(3, 8), scale: '1-10', category: 'Psychological' },
]

function record(athlete, type, responses, offset) {
  const positive = responses.map((r) => (['pain_level', 'muscle_soreness'].includes(r.variable) ? 11 - r.response : r.response))
  const overall = Math.round((positive.reduce((a, b) => a + b, 0) / positive.length) * 10) / 10
  const flags = responses
    .filter((r) => (['pain_level', 'muscle_soreness'].includes(r.variable) ? r.response >= 6 : r.response <= 4))
    .map((r) => (r.variable === 'pain_level' ? 'Pain reported' : r.variable === 'confidence' ? 'Low confidence' : `Low ${r.category.toLowerCase()}`))
  const hour = faker.number.int({ min: 7, max: 9 })
  return {
    athlete_id: athlete.id,
    athlete_name: athleteName(athlete),
    questionnaire_type: type,
    questionnaire_date: isoDate(offset),
    status: 'Completed',
    completion_time: isoDateTime(offset, hour, 30),
    responses,
    overall_score: overall,
    wellness_flags: flags,
    recommendations: flags.length ? 'Follow up with the athlete before training.' : 'Good overall wellness. Continue the current routine.',
    created_at: isoDateTime(offset, hour, 30),
    updated_at: isoDateTime(offset, hour, 35),
  }
}

const injured = new Set(currentInjuries.map((i) => i.athlete_id))
const questionnaires = [
  ...athletes.filter((a) => a.squad_id === 1 && !injured.has(a.id)).slice(0, 10).map((a) => record(a, 'Daily Wellbeing', daily(), -faker.number.int({ min: 0, max: 1 }))),
  ...athletes.filter((a) => injured.has(a.id)).map((a) => record(a, 'Injury Recovery', recovery(), -faker.number.int({ min: 0, max: 2 }))),
].map((q, index) => ({ id: index + 1, ...q }))

export default questionnaires
