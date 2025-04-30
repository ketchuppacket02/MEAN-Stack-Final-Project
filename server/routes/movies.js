const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// Get all movies
router.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// Add a new movie
router.post('/', async (req, res) => {
  const movie = new Movie({ title: req.body.title, ratings: [] });
  await movie.save();
  res.json(movie);
});

module.exports = router;
