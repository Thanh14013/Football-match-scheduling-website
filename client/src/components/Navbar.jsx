import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import { FaSun, FaMoon, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'

function Navbar({ darkMode, toggleDarkMode }) {
  const { session, signOut } = useSupabase()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-8" src="/soccer-ball.svg" alt="Football" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">FootballMatch</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Home</Link>
              <Link to="/schedule" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Schedule</Link>
              <Link to="/live-scores" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Live Scores</Link>
              {session && (
                <Link to="/book-match" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Book Match</Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
            {session ? (
              <div className="relative">
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <FaUserCircle className="h-5 w-5 mr-1" />
                  Profile
                </Link>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
            {session && (
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
              >
                Sign Out
              </button>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleMenu}
              className="ml-2 p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Home</Link>
            <Link to="/schedule" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Schedule</Link>
            <Link to="/live-scores" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Live Scores</Link>
            {session && (
              <Link to="/book-match" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Book Match</Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {session ? (
              <div className="px-2 space-y-1">
                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Profile</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar