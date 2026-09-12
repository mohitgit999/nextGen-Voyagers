require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./server/config/db');

// Connect to MongoDB
connectDB();

const app = express();

// ── CORS — allow the deployed frontend + localhost for dev ──
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:5000',   // Local combined server
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ''));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health-check route (Render pings this to keep the service alive) ──
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'NextGen Voyagers API' });
});

// ── API Routes ──
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/destinations', require('./server/routes/destinations'));
app.use('/api/trips', require('./server/routes/trips'));
app.use('/api/contact', require('./server/routes/contact'));
app.use('/api/ai', require('./server/routes/ai'));
app.use('/api/weather', require('./server/routes/weather'));
app.use('/api/location', require('./server/routes/location'));

// ── Error handling middleware ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error', message: err.message });
});

// ── Start server (Render injects PORT automatically) ──
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;
