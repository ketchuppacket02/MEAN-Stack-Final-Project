const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create a new user
router.post('/', async (req, res) => {
  const user = new User({ username: req.body.username, movies: [] });
  await user.save();
  res.json(user);
});

// Get a user's movie list
router.get('/:id/movies', async (req, res) => {
  const user = await User.findById(req.params.id).populate('movies');
  res.json(user.movies);
});

// Add a movie to user's list
router.post('/:id/movies', async (req, res) => {
  // ... implementation here
});

module.exports = router;
