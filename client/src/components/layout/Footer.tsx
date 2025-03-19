import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              FootballMatch
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Schedule and manage football matches with ease
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            >
              Home
            </Link>
            <Link
              to="/match-schedule"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            >
              Schedule
            </Link>
            <Link
              to="/live-scores"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            >
              Live Scores
            </Link>
            <Link
              to="/book-match"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
            >
              Book Match
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {currentYear} FootballMatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;