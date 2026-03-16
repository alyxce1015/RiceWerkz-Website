import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MemberCarsPage from './pages/MemberCarsPage'
import VehicleInfoPage from './pages/VehicleInfoPage'
import GalleryPage from './pages/GalleryPage'
import PartsPage from './pages/PartsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<MemberCarsPage />} />
        <Route path="/cars/:memberId" element={<VehicleInfoPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/parts" element={<PartsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
