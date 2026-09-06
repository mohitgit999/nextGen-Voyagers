const express = require('express');
const router = express.Router();
const { createTrip, getTripBySessionId, updateTrip } = require('../controllers/tripController');

router.route('/').post(createTrip);
router.route('/:sessionId').get(getTripBySessionId).put(updateTrip);

module.exports = router;
