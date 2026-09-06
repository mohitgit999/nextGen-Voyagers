// server/controllers/tripController.js
const Trip = require('../models/Trip');

// @desc    Create new trip (or upsert if sessionId matches)
// @route   POST /api/trips
// @access  Public / Optional Auth
const createTrip = async (req, res) => {
  try {
    const tripData = { ...req.body };

    // Attach user ID if authenticated
    if (req.user && req.user._id) {
      tripData.userId = req.user._id;
    }

    // Check if trip with sessionId already exists
    if (tripData.sessionId) {
      let existing = await Trip.findOne({ sessionId: tripData.sessionId });
      if (existing) {
        // If current user is logged in, claim ownership
        if (req.user && req.user._id && !existing.userId) {
          tripData.userId = req.user._id;
        }
        existing.set(tripData);
        const updated = await existing.save();
        return res.status(200).json(updated);
      }
    }

    const trip = new Trip(tripData);
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error(`Error creating trip: ${error.message}`);
    res.status(400).json({ message: 'Invalid trip data', error: error.message });
  }
};

// @desc    Get trip by sessionId or Mongo ID
// @route   GET /api/trips/:sessionId
// @access  Public
const getTripBySessionId = async (req, res) => {
  try {
    const param = req.params.sessionId;
    let trip;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      trip = await Trip.findById(param);
    }
    if (!trip) {
      trip = await Trip.findOne({ sessionId: param });
    }

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
// @access  Public / Optional Auth
const updateTrip = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.user && req.user._id) {
      updateData.userId = req.user._id;
    }

    const trip = await Trip.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      updateData,
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

// @desc    Get all trips saved by the logged-in user
// @route   GET /api/trips/user/my-trips
// @access  Private
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error(`Error fetching user trips: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching user trips' });
  }
};

// @desc    Delete a saved trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Verify ownership
    if (trip.userId && trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await Trip.deleteOne({ _id: req.params.id });
    res.json({ message: 'Trip deleted successfully', id: req.params.id });
  } catch (error) {
    console.error(`Error deleting trip: ${error.message}`);
    res.status(500).json({ message: 'Server error deleting trip' });
  }
};

module.exports = {
  createTrip,
  getTripBySessionId,
  updateTrip,
  getMyTrips,
  deleteTrip,
};
