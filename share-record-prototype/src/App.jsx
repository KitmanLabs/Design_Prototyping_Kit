import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ShareProvider } from './context/ShareContext'
import ShareSetupDrawer from './components/ShareSetupDrawer'
import ManageAthletes from './pages/ManageAthletes'
import PrepareSharedRecord from './pages/PrepareSharedRecord'

export default function App() {
  return (
    <BrowserRouter>
      <ShareProvider>
        <Routes>
          <Route path="/" element={<ManageAthletes />} />
          <Route path="/prepare" element={<PrepareSharedRecord />} />
        </Routes>
        {/* Drawer lives at app level so it overlays any page */}
        <ShareSetupDrawer />
      </ShareProvider>
    </BrowserRouter>
  )
}
