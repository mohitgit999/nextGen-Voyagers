// server/controllers/locationController.js
// Online geocoding and location search with Google Geocoding, Photon, and Nominatim
const axios = require('axios');

// In-memory cache for location queries (1 hour TTL)
const locationCache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCached(key) {
  const cached = locationCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  locationCache.delete(key);
  return null;
}

function setCached(key, data) {
  locationCache.set(key, { data, timestamp: Date.now() });
  // Limit cache size
  if (locationCache.size > 500) {
    const oldestKey = locationCache.keys().next().value;
    locationCache.delete(oldestKey);
  }
}

// @desc    Search and autocomplete locations worldwide
// @route   GET /api/location/search?q=...
// @access  Public
const searchLocations = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query || query.length < 2) {
      return res.json({ success: true, results: [] });
    }

    const cacheKey = `loc_${query.toLowerCase()}`;
    const cachedResults = getCached(cacheKey);
    if (cachedResults) {
      return res.json({ success: true, source: 'cached', results: cachedResults });
    }

    let results = [];

    // 0. Try Google Maps Geocoding API if GOOGLE_MAPS_API_KEY is configured
    if (process.env.GOOGLE_MAPS_API_KEY) {
      try {
        const googleRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: query,
            key: process.env.GOOGLE_MAPS_API_KEY
          },
          timeout: 4500
        });

        if (googleRes.data && googleRes.data.status === 'OK' && Array.isArray(googleRes.data.results) && googleRes.data.results.length) {
          results = googleRes.data.results.slice(0, 6).map(item => {
            const comps = item.address_components || [];
            const cityComp = comps.find(c => c.types.includes('locality')) || 
                             comps.find(c => c.types.includes('administrative_area_level_2')) ||
                             comps.find(c => c.types.includes('postal_town'));
            const stateComp = comps.find(c => c.types.includes('administrative_area_level_1'));
            const countryComp = comps.find(c => c.types.includes('country'));

            const name = cityComp ? cityComp.long_name : item.formatted_address.split(',')[0];
            const state = stateComp ? stateComp.long_name : '';
            const country = countryComp ? countryComp.long_name : '';

            let shortName = name;
            if (state && state !== name) shortName += `, ${state}`;

            return {
              name,
              state,
              country,
              shortName,
              fullName: item.formatted_address,
              lat: item.geometry && item.geometry.location ? item.geometry.location.lat : null,
              lon: item.geometry && item.geometry.location ? item.geometry.location.lng : null
            };
          });
        }
      } catch (googleErr) {
        console.warn('Google Maps geocode failed, falling back to Photon/Nominatim:', googleErr.message);
      }
    }

    // 1. Try Photon Geocoding API (fastest, optimized for autocomplete worldwide)
    if (!results.length) {
      try {
        const photonRes = await axios.get('https://photon.komoot.io/api/', {
          params: { q: query, limit: 6 },
          timeout: 4500
        });

        if (photonRes.data && Array.isArray(photonRes.data.features) && photonRes.data.features.length) {
          results = photonRes.data.features.map(f => {
            const p = f.properties || {};
            const name = p.name || p.city || p.county || '';
            const state = p.state || '';
            const country = p.country || '';
            
            let shortName = name;
            if (state && state !== name) shortName += `, ${state}`;

            let fullName = name;
            if (state && state !== name) fullName += `, ${state}`;
            if (country) fullName += `, ${country}`;

            return {
              name,
              state,
              country,
              shortName,
              fullName,
              lat: f.geometry && f.geometry.coordinates ? f.geometry.coordinates[1] : null,
              lon: f.geometry && f.geometry.coordinates ? f.geometry.coordinates[0] : null
            };
          }).filter(r => r.name);
        }
      } catch (photonErr) {
        console.warn('Photon location search failed, falling back to Nominatim:', photonErr.message);
      }
    }

    // 2. Fallback to Nominatim OpenStreetMap if Photon returned no results
    if (!results.length) {
      try {
        const nomRes = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 6
          },
          headers: {
            'User-Agent': 'NextGenVoyagers/1.0',
            'Accept-Language': 'en'
          },
          timeout: 4500
        });

        if (Array.isArray(nomRes.data) && nomRes.data.length) {
          results = nomRes.data.map(item => {
            const addr = item.address || {};
            const name = item.name || addr.city || addr.town || addr.village || addr.county || item.display_name.split(',')[0];
            const state = addr.state || '';
            const country = addr.country || '';

            let shortName = name;
            if (state && state !== name) shortName += `, ${state}`;

            return {
              name,
              state,
              country,
              shortName,
              fullName: item.display_name,
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon)
            };
          });
        }
      } catch (nomErr) {
        console.warn('Nominatim location search failed:', nomErr.message);
      }
    }

    if (results.length) {
      setCached(cacheKey, results);
    }

    return res.json({ success: true, source: 'live', results });
  } catch (error) {
    console.error('Location search controller error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to search location', results: [] });
  }
};

module.exports = { searchLocations };
