// Assessments, generated: one recent assessment per athlete for the first squad's first few,
// dated on each athlete's last_assessment.
import { fakerFor } from './fake'
import { day } from './clock'
import athletes from './athletes'
import { athleteName } from './roster'
import { fullName, staffWithRole } from './users_staff'
import moment from 'moment'

const faker = fakerFor('assessments')

const status = (percentile) => (percentile >= 85 ? 'Excellent' : percentile >= 75 ? 'Very Good' : percentile >= 60 ? 'Good' : 'Fair')

const item = (metric, unit, min, max, digits = 1) => () => {
  const percentile = faker.number.int({ min: 55, max: 97 })
  const value = digits === 0 ? faker.number.int({ min, max }) : faker.number.float({ min, max, fractionDigits: digits })
  return { metric, value, unit, percentile, status: status(percentile) }
}

const TYPES = [
  {
    assessment_type: 'Fitness Assessment', assessment_template: 'Pre-Season Fitness Battery', assessor: 'Strength & Conditioning Coach',
    items: [item('VO2 Max', 'ml/kg/min', 50, 62), item('Sprint Speed (40m)', 'seconds', 4.6, 5.2, 2), item('Vertical Jump', 'cm', 48, 66, 0)],
    note: 'Good overall fitness. Flexibility could improve.', recommendation: 'Add a hamstring and hip flexor stretching routine.',
  },
  {
    assessment_type: 'Medical Screening', assessment_template: 'Comprehensive Health Check', assessor: 'Team Doctor',
    items: [item('Resting Heart Rate', 'bpm', 46, 62, 0), item('Body Fat', '%', 8, 16)],
    note: 'All medical parameters within normal range.', recommendation: 'Repeat screening at the next scheduled check.',
  },
  {
    assessment_type: 'Skill Assessment', assessment_template: 'Technical Skills Evaluation', assessor: 'Assistant Coach',
    items: [item('Passing Accuracy', '%', 74, 92, 0), item('Ball Control', '/10', 6, 9.5)],
    note: 'Strong technical base. Room to improve in the final third.', recommendation: 'Crossing and finishing drills twice a week.',
  },
  {
    assessment_type: 'Psychological Assessment', assessment_template: 'Mental Performance Evaluation', assessor: 'Sports Psychologist',
    items: [item('Stress Management', '/10', 5.5, 9), item('Motivation Level', '/10', 6, 9.5)],
    note: 'Good mental resilience. Concentration could improve in games.', recommendation: 'Mindfulness and concentration exercises.',
  },
  {
    assessment_type: 'Nutrition Assessment', assessment_template: 'Dietary Analysis', assessor: 'Sports Nutritionist',
    items: [item('Caloric Intake', 'kcal/day', 2400, 3200, 0), item('Protein Intake', 'g/kg body weight', 1.4, 2.2)],
    note: 'Good nutritional habits overall. Hydration could improve.', recommendation: 'Increase fluid intake during training sessions.',
  },
]

const assessments = athletes.slice(0, 12).map((athlete, index) => {
  const type = TYPES[index % TYPES.length]
  const items = type.items.map((make) => make())
  const overall = Math.round(items.reduce((sum, i) => sum + i.percentile, 0) / items.length)
  const date = moment(athlete.last_assessment)
  const offset = date.diff(day(0), 'days')
  return {
    id: index + 1,
    athlete_id: athlete.id,
    athlete_name: athleteName(athlete),
    assessment_type: type.assessment_type,
    assessment_template: type.assessment_template,
    assessment_date: athlete.last_assessment,
    assessor: fullName(staffWithRole(type.assessor)),
    status: 'Completed',
    overall_score: overall,
    max_score: 100,
    assessment_items: items,
    notes: type.note,
    recommendations: type.recommendation,
    next_assessment: day(offset + 90).format('YYYY-MM-DD'),
    created_at: day(offset).format('YYYY-MM-DD[T]09:00:00[Z]'),
    updated_at: day(offset).format('YYYY-MM-DD[T]11:30:00[Z]'),
  }
})

export default assessments
