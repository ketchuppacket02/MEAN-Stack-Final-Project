const express = require('express');
const axios = require('axios');
const router = express.Router();

const apiKey = '2e634a94'; // Your OMDb API key

// GET /api/omdb/search?title=movieTitle
router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'Missing title query parameter' });
  }
  try {
    const response = await axios.get(`http://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies from OMDb' });
  }
});

module.exports = router; 