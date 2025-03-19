import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

const Home = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For demo, we'll use mock data
    const fetchUpcomingMatches = async () => {
      try {
        // Simulating API call
        // const response = await axios.get('/api/matches/upcoming');
        // setUpcomingMatches(response.data);
        
        // Mock data
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
          }
        ];
        
        setUpcomingMatches(mockMatches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming matches:', error);
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Schedule and manage football matches with ease
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              Book stadiums, track live scores, and get match predictions all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/book-match"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Book a Match
              </Link>
              <Link
                to="/match-schedule"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Matches Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Upcoming Matches
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(match.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(match.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {match.homeTeam}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">vs</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {match.awayTeam}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {match.stadium}
                  </div>
                  <Link
                    to={`/match-schedule?id=${match.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link
            to="/match-schedule"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View all matches
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                Easy Scheduling
              </h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Book matches at Premier League stadiums with just a few clicks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                Live Scores
              </h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Get real-time updates on match scores and statistics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                Match Predictions
              </h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                Get AI-powered predictions for upcoming matches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;