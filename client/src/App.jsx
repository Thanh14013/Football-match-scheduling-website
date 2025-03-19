import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSupabase } from './contexts/SupabaseContext'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookMatch from './pages/BookMatch'
import MatchSchedule from './pages/MatchSchedule'
import LiveScores from './pages/LiveScores'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { session, isLoading } = useSupabase()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check user preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDark)
  }, [])

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
        <Route index element={<Home />} />
        <Route path="login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="register" element={!session ? <Register /> : <Navigate to="/" />} />
        <Route path="book-match" element={
          <ProtectedRoute>
            <BookMatch />
          </ProtectedRoute>
        } />
        <Route path="schedule" element={<MatchSchedule />} />
        <Route path="live-scores" element={<LiveScores />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App