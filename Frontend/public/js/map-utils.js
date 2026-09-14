'use strict';

/* ============================================================
   VOYAGER — Map Utilities (Leaflet.js)
   Interactive maps for destination detail and itinerary views
   ============================================================ */

var voyagerMaps = {};

/* ── Extensive Indian Coordinates Database ── */
var INDIA_COORDINATES_DB = {
  // Hill Stations & North
  'manali': { lat: 32.2396, lon: 77.1887 },
  'shimla': { lat: 31.1048, lon: 77.1734 },
  'dharamshala': { lat: 32.2190, lon: 76.3234 },
  'mcleodganj': { lat: 32.2426, lon: 76.3213 },
  'kasol': { lat: 32.0100, lon: 77.3150 },
  'spiti': { lat: 32.2461, lon: 78.0349 },
  'kaza': { lat: 32.2276, lon: 78.0710 },
  'kullu': { lat: 31.9579, lon: 77.1095 },
  'dalhousie': { lat: 32.5387, lon: 75.9710 },
  'bir': { lat: 32.0469, lon: 76.7214 },
  'birbilling': { lat: 32.0469, lon: 76.7214 },
  'jibhi': { lat: 31.6366, lon: 77.3486 },
  'tirthan': { lat: 31.6420, lon: 77.3400 },
  'kinnaur': { lat: 31.6510, lon: 78.4752 },
  'kalpa': { lat: 31.5369, lon: 78.2562 },
  'sangla': { lat: 31.4243, lon: 78.2618 },
  'chitkul': { lat: 31.3533, lon: 78.4357 },
  'kasauli': { lat: 30.9013, lon: 76.9649 },

  // Uttarakhand
  'rishikesh': { lat: 30.0869, lon: 78.2676 },
  'haridwar': { lat: 29.9457, lon: 78.1642 },
  'dehradun': { lat: 30.3165, lon: 78.0322 },
  'mussoorie': { lat: 30.4598, lon: 78.0644 },
  'nainital': { lat: 29.3919, lon: 79.4542 },
  'auli': { lat: 30.5317, lon: 79.5694 },
  'chopta': { lat: 30.4879, lon: 79.1764 },
  'kedarnath': { lat: 30.7346, lon: 79.0669 },
  'badrinath': { lat: 30.7433, lon: 79.4938 },
  'uttarkashi': { lat: 30.7268, lon: 78.4354 },
  'almora': { lat: 29.5971, lon: 79.6591 },
  'ranikhet': { lat: 29.6434, lon: 79.4322 },
  'lansdowne': { lat: 29.8377, lon: 78.6871 },
  'mukteshwar': { lat: 29.4722, lon: 79.6479 },
  'kausani': { lat: 29.8543, lon: 79.5967 },
  'jimcorbett': { lat: 29.5300, lon: 78.7747 },
  'corbett': { lat: 29.5300, lon: 78.7747 },

  // Rajasthan
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'udaipur': { lat: 24.5854, lon: 73.7125 },
  'jodhpur': { lat: 26.2389, lon: 73.0243 },
  'jaisalmer': { lat: 26.9157, lon: 70.9083 },
  'pushkar': { lat: 26.4897, lon: 74.5511 },
  'ajmer': { lat: 26.4499, lon: 74.6399 },
  'bikaner': { lat: 28.0229, lon: 73.3119 },
  'mountabu': { lat: 24.5926, lon: 72.7156 },
  'ranthambore': { lat: 26.0173, lon: 76.5026 },
  'chittorgarh': { lat: 24.8887, lon: 74.6269 },
  'bundi': { lat: 25.4415, lon: 75.6441 },
  'alwar': { lat: 27.5530, lon: 76.6346 },
  'bharatpur': { lat: 27.2152, lon: 77.5030 },

  // Goa & Coastal
  'goa': { lat: 15.2993, lon: 74.1240 },
  'northgoa': { lat: 15.5494, lon: 73.7535 },
  'southgoa': { lat: 15.2736, lon: 73.9582 },
  'panaji': { lat: 15.4909, lon: 73.8278 },
  'calangute': { lat: 15.5439, lon: 73.7554 },
  'anjuna': { lat: 15.5733, lon: 73.7410 },
  'arambol': { lat: 15.6853, lon: 73.7042 },
  'palolem': { lat: 15.0100, lon: 74.0232 },
  'gokarna': { lat: 14.5479, lon: 74.3188 },
  'tarkarli': { lat: 16.0336, lon: 73.4912 },

  // Karnataka
  'coorg': { lat: 12.4244, lon: 75.7382 },
  'madikeri': { lat: 12.4244, lon: 75.7382 },
  'mysore': { lat: 12.2958, lon: 76.6394 },
  'mysuru': { lat: 12.2958, lon: 76.6394 },
  'hampi': { lat: 15.3350, lon: 76.4600 },
  'chikmagalur': { lat: 13.3161, lon: 75.7720 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'bengaluru': { lat: 12.9716, lon: 77.5946 },
  'dandeli': { lat: 15.2407, lon: 74.6225 },
  'badami': { lat: 15.9189, lon: 75.6766 },
  'kabini': { lat: 11.9261, lon: 76.2711 },
  'bandipur': { lat: 11.6664, lon: 76.6291 },
  'nagarhole': { lat: 12.0314, lon: 76.1207 },
  'udupi': { lat: 13.3409, lon: 74.7421 },
  'mangalore': { lat: 12.9141, lon: 74.8560 },
  'murudeshwar': { lat: 14.0940, lon: 74.4899 },
  'sakleshpur': { lat: 12.9442, lon: 75.7856 },

  // Kerala
  'munnar': { lat: 10.0889, lon: 77.0595 },
  'alleppey': { lat: 9.4981, lon: 76.3388 },
  'alappuzha': { lat: 9.4981, lon: 76.3388 },
  'kochi': { lat: 9.9312, lon: 76.2673 },
  'cochin': { lat: 9.9312, lon: 76.2673 },
  'wayanad': { lat: 11.6854, lon: 76.1320 },
  'thekkady': { lat: 9.6031, lon: 77.1615 },
  'varkala': { lat: 8.7379, lon: 76.7163 },
  'kovalam': { lat: 8.4004, lon: 76.9787 },
  'kumarakom': { lat: 9.6175, lon: 76.4301 },
  'bekal': { lat: 12.3926, lon: 75.0315 },
  'vagamon': { lat: 9.6869, lon: 76.9056 },
  'athirappilly': { lat: 10.2851, lon: 76.5698 },
  'poovar': { lat: 8.3188, lon: 77.0658 },
  'trivandrum': { lat: 8.5241, lon: 76.9366 },
  'thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },

  // Tamil Nadu
  'ooty': { lat: 11.4102, lon: 76.6950 },
  'kodaikanal': { lat: 10.2381, lon: 77.4892 },
  'coonoor': { lat: 11.3530, lon: 76.7959 },
  'yercaud': { lat: 11.7753, lon: 78.2093 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'madurai': { lat: 9.9252, lon: 78.1198 },
  'rameswaram': { lat: 9.2876, lon: 79.3129 },
  'kanyakumari': { lat: 8.0883, lon: 77.5385 },
  'pondicherry': { lat: 11.9416, lon: 79.8083 },
  'puducherry': { lat: 11.9416, lon: 79.8083 },
  'mahabalipuram': { lat: 12.6269, lon: 80.1927 },
  'thanjavur': { lat: 10.7870, lon: 79.1378 },
  'coimbatore': { lat: 11.0168, lon: 76.9558 },

  // Uttar Pradesh & Heritage
  'varanasi': { lat: 25.3176, lon: 83.0068 },
  'agra': { lat: 27.1767, lon: 78.0081 },
  'lucknow': { lat: 26.8467, lon: 80.9462 },
  'mathura': { lat: 27.4924, lon: 77.6737 },
  'vrindavan': { lat: 27.5806, lon: 77.7006 },
  'ayodhya': { lat: 26.7922, lon: 82.1998 },
  'prayagraj': { lat: 25.4358, lon: 81.8463 },
  'allahabad': { lat: 25.4358, lon: 81.8463 },
  'sarnath': { lat: 25.3811, lon: 83.0214 },
  'jhansi': { lat: 25.4484, lon: 78.5685 },

  // Punjab & Haryana
  'amritsar': { lat: 31.6340, lon: 74.8723 },
  'chandigarh': { lat: 30.7333, lon: 76.7794 },
  'patiala': { lat: 30.3398, lon: 76.3869 },

  // Ladakh & J&K
  'ladakh': { lat: 34.1526, lon: 77.5771 },
  'leh': { lat: 34.1526, lon: 77.5771 },
  'nubra': { lat: 34.6863, lon: 77.5673 },
  'pangong': { lat: 33.7595, lon: 78.6674 },
  'kargil': { lat: 34.5539, lon: 76.1349 },
  'srinagar': { lat: 34.0837, lon: 74.7973 },
  'gulmarg': { lat: 34.0484, lon: 74.3805 },
  'pahalgam': { lat: 34.0161, lon: 75.3150 },
  'sonamarg': { lat: 34.3050, lon: 75.2933 },
  'jammu': { lat: 32.7266, lon: 74.8570 },
  'katra': { lat: 32.9918, lon: 74.9317 },
  'patnitop': { lat: 33.0878, lon: 75.3285 },

  // East & North-East
  'darjeeling': { lat: 27.0410, lon: 88.2663 },
  'gangtok': { lat: 27.3389, lon: 88.6065 },
  'pelling': { lat: 27.3167, lon: 88.2333 },
  'lachung': { lat: 27.6891, lon: 88.7430 },
  'kalimpong': { lat: 27.0594, lon: 88.4695 },
  'kurseong': { lat: 26.8814, lon: 88.2778 },
  'mirik': { lat: 26.8913, lon: 88.1795 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'sundarbans': { lat: 21.9497, lon: 89.1833 },
  'digha': { lat: 21.6266, lon: 87.5074 },
  'shillong': { lat: 25.5788, lon: 91.8933 },
  'cherrapunji': { lat: 25.2986, lon: 91.7317 },
  'sohra': { lat: 25.2986, lon: 91.7317 },
  'dawki': { lat: 25.1878, lon: 92.0197 },
  'mawlynnong': { lat: 25.2016, lon: 91.9038 },
  'kaziranga': { lat: 26.5775, lon: 93.1711 },
  'guwahati': { lat: 26.1445, lon: 91.7362 },
  'majuli': { lat: 26.9500, lon: 94.2167 },
  'tawang': { lat: 27.5861, lon: 91.8594 },
  'ziro': { lat: 27.5950, lon: 93.8385 },
  'kohima': { lat: 25.6751, lon: 94.1086 },
  'dzukou': { lat: 25.5600, lon: 94.0700 },
  'imphal': { lat: 24.8170, lon: 93.9368 },
  'loktak': { lat: 24.5500, lon: 93.8000 },
  'aizawl': { lat: 23.7271, lon: 92.7176 },
  'agartala': { lat: 23.8315, lon: 91.2868 },

  // Islands
  'andaman': { lat: 11.6234, lon: 92.7265 },
  'portblair': { lat: 11.6234, lon: 92.7265 },
  'havelock': { lat: 11.9761, lon: 92.9876 },
  'swarajdweep': { lat: 11.9761, lon: 92.9876 },
  'neilisland': { lat: 11.8324, lon: 93.0519 },

  // Central India
  'bhopal': { lat: 23.2599, lon: 77.4126 },
  'indore': { lat: 22.7196, lon: 75.8577 },
  'ujjain': { lat: 23.1765, lon: 75.7885 },
  'gwalior': { lat: 26.2183, lon: 78.1828 },
  'orchha': { lat: 25.3519, lon: 78.6433 },
  'khajuraho': { lat: 24.8318, lon: 79.9199 },
  'pachmarhi': { lat: 22.4674, lon: 78.4346 },
  'jabalpur': { lat: 23.1815, lon: 79.9864 },
  'bhedaghat': { lat: 23.1311, lon: 79.8007 },
  'kanha': { lat: 22.3345, lon: 80.6115 },
  'bandhavgarh': { lat: 23.7226, lon: 81.0267 },
  'sanchi': { lat: 23.4854, lon: 77.7408 },
  'mandu': { lat: 22.3664, lon: 75.4044 },
  'maheshwar': { lat: 22.1769, lon: 75.5843 },

  // Maharashtra
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'lonavala': { lat: 18.7557, lon: 73.4091 },
  'khandala': { lat: 18.7610, lon: 73.3744 },
  'mahabaleshwar': { lat: 17.9307, lon: 73.6477 },
  'alibaug': { lat: 18.6584, lon: 72.8773 },
  'matheran': { lat: 18.9866, lon: 73.2676 },
  'panchgani': { lat: 17.9237, lon: 73.8007 },
  'shirdi': { lat: 19.7645, lon: 74.4772 },
  'aurangabad': { lat: 19.8762, lon: 75.3433 },
  'nashik': { lat: 19.9975, lon: 73.7898 },
  'ajanta': { lat: 20.5519, lon: 75.7033 },
  'ellora': { lat: 20.0268, lon: 75.1792 },

  // Gujarat
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'kutch': { lat: 23.7337, lon: 69.8597 },
  'rannofkutch': { lat: 23.7337, lon: 69.8597 },
  'gir': { lat: 21.1245, lon: 70.8242 },
  'somnath': { lat: 20.8880, lon: 70.4012 },
  'dwarka': { lat: 22.2442, lon: 68.9685 },
  'saputara': { lat: 20.5794, lon: 73.7497 },
  'vadodara': { lat: 22.3072, lon: 73.1812 },
  'surat': { lat: 21.1702, lon: 72.8311 },

  // South & East Central
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'vizag': { lat: 17.6868, lon: 83.2185 },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'araku': { lat: 18.3273, lon: 82.8775 },
  'tirupati': { lat: 13.6288, lon: 79.4192 },
  'vijayawada': { lat: 16.5062, lon: 80.6480 },
  'gandikota': { lat: 14.8146, lon: 78.2863 },
  'warangal': { lat: 17.9689, lon: 79.5941 },
  'puri': { lat: 19.8135, lon: 85.8312 },
  'konark': { lat: 19.8876, lon: 86.0945 },
  'bhubaneswar': { lat: 20.2961, lon: 85.8245 },
  'chilika': { lat: 19.7164, lon: 85.3207 },
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'newdelhi': { lat: 28.6139, lon: 77.2090 },
  'patna': { lat: 25.5941, lon: 85.1376 },
  'bodhgaya': { lat: 24.6961, lon: 84.9869 },
  'nalanda': { lat: 25.1357, lon: 85.4439 },
  'rajgir': { lat: 25.0306, lon: 85.4206 },
  'ranchi': { lat: 23.3441, lon: 85.3096 },
  'netarhat': { lat: 23.4795, lon: 84.2646 },
  'deoghar': { lat: 24.4826, lon: 86.6974 },
  'raipur': { lat: 21.2514, lon: 81.6296 },
  'jagdalpur': { lat: 19.0740, lon: 82.0082 },
  'bastar': { lat: 19.0740, lon: 82.0082 },
  'chitrakote': { lat: 19.2081, lon: 81.7042 }
};

var STATE_COORDINATES_DB = {
  'himachal pradesh': { lat: 31.1048, lon: 77.1734 },
  'uttarakhand': { lat: 30.0668, lon: 79.0193 },
  'rajasthan': { lat: 27.0238, lon: 74.2179 },
  'goa': { lat: 15.2993, lon: 74.1240 },
  'kerala': { lat: 10.8505, lon: 76.2711 },
  'karnataka': { lat: 15.3173, lon: 75.7139 },
  'tamil nadu': { lat: 11.1271, lon: 78.6569 },
  'ladakh': { lat: 34.1526, lon: 77.5771 },
  'jammu and kashmir': { lat: 33.7782, lon: 76.5762 },
  'uttar pradesh': { lat: 26.8467, lon: 80.9462 },
  'madhya pradesh': { lat: 22.9734, lon: 78.6569 },
  'maharashtra': { lat: 19.7515, lon: 75.7139 },
  'west bengal': { lat: 22.9868, lon: 87.8550 },
  'sikkim': { lat: 27.5330, lon: 88.5122 },
  'meghalaya': { lat: 25.4670, lon: 91.3662 },
  'assam': { lat: 26.2006, lon: 92.9376 },
  'arunachal pradesh': { lat: 28.2180, lon: 94.7278 },
  'nagaland': { lat: 26.1584, lon: 94.5624 },
  'manipur': { lat: 24.6637, lon: 93.9063 },
  'mizoram': { lat: 23.1645, lon: 92.9376 },
  'tripura': { lat: 23.9408, lon: 91.9882 },
  'gujarat': { lat: 22.2587, lon: 71.1924 },
  'odisha': { lat: 20.9517, lon: 85.0985 },
  'andhra pradesh': { lat: 15.9129, lon: 79.7400 },
  'telangana': { lat: 18.1124, lon: 79.0193 },
  'bihar': { lat: 25.0961, lon: 85.3131 },
  'jharkhand': { lat: 23.6102, lon: 85.2799 },
  'chhattisgarh': { lat: 21.2787, lon: 81.8661 },
  'punjab': { lat: 31.1471, lon: 75.3412 },
  'haryana': { lat: 29.0588, lon: 76.0856 },
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'andaman': { lat: 11.6234, lon: 92.7265 }
};

/* ── Synchronously find coordinates for destination ── */
function resolveDestinationCoordinates(dest) {
  if (!dest) return null;
  if (dest.coordinates && typeof dest.coordinates.lat === 'number' && !isNaN(dest.coordinates.lat) && typeof dest.coordinates.lon === 'number' && !isNaN(dest.coordinates.lon)) {
    return dest.coordinates;
  }

  var key = String(dest.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (INDIA_COORDINATES_DB[key]) {
    return INDIA_COORDINATES_DB[key];
  }

  // Substring match in keys
  for (var k in INDIA_COORDINATES_DB) {
    if (key.indexOf(k) !== -1 || k.indexOf(key) !== -1) {
      return INDIA_COORDINATES_DB[k];
    }
  }

  // State-level match
  var stateKey = String(dest.state || '').toLowerCase().trim();
  if (STATE_COORDINATES_DB[stateKey]) {
    return STATE_COORDINATES_DB[stateKey];
  }
  for (var sk in STATE_COORDINATES_DB) {
    if (stateKey.indexOf(sk) !== -1 || sk.indexOf(stateKey) !== -1) {
      return STATE_COORDINATES_DB[sk];
    }
  }

  return null;
}

/* ── Asynchronously resolve destination coordinates with Nominatim fallback ── */
function resolveDestinationCoordinatesAsync(dest) {
  var direct = resolveDestinationCoordinates(dest);
  if (direct) {
    dest.coordinates = direct;
    return Promise.resolve(direct);
  }

  return geocodePlace(dest.name, '', dest.state).then(function(coords) {
    if (coords && !isNaN(coords.lat) && !isNaN(coords.lon)) {
      dest.coordinates = coords;
      return coords;
    }
    // Final safe fallback: Central India
    var centerFallback = { lat: 20.5937, lon: 78.9629 };
    dest.coordinates = centerFallback;
    return centerFallback;
  }).catch(function() {
    var centerFallback = { lat: 20.5937, lon: 78.9629 };
    dest.coordinates = centerFallback;
    return centerFallback;
  });
}

/* ── Initialize a Leaflet map ── */
function initMap(containerId, lat, lon, zoom) {
  if (!window.L) {
    console.warn('Leaflet not loaded — map features unavailable');
    return null;
  }

  // Destroy existing map instance if any
  if (voyagerMaps[containerId]) {
    try {
      voyagerMaps[containerId].remove();
    } catch (e) {
      console.warn('Could not remove previous map:', e);
    }
    delete voyagerMaps[containerId];
  }

  var containerEl = document.getElementById(containerId);
  if (!containerEl) return null;

  // Clear any placeholder/spinner innerHTML before Leaflet takes over
  containerEl.innerHTML = '';

  var map = L.map(containerId, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([lat, lon], zoom || 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  voyagerMaps[containerId] = map;

  // Multiple invalidateSize passes to prevent gray tiles
  setTimeout(function() { if (map) map.invalidateSize(); }, 150);
  setTimeout(function() { if (map) map.invalidateSize(); }, 400);
  setTimeout(function() { if (map) map.invalidateSize(); }, 1000);

  return map;
}

/* ── Custom marker icons ── */
function getMarkerIcon(type) {
  if (!window.L) return null;
  var colors = {
    destination: '#1BB89A',
    heritage:    '#E76F51',
    adventure:   '#F4A261',
    nature:      '#2A9D8F',
    beach:       '#00B4D8',
    spiritual:   '#9B5DE5',
    scenic:      '#06D6A0',
    culture:     '#FF6B6B',
    wildlife:    '#52B788',
    food:        '#F77F00',
    landmark:    '#4361EE',
    island:      '#0077B6',
    curiosity:   '#E9C46A',
    origin:      '#264653',
    'hidden-gem':'#FFD700',
    default:     '#577590'
  };

  var color = colors[type] || colors.default;

  return L.divIcon({
    className: 'voyager-marker',
    html: '<div style="background:' + color + ';width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">' +
          '<div style="width:8px;height:8px;background:white;border-radius:50%;"></div></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

/* ── Geocode a place name via Nominatim (returns a promise) ── */
function geocodePlace(name, destName, destState) {
  var query = name + (destName ? ', ' + destName : '') + (destState ? ', ' + destState : '') + ', India';
  var url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query);
  return fetch(url, { headers: { 'Accept-Language': 'en' } })
    .then(function(r) { return r.json(); })
    .then(function(results) {
      if (results && results[0]) {
        return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
      }
      return null;
    })
    .catch(function() { return null; });
}

/* ── Add a single marker with optional geocoding fallback ── */
function addMapMarker(map, name, lat, lon, type, popupHtml, geocodeName, destName, destState) {
  if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
    var marker = L.marker([lat, lon], { icon: getMarkerIcon(type) }).addTo(map);
    marker.bindPopup(popupHtml);
    return;
  }
  // Real geocoding via Nominatim
  geocodePlace(geocodeName || name, destName, destState).then(function(coords) {
    if (coords && map) {
      var marker = L.marker([coords.lat, coords.lon], { icon: getMarkerIcon(type) }).addTo(map);
      marker.bindPopup(popupHtml);
    }
  });
}

/* ── Safely pan map to spot from chip clicks ── */
window.panMapToSpot = function(containerId, lat, lon, name) {
  var map = voyagerMaps[containerId];
  if (!map) return;
  if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
    map.setView([lat, lon], 14, { animate: true });
  } else {
    geocodePlace(name).then(function(coords) {
      if (coords && map) {
        map.setView([coords.lat, coords.lon], 14, { animate: true });
      }
    });
  }
};

/* ── Render destination detail map ── */
function renderDestinationMap(containerId, dest, originLat, originLon) {
  if (!dest) return;
  var container = document.getElementById(containerId);
  if (!container) return;

  // Check if coordinates exist or can be resolved synchronously
  var coords = resolveDestinationCoordinates(dest);

  if (!coords) {
    // Show loading state while asynchronously geocoding
    container.innerHTML = '<div style="height:100%;min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(15,23,42,0.6);border-radius:12px;color:#94A3B8;gap:12px;padding:24px;text-align:center;">' +
      '<div style="width:36px;height:36px;border:3px solid rgba(16,185,129,0.2);border-top-color:#10B981;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
      '<div style="font-weight:700;color:#F8FAFC;font-size:0.95rem;">Locating ' + (dest.name || 'destination') + ' on satellite map...</div>' +
      '<div style="font-size:0.82rem;color:#94A3B8;">Resolving GPS coordinates & regional points of interest</div>' +
    '</div>';

    resolveDestinationCoordinatesAsync(dest).then(function(resolvedCoords) {
      dest.coordinates = resolvedCoords;
      renderDestinationMap(containerId, dest, originLat, originLon);
    });
    return;
  }

  // Ensure dest has coordinates assigned
  dest.coordinates = coords;

  var map = initMap(containerId, coords.lat, coords.lon, 11);
  if (!map) return;

  // Main destination marker
  var destPopup = '<strong>' + dest.name + '</strong><br><em>' + (dest.state || 'India') + '</em>' +
    '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(dest.name + ', ' + (dest.state || 'India')) +
    '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Google Maps ↗</a>';
  L.marker([coords.lat, coords.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map).bindPopup(destPopup);

  // Nearby attractions — use real lat/lon from data, or offset from center
  if (dest.nearbyAttractions && Array.isArray(dest.nearbyAttractions)) {
    dest.nearbyAttractions.forEach(function(a, idx) {
      var aLat = (typeof a.lat === 'number' && !isNaN(a.lat)) ? a.lat : (coords.lat + ((idx + 1) * 0.012 * (idx % 2 === 0 ? 1 : -1)));
      var aLon = (typeof a.lon === 'number' && !isNaN(a.lon)) ? a.lon : (coords.lon + ((idx + 1) * 0.014 * (idx % 3 === 0 ? 1 : -1)));
      a.lat = aLat;
      a.lon = aLon;

      var popup = '<strong>' + a.name + '</strong>' +
        (a.type ? '<br><em>' + a.type + '</em>' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(a.name + ', ' + dest.name + ', ' + (dest.state || 'India')) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, a.name, aLat, aLon, a.type || 'landmark', popup, a.name, dest.name, dest.state);
    });
  }

  // Hidden gems — use real lat/lon from data, or offset from center
  if (dest.hiddenGems && Array.isArray(dest.hiddenGems)) {
    dest.hiddenGems.forEach(function(g, idx) {
      var gLat = (typeof g.lat === 'number' && !isNaN(g.lat)) ? g.lat : (coords.lat + ((idx + 1) * -0.016 * (idx % 2 === 0 ? 1 : -1)));
      var gLon = (typeof g.lon === 'number' && !isNaN(g.lon)) ? g.lon : (coords.lon + ((idx + 1) * -0.018 * (idx % 3 === 0 ? 1 : -1)));
      g.lat = gLat;
      g.lon = gLon;

      var popup = '<strong>💎 ' + g.name + '</strong>' +
        (g.description ? '<br>' + g.description.substring(0, 80) + '...' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(g.name + ', ' + dest.name + ', ' + (dest.state || 'India')) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, g.name, gLat, gLon, 'hidden-gem', popup, g.name, dest.name, dest.state);
    });
  }

  // Origin marker and route line
  if (originLat && originLon && typeof originLat === 'number' && typeof originLon === 'number') {
    L.marker([originLat, originLon], {
      icon: getMarkerIcon('origin')
    }).addTo(map).bindPopup('<strong>📍 Your starting point</strong>');

    L.polyline([
      [originLat, originLon],
      [coords.lat, coords.lon]
    ], {
      color: '#1BB89A',
      weight: 2,
      dashArray: '8, 8',
      opacity: 0.7
    }).addTo(map);

    try {
      map.fitBounds([
        [originLat, originLon],
        [coords.lat, coords.lon]
      ], { padding: [40, 40] });
    } catch (e) {
      // Fallback setView
      map.setView([coords.lat, coords.lon], 11);
    }
  }

  return map;
}

/* ── Render itinerary day map ── */
function renderDayMap(containerId, dest, dayActivities) {
  if (!dest) return;
  var coords = resolveDestinationCoordinates(dest);
  if (!coords) return;
  dest.coordinates = coords;

  var map = initMap(containerId, coords.lat, coords.lon, 12);
  if (!map) return;

  // Main destination marker
  L.marker([coords.lat, coords.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map).bindPopup('<strong>' + dest.name + '</strong><br><em>' + (dest.state || 'India') + '</em>');

  // Nearby attractions with real coordinates
  if (dest.nearbyAttractions && Array.isArray(dest.nearbyAttractions)) {
    dest.nearbyAttractions.forEach(function(a) {
      var aLat = (typeof a.lat === 'number') ? a.lat : coords.lat;
      var aLon = (typeof a.lon === 'number') ? a.lon : coords.lon;
      var popup = '<strong>' + a.name + '</strong>' +
        (a.type ? '<br><em>' + a.type + '</em>' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(a.name + ', ' + dest.name) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, a.name, aLat, aLon, a.type || 'landmark', popup, a.name, dest.name, dest.state);
    });
  }

  return map;
}

// Window resize listener to keep Leaflet maps responsive
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('resize', function() {
    for (var k in voyagerMaps) {
      if (voyagerMaps[k] && typeof voyagerMaps[k].invalidateSize === 'function') {
        voyagerMaps[k].invalidateSize();
      }
    }
  });
}

