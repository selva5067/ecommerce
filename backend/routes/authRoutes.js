const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, generateTokens } = require('../middleware/auth');

// POST /api/auth/register/
router.post('/register/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ username: ['Username and password are required.'] });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ username: ['A user with that username already exists.'] });
    }

    const user = await User.create({ username, email, password });
    const tokens = generateTokens(user);
    res.status(201).json(tokens);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// POST /api/auth/login/
router.post('/login/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const tokens = generateTokens(user);
      return res.json(tokens);
    } else {
      return res.status(401).json({ detail: 'No active account found with the given credentials' });
    }
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// POST /api/auth/refresh/
router.post('/refresh/', async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ detail: 'Refresh token required.' });

  try {
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../middleware/auth');
    const decoded = jwt.verify(refresh, JWT_SECRET);
    const access = jwt.sign({ id: decoded.id, username: decoded.username }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ access });
  } catch (e) {
    res.status(401).json({ detail: 'Token is invalid or expired.' });
  }
});

// GET /api/auth/me/
router.get('/me/', protect, async (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

module.exports = router;
