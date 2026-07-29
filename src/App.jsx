import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProfileBuilderProvider } from './context/ProfileBuilderContext'
import { Fab, Snackbar } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import LayoutWithMainNav from './components/LayoutWithMainNav'
import SimplePage from './pages/SimplePage'
import Athletes from './pages/Athletes'
import CalendarPage from './pages/Calendar'
import MedicalPage from './pages/Medical'
import Screen01_FormsHome from './pages/forms/Screen01_FormsHome'
import FormsPage from './pages/forms/FormsPage'
import Screen02_FormBuilder from './pages/forms/Screen02_FormBuilder'
import Screen03_FormResponsesForTemplate from './pages/forms/Screen03_FormResponsesForTemplate'
import Screen04_FormAnswerSet from './pages/forms/Screen04_FormAnswerSet'
import Messaging from './pages/Messaging'
import MedicalAssessment from './pages/forms/MedicalAssessment'
import FormFillView from './pages/forms/FormFillView'
import BodyMapPage from './pages/BodyMap/BodyMapPage'
import BodyMapPageV2 from './pages/BodyMap/BodyMapPageV2'
import BodyMapPageV3 from './pages/BodyMap/BodyMapPageV3'
import BodyMapPageV4 from './pages/BodyMap/BodyMapPageV4'
import BodyMapPageV5 from './pages/BodyMap/BodyMapPageV5'
import BodyMapResponseView from './pages/BodyMap/BodyMapResponseView'
import BodyMapResponseViewV2 from './pages/BodyMap/BodyMapResponseViewV2'
import BodyMapResponseViewV3 from './pages/BodyMap/BodyMapResponseViewV3'
import BodyMapPageV6 from './pages/BodyMap/BodyMapPageV6'
import BodyMapSymptomModes from './pages/BodyMap/BodyMapSymptomModes'
import BodyMapClassic from './pages/BodyMap/BodyMapClassic'
import BodyMapClassicModes from './pages/BodyMap/BodyMapClassicModes'
import BodyMapPageV7 from './pages/BodyMap/BodyMapPageV7'
import BodyMapClassicModesBuilder from './pages/BodyMap/BodyMapClassicModesBuilder'
import BodyMapClassicModesBuilderV2 from './pages/BodyMap/BodyMapClassicModesBuilderV2'
import BodyMapMobileClassicModes from './pages/BodyMap/BodyMapMobileClassicModes'
import BodyMapMobileClassicModesV2 from './pages/BodyMap/BodyMapMobileClassicModesV2'
import BodyMapClassicModesBuilderV3 from './pages/BodyMap/BodyMapClassicModesBuilderV3'
import BodyMapClassicModesBuilderV4 from './pages/BodyMap/BodyMapClassicModesBuilderV4'
import BodyMapMobileResponse from './pages/BodyMap/BodyMapMobileResponse'
import BodyMapMobileResponseV3 from './pages/BodyMap/BodyMapMobileResponseV3'
import BodyMapMobileResponseV4 from './pages/BodyMap/BodyMapMobileResponseV4'
import BodyMapMobileResponseV5 from './pages/BodyMap/BodyMapMobileResponseV5'
import BodyMapMobileResponseV6 from './pages/BodyMap/BodyMapMobileResponseV6'
import BodyMapMobileResponseV7 from './pages/BodyMap/BodyMapMobileResponseV7'
import BodyMapMobileResponseV8 from './pages/BodyMap/BodyMapMobileResponseV8'
import BodyMapMobileResponseV9 from './pages/BodyMap/BodyMapMobileResponseV9'
import BodyMapMobileResponseV10 from './pages/BodyMap/BodyMapMobileResponseV10'
import CustomGroupPermissionsV1 from './pages/CustomGroupPermissions'
import RolePermissionsV1 from './pages/RolePermissions'
import AiResponseSummaryV1 from './pages/AiResponseSummary'
import AiFormSummaryAsync from './pages/AiFormSummaryAsync'
import AthleteProfileBuilder from './pages/AthleteProfileBuilder'
import ManageAthletes from './pages/ManageAthletes'
import ProfileBuilder from './pages/ManageAthletes/ProfileBuilder'
import AthleteProfile from './pages/ManageAthletes/AthleteProfile'
import ExportAthleteProfiles from './pages/ExportAthleteProfiles'
import FormsPageV3 from './pages/forms/FormsPageV3'
import AddMedicationsBulk from './pages/Medications/AddMedicationsBulk'

function App() {
  const [intercomOpen, setIntercomOpen] = useState(false)
  return (
    <ProfileBuilderProvider><>
      <Routes>
        {/* Self-contained connected prototypes — render their own full-screen chrome */}
        <Route path="/role-permissions/v1" element={<RolePermissionsV1 />} />
        <Route path="/ai-response-summary/v1" element={<AiResponseSummaryV1 />} />
        {/* Prototype 2 (Responses tab + bulk action bar) — clean alias URL */}
        <Route path="/ai-summary-v2" element={<AiResponseSummaryV1 />} />
        <Route path="/ai-form-summary/async" element={<AiFormSummaryAsync />} />
        <Route path="/manage-athletes/profile-builder" element={<ProfileBuilder />} />
        <Route path="/manage-athletes/export" element={<ExportAthleteProfiles />} />

        {/* Everything else uses the global layout */}
        <Route path="*" element={<MainApp />} />
      </Routes>

      {/* Global Intercom messenger bubble — renders on every route */}
      <Fab
        aria-label="Open messenger"
        onClick={() => setIntercomOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'var(--color-primary-dark)',
          zIndex: 9999,
        }}
      >
        <ChatIcon style={{ color: 'var(--color-white)' }} />
      </Fab>
      <Snackbar
        open={intercomOpen}
        autoHideDuration={3000}
        onClose={() => setIntercomOpen(false)}
        message="Intercom would open here"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 10000 }}
      />
    </></ProfileBuilderProvider>
  )
}

