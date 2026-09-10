// server/controllers/aiController.js
// AI-powered itinerary generation using Google Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

let genAI = null;

function initGemini() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn('⚠️  GEMINI_API_KEY not set — AI features will use fallback logic.');
    return false;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return true;
}

async function generateWithFallback(prompt) {
  if (!initGemini()) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-flash-latest'
  ].filter(Boolean);

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const generativeModel = genAI.getGenerativeModel({ model: modelName });
      const result = await generativeModel.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini model ${modelName} failed:`, err.message);
      lastError = err;
    }
  }
  throw lastError || new Error('All candidate Gemini models failed to generate content');
}

// @desc    Generate AI-powered day-by-day itinerary
// @route   POST /api/ai/generate-itinerary
// @access  Public
const generateItinerary = async (req, res) => {
  try {
    const { destination, state: destState, duration, budget, group, travelers, moods, origin } = req.body;

    if (!destination || !duration || !budget) {
      return res.status(400).json({ message: 'Missing required fields: destination, duration, budget' });
    }

    if (!initGemini()) {
      return res.status(503).json({ message: 'AI not configured', fallback: true });
    }

    const moodStr = (moods && moods.length) ? moods.join(', ') : 'general sightseeing';
    const budgetLabel = { budget: '₹1,000-1,500/day', mid: '₹2,500-4,000/day', luxury: '₹6,000+/day' };

    const prompt = `You are a professional Indian travel planner. Create a detailed ${duration}-day itinerary for ${destination}, ${destState || 'India'}.

TRAVELER PROFILE:
- Group: ${group} (${travelers} traveler${travelers > 1 ? 's' : ''})
- Budget: ${budgetLabel[budget] || budget} per person per day
- Starting from: ${origin || 'not specified'}
- Mood/Interests: ${moodStr}

GENERATE a JSON response with this exact structure:
{
  "title": "Trip title with emoji",
  "summary": "1-2 line trip summary",
  "days": [
    {
      "day": 1,
      "theme": "Day theme",
      "morning": { "activity": "description", "location": "place name", "tip": "insider tip" },
      "afternoon": { "activity": "description", "location": "place name", "tip": "insider tip" },
      "evening": { "activity": "description", "location": "place name", "tip": "insider tip" },
      "budget": { "stay": 800, "food": 500, "transport": 300, "activities": 400 },
      "safetyTip": "safety advice for the day",
      "culturalNote": "local custom or cultural insight",
      "hiddenGem": "off-the-beaten-path suggestion",
      "crowdLevel": "low/medium/high",
      "bestTimeToVisit": "early morning before 9am"
    }
  ],
  "packingSuggestions": ["item1", "item2"],
  "culturalHighlights": ["highlight1", "highlight2"],
  "hiddenGems": [
    { "name": "place name", "description": "why it's special", "bestFor": "photography" }
  ],
  "emergencyInfo": {
    "nearestHospital": "name",
    "policeStation": "name",
    "touristHelpline": "number"
  }
}

IMPORTANT RULES:
- Budget values must be realistic for ${destination} in INR (₹)
- Include at least 2 hidden gems across the trip
- Cultural notes should be authentic and respectful
- Safety tips should be practical and location-specific
- Activities must match the traveler's mood: ${moodStr}
- For heritage/culture mood: include historical sites, museums, local artisan workshops
- For hidden gems mood: focus on lesser-known spots that locals love
- For adventure mood: include trekking, water sports, outdoor activities
- For food mood: include local food walks, street food spots, authentic restaurants
- Return ONLY the JSON, no markdown formatting or code blocks`;

    const responseText = await generateWithFallback(prompt);

    // Parse JSON from response (handle markdown code blocks)
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const itinerary = JSON.parse(jsonStr);
    res.json({ success: true, itinerary, source: 'ai' });

  } catch (error) {
    console.error('AI itinerary generation error:', error.message);

    // If it's a JSON parse error, still try to return partial data
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message: 'AI generated invalid response',
        fallback: true,
        error: error.message
      });
    }

    res.status(500).json({
      message: 'AI generation failed',
      fallback: true,
      error: error.message
    });
  }
};

// @desc    Get AI-powered hidden gem suggestions
// @route   POST /api/ai/suggest-hidden-gems
// @access  Public
const suggestHiddenGems = async (req, res) => {
  try {
    const { destination, state: destState, moods } = req.body;

    if (!initGemini()) {
      return res.status(503).json({ message: 'AI not configured', fallback: true });
    }

    const moodStr = (moods && moods.length) ? moods.join(', ') : 'general exploration';

    const prompt = `You are an expert local guide for ${destination}, ${destState || 'India'}. 
    
