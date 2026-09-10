'use strict';

/* ============================================================
   VOYAGER — Map Utilities (Leaflet.js)
   Interactive maps for destination detail and itinerary views
   ============================================================ */

var voyagerMaps = {};

/* ── Initialize a Leaflet map ── */
function initMap(containerId, lat, lon, zoom) {
  if (!window.L) {
    console.warn('Leaflet not loaded — map features unavailable');
    return null;
  }

  // Destroy existing map instance if any
  if (voyagerMaps[containerId]) {
    voyagerMaps[containerId].remove();
    delete voyagerMaps[containerId];
  }

  var map = L.map(containerId, {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView([lat, lon], zoom || 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  voyagerMaps[containerId] = map;
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

/* ── Render destination detail map ── */
function renderDestinationMap(containerId, dest, originLat, originLon) {
  if (!dest || !dest.coordinates) return;

  var map = initMap(containerId, dest.coordinates.lat, dest.coordinates.lon, 11);
  if (!map) return;

  // Main destination marker
  var destPopup = '<strong>' + dest.name + '</strong><br><em>' + dest.state + '</em>' +
    '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(dest.name + ', ' + dest.state) +
    '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Google Maps ↗</a>';
  L.marker([dest.coordinates.lat, dest.coordinates.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map).bindPopup(destPopup);

  // Nearby attractions — use real lat/lon from data, geocode if missing
  if (dest.nearbyAttractions && Array.isArray(dest.nearbyAttractions)) {
    dest.nearbyAttractions.forEach(function(a) {
      var popup = '<strong>' + a.name + '</strong>' +
        (a.type ? '<br><em>' + a.type + '</em>' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(a.name + ', ' + dest.name + ', ' + dest.state) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, a.name, a.lat, a.lon, a.type || 'landmark', popup, a.name, dest.name, dest.state);
    });
  }

  // Hidden gems — use real lat/lon from data, geocode if missing
  if (dest.hiddenGems && Array.isArray(dest.hiddenGems)) {
    dest.hiddenGems.forEach(function(g) {
      var popup = '<strong>💎 ' + g.name + '</strong>' +
        (g.description ? '<br>' + g.description.substring(0, 80) + '...' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(g.name + ', ' + dest.name + ', ' + dest.state) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, g.name, g.lat, g.lon, 'hidden-gem', popup, g.name, dest.name, dest.state);
    });
  }

  // Origin marker and route line
  if (originLat && originLon) {
    L.marker([originLat, originLon], {
      icon: getMarkerIcon('origin')
    }).addTo(map).bindPopup('<strong>📍 Your starting point</strong>');

    L.polyline([
      [originLat, originLon],
      [dest.coordinates.lat, dest.coordinates.lon]
    ], {
      color: '#1BB89A',
      weight: 2,
      dashArray: '8, 8',
      opacity: 0.7
    }).addTo(map);

    map.fitBounds([
      [originLat, originLon],
      [dest.coordinates.lat, dest.coordinates.lon]
    ], { padding: [40, 40] });
  }

  setTimeout(function() { map.invalidateSize(); }, 200);
  return map;
}

/* ── Render itinerary day map ── */
function renderDayMap(containerId, dest, dayActivities) {
  if (!dest || !dest.coordinates) return;

  var map = initMap(containerId, dest.coordinates.lat, dest.coordinates.lon, 12);
  if (!map) return;

  // Main destination marker
  L.marker([dest.coordinates.lat, dest.coordinates.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map).bindPopup('<strong>' + dest.name + '</strong><br><em>' + dest.state + '</em>');

  // Nearby attractions with real coordinates
  if (dest.nearbyAttractions && Array.isArray(dest.nearbyAttractions)) {
    dest.nearbyAttractions.forEach(function(a) {
      var popup = '<strong>' + a.name + '</strong>' +
        (a.type ? '<br><em>' + a.type + '</em>' : '') +
        '<br><a href="https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(a.name + ', ' + dest.name) +
        '" target="_blank" rel="noopener" style="color:#1BB89A;font-weight:600;">Open in Maps ↗</a>';
      addMapMarker(map, a.name, a.lat, a.lon, a.type || 'landmark', popup, a.name, dest.name, dest.state);
    });
  }

  setTimeout(function() { map.invalidateSize(); }, 200);
  return map;
}
