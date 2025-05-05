const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie = require('../models/movie');

// OMDb API setup (replace with your real API key)
const OMDB_API_KEY = '2e634a94'; // Example: 'abcd1234'

router.get('/search', async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'Movie title is required' });
  }

  try {
    const response = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(title)}`);
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: 'No movies found' });
    }
    res.json(response.data.Search); // Returns list of movie summaries
  } catch (err) {
    res.status(500).json({ error: 'OMDb API failed', details: err.message });
  }
});

router.post('/', async (req, res) => {
  const { imdbID } = req.body;

  if (!imdbID) {
    return res.status(400).json({ error: 'IMDb ID is required' });
  }

  try {
    // Check if movie already exists
    const existing = await Movie.findOne({ imdbID });
    if (existing) return res.json(existing);

    // Fetch full movie data from OMDb
    const omdbRes = await axios.get(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`);
    const data = omdbRes.data;

    if (data.Response === 'False') {
      return res.status(404).json({ error: 'Movie not found in OMDb' });
    }

    // Save new movie to DB
    const movie = new Movie({
      imdbID: data.imdbID,
      title: data.Title,
      year: data.Year,
      poster: data.Poster,
      ratings: []
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save movie', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get movies', details: err.message });
  }
});

router.post('/:imdbID/rate', async (req, res) => {
  const { imdbID } = req.params;
  const { user, score } = req.body;

  if (!user || score == null) {
    return res.status(400).json({ error: 'User and score are required' });
  }

  try {
    let movie = await Movie.findOne({ imdbID });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found. Save it first before rating.' });
    }

    // Check if user already rated
    const existingRating = movie.ratings.find(r => r.user === user);

    if (existingRating) {
      existingRating.score = score;
    } else {
      movie.ratings.push({ user, score });
    }

    await movie.save();
    res.json({ message: 'Rating submitted', movie });
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate movie', details: err.message });
  }
});

// DELETE /api/movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie', details: err.message });
  }
});

module.exports = router;