Suggest 5 hidden gem locations that most tourists miss. The traveler's interests are: ${moodStr}.

Return ONLY a JSON array:
[
  {
    "name": "Place Name",
    "description": "Why it's special (2-3 sentences)",
    "bestFor": "photography/peace/adventure/food/culture",
    "crowdLevel": "low/medium",
    "bestTime": "early morning",
    "estimatedCost": "Free/₹100-200"
  }
]

Return ONLY the JSON, no markdown.`;

    const responseText = await generateWithFallback(prompt);

    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    const gems = JSON.parse(jsonStr);
    res.json({ success: true, gems });

  } catch (error) {
    console.error('Hidden gems error:', error.message);
    res.status(500).json({ message: 'Failed to get hidden gems', fallback: true });
  }
};

// @desc    AI mood-match destinations
// @route   POST /api/ai/mood-match
// @access  Public
const moodMatch = async (req, res) => {
  try {
    const { moods, destinations } = req.body;

    if (!initGemini()) {
      return res.status(503).json({ message: 'AI not configured', fallback: true });
    }

    const destNames = destinations.map(d => d.name).join(', ');
    const moodStr = moods.join(', ');

    const prompt = `Given these Indian destinations: ${destNames}
And a traveler interested in: ${moodStr}

Rank the destinations from best to worst match. Return ONLY a JSON array of destination names in order:
["best match", "second best", ...]

Return ONLY the JSON, no markdown.`;

    const responseText = await generateWithFallback(prompt);

    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    const ranking = JSON.parse(jsonStr);
    res.json({ success: true, ranking });

  } catch (error) {
    console.error('Mood match error:', error.message);
    res.status(500).json({ message: 'Mood matching failed', fallback: true });
  }
};

// @desc    Find AI destinations for a state, exact place, or travel vibe
// @route   POST /api/ai/recommend-destinations
// @access  Public
const recommendDestinations = async (req, res) => {
  try {
    const {
      query,
      moods = [],
      duration,
      budget,
      group,
      travelers,
      origin
    } = req.body;

    if (!initGemini()) {
      return res.status(503).json({ message: 'AI recommendations are not configured' });
    }

    const moodText = moods.length ? moods.join(', ') : 'no specific mood; choose broadly suitable experiences';
    const prompt = `You are a live-data travel discovery engine for India. Recommend destinations based on the traveler input below.

INPUT:
- Search text: ${query || 'none'}
- Moods: ${moodText}
- Trip length: ${duration || 4} days
- Budget tier: ${budget || 'mid'}
- Group: ${group || 'not specified'} (${travelers || 1} travelers)
- Origin: ${origin || 'not specified'}

RULES:
- If Search text is an Indian state name, return 5-8 famous destinations within that state.
- If Search text is a place name, put that exact place first, then return 4-6 nearby or vibe-similar places.
- If Search text is empty, rank 6-8 destinations by the selected moods. Match the mood strongly.
- Do not invent a place, state, rating, price, weather, or safety claim. Use current reputable knowledge and clearly mark uncertain fields.
- Return only destinations relevant to India and do not return generic travel advice.

