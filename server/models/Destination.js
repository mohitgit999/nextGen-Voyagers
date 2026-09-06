// server/models/Destination.js
// Mirrors the data in js/data.js — seeded into MongoDB on first run.
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  id:      { type: String, required: true, unique: true },
  name:    { type: String, required: true },
  state:   { type: String, required: true },
  tags:    [String],
  icon:    { type: String },
  emoji:   { type: String },
  rating:  { type: Number, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  cost: {
    budget:  { type: Number },
    mid:     { type: Number },
    luxury:  { type: Number }
  },
  bestFor: [String],
  blurb:   { type: String },
  safety: {
    score:  { type: Number, min: 0, max: 5 },
    points: [String]
  },
  dayThemes:  [String],
  activities: {
    morning:   [String],
    afternoon: [String],
    evening:   [String]
  },
  weather: {
    best:  [String],
    avoid: [String],
    temp: {
      min: Number,
      max: Number
    },
    note: String
  },
  transport: {
    train: {
      label:   String,
      station: String,
      note:    String
    },
    flight: {
      label:   String,
      airport: String,
      note:    String
    },
    road: {
      label: String,
      note:  String
    }
  },
  localEmergency: {
    police:   String,
    hospital: String,
    tourist:  String
  },
  packingExtras: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);
