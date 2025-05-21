import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useSupabase } from '../contexts/SupabaseContext'
import LoadingScreen from '../components/LoadingScreen'
import { useNavigate } from 'react-router-dom'

// Sample data to display when there is no data from Supabase
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
  const { supabase, user } = useSupabase()
  const [matches, setMatches] = useState(SAMPLE_MATCHES) // Start with sample data 
  const [stadiums, setStadiums] = useState(SAMPLE_STADIUMS)
  const [teams, setTeams] = useState(SAMPLE_TEAMS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStadium, setSelectedStadium] = useState('All Stadiums')
  const [selectedTeam, setSelectedTeam] = useState('All Teams')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMatches, setFilteredMatches] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 10

  const navigate = useNavigate()

  // Get matches list with timeout
  const fetchMatchesWithTimeout = async (status = 'all') => {
    return Promise.race([
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout fetching matches')), 5000)
      ),
      fetchMatches(status)
    ]);
  }

  // Function to fetch matches
  const fetchMatches = async (status = 'all') => {
    try {
      let query = supabase
        .from('matches')
        .select(`
          id,
          date,
          time,
          status,
          stadium_id,
          club1_id,
          club2_id,
          stadiums (
            id,
            name,
            capacity,
            price
          ),
          club1:teams!matches_club1_id_fkey (
            id,
            name,
            logo_url
          ),
          club2:teams!matches_club2_id_fkey (
            id,
            name,
            logo_url
          )
        `)
        .order('date', { ascending: true })
        
      // Filter by status if not 'all'
      if (status !== 'all') {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching matches:', error)
      return []
    }
  }
  
  // Function to fetch stadiums
  const fetchStadiums = async () => {
    try {
      const { data, error } = await supabase
        .from('stadiums')
        .select('*')
        .limit(20)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching stadiums:', error)
      return []
    }
  }
  
  // Function to fetch teams
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .limit(20)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        
        // Perform parallel requests
        const [stadiumsData, teamsData, matchesData] = await Promise.all([
          fetchStadiums().catch(() => []),
          fetchTeams().catch(() => []),
          fetchMatchesWithTimeout(selectedStatus).catch(() => [])
        ]);
        
        // Update data if fetch successful
        let hasRealData = false;
        if (stadiumsData.length > 0) {
          setStadiums(stadiumsData);
          hasRealData = true;
        }
        
        if (teamsData.length > 0) {
          setTeams(teamsData);
          hasRealData = true;
        }
        
        if (matchesData.length > 0) {
          setMatches(matchesData); // Update main matches state with real data
          // setFilteredMatches will be updated by the filtering useEffect
          hasRealData = true;
        }
        
        if (!hasRealData) {
          // If no real data could be fetched, show an error and potentially use sample data if desired later
          setError('Could not load data from the database. Please try again.');
          // Optionally, you could set sample data here as a fallback, but for now, show error.
          setMatches([]); // Clear matches if real data fetch failed
          setFilteredMatches([]);
        } else {
          // If real data was fetched, ensure filteredMatches is updated based on the filters and real data
          // The filtering useEffect depends on 'matches' and filter states, so it will run after setMatches
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('An error occurred while loading data.');
        setMatches([]); // Clear matches on error
        setFilteredMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supabase, selectedStatus]); // Depend on supabase and selectedStatus

  // Filter matches list - depends on 'matches' state
  useEffect(() => {
    // This effect runs whenever 'matches' or any filter state changes
    if (!matches || matches.length === 0) {
       setFilteredMatches([]);
       setHasMore(false);
       return;
    }
    
    let filtered = [...matches];

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

    setFilteredMatches(filtered.slice(0, page * ITEMS_PER_PAGE))
    setHasMore(filtered.length > page * ITEMS_PER_PAGE)
  }, [matches, searchTerm, selectedStadium, selectedTeam, selectedDate, page])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedStadium, selectedTeam, selectedDate, selectedStatus])

  // Load more data when scrolling
  const loadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1)
    }
  }

  // Book ticket function
  const handleBookTicket = (match) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/book-match', { state: { match: match } });
    }
  }

  // Format date and time
  const formatDateTime = (date, time) => {
    try {
      if (!date || !time) return 'Not specified';
      const dateTime = new Date(`${date}T${time}`)
      return format(dateTime, 'PPPp')
    } catch (error) {
      return `${date || ''} ${time || ''}`
    }
  }

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'live':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Match Schedule</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Filter bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Search teams, stadiums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Stadium filter */}
          <div>
            <label htmlFor="stadium" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stadium
            </label>
            <select
              id="stadium"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedStadium}
              onChange={(e) => setSelectedStadium(e.target.value)}
            >
              <option value="All Stadiums">All Stadiums</option>
              {stadiums.map(stadium => (
                <option key={stadium.id} value={stadium.name}>
                  {stadium.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Team filter */}
          <div>
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              id="team"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="All Teams">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date filter */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <LoadingScreen />
        </div>
      )}
      
      {/* Match list */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No matches found with the current filters
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center">
                  {/* Home team */}
                  <div className="w-full md:w-2/5 flex flex-col items-center md:items-end mb-4 md:mb-0">
                    <div className="flex flex-col items-center md:items-end">
                      <div className="w-16 h-16 mb-2">
                        <img 
                          src={match.club1?.logo_url || `https://via.placeholder.com/128?text=${(match.club1?.name || 'T').charAt(0)}`}
                          alt={match.club1?.name || 'Home Team'}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/128?text=${(match.club1?.name || 'T').charAt(0)}`;
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-center md:text-right">{match.club1?.name || 'Home Team'}</h3>
                    </div>
                  </div>
                  
                  {/* Match info center */}
                  <div className="w-full md:w-1/5 flex flex-col items-center px-4">
                    <div className={`text-sm font-medium px-3 py-1 rounded-full mb-2 ${getStatusColor(match.status)}`}>
                      {match.status === 'upcoming' ? 'Upcoming' : 
                       match.status === 'live' ? 'Live' : 
                       match.status === 'completed' ? 'Completed' : 
                       match.status === 'cancelled' ? 'Cancelled' : match.status}
                    </div>
                    <div className="text-2xl font-bold mb-2">VS</div>
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {formatDateTime(match.date, match.time)}
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {match.stadiums?.name || 'Stadium'}
                    </div>
                    {match.status === 'upcoming' && (
                      <button
                        onClick={() => handleBookTicket(match)}
                        className="btn btn-sm btn-primary"
                      >
                        Book Tickets
                      </button>
                    )}
                  </div>
                  
                  {/* Away team */}
                  <div className="w-full md:w-2/5 flex flex-col items-center md:items-start">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="w-16 h-16 mb-2">
                        <img 
                          src={match.club2?.logo_url || `https://via.placeholder.com/128?text=${(match.club2?.name || 'T').charAt(0)}`}
                          alt={match.club2?.name || 'Away Team'}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/128?text=${(match.club2?.name || 'T').charAt(0)}`;
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-center md:text-left">{match.club2?.name || 'Away Team'}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center py-4">
              <button 
                onClick={loadMore}
                className="btn btn-outline-primary"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MatchSchedule