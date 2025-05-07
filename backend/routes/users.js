const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      movieLists: []
    });

    await user.save();

    // Return user without password
    const userResponse = {
      _id: user._id,
      username: user.username
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return user without password
    const userResponse = {
      _id: user._id,
      username: user.username
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all movie lists for a user
router.get('/:userId/lists', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.movieLists);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a movie list
router.delete('/:userId/lists/:listName', async (req, res) => {
  try {
    const { userId, listName } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the movie list
    const listIndex = user.movieLists.findIndex(list => list.name === listName);
    if (listIndex === -1) {
      return res.status(404).json({ message: 'Movie list not found' });
    }

    // Remove the movie list
    user.movieLists.splice(listIndex, 1);
    await user.save();

    res.json({ message: 'Movie list deleted successfully' });
  } catch (error) {
    console.error('Delete movie list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 