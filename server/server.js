// server.js

/* ---------------------------
   Environment Configuration
--------------------------- */
try {
  require('dotenv').config();
  console.log('Environment variables loaded');
} catch (err) {
  console.warn('dotenv not found, continuing without .env file');
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { promisePool, testConnection } = require('./config/db');

// Routes
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const skillCategoryRoutes = require('./routes/skillCategories');
const sectionSettingsRoutes = require('./routes/sectionSettings');
const certificationRoutes = require('./routes/certifications');
const experienceRoutes = require('./routes/experiences');
const educationRoutes = require('./routes/education');
const messageRoutes = require('./routes/messages');
const personalInfoRoutes = require('./routes/personalInfo');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/* ---------------------------
   Security & Middleware
--------------------------- */
// Configure helmet to allow cross-origin resource loading for uploaded images
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Required when behind Nginx reverse proxy
app.set('trust proxy', 1);

// Rate limiting — stricter in production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS — reads allowed origins from environment variable
const getAllowedOrigins = () => {
  if (NODE_ENV === 'production') {
    const envOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [];
    const frontendUrl = process.env.FRONTEND_URL;
    if (frontendUrl && !envOrigins.includes(frontendUrl)) {
      envOrigins.push(frontendUrl);
    }
    return envOrigins;
  }
  return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4578'];
};

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploaded images)
app.use('/uploads', express.static('uploads'));

/* ---------------------------
   API Routes
--------------------------- */
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/skillCategories', skillCategoryRoutes);
app.use('/api/sectionSettings', sectionSettingsRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/personal-info', personalInfoRoutes);

/* ---------------------------
   Health & Readiness
--------------------------- */

// Fast liveness check (Nginx / load balancer)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API-level health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Portfolio API',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Readiness check (verifies DB connection)
app.get('/ready', async (req, res) => {
  try {
    await promisePool.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    res.status(503).json({ status: 'error', db: 'unreachable' });
  }
});

/* ---------------------------
   404 Handler
--------------------------- */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

/* ---------------------------
   Global Error Handler
--------------------------- */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

/* ---------------------------
   Start Server (NON-BLOCKING)
--------------------------- */
app.listen(PORT, () => {
  console.log('--------------------------------');
  console.log(`Server running on port : ${PORT}`);
  console.log(`Environment           : ${NODE_ENV}`);
  console.log(`Health check          : /health`);
  console.log(`Readiness check       : /ready`);
  console.log(`API base              : /api`);
  console.log('--------------------------------');
});

/* ---------------------------
   DB Connection (Background)
--------------------------- */
(async () => {
  try {
    await testConnection();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('⚠️  Database connection failed:', err.message);
    console.error('⚠️  Application is running, but DB is NOT ready');
  }
})();
