const express = require('express');
const router = express.Router();

// @route   GET api/predictions
// @desc    Get match predictions
// @access  Public
router.get('/', async (req, res) => {
  try {
    // In a real app, this would use historical data and algorithms
    // For now, we'll return mock predictions
    const predictions = [
      { 
        matchId: 1, 
        homeTeam: 'Arsenal', 
        awayTeam: 'Chelsea', 
        predictedScore: '2-1',
        winProbability: { home: 0.45, draw: 0.25, away: 0.3 }
      },
      { 
        matchId: 2, 
        homeTeam: 'Manchester United', 
        awayTeam: 'Liverpool', 
        predictedScore: '1-2',
        winProbability: { home: 0.3, draw: 0.25, away: 0.45 }
      },
      { 
        matchId: 3, 
        homeTeam: 'Manchester City', 
        awayTeam: 'Tottenham', 
        predictedScore: '3-1',
        winProbability: { home: 0.6, draw: 0.2, away: 0.2 }
      }
    ];
    
    res.json(predictions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/predictions/:matchId
// @desc    Get prediction for a specific match
// @access  Public
router.get('/:matchId', async (req, res) => {
  try {
    // Mock prediction for a specific match
    const prediction = { 
      matchId: parseInt(req.params.matchId), 
      homeTeam: 'Team A', 
      awayTeam: 'Team B', 
      predictedScore: '2-1',
      winProbability: { home: 0.55, draw: 0.25, away: 0.2 }
    };
    
    res.json(prediction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;