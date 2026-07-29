import React, { createContext, useContext, useState } from 'react'

export type FieldType = 'text' | 'number' | 'date' | 'dropdown'
export type FieldTier = 1 | 2 | 3

export interface FieldOption {
  id: string
  label: string
}

export interface Field {
  id: string
  label: string
  type: FieldType
  tier: FieldTier
  mandatory: boolean
  hidden: boolean
  options?: FieldOption[]
}

export interface Section {
  id: string
  label: string
  locked: boolean
  fields: Field[]
}

let idCounter = 1000
export const nextId = (prefix: string) => `${prefix}-${++idCounter}`

const positionOptions: FieldOption[] = [
  { id: 'pos-1', label: 'Prop' },
  { id: 'pos-2', label: 'Hooker' },
  { id: 'pos-3', label: 'Lock' },
  { id: 'pos-4', label: 'Flanker' },
  { id: 'pos-5', label: 'Number 8' },
  { id: 'pos-6', label: 'Scrum-half' },
  { id: 'pos-7', label: 'Fly-half' },
  { id: 'pos-8', label: 'Centre' },
  { id: 'pos-9', label: 'Wing' },
  { id: 'pos-10', label: 'Full-back' },
]

const squadOptions: FieldOption[] = [
  { id: 'sq-1', label: 'International' },
  { id: 'sq-2', label: 'Senior' },
  { id: 'sq-3', label: 'Academy' },
  { id: 'sq-4', label: 'Development' },
]

const languageOptions: FieldOption[] = [
  { id: 'lang-1', label: 'English' },
  { id: 'lang-2', label: 'French' },
  { id: 'lang-3', label: 'Spanish' },
  { id: 'lang-4', label: 'Afrikaans' },
]

const countryOptions: FieldOption[] = [
  { id: 'co-1', label: 'Ireland' },
  { id: 'co-2', label: 'England' },
  { id: 'co-3', label: 'France' },
  { id: 'co-4', label: 'South Africa' },
  { id: 'co-5', label: 'New Zealand' },
  { id: 'co-6', label: 'Australia' },
]

const initialSections: Section[] = [
  {
    id: 'section-essential',
    label: 'Essential Info',
    locked: true,
    fields: [
      { id: 'f-firstname', label: 'First name', type: 'text', tier: 1, mandatory: true, hidden: false },
      { id: 'f-lastname', label: 'Last name', type: 'text', tier: 1, mandatory: true, hidden: false },
      { id: 'f-position', label: 'Position', type: 'dropdown', tier: 1, mandatory: true, hidden: false, options: positionOptions },
      { id: 'f-squad', label: 'Squad', type: 'dropdown', tier: 1, mandatory: true, hidden: false, options: squadOptions },
      { id: 'f-email', label: 'Email address', type: 'text', tier: 1, mandatory: true, hidden: false },
      { id: 'f-username', label: 'Username', type: 'text', tier: 1, mandatory: true, hidden: false },
      { id: 'f-dob', label: 'Date of birth', type: 'date', tier: 1, mandatory: true, hidden: false },
      { id: 'f-mobile', label: 'Mobile number', type: 'text', tier: 1, mandatory: true, hidden: false },
      { id: 'f-language', label: 'Language', type: 'dropdown', tier: 1, mandatory: true, hidden: false, options: languageOptions },
    ],
  },
  {
    id: 'section-additional',
    label: 'Additional Info',
    locked: false,
    fields: [
      { id: 'f-height', label: 'Height cm', type: 'number', tier: 2, mandatory: false, hidden: false },
      { id: 'f-country', label: 'Country', type: 'dropdown', tier: 2, mandatory: false, hidden: false, options: countryOptions },
      { id: 'f-displayname', label: 'Display Name', type: 'text', tier: 2, mandatory: false, hidden: false },
      { id: 'f-shortname', label: 'Shortened Name', type: 'text', tier: 2, mandatory: false, hidden: false },
      { id: 'f-squadnumber', label: 'Squad Number', type: 'number', tier: 2, mandatory: false, hidden: false },
      { id: 'f-associd', label: 'Association Player ID', type: 'text', tier: 2, mandatory: false, hidden: false },
      { id: 'f-externalid', label: 'External ID', type: 'text', tier: 2, mandatory: false, hidden: false },
      { id: 'f-crmid', label: 'CRM ID', type: 'text', tier: 2, mandatory: false, hidden: false },
      { id: 'f-nationality', label: 'Nationality', type: 'text', tier: 2, mandatory: false, hidden: false },
    ],
  },
]

interface ProfileConfigContextValue {
  sections: Section[]
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
}

const ProfileConfigContext = createContext<ProfileConfigContextValue | null>(null)

export const ProfileConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sections, setSections] = useState<Section[]>(initialSections)
  return (
    <ProfileConfigContext.Provider value={{ sections, setSections }}>
      {children}
    </ProfileConfigContext.Provider>
  )
}

export const useProfileConfig = () => {
  const ctx = useContext(ProfileConfigContext)
  if (!ctx) throw new Error('useProfileConfig must be used within ProfileConfigProvider')
  return ctx
}
