import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import HomePage from './pages/HomePage'
import MemberCarsPage from './pages/MemberCarsPage'
import VehicleInfoPage from './pages/VehicleInfoPage'
import GalleryPage from './pages/GalleryPage'
import PartsPage from './pages/PartsPage'
import UploadPage from './pages/UploadPage'
import ManagePage from './pages/ManagePage'
import HubPage from './pages/HubPage'
import LaunchPage from './pages/LaunchPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import E85Page from './pages/E85Page'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<MemberCarsPage />} />
        <Route path="/cars/:memberId" element={<VehicleInfoPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/parts" element={<PartsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/manage/:memberId" element={<ManagePage />} />
        <Route path="/hub/:memberId" element={<HubPage />} />
        <Route path="/launch" element={<LaunchPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/e85" element={<E85Page />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