Return ONLY valid JSON in this exact shape:
{
  "mode": "state|place|mood",
  "summary": "short explanation of how the results were selected",
  "destinations": [
    {
      "name": "string",
      "state": "string",
      "isExactMatch": true,
      "isPrimary": true,
      "whyMatched": "string",
      "blurb": "string",
      "tags": ["string"],
      "vibes": ["string"],
      "rating": 0,
      "estimatedDailyCost": { "budget": 0, "mid": 0, "luxury": 0 },
      "safetyScore": 0,
      "weather": { "min": 0, "max": 0, "condition": "string", "bestTime": "string" },
      "liveDataQuery": "city name for live weather lookup"
    }
  ]
}`;

    const responseText = await generateWithFallback(prompt);
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = (jsonMatch ? jsonMatch[1] : responseText).trim();
    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed.destinations) || !parsed.destinations.length) {
      return res.status(502).json({ message: 'AI returned no destinations' });
    }

    const destinations = await Promise.all(parsed.destinations.slice(0, 8).map(async (item, index) => {
      const name = String(item.name || '').trim();
      const weather = await fetchLiveWeather(item.liveDataQuery || name);
      const costs = item.estimatedDailyCost || {};
      const min = Number(item.weather && item.weather.min) || 0;
      const max = Number(item.weather && item.weather.max) || 0;
      const liveMin = weather.source === 'live' ? weather.temp : min;
      const liveMax = weather.source === 'live' ? weather.temp : max;
      return {
        id: `ai-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${index}`,
        name,
        state: String(item.state || 'India'),
        tags: Array.isArray(item.tags) ? item.tags.slice(0, 5) : [],
        vibes: Array.isArray(item.vibes) ? item.vibes.slice(0, 6) : [],
        icon: 'map',
        emoji: '📍',
        rating: Number(item.rating) || 0,
        reviews: 0,
        blurb: String(item.blurb || item.whyMatched || ''),
        whyMatched: String(item.whyMatched || ''),
        isExactMatch: Boolean(item.isExactMatch),
        isPrimary: Boolean(item.isPrimary),
        bestFor: [],
        cost: {
          budget: Number(costs.budget) || 0,
          mid: Number(costs.mid) || 0,
          luxury: Number(costs.luxury) || 0
        },
        safety: { score: Math.max(0, Math.min(5, Number(item.safetyScore) || 0)), points: [] },
        weather: {
          temp: { min: liveMin, max: liveMax },
          condition: weather.source === 'live' ? weather.condition : String((item.weather && item.weather.condition) || 'Unavailable'),
          best: [],
          avoid: [],
          note: String((item.weather && item.weather.bestTime) || '')
        },
        liveWeather: weather,
        coordinates: weather.coordinates || null,
        hiddenGems: [],
        dayThemes: ['AI-curated arrival and orientation'],
        activities: {
          morning: [`Explore ${name} with an AI-curated morning plan`],
          afternoon: [`Discover recommended experiences around ${name}`],
          evening: [`Enjoy a personalized evening in ${name}`]
        },
        transport: {
          train: { label: 'Live transport lookup', station: 'Details available in destination search' },
          flight: { label: 'Live airport lookup', airport: 'Details available in destination search' },
          road: { label: 'Live route lookup', note: 'Route details are generated for your origin' }
        },
        localEmergency: { police: 'Unavailable', hospital: 'Unavailable', tourist: 'Unavailable' },
        packingExtras: [],
        culture: null
      };
    }));

    res.json({ success: true, source: 'ai', mode: parsed.mode || 'mood', summary: parsed.summary || '', destinations });
  } catch (error) {
    console.error('AI destination recommendation error:', error.message);
    res.status(502).json({ message: 'AI destination recommendations failed', error: error.message });
  }
};

async function fetchLiveWeather(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE' || !city) {
    return { source: 'unavailable', city: city || null };
  }

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: `${city},IN`, units: 'metric', appid: apiKey },
      timeout: 6000
    });
    return {
      source: 'live',
      city: response.data.name,
      temp: Math.round(response.data.main.temp),
      condition: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      coordinates: { lat: response.data.coord.lat, lon: response.data.coord.lon }
    };
  } catch (error) {
    return { source: 'unavailable', city };
  }
}

module.exports = {
  generateItinerary,
  suggestHiddenGems,
  moodMatch,
  recommendDestinations
};
