const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const Movie   = require('../models/movie');

const OMDB_API_KEY = '2e634a94';

router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: 'Movie title is required' });
  }
  if (!OMDB_API_KEY) {
    return res.status(500).json({ error: 'OMDb API key not configured' });
  }
  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(title)}`
    );
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: 'No movies found' });
    }
    res.json(response.data.Search);
  } catch (err) {
    console.error('OMDb API search error:', err.message);
    res.status(500).json({ error: 'OMDb API failed', details: err.message });
  }
});

router.post('/', async (req, res) => {
  const { imdbID } = req.body;
  if (!imdbID) {
    return res.status(400).json({ error: 'IMDb ID is required' });
  }
  if (!OMDB_API_KEY) {
    return res.status(500).json({ error: 'OMDb API key not configured' });
  }
  try {
    let movie = await Movie.findOne({ imdbID });
    if (!movie) {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}`
      );
      if (response.data.Response === 'False') {
        return res.status(404).json({ error: 'Movie not found in OMDb' });
      }
      movie = new Movie({
        title:   response.data.Title,
        year:    response.data.Year,
        imdbID:  response.data.imdbID,
        type:   response.data.Type,
        poster:  response.data.Poster,
        ratings: response.data.Ratings
      });
      await movie.save();
    }
    res.status(201).json(movie);
  } catch (err) {
    console.error('Save movie error:', err.message);
    res.status(500).json({ error: 'Failed to save movie', details: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error('Get movies error:', err.message);
    res.status(500).json({ error: 'Failed to get movies', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    console.error('Delete movie error:', err.message);
    res.status(500).json({ error: 'Failed to delete movie', details: err.message });
  }
});

module.exports = router;
