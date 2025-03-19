import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import InfiniteScroll from '../components/InfiniteScroll'
import Skeleton from '../components/Skeleton'
import FadeIn from '../components/FadeIn'
import { useNavigate } from 'react-router-dom'
import { getMatches, getStadiums, getMatchesByStatus } from '../lib/supabase'

function MatchSchedule() {
  const [matches, setMatches] = useState([])
  const [stadiums, setStadiums] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStadium, setSelectedStadium] = useState('All Stadiums')
  const [selectedTeam, setSelectedTeam] = useState('All Teams')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMatches, setFilteredMatches] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch stadiums
        const stadiumsData = await getStadiums()
        setStadiums(stadiumsData)
        
        // Fetch matches based on status
        let matchesData
        if (selectedStatus === 'all') {
          matchesData = await getMatches()
        } else {
          matchesData = await getMatchesByStatus(selectedStatus)
        }
        
        setMatches(matchesData)
        setFilteredMatches(matchesData.slice(0, 10))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load match schedule. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedStatus])

  useEffect(() => {
    let filtered = matches.filter(match => match && match.stadiums);

    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.stadiums.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.opponent.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStadium !== 'All Stadiums') {
      filtered = filtered.filter(match => 
        match.stadiums.name === selectedStadium
      )
    }

    if (selectedTeam !== 'All Teams') {
      filtered = filtered.filter(match => 
        match.stadiums.name === selectedTeam || match.opponent === selectedTeam
      )
    }

    if (selectedDate) {
      filtered = filtered.filter(match => 
        match.date === selectedDate
      )
    }

    setFilteredMatches(filtered.slice(0, 10))
  }, [matches, searchTerm, selectedStadium, selectedTeam, selectedDate])

  const renderMatchCard = (match) => {
    if (!match || !match.stadiums) return null;
    
    return (
      <FadeIn key={match.id}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(match.date), 'dd/MM/yyyy')}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{match.time}</span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">{match.stadiums.name}</div>
            <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">VS</div>
            <div className="text-lg font-semibold">{match.opponent}</div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300">{match.stadiums.name}</div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => navigate(`/book/${match.id}`)}
          >
            Book Tickets
          </motion.button>
        </motion.div>
      </FadeIn>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Match Schedule
      </motion.h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="card p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by team name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              id="date-filter"
              type="date"
              className="w-full p-2 border rounded"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="stadium-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stadium
            </label>
            <select
              id="stadium-filter"
              className="w-full p-2 border rounded"
              value={selectedStadium}
              onChange={(e) => setSelectedStadium(e.target.value)}
            >
              <option>All Stadiums</option>
              {stadiums.map(stadium => (
                <option key={stadium.id} value={stadium.name}>
                  {stadium.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              id="team-filter"
              className="w-full p-2 border rounded"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option>All Teams</option>
              {stadiums.map(stadium => (
                <option key={stadium.id} value={stadium.team}>
                  {stadium.team}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="w-full p-2 border rounded"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Matches</option>
              <option value="completed">Completed</option>
              <option value="live">Live</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(renderMatchCard)}
        </div>
      )}
    </motion.div>
  );
}

export default MatchSchedule;