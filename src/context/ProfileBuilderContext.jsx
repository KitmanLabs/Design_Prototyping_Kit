import React, { createContext, useContext, useState } from 'react'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function makeField(overrides = {}) {
  return {
    id: uid(),
    label: 'Untitled field',
    type: 'text',
    tier: 3,
    mandatory: false,
    hidden: false,
    options: [],
    optionStyle: 'dropdown',
    defaultValue: '',
    description: '',
    ...overrides,
  }
}

const INITIAL_SECTIONS = [
  {
    id: 'essential-info',
    label: 'Essential info',
    locked: true,
    collapsed: false,
    fields: [
      makeField({ id: 'f-first-name', label: 'First name', type: 'text', tier: 1 }),
      makeField({ id: 'f-last-name', label: 'Last name', type: 'text', tier: 1 }),
      makeField({ id: 'f-position', label: 'Position', type: 'text', tier: 1 }),
      makeField({ id: 'f-squad', label: 'Squad', type: 'text', tier: 1 }),
      makeField({ id: 'f-email', label: 'Email address', type: 'text', tier: 1 }),
      makeField({ id: 'f-username', label: 'Username', type: 'text', tier: 1 }),
      makeField({ id: 'f-dob', label: 'Date of birth', type: 'date', tier: 1 }),
      makeField({ id: 'f-mobile', label: 'Mobile number', type: 'text', tier: 1 }),
      makeField({ id: 'f-language', label: 'Language', type: 'dropdown', tier: 1, options: ['English', 'Irish', 'French', 'Spanish', 'German', 'Italian'] }),
    ],
  },
  {
    id: 'additional-info',
    label: 'Additional info',
    locked: false,
    collapsed: false,
    fields: [
      makeField({ id: 'f-height', label: 'Height (cm)', type: 'number', tier: 2 }),
      makeField({ id: 'f-country', label: 'Country', type: 'dropdown', tier: 2, options: ['Ireland', 'England', 'France', 'Australia', 'New Zealand', 'South Africa'] }),
      makeField({ id: 'f-display-name', label: 'Display name', type: 'text', tier: 2 }),
      makeField({ id: 'f-short-name', label: 'Shortened name', type: 'text', tier: 2 }),
      makeField({ id: 'f-squad-num', label: 'Squad number', type: 'number', tier: 2 }),
      makeField({ id: 'f-assoc-id', label: 'Association player ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-ext-id', label: 'External ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-crm-id', label: 'CRM ID', type: 'text', tier: 2 }),
      makeField({ id: 'f-nationality', label: 'Nationality', type: 'dropdown', tier: 2, options: ['Irish', 'English', 'French', 'Australian', 'New Zealander', 'South African'] }),
    ],
  },
]

const ProfileBuilderContext = createContext(null)

export function ProfileBuilderProvider({ children }) {
  const [sections, setSections] = useState(INITIAL_SECTIONS)
  return (
    <ProfileBuilderContext.Provider value={{ sections, setSections, makeField, uid }}>
      {children}
    </ProfileBuilderContext.Provider>
  )
}

export function useProfileBuilder() {
  const ctx = useContext(ProfileBuilderContext)
  if (!ctx) throw new Error('useProfileBuilder must be used inside ProfileBuilderProvider')
  return ctx
}
