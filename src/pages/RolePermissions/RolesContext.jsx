import React, { createContext, useContext, useState } from 'react'

// ─── Full permission definitions ───────────────────────────────────────────────

export const PERMISSIONS = {
  General: [
    'View Athletes', 'View Dashboard', 'Manage Dashboard', 'View Absence',
    'Manage Absence', 'View Availability Report', 'View Activity Log',
    'View Past Athletes', 'View Trial Athletes', 'View Athletes Area',
    'Manage Ancillary Date Range', 'Add Ancillary Data',
  ],
  Settings: [
    'Manage Athletes', 'Manage Staff Users', 'Settings Questionnaire',
    'Organisation Settings', 'Manage Athlete Emergency Contacts',
    'Labels Admin', 'View Labels', 'Groups Admin', 'View Groups',
    'Assign Labels', 'View Staff Users',
  ],
  Analysis: [
    'Analysis Athlete View', 'Analysis Squad View', 'Analysis Injury View',
    'Graph Viewer', 'Graph Builder', 'View Analytical Dashboard',
    'Manage Analytical Dashboard', 'Report on Labels and Groups',
    'Enable Historic Athletes on Reporting', 'Power BI Reports',
    'Access Labels and Groups in Reporting', 'Enable Historic Athletes',
  ],
  'Athlete Screening': [
    'Questionnaire Create', 'Questionnaires Admin',
    'Questionnaire Comments', 'Delete Form Submission',
  ],
  Medical: [
    'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
    'Medical Graphing', 'Export Medical Data', 'View Medical History',
    'Diagnostic Admin', 'Medical Module', 'Create Modifications',
    'Edit Modifications', 'View Medical Notes', 'Create Medical Notes',
    'Edit Medical Notes', 'Archive Medical Notes', 'Create Medical Forms',
    'View Medical Forms', 'Edit Medical Forms', 'View Allergy',
    'Create Medical Documents', 'View OSHA', 'Manage OSHA',
    'Dispense stock', 'View stock', 'Add stock', 'Remove Stock',
    'Archive Diagnostic', 'Delete Attachment', 'Archive Issue',
    'Archive Medical Documents', 'Log Medication', 'Archive Medication',
    'Medical Documents Edit', 'Edit Medication', 'Edit Medical Alert',
    'Edit Allergy', 'View Medications', 'Medications Admin',
  ],
  Workloads: [
    'Workload View', 'Games Admin', 'Training Sessions Admin',
    'Manage workloads', 'Create Games', 'Edit Games',
  ],
  Kiosk: ['Forms'],
  Messaging: [
    'View Messaging', 'Create Direct Message', 'Create Private Channel',
    'Create Public Channel', 'Messaging Admin',
  ],
  Efile: [
    'Send Efile', 'View Efile', 'View Efile Archive', 'Manage Efile Contacts',
  ],
  Notes: ['Medical Notes', 'Create Private Notes', 'Private Notes Admin'],
  'Injury Surveillance': ['Injury Surveillance Admin'],
  'Logic Builder': ['Logic Builder Admin - Medical'],
  eForms: [
    'Submit eForms', 'View eForms', 'Edit eForms', 'Delete eForms',
    'Manage eForms Templates', 'View eForms tryout', 'Export eForms',
  ],
  'My iP': ['My iP View', 'My iP Create', 'My iP Demo View'],
  Bodyweight: ['Bodyweight App', 'View Bodyweight'],
}

const ALL_PERMISSIONS = Object.values(PERMISSIONS).flat()

// ─── System (built-in) roles + their permission presets ────────────────────────

export const SYSTEM_ROLES = {
  'Account Admin': ALL_PERMISSIONS,
  Staff: [
    'View Athletes', 'View Dashboard', 'View Absence', 'View Availability',
    'Questionnaire Create', 'Questionnaire Comments', 'View Issues',
  ],
  Doctor: [
    'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
    'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
    'Medical Graphing', 'View Medical History', 'Diagnostic Admin', 'Medical Module',
    'View Medical Notes', 'Create Medical Notes', 'View Medical Forms', 'View Allergy',
    'View Medications',
  ],
  Psychologist: [
    'View Athletes', 'View Dashboard', 'View Absence', 'View Issues',
    'View Availability', 'View Medical History', 'Questionnaire Create',
    'Questionnaire Comments', 'View Medical Notes',
  ],
  'Athletic Trainer / Therapist': [
    'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
    'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
    'Medical Graphing', 'View Medical History', 'View Medical Notes',
    'Create Medical Notes', 'Create Modifications', 'Edit Modifications',
  ],
  Coach: [
    'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
    'View Issues', 'View Availability', 'Workload View', 'View Messaging',
    'Questionnaire Create', 'Questionnaire Comments',
  ],
}

