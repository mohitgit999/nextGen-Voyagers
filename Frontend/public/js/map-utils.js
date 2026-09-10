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

/* ── Render destination detail map ── */
function renderDestinationMap(containerId, dest, originLat, originLon) {
  if (!dest || !dest.coordinates) return;

  var map = initMap(containerId, dest.coordinates.lat, dest.coordinates.lon, 10);
  if (!map) return;

  // Main destination marker
  L.marker([dest.coordinates.lat, dest.coordinates.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map)
    .bindPopup('<strong>' + dest.name + '</strong><br>' + dest.state);

  // Nearby attractions
  if (dest.nearbyAttractions) {
    dest.nearbyAttractions.forEach(function(a) {
      L.marker([a.lat, a.lon], {
        icon: getMarkerIcon(a.type)
      }).addTo(map)
        .bindPopup('<strong>' + a.name + '</strong><br><em>' + a.type + '</em>');
    });
  }

  // Hidden gems
  if (dest.hiddenGems) {
    dest.hiddenGems.forEach(function(g) {
      if (g.lat && g.lon) {
        L.marker([g.lat, g.lon], {
          icon: getMarkerIcon('hidden-gem')
        }).addTo(map)
          .bindPopup('<strong>💎 ' + g.name + '</strong><br>' + g.description);
      }
    });
  }

  // Origin marker and route line
  if (originLat && originLon) {
    L.marker([originLat, originLon], {
      icon: getMarkerIcon('origin')
    }).addTo(map)
      .bindPopup('<strong>Your starting point</strong>');

    // Draw route line
    L.polyline([
      [originLat, originLon],
      [dest.coordinates.lat, dest.coordinates.lon]
    ], {
      color: '#1BB89A',
      weight: 2,
      dashArray: '8, 8',
      opacity: 0.7
    }).addTo(map);

    // Fit bounds to show both markers
    map.fitBounds([
      [originLat, originLon],
      [dest.coordinates.lat, dest.coordinates.lon]
    ], { padding: [40, 40] });
  }

  // Force resize after render
  setTimeout(function() { map.invalidateSize(); }, 200);

  return map;
}

/* ── Render itinerary day map ── */
function renderDayMap(containerId, dest, dayActivities) {
  if (!dest || !dest.coordinates) return;

  var map = initMap(containerId, dest.coordinates.lat, dest.coordinates.lon, 13);
  if (!map) return;

  // Main destination marker
  L.marker([dest.coordinates.lat, dest.coordinates.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map)
    .bindPopup('<strong>' + dest.name + '</strong>');

  // If we have nearby attractions, place some contextual ones
  if (dest.nearbyAttractions) {
    dest.nearbyAttractions.forEach(function(a) {
      L.marker([a.lat, a.lon], {
        icon: getMarkerIcon(a.type)
      }).addTo(map)
        .bindPopup('<strong>' + a.name + '</strong><br><em>' + a.type + '</em>');
    });
  }

  setTimeout(function() { map.invalidateSize(); }, 200);
  return map;
}
