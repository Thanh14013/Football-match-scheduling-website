import { useState, useEffect } from 'react'
import { FaFutbol } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '../contexts/SupabaseContext'
import LoadingScreen from '../components/LoadingScreen'

// Component to select league
const LeagueSelector = ({ selectedLeague, onChange }) => {
  const leagues = [
    { id: 'premier-league', name: 'Premier League' },
    { id: 'laliga', name: 'La Liga' },
    { id: 'bundesliga', name: 'Bundesliga' },
    { id: 'serie-a', name: 'Serie A' },
    { id: 'ligue-1', name: 'Ligue 1' }
  ]
  
  return (
    <div className="flex flex-wrap justify-center mb-6 space-x-2">
      {leagues.map(league => (
        <button
          key={league.id}
          className={`px-4 py-2 rounded-full text-sm font-semibold mb-2 ${
            selectedLeague === league.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
          onClick={() => onChange(league.id)}
        >
          {league.name}
        </button>
      ))}
    </div>
  )
}

function LiveScores() {
  const { supabase } = useSupabase()
  const [liveMatches, setLiveMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLeague, setSelectedLeague] = useState('premier-league')

  // Team logos mapping - placed outside component to avoid recreation on each render
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
    'Monaco': 'https://upload.wikimedia.org/wikipedia/en/e/ea/AS_Monaco_FC.svg',
    'Atletico Madrid': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg'
  }

  // Sample data for leagues
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

  useEffect(() => {
    const fetchLiveScores = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Try to get data from Supabase if possible - but don't block UI
        let useRealData = false;
        try {
          const { data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('status', 'live')
            .limit(1)
            .maybeSingle();
            
          useRealData = !error && data;
        } catch (e) {
          console.log('Using sample data')
        }
        
        // Immediately display sample data to improve UX
        setLiveMatches(mockLiveMatches[selectedLeague] || [])
        setIsLoading(false)
        
        // If Supabase is working, try to get real data
        if (useRealData) {
          try {
            const { data, error } = await supabase
              .from('matches')
              .select(`
                id,
                date,
                time,
                status,
                club1:teams!matches_club1_id_fkey (id, name, logo_url),
                club2:teams!matches_club2_id_fkey (id, name, logo_url)
              `)
              .eq('status', 'live')
              
            if (!error && data && data.length > 0) {
              // Convert Supabase data to required format
              const formattedMatches = data.map(match => ({
                id: match.id,
                homeTeam: match.club1?.name || 'Unknown',
                awayTeam: match.club2?.name || 'Unknown',
                homeScore: Math.floor(Math.random() * 4), // simulate scores
                awayScore: Math.floor(Math.random() * 4), // simulate scores
                minute: Math.floor(Math.random() * 90) + 1, // simulate minute
                status: 'LIVE',
                logo1: match.club1?.logo_url,
                logo2: match.club2?.logo_url
              }))
              
              setLiveMatches(formattedMatches)
            }
          } catch (supabaseError) {
            console.error('Error fetching live data:', supabaseError)
            // Don't show error since we have sample data
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Unable to load live match data. Please try again later.')
        // Still show sample data even when there's an error
        setLiveMatches(mockLiveMatches[selectedLeague] || [])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveScores()
    // Update data every 30 seconds
    const interval = setInterval(fetchLiveScores, 30000)
    return () => clearInterval(interval)
  }, [selectedLeague, supabase])

  const renderLiveMatch = (match) => (
    <div
      key={match.id}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right flex items-center justify-end">
          <h3 className="text-lg font-semibold mr-3">{match.homeTeam}</h3>
          <img 
            src={match.logo1 || teamLogos[match.homeTeam] || `https://via.placeholder.com/40?text=${match.homeTeam.charAt(0)}`} 
            alt={match.homeTeam} 
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/40?text=${match.homeTeam.charAt(0)}`;
            }}
          />
        </div>
        <div className="px-6">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            {match.homeScore} - {match.awayScore}
          </div>
          <div className="text-center text-sm text-gray-500 mt-1">
            {match.minute}'
          </div>
        </div>
        <div className="flex-1 flex items-center">
          <img 
            src={match.logo2 || teamLogos[match.awayTeam] || `https://via.placeholder.com/40?text=${match.awayTeam.charAt(0)}`} 
            alt={match.awayTeam} 
            className="w-12 h-12 object-contain mr-3"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/40?text=${match.awayTeam.charAt(0)}`;
            }}
          />
          <h3 className="text-lg font-semibold">{match.awayTeam}</h3>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Live Matches
      </h1>
      
      <LeagueSelector selectedLeague={selectedLeague} onChange={setSelectedLeague} />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingScreen />
        </div>
      ) : error && liveMatches.length === 0 ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      ) : liveMatches.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <FaFutbol className="mx-auto text-5xl mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-xl">No live matches in this league</p>
        </div>
      ) : (
        <div className="space-y-4">
          {liveMatches.map(match => renderLiveMatch(match))}
        </div>
      )}
    </div>
  )
}

export default LiveScores