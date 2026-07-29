import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ManageAthletes from './pages/ManageAthletes'
import ProfileBuilder from './pages/ProfileBuilder'
import AthletesList from './pages/AthletesList'
import AthleteProfile from './pages/AthleteProfile'

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/manage-athletes" replace />} />
        <Route path="/manage-athletes" element={<ManageAthletes />} />
        <Route path="/manage-athletes/profile-builder" element={<ProfileBuilder />} />
        <Route path="/manage-athletes/:id" element={<AthleteProfile />} />
        <Route path="/athletes" element={<AthletesList />} />
        <Route path="/athletes/:id" element={<AthleteProfile />} />
        <Route path="*" element={<Navigate to="/manage-athletes" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
