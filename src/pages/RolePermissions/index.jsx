import React, { useState } from 'react'
import { RolesProvider } from './RolesContext'
import AppShell from './AppShell'
import OrganisationSettings from './OrganisationSettings'
import ManageStaffUsers from './ManageStaffUsers'
import StaffProfile from './StaffProfile'

// Internal screens: 'org-settings' | 'staff-list' | 'staff-profile'
function ConnectedApp() {
  const [screen, setScreen] = useState('org-settings')
  const [selectedStaff, setSelectedStaff] = useState(null)

  const activeAdminItem = screen === 'org-settings' ? 'Organisation Settings' : 'Manage Staff Users'

  const handleAdminNavigate = (item) => {
    if (item === 'Manage Staff Users') { setScreen('staff-list'); setSelectedStaff(null) }
    else if (item === 'Organisation Settings') { setScreen('org-settings'); setSelectedStaff(null) }
  }

  return (
    <AppShell activeAdminItem={activeAdminItem} onAdminNavigate={handleAdminNavigate}>
      {screen === 'org-settings' && <OrganisationSettings />}
      {screen === 'staff-list' && (
        <ManageStaffUsers onOpenStaff={(s) => { setSelectedStaff(s); setScreen('staff-profile') }} />
      )}
      {screen === 'staff-profile' && selectedStaff && (
        <StaffProfile staff={selectedStaff} onBack={() => { setScreen('staff-list'); setSelectedStaff(null) }} />
      )}
    </AppShell>
  )
}

export default function RolePermissionsV1() {
  return (
    <RolesProvider>
      <ConnectedApp />
    </RolesProvider>
  )
}
