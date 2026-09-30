const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { seedInitialData } = require('./utils/seedData');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for development and cross-origin requests
app.use(cors());

// Body parsing middleware (higher limit for base64 image uploads)
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Path to compiled React production build
const clientDistPath = path.join(__dirname, '../client/dist');

// Serve static assets from React build directory
app.use(express.static(clientDistPath));

// Fallback: Serve React SPA index.html for all non-API GET routes (dashboard, consultations, learn, crops)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('AgriSphere Frontend build not found. Please build the client project first.');
    }
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start server and initialize DB connection & seed data
async function startServer() {
  await connectDB();
  await seedInitialData();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
======================================================
  🌱 AgriSphere Server is running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'production'}
  LLM Integration: ${process.env.LLM_API_KEY ? 'Active API' : 'Rule-based Offline Agriculture Fallback'}
  Single Web Service Mode: Active (Serving Frontend + API)
======================================================
    `);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;

