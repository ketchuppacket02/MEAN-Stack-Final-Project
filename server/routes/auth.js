const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Use environment variable for JWT secret, fallback to a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ error: 'Username & password required' });
        
        if (await User.findOne({ username }))
            return res.status(400).json({ error: 'Username taken' });
        
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hash, movieLists: [] });
        await user.save();
        
        // Generate token for new user
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) 
            return res.status(400).json({ error: 'Username & password required' });
        
        const user = await User.findOne({ username });
        if (!user) 
            return res.status(400).json({ error: 'Invalid credentials' });
        
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) 
            return res.status(400).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;