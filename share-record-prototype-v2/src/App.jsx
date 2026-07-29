import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShareProvider } from './context/ShareContext'
import ShareSetupDrawer from './components/ShareSetupDrawer'
import Snackbar from './components/Snackbar'
import ManageAthletes from './pages/ManageAthletes'
import PrepareSharedRecord from './pages/PrepareSharedRecord'
import LoginScreen from './pages/LoginScreen'
import RecipientView from './pages/RecipientView'

export default function App() {
  return (
    <BrowserRouter>
      <ShareProvider>
        <Routes>
          <Route path="/" element={<ManageAthletes />} />
          <Route path="/prepare" element={<PrepareSharedRecord />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/shared" element={<RecipientView />} />
        </Routes>
        {/* Drawer + snackbar live at app level so they overlay any page */}
        <ShareSetupDrawer />
        <Snackbar />
      </ShareProvider>
    </BrowserRouter>
  )
}
