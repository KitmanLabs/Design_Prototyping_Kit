import { Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <LayoutWithMainNav>
      <Routes>
        <Route path="/" element={<SimplePage pageName="Home" />} />
        <Route path="/dashboard" element={<SimplePage pageName="Dashboard" />} />
        <Route path="/medical" element={<MedicalPage />} />
        <Route path="/analysis" element={<SimplePage pageName="Analysis" />} />
        <Route path="/athlete" element={<Athletes />} />
        <Route path="/workloads" element={<SimplePage pageName="Workload" />} />
        <Route path="/questionnaires" element={<Screen01_FormsHome />} />
        <Route path="/forms" element={<FormsPage />} />
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
        <Route path="/custom-group-permissions/v1" element={<CustomGroupPermissionsV1 />} />
        <Route path="/notifications" element={<SimplePage pageName="Notifications" />} />
        <Route path="/activity" element={<SimplePage pageName="Activity log" />} />
        <Route path="/settings" element={<SimplePage pageName="Admin" />} />
        <Route path="/help" element={<SimplePage pageName="Help" />} />
      </Routes>
    </LayoutWithMainNav>
  )
}

export default App