function MainApp() {
  return (
    <LayoutWithMainNav>
      <Routes>
        <Route path="/" element={<SimplePage pageName="Home" />} />
        <Route path="/dashboard" element={<SimplePage pageName="Dashboard" />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/add-medications-bulk" element={<AddMedicationsBulk />} />
        <Route path="/analysis" element={<SimplePage pageName="Analysis" />} />
        <Route path="/athlete" element={<Athletes />} />
        <Route path="/workloads" element={<SimplePage pageName="Workload" />} />
        <Route path="/questionnaires" element={<Screen01_FormsHome />} />
        <Route path="/forms" element={<FormsPage />} />
        {/* Prototype 1 (AI summary button in header + multi-step drawer) — clean alias URL */}
        <Route path="/ai-summary-v1" element={<FormsPage />} />
        {/* Prototype 3 (v1 base + feedback section in the generated summary panel) */}
        <Route path="/ai-summary-v3" element={<FormsPageV3 />} />
        <Route path="/forms/form_templates" element={<FormsPage />} />
        <Route path="/forms/form_answers_sets" element={<FormsPage />} />
        <Route path="/forms/form_answers_sets/forms/:formId" element={<Screen03_FormResponsesForTemplate />} />
        <Route path="/forms/form_answers_sets/:answerSetId" element={<Screen04_FormAnswerSet />} />
        <Route path="/medical-assessment" element={<MedicalAssessment />} />
        <Route path="/form-fill/:athleteId" element={<FormFillView />} />
        <Route path="/forms/:formId/build" element={<Screen02_FormBuilder />} />
        <Route path="/planning" element={<CalendarPage />} />
        <Route path="/messages" element={<Messaging />} />
        <Route path="/body-map" element={<BodyMapPage />} />
        <Route path="/body-map/v2" element={<BodyMapPageV2 />} />
        <Route path="/body-map/v3" element={<BodyMapPageV3 />} />
        <Route path="/body-map/v4" element={<BodyMapPageV4 />} />
        <Route path="/body-map/v5" element={<BodyMapPageV5 />} />
        <Route path="/body-map/v6" element={<BodyMapPageV6 />} />
        <Route path="/body-map/modes" element={<BodyMapSymptomModes />} />
        <Route path="/body-map/classic" element={<BodyMapClassic />} />
        <Route path="/body-map/classic-modes" element={<BodyMapClassicModes />} />
        <Route path="/body-map/classic-modes/builder" element={<BodyMapClassicModesBuilder />} />
        <Route path="/body-map/classic-modes/builder/v2" element={<BodyMapClassicModesBuilderV2 />} />
        <Route path="/body-map/classic-modes/builder/v3" element={<BodyMapClassicModesBuilderV3 />} />
        <Route path="/body-map/classic-modes/builder/v4" element={<BodyMapClassicModesBuilderV4 />} />
        <Route path="/body-map/v7" element={<BodyMapPageV7 />} />
        <Route path="/body-map/response" element={<BodyMapResponseView />} />
        <Route path="/body-map/response/v2" element={<BodyMapResponseViewV2 />} />
        <Route path="/body-map/response/v3" element={<BodyMapResponseViewV3 />} />
        <Route path="/body-map-mobile" element={<BodyMapMobileResponse />} />
        <Route path="/body-map-mobile/v3" element={<BodyMapMobileResponseV3 />} />
        <Route path="/body-map-mobile/v4" element={<BodyMapMobileResponseV4 />} />
        <Route path="/body-map-mobile/v5" element={<BodyMapMobileResponseV5 />} />
        <Route path="/body-map-mobile/v6" element={<BodyMapMobileResponseV6 />} />
        <Route path="/body-map-mobile/v7" element={<BodyMapMobileResponseV7 />} />
        <Route path="/body-map-mobile/v8" element={<BodyMapMobileResponseV8 />} />
        <Route path="/body-map-mobile/v9" element={<BodyMapMobileResponseV9 />} />
        <Route path="/body-map-mobile/v10" element={<BodyMapMobileResponseV10 />} />
        <Route path="/body-map-mobile/classic-modes" element={<BodyMapMobileClassicModes />} />
        <Route path="/body-map-mobile/classic-modes/v2" element={<BodyMapMobileClassicModesV2 />} />
        <Route path="/custom-group-permissions/v1" element={<CustomGroupPermissionsV1 />} />
        <Route path="/athlete-profile-builder" element={<AthleteProfileBuilder />} />
        <Route path="/manage-athletes" element={<ManageAthletes />} />
        <Route path="/manage-athletes/:id" element={<AthleteProfile />} />
        <Route path="/notifications" element={<SimplePage pageName="Notifications" />} />
        <Route path="/activity" element={<SimplePage pageName="Activity log" />} />
        <Route path="/settings" element={<SimplePage pageName="Admin" />} />
        <Route path="/help" element={<SimplePage pageName="Help" />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App