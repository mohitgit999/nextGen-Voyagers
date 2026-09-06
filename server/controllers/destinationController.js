const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    console.error(`Error fetching destinations: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res) => {
  try {
    // Note: the model uses a string 'id' field, not just _id
    const destination = await Destination.findOne({ id: req.params.id });
    
    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ message: 'Destination not found' });
    }
  } catch (error) {
    console.error(`Error fetching destination: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
};
