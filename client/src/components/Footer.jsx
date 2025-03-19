import { Link } from 'react-router-dom'
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">FootballMatch</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Book football matches at premier league stadiums and stay updated with live scores.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Match Schedule</Link>
              </li>
              <li>
                <Link to="/live-scores" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Live Scores</Link>
              </li>
              <li>
                <Link to="/book-match" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Book a Match</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-300">
            &copy; {currentYear} FootballMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer