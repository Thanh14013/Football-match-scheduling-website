import { Route, Routes } from 'react-router-dom'
import { Suspense, lazy, useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import LoadingScreen from './components/LoadingScreen'
import { SupabaseProvider } from './contexts/SupabaseContext'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy loaded components
const Home = lazy(() => import('./pages/Home'))
const MatchSchedule = lazy(() => import('./pages/MatchSchedule'))
const LiveScores = lazy(() => import('./pages/LiveScores'))
const BookMatch = lazy(() => import('./pages/BookMatch'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Profile = lazy(() => import('./pages/Profile'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Kiểm tra cài đặt dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDark)
  }, [])

  useEffect(() => {
    // Áp dụng dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Lưu cài đặt vào localStorage
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <SupabaseProvider>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route index element={<Home />} />
            <Route path="schedule" element={<MatchSchedule />} />
            <Route path="live-scores" element={<LiveScores />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Các trang cần xác thực */}
            <Route element={<ProtectedRoute />}>
              <Route path="book-match" element={<BookMatch />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            
            {/* Trang 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </SupabaseProvider>
  )
}

export default App