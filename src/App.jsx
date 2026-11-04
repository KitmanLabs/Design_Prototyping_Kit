import { Routes, Route, Navigate } from 'react-router-dom'
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
import { legacyRedirects } from './data/layout'

// Paths follow iP's (kitman-frontend Router.js) where the kit has an equivalent page.
function App() {
  return (
    <LayoutWithMainNav>
      <Routes>
        <Route path="/" element={<SimplePage pageName="Home" />} />
        <Route path="/dashboard" element={<SimplePage pageName="Dashboard" />} />
        <Route path="/medical/rosters" element={<MedicalPage />} />
        <Route path="/analysis" element={<SimplePage pageName="Analysis" />} />
        <Route path="/athletes" element={<Athletes />} />
        <Route path="/workloads" element={<SimplePage pageName="Workloads" />} />
        <Route path="/questionnaires" element={<Screen01_FormsHome />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/forms/form_templates" element={<FormsPage />} />
        <Route path="/forms/form_answers_sets" element={<FormsPage />} />
        <Route path="/forms/form_answers_sets/forms/:formId" element={<Screen03_FormResponsesForTemplate />} />
        <Route path="/forms/form_answers_sets/:answerSetId" element={<Screen04_FormAnswerSet />} />
        <Route path="/medical-assessment" element={<MedicalAssessment />} />
        <Route path="/form-fill/:athleteId" element={<FormFillView />} />
        <Route path="/forms/:formId/build" element={<Screen02_FormBuilder />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/notifications" element={<SimplePage pageName="Notifications" />} />
        <Route path="/activity" element={<SimplePage pageName="Activity" />} />
        <Route path="/administration" element={<SimplePage pageName="Administration" />} />
        <Route path="/help" element={<SimplePage pageName="Help" />} />
        {/* Old kit paths, kept so existing links still work */}
        {Object.entries(legacyRedirects).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App