export const SYSTEM_ROLE_NAMES = Object.keys(SYSTEM_ROLES)

// ─── Initial custom roles (Screen 1 DataGrid rows + their permissions) ──────────

const INITIAL_ROLES = [
  {
    id: 1, name: 'Doctor – Export Access', basedOn: 'Doctor', members: 3,
    status: 'Active', lastModified: '2026-05-14',
    permissions: [
      ...SYSTEM_ROLES['Doctor'], 'Export Medical Data', 'Create Medical Forms',
    ],
  },
  {
    id: 2, name: 'Head Coach', basedOn: 'Coach', members: 2,
    status: 'Active', lastModified: '2026-04-22',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
      'View Issues', 'View Availability', 'Workload View', 'View Messaging',
    ],
  },
  {
    id: 3, name: 'Assistant Coach', basedOn: 'Coach', members: 4,
    status: 'Active', lastModified: '2026-04-22',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
      'View Issues', 'View Availability',
    ],
  },
  {
    id: 4, name: 'Athletic Trainer', basedOn: 'Athletic Trainer / Therapist', members: 6,
    status: 'Active', lastModified: '2026-03-10',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
      'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
      'Medical Graphing', 'View Medical History', 'View Medical Notes',
    ],
  },
  {
    id: 5, name: 'Psychologist', basedOn: 'Psychologist', members: 2,
    status: 'Active', lastModified: '2026-03-01',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Absence', 'View Issues',
      'View Availability', 'View Medical History', 'Questionnaire Create',
      'Questionnaire Comments', 'View Medical Notes',
    ],
  },
  {
    id: 6, name: 'Club Physiotherapist', basedOn: 'Athletic Trainer / Therapist', members: 3,
    status: 'Active', lastModified: '2026-02-18',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Absence', 'View Availability Report',
      'View Issues', 'Issues Admin', 'Manage Availability', 'View Availability',
      'Medical Graphing', 'View Medical History',
    ],
  },
  {
    id: 7, name: 'Legacy Doctor Role', basedOn: 'Doctor', members: 0,
    status: 'Archived', lastModified: '2025-11-03',
    permissions: [
      'View Athletes', 'View Dashboard', 'View Issues', 'Issues Admin',
      'Manage Availability', 'View Availability', 'Medical Graphing',
      'View Medical History', 'Diagnostic Admin', 'Medical Module',
      'View Medical Notes', 'View Medical Forms',
    ],
  },
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

// ─── Context ────────────────────────────────────────────────────────────────────

const RolesContext = createContext(null)

export function RolesProvider({ children }) {
  const [roles, setRoles] = useState(INITIAL_ROLES)

  const updateRolePermissions = (id, permissions) => {
    setRoles(prev => prev.map(r =>
      r.id === id ? { ...r, permissions: [...permissions], lastModified: today() } : r
    ))
  }

  const archiveRole = (id) => {
    setRoles(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'Archived', lastModified: today() } : r
    ))
  }

  const addRole = (role) => {
    setRoles(prev => [
      { id: Date.now(), members: 0, status: 'Active', lastModified: today(), ...role },
      ...prev,
    ])
  }

  // Resolve a role name (custom OR system) to its permission list
  const getRolePermissions = (name) => {
    const custom = roles.find(r => r.name === name)
    if (custom) return custom.permissions
    if (SYSTEM_ROLES[name]) return SYSTEM_ROLES[name]
    return []
  }

  const value = {
    roles,
    customRoles: roles.filter(r => r.status === 'Active'),
    systemRoles: SYSTEM_ROLES,
    systemRoleNames: SYSTEM_ROLE_NAMES,
    updateRolePermissions,
    archiveRole,
    addRole,
    getRolePermissions,
  }

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>
}

export function useRoles() {
  const ctx = useContext(RolesContext)
  if (!ctx) throw new Error('useRoles must be used within RolesProvider')
  return ctx
}
