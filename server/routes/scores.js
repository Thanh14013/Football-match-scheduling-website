const express = require('express');
const router = express.Router();
const axios = require('axios');

// @route   GET api/scores
// @desc    Get live scores
// @access  Public
router.get('/', async (req, res) => {
  try {
    // In a real app, this would connect to a sports API
    // For now, we'll return mock live scores
    const liveScores = [
      { 
        matchId: 1, 
        homeTeam: 'Arsenal', 
        awayTeam: 'Chelsea', 
        score: '2-1',
        minute: 75,
        status: 'LIVE',
        stats: {
          possession: { home: 55, away: 45 },
          shots: { home: 12, away: 8 },
          shotsOnTarget: { home: 5, away: 3 },
          corners: { home: 6, away: 4 },
          fouls: { home: 10, away: 12 },
          yellowCards: { home: 2, away: 3 },
          redCards: { home: 0, away: 0 }
        }
      },
      { 
        matchId: 2, 
        homeTeam: 'Manchester United', 
        awayTeam: 'Liverpool', 
        score: '1-2',
        minute: 60,
        status: 'LIVE',
        stats: {
          possession: { home: 40, away: 60 },
          shots: { home: 7, away: 15 },
          shotsOnTarget: { home: 3, away: 6 },
          corners: { home: 3, away: 7 },
          fouls: { home: 14, away: 8 },
          yellowCards: { home: 3, away: 1 },
          redCards: { home: 0, away: 0 }
        }
      },
      { 
        matchId: 3, 
        homeTeam: 'Manchester City', 
        awayTeam: 'Tottenham', 
        score: '3-0',
        minute: 90,
        status: 'FINISHED',
        stats: {
          possession: { home: 65, away: 35 },
          shots: { home: 18, away: 6 },
          shotsOnTarget: { home: 8, away: 2 },
          corners: { home: 9, away: 2 },
          fouls: { home: 7, away: 11 },
          yellowCards: { home: 1, away: 4 },
          redCards: { home: 0, away: 1 }
        }
      }
    ];
    
    res.json(liveScores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/scores/:matchId
// @desc    Get score for a specific match
// @access  Public
router.get('/:matchId', async (req, res) => {
  try {
    // Mock data for a specific match
    const matchScore = { 
      matchId: parseInt(req.params.matchId), 
      homeTeam: 'Team A', 
      awayTeam: 'Team B', 
      score: '2-1',
      minute: 85,
      status: 'LIVE',
      stats: {
        possession: { home: 52, away: 48 },
        shots: { home: 14, away: 9 },
        shotsOnTarget: { home: 6, away: 4 },
        corners: { home: 5, away: 3 },
        fouls: { home: 11, away: 13 },
        yellowCards: { home: 2, away: 2 },
        redCards: { home: 0, away: 0 }
      }
    };
    
    res.json(matchScore);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;