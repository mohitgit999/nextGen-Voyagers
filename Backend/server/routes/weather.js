// server/routes/weather.js
const express = require('express');
const router = express.Router();
const { getWeather, getCrowdIntensity } = require('../controllers/weatherController');

router.get('/:city', getWeather);
router.get('/:city/crowd', getCrowdIntensity);

module.exports = router;
