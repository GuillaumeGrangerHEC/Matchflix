import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { PlatformsPage } from '@/pages/PlatformsPage'
import { SwipePage } from '@/pages/SwipePage'
import { MatchPage } from '@/pages/MatchPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/platforms" element={<PlatformsPage />} />
      <Route path="/swipe" element={<SwipePage />} />
      <Route path="/match" element={<MatchPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
