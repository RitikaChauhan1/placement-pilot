const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initDb, isPgConnected } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend during development
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/study-plan', studyPlanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'PlacementPilot API Server',
    database: isPgConnected() ? 'PostgreSQL (Connected)' : 'Resilient In-Memory Fallback (Active)',
    timestamp: new Date().toISOString()
  });
});

// Root API welcome
app.get('/', (req, res) => {
  res.json({
    name: 'PlacementPilot Backend API',
    version: '1.0.0',
    description: 'Campus Placement & Technical Interview Preparation Platform',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.url}`
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start server after initializing DB
const startServer = async () => {
  console.log('Initializing PlacementPilot Server...');
  await initDb();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 PlacementPilot Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💾 Database Status: ${isPgConnected() ? 'PostgreSQL Connected' : 'Resilient In-Memory Fallback Active'}`);
    console.log(`====================================================`);
  });
};

startServer();
