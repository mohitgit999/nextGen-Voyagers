// server/controllers/weatherController.js
// Weather data from OpenWeatherMap + crowd intensity simulation
const axios = require('axios');

// Cache weather data for 30 minutes to stay within free tier limits
const weatherCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

function getCachedWeather(key) {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  weatherCache.delete(key);
  return null;
}

// @desc    Get current weather + 5-day forecast
// @route   GET /api/weather/:city
// @access  Public
const getWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
      // Return simulated weather as fallback
      return res.json({
        success: true,
        source: 'simulated',
        current: generateSimulatedWeather(city),
        forecast: generateSimulatedForecast(city)
      });
    }

    // Check cache
    const cacheKey = `weather_${city.toLowerCase()}`;
    const cached = getCachedWeather(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cached', ...cached });
    }

    // Fetch current weather
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&units=metric&appid=${apiKey}`
    );

    // Fetch 5-day forecast
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},IN&units=metric&cnt=40&appid=${apiKey}`
    );

    const current = {
      temp: Math.round(currentRes.data.main.temp),
      feelsLike: Math.round(currentRes.data.main.feels_like),
      humidity: currentRes.data.main.humidity,
      windSpeed: currentRes.data.wind.speed,
      description: currentRes.data.weather[0].description,
      icon: currentRes.data.weather[0].icon,
      condition: currentRes.data.weather[0].main,
      visibility: currentRes.data.visibility,
      uv: null // UV requires separate API call
    };

    // Process 5-day forecast into daily summaries
    const dailyMap = {};
    forecastRes.data.list.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { temps: [], conditions: [], icons: [] };
      }
      dailyMap[date].temps.push(entry.main.temp);
      dailyMap[date].conditions.push(entry.weather[0].main);
      dailyMap[date].icons.push(entry.weather[0].icon);
    });

    const forecast = Object.entries(dailyMap).slice(0, 5).map(([date, data]) => ({
      date,
      tempMin: Math.round(Math.min(...data.temps)),
      tempMax: Math.round(Math.max(...data.temps)),
      condition: mode(data.conditions),
      icon: mode(data.icons)
    }));

    const weatherData = { current, forecast };
    weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });

    res.json({ success: true, source: 'live', ...weatherData });

  } catch (error) {
    console.error('Weather API error:', error.message);
    // Fallback to simulated data
    res.json({
      success: true,
      source: 'simulated',
      current: generateSimulatedWeather(req.params.city),
      forecast: generateSimulatedForecast(req.params.city)
    });
  }
};

