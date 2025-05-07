const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const SECRET = 'supersecret';

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username & password required' });
    if (await User.findOne({ username }))
      return res.status(400).json({ error: 'Username taken' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash, movies: [] });
    await user.save();
    res.status(201).json({ message: 'User created' });
  });
  

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username & password required' });
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;