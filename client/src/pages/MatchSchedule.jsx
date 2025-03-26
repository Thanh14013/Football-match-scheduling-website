import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import InfiniteScroll from '../components/InfiniteScroll'
import Skeleton from '../components/Skeleton'
import FadeIn from '../components/FadeIn'
import { useNavigate } from 'react-router-dom'
import { getMatches, getStadiums, getMatchesByStatus, getTeams } from '../lib/supabase'

// Dữ liệu mẫu để hiển thị khi không có dữ liệu từ Supabase
const SAMPLE_MATCHES = [
  {
    id: 1,
    date: '2024-07-10',
    time: '19:30:00',
    status: 'upcoming',
    stadiums: {
      id: 1,
      name: 'Old Trafford',
      capacity: 74140,
      price: 50.00
    },
    club1: {
      id: 1,
      name: 'Manchester United',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'
    },
    club2: {
      id: 2,
      name: 'Liverpool',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'
    }
  },
  {
    id: 2,
    date: '2024-07-12',
    time: '20:00:00',
    status: 'upcoming',
    stadiums: {
      id: 3,
      name: 'Emirates Stadium',
      capacity: 60704,
      price: 55.00
    },
    club1: {
      id: 3,
      name: 'Arsenal',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'
    },
    club2: {
      id: 4,
      name: 'Chelsea',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
    }
  },
  {
    id: 3,
    date: '2024-07-15',
    time: '21:00:00',
    status: 'upcoming',
    stadiums: {
      id: 5,
      name: 'Camp Nou',
      capacity: 99354,
      price: 65.00
    },
    club1: {
      id: 5,
      name: 'Barcelona',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg'
    },
    club2: {
      id: 6,
      name: 'Real Madrid',
      logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'
    }
  }
];

const SAMPLE_STADIUMS = [
  { id: 1, name: 'Old Trafford', capacity: 74140, price: 50.00 },
  { id: 2, name: 'Anfield', capacity: 53394, price: 45.00 },
  { id: 3, name: 'Emirates Stadium', capacity: 60704, price: 55.00 },
  { id: 4, name: 'Stamford Bridge', capacity: 41837, price: 60.00 },
  { id: 5, name: 'Camp Nou', capacity: 99354, price: 65.00 }
];

const SAMPLE_TEAMS = [
  { id: 1, name: 'Manchester United', logo_url: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' },
  { id: 2, name: 'Liverpool', logo_url: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' },
  { id: 3, name: 'Arsenal', logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' },
  { id: 4, name: 'Chelsea', logo_url: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' },
  { id: 5, name: 'Barcelona', logo_url: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
  { id: 6, name: 'Real Madrid', logo_url: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' }
];

function MatchSchedule() {
  const [matches, setMatches] = useState([])
  const [stadiums, setStadiums] = useState([])
  const [teams, setTeams] = useState([])
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

  // Team logos mapping
  const teamLogos = {
    'Manchester United': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
    'Liverpool': 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    'Arsenal': 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    'Chelsea': 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    'Barcelona': 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    'Real Madrid': 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    'Manchester City': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    'Tottenham': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
    'Bayern Munich': 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    'Borussia Dortmund': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
    'Juventus': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg',
    'Inter Milan': 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    'PSG': 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
    'Monaco': 'https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch stadiums
        const stadiumsData = await getStadiums()
        // Nếu không có dữ liệu sân vận động, sử dụng dữ liệu mẫu
        setStadiums(stadiumsData && stadiumsData.length > 0 ? stadiumsData : SAMPLE_STADIUMS)
        
        // Fetch teams
        const teamsData = await getTeams()
        // Nếu không có dữ liệu đội bóng, sử dụng dữ liệu mẫu
        setTeams(teamsData && teamsData.length > 0 ? teamsData : SAMPLE_TEAMS)
        
        // Fetch matches based on status
        let matchesData
        if (selectedStatus === 'all') {
          matchesData = await getMatches()
        } else {
          matchesData = await getMatchesByStatus(selectedStatus)
        }
        
        // Nếu không có dữ liệu trận đấu, sử dụng dữ liệu mẫu
        if (!matchesData || matchesData.length === 0) {
          console.log('Không có dữ liệu trận đấu, sử dụng dữ liệu mẫu');
          matchesData = SAMPLE_MATCHES
        }
        
        setMatches(matchesData)
        setFilteredMatches(matchesData.slice(0, 10))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load match schedule. Please try again later.')
        
        // Sử dụng dữ liệu mẫu khi có lỗi
        setStadiums(SAMPLE_STADIUMS)
        setTeams(SAMPLE_TEAMS)
        setMatches(SAMPLE_MATCHES)
        setFilteredMatches(SAMPLE_MATCHES.slice(0, 10))
        
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedStatus])

  useEffect(() => {
    let filtered = matches || [];

    if (searchTerm) {
      filtered = filtered.filter(match => 
        (match.stadiums?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (match.club1?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (match.club2?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStadium !== 'All Stadiums') {
      filtered = filtered.filter(match => 
        match.stadiums?.name === selectedStadium
      )
    }

    if (selectedTeam !== 'All Teams') {
      filtered = filtered.filter(match => 
        match.club1?.name === selectedTeam || match.club2?.name === selectedTeam
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
    if (!match || !match.stadiums || !match.club1 || !match.club2) return null;
    
    // Get home team and away team
    const homeTeam = match.club1.name;
    const awayTeam = match.club2.name;
    const stadium = match.stadiums.name;
    
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
          
          <div className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">{stadium}</div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={match.club1.logo_url || `https://via.placeholder.com/40?text=${homeTeam.charAt(0)}`} 
                alt={homeTeam} 
                className="w-10 h-10 mr-2 object-contain"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/40?text=${homeTeam.charAt(0)}`;
                }}
              />
              <div className="text-lg font-semibold">{homeTeam}</div>
            </div>
            <div className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-bold">VS</div>
            <div className="flex items-center">
              <div className="text-lg font-semibold">{awayTeam}</div>
              <img 
                src={match.club2.logo_url || `https://via.placeholder.com/40?text=${awayTeam.charAt(0)}`} 
                alt={awayTeam} 
                className="w-10 h-10 ml-2 object-contain"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/40?text=${awayTeam.charAt(0)}`;
                }}
              />
            </div>
          </div>
          
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
              {teams.map(team => (
                <option key={team.id} value={team.name}>
                  {team.name}
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