// @desc    Get crowd intensity estimation
// @route   GET /api/weather/:city/crowd
// @access  Public
const getCrowdIntensity = async (req, res) => {
  try {
    const { city } = req.params;
    const now = new Date();
    const month = now.toLocaleString('en', { month: 'short' });
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Destination-specific crowd patterns
    const peakMonths = {
      'Manali': ['May', 'Jun', 'Dec', 'Jan'],
      'Goa': ['Dec', 'Jan', 'Feb', 'Nov'],
      'Jaipur': ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      'Udaipur': ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      'Varanasi': ['Oct', 'Nov', 'Dec', 'Feb', 'Mar'],
      'Ladakh': ['Jun', 'Jul', 'Aug', 'Sep'],
      'Munnar': ['Sep', 'Oct', 'Nov', 'Dec'],
      'Coorg': ['Oct', 'Nov', 'Dec', 'Jan'],
      'Rishikesh': ['Sep', 'Oct', 'Nov', 'Feb', 'Mar'],
      'Andaman': ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
    };

    const cityPeaks = peakMonths[city] || ['Oct', 'Nov', 'Dec'];
    const isPeakSeason = cityPeaks.includes(month);

    // Base crowd level (0-100)
    let crowdScore = 35; // baseline

    // Season modifier
    if (isPeakSeason) crowdScore += 30;

    // Weekend modifier
    if (isWeekend) crowdScore += 15;

    // Time of day modifier
    const hourlyPattern = [
      10, 8, 5, 5, 5, 8,      // 0-5am: very low
      15, 25, 40, 60, 70, 75,  // 6-11am: rising
      65, 55, 50, 55, 65, 80,  // 12-5pm: afternoon dip then rise
      85, 75, 60, 45, 30, 18   // 6-11pm: evening peak then decline
    ];
    const timeModifier = hourlyPattern[hour] || 50;

    // Combine
    crowdScore = Math.round(crowdScore * (timeModifier / 60));
    crowdScore = Math.max(5, Math.min(95, crowdScore));

    // Generate hourly prediction for today
    const hourlyPrediction = hourlyPattern.map((base, h) => {
      let score = 35;
      if (isPeakSeason) score += 30;
      if (isWeekend) score += 15;
      score = Math.round(score * (base / 60));
      return {
        hour: h,
        label: `${h}:00`,
        intensity: Math.max(5, Math.min(95, score))
      };
    });

    // Determine level
    let level, color;
    if (crowdScore < 25) { level = 'Low'; color = '#1BB89A'; }
    else if (crowdScore < 50) { level = 'Medium'; color = '#F4A261'; }
    else if (crowdScore < 75) { level = 'High'; color = '#E76F51'; }
    else { level = 'Very High'; color = '#E63946'; }

    // Find best time to visit today
    const futureHours = hourlyPrediction.filter(h => h.hour >= hour);
    const quietest = futureHours.reduce((min, h) => h.intensity < min.intensity ? h : min, futureHours[0] || hourlyPrediction[0]);

    res.json({
      success: true,
      city,
      current: {
        score: crowdScore,
        level,
        color,
        isPeakSeason,
        isWeekend
      },
      bestTimeToday: `Around ${quietest.hour}:00 (${quietest.intensity}% intensity)`,
      peakMonths: cityPeaks,
      hourly: hourlyPrediction
    });

  } catch (error) {
    console.error('Crowd intensity error:', error.message);
    res.status(500).json({ message: 'Failed to estimate crowd intensity' });
  }
};

// ── Helpers ──

function mode(arr) {
  const freq = {};
  let maxFreq = 0, result = arr[0];
  arr.forEach(item => {
    freq[item] = (freq[item] || 0) + 1;
    if (freq[item] > maxFreq) { maxFreq = freq[item]; result = item; }
  });
  return result;
}

function generateSimulatedWeather(city) {
  const month = new Date().getMonth();
  // Rough seasonal temp for India
  const seasonal = [18, 20, 25, 30, 34, 33, 30, 29, 29, 27, 23, 19];
  const hillStations = ['Manali', 'Ladakh', 'Munnar', 'Coorg', 'Rishikesh'];
  const isHill = hillStations.some(h => city.toLowerCase().includes(h.toLowerCase()));
  const baseTemp = seasonal[month] - (isHill ? 12 : 0);

  const conditions = ['Clear', 'Clouds', 'Haze', 'Mist'];
  if (month >= 6 && month <= 8) conditions.push('Rain', 'Rain');

  return {
    temp: baseTemp + Math.round(Math.random() * 4 - 2),
    feelsLike: baseTemp + Math.round(Math.random() * 3),
    humidity: 45 + Math.round(Math.random() * 30),
    windSpeed: 2 + Math.round(Math.random() * 8),
    description: conditions[Math.floor(Math.random() * conditions.length)].toLowerCase(),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    icon: '02d',
    visibility: 8000 + Math.round(Math.random() * 2000)
  };
}

function generateSimulatedForecast(city) {
  const days = [];
  const base = generateSimulatedWeather(city);
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      tempMin: base.temp - 3 - Math.round(Math.random() * 3),
      tempMax: base.temp + 3 + Math.round(Math.random() * 3),
      condition: ['Clear', 'Clouds', 'Haze'][Math.floor(Math.random() * 3)],
      icon: ['01d', '02d', '03d'][Math.floor(Math.random() * 3)]
    });
  }
  return days;
}

module.exports = {
  getWeather,
  getCrowdIntensity
};
