import { useState, useEffect } from 'react';
import axios from 'axios';

interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

interface Match {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  score: string;
  minute?: number;
  status: 'LIVE' | 'FINISHED' | 'SCHEDULED';
  stats: MatchStats;
}

const LiveScores = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'finished' | 'all'>('live');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // In a real app, this would fetch from a real API
        // For demo, we'll use mock data
        const response = await axios.get('/api/scores');
        setMatches(response.data);
        
        // Set the first match as selected by default
        if (response.data.length > 0) {
          setSelectedMatch(response.data[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setError('Failed to load match scores. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchScores();
    
    // In a real app, we would set up a polling mechanism to update scores
    const interval = setInterval(fetchScores, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Filter matches based on active tab
  const filteredMatches = matches.filter(match => {
    if (activeTab === 'live') return match.status === 'LIVE';
    if (activeTab === 'finished') return match.status === 'FINISHED';
    return true; // 'all' tab
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Live Scores & Results
      </h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'live'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('live')}
        >
          Live
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'finished'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('finished')}
        >
          Finished
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match List */}
          <div className="lg:col-span-1 space-y-2">
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <div 
                  key={match.matchId}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer transition-colors ${
                    selectedMatch?.matchId === match.matchId 
                      ? 'border-2 border-blue-500 dark:border-blue-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className={`p-3 flex justify-between items-center ${
                    match.status === 'LIVE' 
                      ? 'border-l-4 border-red-500' 
                      : match.status === 'FINISHED'
                        ? 'border-l-4 border-gray-500'
                        : ''
                  }`}>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 dark:text-white">{match.homeTeam}</span>
                        <span className="mx-2 font-bold text-gray-800 dark:text-white">{match.score.split('-')[0]}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-800 dark:text-white">{match.awayTeam}</span>
                        <span className="mx-2 font-bold text-gray-800 dark:text-white">{match.score.split('-')[1]}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {match.status === 'LIVE' ? (
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">{match.minute}'</span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">FT</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No matches found.
              </div>
            )}
          </div>
          
          {/* Match Details */}
          <div className="lg:col-span-2">
            {selectedMatch ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                    </h2>
                    <div>
                      {selectedMatch.status === 'LIVE' ? (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
                          LIVE {selectedMatch.minute}'
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-600 rounded-full">
                          FINISHED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Score */}
                <div className="p-6 flex justify-center items-center">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedMatch.homeTeam}</p>
                  </div>
                  <div className="text-center px-6">
                    <span className="text-4xl font-bold text-gray-800 dark:text-white">{selectedMatch.score}</span>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{selectedMatch.awayTeam}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="p-6 border-t dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Match Statistics</h3>
                  
                  {/* Possession */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.possession.home}%</span>
                      <span className="text-gray-600 dark:text-gray-400">Possession</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.possession.away}%</span>
                    </div>
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500" 
                        style={{ width: `${selectedMatch.stats.possession.home}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Shots */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.shots.home}</span>
                      <span className="text-gray-600 dark:text-gray-400">Shots</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.shots.away}</span>
                    </div>
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500" 
                        style={{ width: `${(selectedMatch.stats.shots.home / (selectedMatch.stats.shots.home + selectedMatch.stats.shots.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Shots on Target */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.shotsOnTarget.home}</span>
                      <span className="text-gray-600 dark:text-gray-400">Shots on Target</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.shotsOnTarget.away}</span>
                    </div>
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500" 
                        style={{ width: `${(selectedMatch.stats.shotsOnTarget.home / (selectedMatch.stats.shotsOnTarget.home + selectedMatch.stats.shotsOnTarget.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Corners */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.corners.home}</span>
                      <span className="text-gray-600 dark:text-gray-400">Corners</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{selectedMatch.stats.corners.away}</span>
                    </div>
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500" 
                        style={{ width: `${(selectedMatch.stats.corners.home / (selectedMatch.stats.corners.home + selectedMatch.stats.corners.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yellow Cards</h4>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-6 bg-yellow-400 mr-2"></div>
                          <span className="text-gray-800 dark:text-white">{selectedMatch.stats.yellowCards.home}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-6 bg-yellow-400 mr-2"></div>
                          <span className="text-gray-800 dark:text-white">{selectedMatch.stats.yellowCards.away}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Red Cards</h4>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-6 bg-red-600 mr-2"></div>
                          <span className="text-gray-800 dark:text-white">{selectedMatch.stats.redCards.home}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-6 bg-red-600 mr-2"></div>
                          <span className="text-gray-800 dark:text-white">{selectedMatch.stats.redCards.away}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
                Select a match to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveScores;