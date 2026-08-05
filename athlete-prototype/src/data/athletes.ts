export interface ManageAthleteRow {
  id: string
  firstName: string
  lastName: string
  username: string
  rosterPosition: string
  squads: string[]
  creationDate: string
  labels: string[]
}

export const manageAthletes: ManageAthleteRow[] = [
  { id: '1', firstName: 'Herbert', lastName: 'Austin', username: 'haustin', rosterPosition: 'Fly-half', squads: ['International', 'Senior'], creationDate: '12 Jan 2024', labels: ['Captain'] },
  { id: '2', firstName: 'Connor', lastName: "O'Brien", username: 'cobrien', rosterPosition: 'Scrum-half', squads: ['Senior'], creationDate: '03 Feb 2024', labels: [] },
  { id: '3', firstName: 'Sipho', lastName: 'Ndlovu', username: 'sndlovu', rosterPosition: 'Wing', squads: ['International'], creationDate: '21 Feb 2024', labels: ['Speedster'] },
  { id: '4', firstName: 'James', lastName: 'Patterson', username: 'jpatterson', rosterPosition: 'Lock', squads: ['Academy'], creationDate: '14 Mar 2024', labels: ['Rookie'] },
  { id: '5', firstName: 'Louis', lastName: 'Dupont', username: 'ldupont', rosterPosition: 'Prop', squads: ['Senior', 'Development'], creationDate: '29 Mar 2024', labels: [] },
  { id: '6', firstName: 'Tane', lastName: 'Walker', username: 'twalker', rosterPosition: 'Number 8', squads: ['International'], creationDate: '08 Apr 2024', labels: ['Vice-captain'] },
  { id: '7', firstName: 'Marcus', lastName: 'Reid', username: 'mreid', rosterPosition: 'Centre', squads: ['Senior'], creationDate: '17 Apr 2024', labels: [] },
  { id: '8', firstName: 'Daniel', lastName: 'Kruger', username: 'dkruger', rosterPosition: 'Full-back', squads: ['Academy', 'Development'], creationDate: '02 May 2024', labels: ['Rookie'] },
]

export type Availability = 'Available' | 'Unavailable' | 'Available (Injured/Ill)'

export interface AthleteListRow {
  id: string
  firstName: string
  lastName: string
  position: string
  availability: Availability
}

export const athletesList: AthleteListRow[] = [
  { id: '1', firstName: 'Herbert', lastName: 'Austin', position: 'Fly-half', availability: 'Available' },
  { id: '2', firstName: 'Connor', lastName: "O'Brien", position: 'Scrum-half', availability: 'Available' },
  { id: '3', firstName: 'Sipho', lastName: 'Ndlovu', position: 'Wing', availability: 'Unavailable' },
  { id: '4', firstName: 'James', lastName: 'Patterson', position: 'Lock', availability: 'Available (Injured/Ill)' },
  { id: '5', firstName: 'Louis', lastName: 'Dupont', position: 'Prop', availability: 'Available' },
  { id: '6', firstName: 'Tane', lastName: 'Walker', position: 'Number 8', availability: 'Unavailable' },
  { id: '7', firstName: 'Marcus', lastName: 'Reid', position: 'Centre', availability: 'Available' },
  { id: '8', firstName: 'Daniel', lastName: 'Kruger', position: 'Full-back', availability: 'Available (Injured/Ill)' },
  { id: '9', firstName: 'Owen', lastName: 'Hughes', position: 'Flanker', availability: 'Available' },
  { id: '10', firstName: 'Pieter', lastName: 'van der Merwe', position: 'Hooker', availability: 'Unavailable' },
]

// Per-athlete profile field values, keyed by field id from profileConfig.
export const athleteProfileValues: Record<string, Record<string, string>> = {
  '1': {
    'f-firstname': 'Herbert', 'f-lastname': 'Austin', 'f-position': 'Fly-half', 'f-squad': 'International',
    'f-email': 'h.austin@rugbyclub.com', 'f-username': 'haustin', 'f-dob': '1996-04-12',
    'f-mobile': '+353 87 123 4567', 'f-language': 'English',
    'f-height': '183', 'f-country': 'Ireland', 'f-displayname': 'Herbie', 'f-shortname': 'H. Austin',
    'f-squadnumber': '10', 'f-associd': 'AP-10293', 'f-externalid': 'EXT-552', 'f-crmid': 'CRM-8841', 'f-nationality': 'Irish',
  },
  '2': {
    'f-firstname': 'Connor', 'f-lastname': "O'Brien", 'f-position': 'Scrum-half', 'f-squad': 'Senior',
    'f-email': 'c.obrien@rugbyclub.com', 'f-username': 'cobrien', 'f-dob': '1998-09-03',
    'f-mobile': '+353 86 222 1111', 'f-language': 'English',
    'f-height': '176', 'f-country': 'Ireland', 'f-displayname': 'Connor', 'f-shortname': "C. O'Brien",
    'f-squadnumber': '9', 'f-associd': 'AP-10455', 'f-externalid': 'EXT-553', 'f-crmid': 'CRM-8842', 'f-nationality': 'Irish',
  },
}

export const defaultProfileValues: Record<string, string> = {
  'f-firstname': 'Herbert', 'f-lastname': 'Austin', 'f-position': 'Fly-half', 'f-squad': 'International',
  'f-email': 'h.austin@rugbyclub.com', 'f-username': 'haustin', 'f-dob': '1996-04-12',
  'f-mobile': '+353 87 123 4567', 'f-language': 'English',
  'f-height': '183', 'f-country': 'Ireland', 'f-displayname': 'Herbie', 'f-shortname': 'H. Austin',
  'f-squadnumber': '10', 'f-associd': 'AP-10293', 'f-externalid': 'EXT-552', 'f-crmid': 'CRM-8841', 'f-nationality': 'Irish',
}
