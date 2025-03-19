import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                FootballMatch
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/match-schedule"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Schedule
              </Link>
              <Link
                to="/live-scores"
                className="border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Live Scores
              </Link>
              {user && (
                <Link
                  to="/book-match"
                  className="border-transparent text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Book Match
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            {user ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="ml-3 relative flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/match-schedule"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={toggleMenu}
            >
              Schedule
            </Link>
            <Link
              to="/live-scores"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={toggleMenu}
            >
              Live Scores
            </Link>
            {user && (
              <Link
                to="/book-match"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={toggleMenu}
              >
                Book Match
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              {user ? (
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {user.email}
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ml-3 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;