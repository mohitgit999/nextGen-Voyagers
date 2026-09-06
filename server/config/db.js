// server/config/db.js
const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers to avoid querySrv ECONNREFUSED on some networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.warn('⚠️  Running without database — trip saving disabled.');
    // Don't exit — let the server run in offline/demo mode
  }
};

module.exports = connectDB;
