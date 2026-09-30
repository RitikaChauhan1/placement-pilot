const jwt = require('jsonwebtoken');
const { query, isPgConnected, memoryStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'placementpilot_super_secret_jwt_key_2026_xyz';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (isPgConnected()) {
      const result = await query('SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1', [decoded.id]);
      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.'
        });
      }
      user = result.rows[0];
    } else {
      const found = memoryStore.users.find(u => u.id === decoded.id);
      if (!found) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.'
        });
      }
      user = { id: found.id, name: found.name, email: found.email, created_at: found.created_at, updated_at: found.updated_at };
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or corrupted token.'
    });
  }
};

module.exports = authMiddleware;
