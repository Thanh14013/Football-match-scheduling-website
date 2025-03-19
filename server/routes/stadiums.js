const express = require('express');
const router = express.Router();

// Premier League stadiums data
const stadiums = [
  { id: 1, name: 'Emirates Stadium', team: 'Arsenal', capacity: 60704 },
  { id: 2, name: 'Villa Park', team: 'Aston Villa', capacity: 42785 },
  { id: 3, name: 'Brentford Community Stadium', team: 'Brentford', capacity: 17250 },
  { id: 4, name: 'Amex Stadium', team: 'Brighton & Hove Albion', capacity: 31800 },
  { id: 5, name: 'Turf Moor', team: 'Burnley', capacity: 21944 },
  { id: 6, name: 'Stamford Bridge', team: 'Chelsea', capacity: 40853 },
  { id: 7, name: 'Selhurst Park', team: 'Crystal Palace', capacity: 25486 },
  { id: 8, name: 'Goodison Park', team: 'Everton', capacity: 39572 },
  { id: 9, name: 'Elland Road', team: 'Leeds United', capacity: 37890 },
  { id: 10, name: 'King Power Stadium', team: 'Leicester City', capacity: 32312 },
  { id: 11, name: 'Anfield', team: 'Liverpool', capacity: 53394 },
  { id: 12, name: 'Etihad Stadium', team: 'Manchester City', capacity: 55017 },
  { id: 13, name: 'Old Trafford', team: 'Manchester United', capacity: 74140 },
  { id: 14, name: 'St James\' Park', team: 'Newcastle United', capacity: 52305 },
  { id: 15, name: 'Carrow Road', team: 'Norwich City', capacity: 27359 },
  { id: 16, name: 'St Mary\'s Stadium', team: 'Southampton', capacity: 32384 },
  { id: 17, name: 'Tottenham Hotspur Stadium', team: 'Tottenham Hotspur', capacity: 62850 },
  { id: 18, name: 'Vicarage Road', team: 'Watford', capacity: 21577 },
  { id: 19, name: 'London Stadium', team: 'West Ham United', capacity: 60000 },
  { id: 20, name: 'Molineux Stadium', team: 'Wolverhampton Wanderers', capacity: 32050 }
];

// @route   GET api/stadiums
// @desc    Get all stadiums
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json(stadiums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/stadiums/:id
// @desc    Get stadium by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const stadium = stadiums.find(s => s.id === parseInt(req.params.id));
    
    if (!stadium) {
      return res.status(404).json({ msg: 'Stadium not found' });
    }
    
    res.json(stadium);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;