import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  stadium: string;
  status: string;
}

interface Stadium {
  id: number;
  name: string;
  team: string;
}

const MatchSchedule = () => {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [dateFilter, setDateFilter] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [stadiumFilter, setStadiumFilter] = useState<string>('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For demo, we'll use mock data
        
        // Fetch stadiums
        const stadiumsResponse = await axios.get('/api/stadiums');
        setStadiums(stadiumsResponse.data);
        
        // Extract unique teams from stadiums
        const uniqueTeams = [...new Set(stadiumsResponse.data.map((stadium: Stadium) => stadium.team))];
        setTeams(uniqueTeams);
        
        // Mock match data
        const mockMatches = [
          {
            id: 1,
            homeTeam: 'Arsenal',
            awayTeam: 'Chelsea',
            date: '2025-01-15T15:00:00',
            stadium: 'Emirates Stadium',
            status: 'SCHEDULED'
          },
          {
            id: 2,
            homeTeam: 'Manchester United',
            awayTeam: 'Liverpool',
            date: '2025-01-16T17:30:00',
            stadium: 'Old Trafford',
            status: 'SCHEDULED'
          },
          {
            id: 3,
            homeTeam: 'Manchester City',
            awayTeam: 'Tottenham',
            date: '2025-01-17T20:00:00',
            stadium: 'Etihad Stadium',
            status: 'SCHEDULED'
          },
          {
            id: 4,
            homeTeam: 'Leicester City',
            awayTeam: 'West Ham',
            date: '2025-01-18T15:00:00',
            stadium: 'King Power Stadium',
            status: 'SCHEDULED'
          },
          {
            id: 5,
            homeTeam: 'Liverpool',
            awayTeam: 'Everton',
            date: '2025-01-20T20:00:00',
            stadium: 'Anfield',
            status: 'SCHEDULED'
          },
          {
            id: 6,
            homeTeam: 'Chelsea',
            awayTeam: 'Manchester City',
            date: '2025-01-22T15:00:00',
            stadium: 'Stamford Bridge',
            status: 'SCHEDULED'
          },
          {
            id: 7,
            homeTeam: 'Tottenham',
            awayTeam: 'Arsenal',
            date: '2025-01-23T17:30:00',
            stadium: 'Tottenham Hotspur Stadium',
            status: 'SCHEDULED'
          },
          {
            id: 8,
            homeTeam: 'West Ham',
            awayTeam: 'Manchester United',
            date: '2025-01-25T15:00:00',
            stadium: 'London Stadium',
            status: 'SCHEDULED'
          }
        ];
        
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
        
        // Check if there's a specific match ID in the URL
        const matchId = searchParams.get('id');
        if (matchId) {
          // Scroll to that match
          setTimeout(() => {
            const element = document.getElementById(`match-${matchId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              element.classList.add('bg-blue-50', 'dark:bg-blue-900');
              setTimeout(() => {
                element.classList.remove('bg-blue-50', 'dark:bg-blue-900');
              }, 3000);
            }
          }, 500);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...matches];
    
    if (dateFilter) {
      filtered = filtered.filter(match => 
        match.date.startsWith(dateFilter)
      );
    }
    
    if (teamFilter) {
      filtered = filtered.filter(match => 
        match.homeTeam === teamFilter || match.awayTeam === teamFilter
      );
    }
    
    if (stadiumFilter) {
      filtered = filtered.filter(match => 
        match.stadium === stadiumFilter
      );
    }
    
    setFilteredMatches(filtered);
  }, [matches, dateFilter, teamFilter, stadiumFilter]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Match Schedule
      </h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            Filter Matches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="teamFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team
              </label>
              <select
                id="teamFilter"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="stadiumFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Stadium
              </label>
              <select
                id="stadiumFilter"
                value={stadiumFilter}
                onChange={(e) => setStadiumFilter(e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              >
                <option value="">All Stadiums</option>
                {stadiums.map((stadium) => (
                  <option key={stadium.id} value={stadium.name}>
                    {stadium.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Match List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-700 dark:text-gray-300">No matches found with the selected filters.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMatches.map((match) => (
              <li 
                key={match.id} 
                id={`match-${match.id}`}
                className="px-4 py-4 sm:px-6 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mr-4">
                      {format(new Date(match.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(match.date), 'h:mm a')}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {match.stadium}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {match.homeTeam}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">vs</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {match.awayTeam}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {match.status === 'SCHEDULED' ? 'Upcoming' : match.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;