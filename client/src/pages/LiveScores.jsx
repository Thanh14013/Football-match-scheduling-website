import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaFutbol, FaSquare } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'
import LeagueSelector from '../components/LeagueSelector'

function LiveScores() {
  const [liveMatches, setLiveMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLeague, setSelectedLeague] = useState('premier-league')

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        setIsLoading(true)
        // Simulate API call with league filter
        const mockLiveMatches = {
          'premier-league': [
            {
              id: 1,
              homeTeam: 'Manchester United',
              awayTeam: 'Liverpool',
              homeScore: 2,
              awayScore: 1,
              minute: 65,
              status: 'LIVE'
            },
            {
              id: 2,
              homeTeam: 'Arsenal',
              awayTeam: 'Chelsea',
              homeScore: 0,
              awayScore: 0,
              minute: 15,
              status: 'LIVE'
            }
          ],
          'champions-league': [
            {
              id: 3,
              homeTeam: 'Real Madrid',
              awayTeam: 'Bayern Munich',
              homeScore: 1,
              awayScore: 1,
              minute: 30,
              status: 'LIVE'
            }
          ],
          'laliga': [
            {
              id: 4,
              homeTeam: 'Barcelona',
              awayTeam: 'Atletico Madrid',
              homeScore: 3,
              awayScore: 0,
              minute: 75,
              status: 'LIVE'
            }
          ],
          'bundesliga': [
            {
              id: 5,
              homeTeam: 'Bayern Munich',
              awayTeam: 'Borussia Dortmund',
              homeScore: 2,
              awayScore: 2,
              minute: 85,
              status: 'LIVE'
            }
          ],
          'serie-a': [
            {
              id: 6,
              homeTeam: 'Juventus',
              awayTeam: 'Inter Milan',
              homeScore: 1,
              awayScore: 0,
              minute: 25,
              status: 'LIVE'
            }
          ],
          'ligue-1': [
            {
              id: 7,
              homeTeam: 'PSG',
              awayTeam: 'Monaco',
              homeScore: 2,
              awayScore: 1,
              minute: 55,
              status: 'LIVE'
            }
          ]
        }
        
        setLiveMatches(mockLiveMatches[selectedLeague] || [])
        setIsLoading(false)
      } catch (error) {
        setError('Failed to load live scores')
        setIsLoading(false)
      }
    }

    fetchLiveScores()
    // Set up polling every 30 seconds
    const interval = setInterval(fetchLiveScores, 30000)
    return () => clearInterval(interval)
  }, [selectedLeague])

  const renderLiveMatch = (match) => (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <h3 className="text-lg font-semibold">{match.homeTeam}</h3>
        </div>
        <div className="px-6">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            {match.minute}'
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{match.awayTeam}</h3>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Live Scores
      </motion.h1>

      <LeagueSelector 
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
      />

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-4 rounded-md mb-6"
        >
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <Skeleton height="24px" className="mb-4" />
              <Skeleton height="16px" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {liveMatches.length > 0 ? (
            liveMatches.map(match => renderLiveMatch(match))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              No live matches at the moment
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default LiveScores