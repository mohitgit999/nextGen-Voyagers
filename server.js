require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./server/config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // For serving local frontend without strict CSP blocking
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/destinations', require('./server/routes/destinations'));
app.use('/api/trips', require('./server/routes/trips'));

// Fallback to index.html for unknown GET routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
