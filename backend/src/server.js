/**
 * VMS Backend Server Entry Point
 * - In production: serves the built React frontend as static files
 * - In development: API only (frontend runs on Vite dev server)
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes       = require('./routes/authRoutes');
const visitorRoutes    = require('./routes/visitorRoutes');
const userRoutes       = require('./routes/userRoutes');
const reportRoutes     = require('./routes/reportRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const securityRoutes   = require('./routes/securityRoutes');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ─── CORS ─────────────────────────────────────────────────────────────────────
// In production: allow the Render frontend URL + same-origin (when serving static)
// In development: allow localhost:5173
const allowedOrigins = isProd
  ? [
      process.env.CLIENT_URL,
      'https://vms-frontend-2us4.onrender.com', // Render frontend
    ].filter(Boolean)
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HTTP logging ─────────────────────────────────────────────────────────────
app.use(
  morgan(isProd ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/visitors',     visitorRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/reports',      reportRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/security',     securityRoutes);

// Health check — Render uses this to verify the service is up
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', env: process.env.NODE_ENV, timestamp: new Date() })
);

// ─── Serve React frontend in production ───────────────────────────────────────
if (isProd) {
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));

  // All non-API routes → serve React's index.html (client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Dev: 404 for unknown routes
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

// ─── Global error handler — must be last ──────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`VMS Backend running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
