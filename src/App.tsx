import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { GeneratePage } from './pages/GeneratePage'
import { GifsPage } from './pages/GifsPage'
import { FavoritesPage } from './pages/FavoritesPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/gifs" element={<GifsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App