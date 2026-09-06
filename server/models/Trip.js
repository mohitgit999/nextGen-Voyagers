// server/models/Trip.js
const mongoose = require('mongoose');

const dayPartSchema = new mongoose.Schema({
  morning:   { type: String },
  afternoon: { type: String },
  evening:   { type: String },
  safetyTip: { type: String }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },

  // Origin
  origin: {
    city:   { type: String, required: true },
    source: { type: String, enum: ['gps', 'gps-coords', 'manual'], default: 'manual' },
    lat:    { type: Number, default: null },
    lon:    { type: Number, default: null }
  },

  // Preferences
  prefs: {
    destination: { type: String, default: '' },
    budget:      { type: String, enum: ['budget', 'mid', 'luxury'], required: true },
    duration:    { type: Number, min: 1, max: 21, required: true },
    group:       { type: String, enum: ['solo', 'couple', 'friends', 'family'], required: true },
    travelers:   { type: Number, min: 1, max: 12, default: 1 }
  },

  // Selected destination
  destinationId:   { type: String, required: true },
  destinationName: { type: String, required: true },
  customPerDay:    { type: Number, default: null },

  // Computed cost
  estimatedTotal: { type: Number, default: 0 },

  // Itinerary days
  itinerary: [dayPartSchema],

  // Budget log
  budgetEntries: [{
    label:     { type: String, required: true },
    amount:    { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now }
  }],

  // Packing state
  packingState: {
    type: Map,
    of: Boolean,
    default: {}
  },

  // Meta
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tripSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual: total spent
tripSchema.virtual('totalSpent').get(function() {
  return this.budgetEntries.reduce((sum, e) => sum + e.amount, 0);
});

tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);
