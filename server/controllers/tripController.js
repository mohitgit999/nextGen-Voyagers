const Trip = require('../models/Trip');

// @desc    Create new trip
// @route   POST /api/trips
// @access  Public
const createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error(`Error creating trip: ${error.message}`);
    res.status(400).json({ message: 'Invalid trip data', error: error.message });
  }
};

// @desc    Get trip by sessionId
// @route   GET /api/trips/:sessionId
// @access  Public
const getTripBySessionId = async (req, res) => {
  try {
    const trip = await Trip.findOne({ sessionId: req.params.sessionId });
    
    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(`Error fetching trip: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:sessionId
// @access  Public
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      req.body,
      { new: true, runValidators: true }
    );

    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    console.error(`Error updating trip: ${error.message}`);
    res.status(400).json({ message: 'Invalid trip data', error: error.message });
  }
};

module.exports = {
  createTrip,
  getTripBySessionId,
  updateTrip,
};
