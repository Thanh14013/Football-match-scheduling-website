const express = require('express');
const router = express.Router();

// @route   GET api/matches
// @desc    Get all matches
// @access  Public
router.get('/', async (req, res) => {
  try {
    // This will be handled by Supabase on the client side
    // But we keep this endpoint for potential future server-side processing
    res.json({ msg: 'Get all matches endpoint' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/matches
// @desc    Create a new match booking
// @access  Private
router.post('/', async (req, res) => {
  try {
    // This will be handled by Supabase on the client side
    // But we keep this endpoint for email notifications and additional processing
    const { stadium, date, time, numberOfPlayers } = req.body;
    
    // Here we would typically:
    // 1. Validate the booking
    // 2. Check for conflicts
    // 3. Send confirmation emails
    
    res.json({ msg: 'Match booking created', data: { stadium, date, time, numberOfPlayers } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/matches/:id
// @desc    Get match by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    res.json({ msg: `Get match with id ${req.params.id}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;