import { motion } from 'framer-motion'
import { FaFutbol } from 'react-icons/fa'

const leagues = [
  {
    id: 'premier-league',
    name: 'Premier League',
    country: 'England',
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  {
    id: 'champions-league',
    name: 'Champions League',
    country: 'Europe',
    logo: '🏆'
  },
  {
    id: 'laliga',
    name: 'La Liga',
    country: 'Spain',
    logo: '🇪🇸'
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    logo: '🇩🇪'
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Italy',
    logo: '🇮🇹'
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'France',
    logo: '🇫🇷'
  }
]

function LeagueSelector({ selectedLeague, onLeagueChange }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaFutbol className="text-2xl text-blue-600" />
        <h2 className="text-xl font-bold">Select League</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {leagues.map((league) => (
          <motion.button
            key={league.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLeagueChange(league.id)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedLeague === league.id
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{league.logo}</span>
              <div className="text-left">
                <h3 className="font-semibold">{league.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{league.country}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default LeagueSelector 