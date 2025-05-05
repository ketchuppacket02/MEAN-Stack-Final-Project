const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Movie = require('../models/movie');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    const user = new User({ username, movies: [] });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// Get a user's movie list
router.get('/:id/movies', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('movies');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user movies', details: err.message });
  }
});

// Add a movie to a user's list (referencing an existing movie or creating a new one)
router.post('/:id/movies', async (req, res) => {
  try {
    const userId = req.params.id;
    const { title } = req.body;

    if (!title) return res.status(400).json({ error: 'Movie title is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if movie already exists (optional)
    let movie = await Movie.findOne({ title });
    if (!movie) {
      movie = new Movie({ title, ratings: [] });
      await movie.save();
    }

    // Prevent duplicates
    if (!user.movies.includes(movie._id)) {
      user.movies.push(movie._id);
      await user.save();
    }

    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add movie to user', details: err.message });
  }
});

module.exports = router;
