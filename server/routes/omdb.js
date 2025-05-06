const express = require('express');
const axios   = require('axios');
const router  = express.Router();

const apiKey = '2e634a94';

// GET /api/omdb/search?title=movieTitle
router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'Missing title query parameter' });
  }
  if (!apiKey) {
    return res.status(500).json({ error: 'OMDb API key not configured' });
  }
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&apikey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('OMDb API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies from OMDb' });
  }
});

module.exports = router;
