// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { generateItinerary, suggestHiddenGems, moodMatch, recommendDestinations, getDestinationPhoto } = require('../controllers/aiController');

router.post('/generate-itinerary', generateItinerary);
router.post('/suggest-hidden-gems', suggestHiddenGems);
router.post('/mood-match', moodMatch);
router.post('/recommend-destinations', recommendDestinations);
router.get('/destination-photo', getDestinationPhoto);

module.exports = router;
