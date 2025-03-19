import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaCalendarAlt, FaFutbol, FaChartLine } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import FadeIn from '../components/animations/FadeIn'
import Skeleton from '../components/Skeleton'

function Home() {
  const [upcomingMatches, setUpcomingMatches] = useState([])
  const [liveScores, setLiveScores] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [featuredMatches, setFeaturedMatches] = useState([])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be separate API calls
        const scoresRes = await axios.get('/api/scores')
        setLiveScores(scoresRes.data.filter(match => match.status === 'LIVE').slice(0, 3))
        
        // Mock upcoming matches
        setUpcomingMatches([
          {
            id: 101,
            homeTeam: 'Arsenal',
            awayTeam: 'Manchester United',
            stadium: 'Emirates Stadium',
            date: '2025-01-15',
            time: '15:00'
          },
          {
            id: 102,
            homeTeam: 'Liverpool',
            awayTeam: 'Chelsea',
            stadium: 'Anfield',
            date: '2025-01-16',
            time: '19:45'
          },
          {
            id: 103,
            homeTeam: 'Manchester City',
            awayTeam: 'Tottenham',
            stadium: 'Etihad Stadium',
            date: '2025-01-18',
            time: '17:30'
          }
        ])
        
        // Simulate API call
        setTimeout(() => {
          setFeaturedMatches([
            { id: 1, homeTeam: 'Manchester United', awayTeam: 'Liverpool', time: '20:00' },
            { id: 2, homeTeam: 'Arsenal', awayTeam: 'Chelsea', time: '22:00' }
          ])
          setIsLoading(false)
        }, 1500)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">Football Match Scheduling</h1>
          <p className="text-xl mb-8">Book your favorite matches and never miss a game</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold"
          >
            Book Now
          </motion.button>
        </div>
      </motion.div>

      {/* Featured Matches Section */}
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Matches</h2>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loading
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <Skeleton height="24px" className="mb-4" />
                <Skeleton height="16px" className="mb-4" />
                <Skeleton height="16px" />
              </div>
            ))
          ) : (
            featuredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-4">{match.homeTeam} vs {match.awayTeam}</h3>
                <p className="text-gray-600 dark:text-gray-300">Time: {match.time}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Book Tickets
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-800 py-12"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">1000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Matches Booked</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-300">Stadiums</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">100k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Happy Users</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home