const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_shopeasy_123';

const generateTokens = (user) => {
  const access = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
  const refresh = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ detail: 'User no longer exists.' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ detail: 'Token invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ detail: 'Authentication token missing.' });
  }
};

module.exports = { protect, generateTokens, JWT_SECRET };
