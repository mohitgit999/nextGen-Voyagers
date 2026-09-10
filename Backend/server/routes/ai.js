// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { generateItinerary, suggestHiddenGems, moodMatch, recommendDestinations } = require('../controllers/aiController');

router.post('/generate-itinerary', generateItinerary);
router.post('/suggest-hidden-gems', suggestHiddenGems);
router.post('/mood-match', moodMatch);
router.post('/recommend-destinations', recommendDestinations);

module.exports = router;
