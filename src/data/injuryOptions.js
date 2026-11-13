// Steps and option lists for the Log injury Guided flow

export const logInjurySteps = [
  { id: 'athlete', label: 'Athlete and date' },
  { id: 'injury', label: 'Injury' },
  { id: 'mechanism', label: 'Mechanism' },
  { id: 'availability', label: 'Availability' },
  { id: 'review', label: 'Review' },
]

export const bodyAreaOptions = ['Head', 'Neck', 'Shoulder', 'Elbow', 'Wrist and hand', 'Chest', 'Back', 'Hip and groin', 'Thigh', 'Hamstring', 'Knee', 'Lower leg', 'Ankle', 'Foot']

export const sideOptions = ['Left', 'Right', 'Both', 'Not applicable']

export const injuryTypeOptions = ['Muscle strain', 'Ligament sprain', 'Contusion', 'Fracture', 'Concussion', 'Tendinopathy', 'Other']

export const activityOptions = ['Training', 'Match', 'Gym session', 'Outside of sport']

export const contactOptions = ['Non-contact', 'Contact with another athlete', 'Contact with an object']

export const availabilityOptions = [
  { value: 'Unavailable', label: 'Unavailable', description: 'Cannot train or play' },
  { value: 'Modified', label: 'Modified', description: 'Can train with restrictions' },
  { value: 'Available', label: 'Available', description: 'Can train and play fully' },
]

export const emptyInjury = {
  athleteId: '',
  occurrenceDate: null,
  bodyArea: '',
  side: '',
  injuryType: '',
  activity: '',
  contact: '',
  notes: '',
  availability: '',
  expectedReturn: null,
}

// The fields each step requires before Next is enabled
export const requiredFieldsByStep = {
  athlete: ['athleteId', 'occurrenceDate'],
  injury: ['bodyArea', 'side', 'injuryType'],
  mechanism: ['activity', 'contact'],
  availability: ['availability'],
  review: [],
}
