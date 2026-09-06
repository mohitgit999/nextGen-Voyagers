// server/routes/trips.js
const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTripBySessionId,
  updateTrip,
  getMyTrips,
  deleteTrip,
} = require('../controllers/tripController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/user/my-trips', protect, getMyTrips);
router.route('/')
  .post(optionalAuth, createTrip);

router.route('/:sessionId')
  .get(getTripBySessionId)
  .put(optionalAuth, updateTrip);

router.delete('/:id', protect, deleteTrip);

module.exports = router;
