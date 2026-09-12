'use strict';

/* ============================================================
   VOYAGER — Screen 5: Itinerary
   AI-powered day-by-day plan, Leaflet day routing map,
   interactive category budget tracker, dynamic packing checklist,
   share/print, scroll-sync day chips, new trip reset
   ============================================================ */

var currentAiPlan = null;
var currentAiPlanDest = null;
var isGeneratingAi = false;

/* ============================================================
   GENERATE ITINERARY
   ============================================================ */
function generateItinerary() {
  var d        = findDest(state.selectedId);
  if (!d) return;
  var duration = state.prefs.duration;
  var cost     = estimateCost(d, state.prefs, state.customPerDay);

  if (currentAiPlanDest !== d.name) {
    currentAiPlan = null;
    currentAiPlanDest = d.name;
  }

  // Auto-request AI itinerary if not yet loaded
  if (!currentAiPlan && !isGeneratingAi) {
    setTimeout(function() {
      requestAiItinerary(d, duration, cost);
    }, 30);
  }

  /* ── Day chips ── */
  var chips = '';
  for (var i = 1; i <= duration; i++) {
    chips += '<a href="#day-' + i + '" class="day-chip' + (i === 1 ? ' active' : '') + '" id="chip-' + i + '">Day ' + i + '</a>';
  }

  /* ── Day cards ── */
  var daysHtml = renderDayCardsHtml(d, duration, cost);

  /* ── Full itinerary HTML ── */
  var html = '' +
    /* Hero banner */
    '<div class="itinerary-header-hero">' +
      '<div class="itinerary-hero-text">' +
        '<h2>' + duration + '-day ' + d.name + ' Explorer ' + d.emoji + '</h2>' +
        '<p>Curated for your ' + (state.prefs.group || 'solo') + ' journey · starting from ' + (state.location.city || 'your city') +
        (state.prefs.moods && state.prefs.moods.length ? ' · Vibe: ' + state.prefs.moods.join(', ') : '') + '</p>' +
      '</div>' +
    '</div>' +

    /* Recap bar */
    '<div class="itinerary-recap">' +
      '<div class="recap-item"><div class="recap-label">Estimated Total</div><div class="recap-val">' + inr(cost.total) + '</div></div>' +
      '<div class="recap-item"><div class="recap-label">Travellers</div><div class="recap-val">' + state.prefs.travelers + ' ' + (state.prefs.travelers > 1 ? 'people' : 'person') + '</div></div>' +
      '<div class="recap-item"><div class="recap-label">Duration</div><div class="recap-val">' + duration + ' days</div></div>' +
      '<div class="recap-item"><div class="recap-label">Safety Rating</div><div class="recap-val">' + d.safety.score.toFixed(1) + '/5 🛡️</div></div>' +
      '<div class="recap-item" style="display:flex;align-items:center;justify-content:center;">' +
        '<button class="btn btn-save-cloud btn-sm" id="btn-save-recap" style="padding:8px 16px;">' +
          '<span>💾 Save to Cloud</span>' +
        '</button>' +
      '</div>' +
    '</div>' +

    /* AI Generator Banner */
    '<div class="ai-generator-card">' +
      '<div class="ai-card-content">' +
        '<div class="ai-badge-header">' +
          '<span class="ai-sparkle">✨</span>' +
          '<strong>NextGen AI Itinerary Architect</strong>' +
          (currentAiPlan ? '<span class="ai-active-tag">AI Active</span>' : '') +
        '</div>' +
        '<p class="ai-card-sub">Generate dynamic time-slots, hidden gems, and crowd-optimized routing tailored to your vibes.</p>' +
      '</div>' +
      '<button class="btn btn-ai-sparkle' + (isGeneratingAi ? ' loading' : '') + '" id="btn-generate-ai" ' + (isGeneratingAi ? 'disabled' : '') + '>' +
        (isGeneratingAi ? '<span>⚡ Crafting Itinerary with Gemini...</span>' : '<span>⚡ ' + (currentAiPlan ? 'Regenerate with AI' : 'Enhance with Gemini AI') + '</span>') +
      '</button>' +
    '</div>' +

    /* Interactive Itinerary Route Map */
    '<div class="panel itinerary-map-panel" style="margin-top:20px;">' +
      '<div class="itinerary-map-head">' +
        '<div>' +
          '<h3>' + icon('location') + ' Day-by-Day Route & Spot Map</h3>' +
          '<p class="hint-text">Track your daily geographic progression across ' + d.name + '</p>' +
        '</div>' +
        '<span class="map-status-pill">🗺️ Interactive Leaflet Map</span>' +
      '</div>' +
      '<div id="itinerary-map-canvas" style="height:320px;border-radius:12px;margin:14px 0;"></div>' +
    '</div>' +

    /* Day chip navigation */
    '<div class="day-chip-row" id="day-chip-row">' + chips + '</div>' +

    /* Day cards container */
    '<div id="itinerary-days-container">' + daysHtml + '</div>' +

    /* Dedicated Secret Spots & Hidden Gems Panel */
    renderItineraryHiddenGemsPanel(d, currentAiPlan) +

    /* Budget tracker */
    renderBudgetTracker(d, cost) +

    /* Packing checklist */
    renderPackingChecklist(d) +

    /* Share panel */
    renderSharePanel(d);

  byId('itinerary-content').innerHTML = html;

  /* ── Post-render bindings ── */
  bindPackingChecklist(d);
  bindBudgetTracker(cost);
  bindSharePanel(d, duration, cost);
  initDayChipScrollSync(duration);

  // Initialize Route Map
  setTimeout(function() {
    initItineraryRouteMap(d, duration);
  }, 150);

  // Bind AI button
  var aiBtn = byId('btn-generate-ai');
  if (aiBtn) {
    aiBtn.addEventListener('click', function() {
      requestAiItinerary(d, duration, cost);
    });
  }

  /* Update SOS note */
  var sosNote = byId('sos-context-note');
  if (sosNote) {
    sosNote.textContent = 'You\'re viewing the itinerary for ' + d.name + ', ' + d.state + '. Safety notes are embedded in each day above.';
  }
}

/* ── Render Day Cards ── */
function renderDayCardsHtml(d, duration, cost) {
  var perDayCost = cost.perDay;
  var stayAlloc = Math.round(perDayCost * 0.45);
  var foodAlloc = Math.round(perDayCost * 0.25);
  var transAlloc = Math.round(perDayCost * 0.15);
  var actAlloc = Math.round(perDayCost * 0.15);

  var crowdLevel = d.crowdPatterns ? d.crowdPatterns.generalLevel : 'Moderate';
  var peakHours = d.crowdPatterns ? d.crowdPatterns.peakHours : '11:00 AM – 3:30 PM';

  if (isGeneratingAi && (!currentAiPlan || !currentAiPlan.days)) {
    return '' +
      '<div class="ai-generating-loader" style="text-align:center; padding:48px 24px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.14); border-radius:16px; margin:24px 0; box-shadow:0 8px 30px rgba(0,0,0,0.4);">' +
        '<div style="font-size:2.5rem; margin-bottom:12px; display:inline-block;">⚡</div>' +
        '<h3 style="font-size:1.3rem; font-weight:700; color:#FFFFFF; margin-bottom:8px;">Crafting Personalized AI Itinerary for ' + d.name + '...</h3>' +
        '<p style="color:#CBD5E1; font-size:0.95rem; max-width:520px; margin:0 auto 16px;">NextGen Gemini AI is discovering authentic local attractions, scenic viewpoints, dining spots, and crowd-optimized routing.</p>' +
        '<div style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:20px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#FFFFFF; font-weight:600; font-size:0.85rem;">' +
          '<span>✨ Live AI Generation in Progress</span>' +
        '</div>' +
      '</div>';
  }

  var days = '';
  for (var j = 1; j <= duration; j++) {
    var aiDay = currentAiPlan && currentAiPlan.days && currentAiPlan.days[j - 1] ? currentAiPlan.days[j - 1] : null;

    var theme;
    if (aiDay && aiDay.theme) {
      theme = aiDay.theme;
    } else if (j === 1) {
      theme = 'Arrival, Check-in & First Exploration';
    } else if (j === duration && duration > 1) {
      theme = 'Souvenirs, Hidden Corners & Departure';
    } else {
      theme = (d.dayThemes && d.dayThemes.length) ? d.dayThemes[(j - 1) % d.dayThemes.length] : ('Day ' + j + ' Discovery');
    }

    var attr0 = (d.nearbyAttractions && d.nearbyAttractions[0] && d.nearbyAttractions[0].name) || (d.name + ' Heritage Quarter');
    var attr1 = (d.nearbyAttractions && d.nearbyAttractions[1] && d.nearbyAttractions[1].name) || (d.name + ' Scenic Ridge');
    var attr2 = (d.nearbyAttractions && d.nearbyAttractions[2] && d.nearbyAttractions[2].name) || (d.name + ' Sunset Point');
    var gem0 = (d.hiddenGems && d.hiddenGems[0] && d.hiddenGems[0].name) || (d.name + ' Valley Trail');

    var locMorning = (aiDay && aiDay.morning && aiDay.morning.location) ? aiDay.morning.location : attr0;
    var locMidday = (aiDay && aiDay.midday && aiDay.midday.location) ? aiDay.midday.location : (d.name + ' Old Town Cafe & Eatery');
    var locAfternoon = (aiDay && aiDay.afternoon && aiDay.afternoon.location) ? aiDay.afternoon.location : attr1;
    var locEvening = (aiDay && aiDay.evening && aiDay.evening.location) ? aiDay.evening.location : attr2;
    var locSmartTip = (aiDay && aiDay.smartTip && aiDay.smartTip.location) ? aiDay.smartTip.location : gem0;

    var textMorning = (aiDay && aiDay.morning && (aiDay.morning.activity || aiDay.morning.description)) || (d.activities && d.activities.morning && d.activities.morning[(j - 1) % d.activities.morning.length]) || ('Morning exploration and sightseeing at ' + locMorning);
    var textMidday = (aiDay && aiDay.midday && (aiDay.midday.activity || aiDay.midday.description)) || ('Midday pause for authentic lunch and refreshments at ' + locMidday);
    var textAfternoon = (aiDay && aiDay.afternoon && (aiDay.afternoon.activity || aiDay.afternoon.description)) || (d.activities && d.activities.afternoon && d.activities.afternoon[(j - 1) % d.activities.afternoon.length]) || ('Afternoon visit and activities around ' + locAfternoon);
    var textEvening = (aiDay && aiDay.evening && (aiDay.evening.activity || aiDay.evening.description)) || (d.activities && d.activities.evening && d.activities.evening[(j - 1) % d.activities.evening.length]) || ('Evening stroll, vibrant atmosphere and sunset at ' + locEvening);
    var textSmartTip = (aiDay && aiDay.smartTip && (aiDay.smartTip.activity || aiDay.smartTip.text)) || (aiDay && aiDay.hiddenGem) || (d.culture ? d.culture.etiquette : 'Respect local sacred traditions, carry cash for mountain markets, and keep emergency contacts handy.');

    var dayCrowd = (aiDay && aiDay.crowdLevel) ? aiDay.crowdLevel : crowdLevel;
    var dayWeather = (aiDay && aiDay.weather) ? aiDay.weather : (d.weather.temp.min + '-' + d.weather.temp.max + '°C');

    var acts = [
      { label: 'Morning (08:30 – 12:30)', dot: 'dot-morning', text: textMorning, loc: locMorning },
      { label: 'Midday (12:30 – 13:00)', dot: 'dot-afternoon', text: textMidday, loc: locMidday },
      { label: 'Afternoon (13:00 – 17:00)', dot: 'dot-afternoon', text: textAfternoon, loc: locAfternoon },
      { label: 'Evening & Night (18:00 – 22:00)', dot: 'dot-evening', text: textEvening, loc: locEvening },
      { label: 'Smart Tip', dot: 'dot-evening', text: textSmartTip, loc: locSmartTip }
    ];

    var actsHtml = '<div class="activity-cards-list" style="display:flex; flex-direction:column; gap:16px; margin-top:16px; margin-bottom:16px;">';
    acts.forEach(function(act) {
      actsHtml += '' +
        '<div class="activity-card-vertical" style="background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,0.3);">' +
          '<div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#E2E8F0; margin-bottom:8px; display:flex; align-items:center; gap:6px;">' +
            '<span class="part-dot ' + act.dot + '"></span> ' + act.label + 
          '</div>' +
          '<div style="font-size:1.02rem; font-weight:600; color:#FFFFFF; margin-bottom:14px; line-height:1.55;">' +
            act.text +
          '</div>' +
          '<div style="display:flex; gap:12px; flex-wrap:wrap; font-size:0.85rem; color:#CBD5E1; background:rgba(255,255,255,0.05); padding:10px 12px; border-radius:8px;">' +
            '<div style="display:flex; align-items:center; gap:4px;">📍 <a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(act.loc + ', ' + d.name + (d.state ? ', ' + d.state : '')) + '" target="_blank" rel="noopener noreferrer" style="color:#FFFFFF; font-weight:700; text-decoration:underline;">' + act.loc + '</a></div>' +
            '<div style="display:flex; align-items:center; gap:4px;">☀️ <span style="color:#FFFFFF; font-weight:600;">' + dayWeather + '</span></div>' +
            '<div style="display:flex; align-items:center; gap:4px;">👥 <span style="color:#FFFFFF; font-weight:600;">' + dayCrowd + (String(dayCrowd).toLowerCase().indexOf('crowd') === -1 ? ' Crowd' : '') + '</span></div>' +
          '</div>' +
        '</div>';
    });
    actsHtml += '</div>';

    days += '' +
      '<div class="day-card' + (j === 1 ? ' day-active' : '') + '" id="day-' + j + '" data-day="' + j + '">' +
        '<div class="day-card-head">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span class="day-num">' + String(j).padStart(2, '0') + '</span>' +
            '<div>' +
              '<span class="day-theme">' + theme + '</span>' +
              '<div class="day-meta-pill-row">' +
                '<span class="day-sub-pill peak-pill">⏰ Peak Hours: ' + peakHours + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="day-budget-badge">' + inr(perDayCost) + '/person</div>' +
        '</div>' +
        actsHtml +

        /* Day budget breakdown */
        '<div class="day-budget-row">' +
          '<span class="budget-mini-chip">🏨 Stay: ' + inr(stayAlloc) + '</span>' +
          '<span class="budget-mini-chip">🍲 Food: ' + inr(foodAlloc) + '</span>' +
          '<span class="budget-mini-chip">🚖 Transport: ' + inr(transAlloc) + '</span>' +
          '<span class="budget-mini-chip">🎟️ Activities: ' + inr(actAlloc) + '</span>' +
        '</div>';

    // Day Secret Spot Card
    var rawGem = (aiDay && aiDay.hiddenGem) || (d.hiddenGems && d.hiddenGems[(j - 1) % d.hiddenGems.length]) || null;
    var gemObj = null;
    if (rawGem) {
      if (typeof rawGem === 'object') {
        gemObj = {
          name: rawGem.name || (d.name + ' Secret Discovery'),
          location: rawGem.location || rawGem.name || (d.name + ' Offbeat Trail'),
          description: rawGem.description || (d.name + ' secluded scenic spot treasured by local residents.'),
          bestTime: rawGem.bestTime || 'Early morning or golden hour',
          tip: rawGem.tip || rawGem.secretTip || 'Ask friendly local shopkeepers for the scenic walking path.'
        };
      } else if (typeof rawGem === 'string') {
        var parts = rawGem.split('—');
        gemObj = {
          name: parts[0].trim(),
          location: parts[0].trim() + ', ' + d.name,
          description: parts[1] ? parts[1].trim() : rawGem,
          bestTime: 'Early morning or gold    if (gemObj) {
      var gemMapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(gemObj.location + ', ' + d.name + (d.state ? ', ' + d.state : ''));
      gemHtml = '' +
        '<div class="day-gem-featured-card" style="margin-top:16px; padding:16px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.18); border-radius:12px; box-shadow:0 4px 16px rgba(0,0,0,0.3);">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:8px; flex-wrap:wrap;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span style="font-size:1.3rem;">💎</span>' +
              '<div>' +
                '<h4 style="margin:0; font-size:1.05rem; font-weight:700; color:#FFFFFF;">' + gemObj.name + '</h4>' +
                '<span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; color:#E2E8F0; font-weight:700;">Day ' + j + ' Secret Spot</span>' +
              '</div>' +
            '</div>' +
            '<a href="' + gemMapsUrl + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:4px; padding:6px 14px; background:#FFFFFF; color:#0A0D12; border-radius:999px; font-size:0.8rem; font-weight:700; text-decoration:none; box-shadow:0 2px 10px rgba(255,255,255,0.25);">' +
              '📍 View on Maps' +
            '</a>' +
          '</div>' +
          '<p style="font-size:0.92rem; color:#CBD5E1; margin:8px 0 10px; line-height:1.5;">' + gemObj.description + '</p>' +
          '<div style="display:flex; gap:12px; flex-wrap:wrap; font-size:0.82rem; color:#E2E8F0; background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">' +
            '<div>📍 <strong>Location:</strong> <span style="color:#FFFFFF;">' + gemObj.location + '</span></div>' +
            '<div>⏰ <strong>Best Time:</strong> <span style="color:#FFFFFF;">' + gemObj.bestTime + '</span></div>' +
            '<div>🤫 <strong>Secret Tip:</strong> <span style="color:#FFFFFF;">' + gemObj.tip + '</span></div>' +
          '</div>' +
        '</div>';
    }

    days += '' +
      gemHtml +
      '<div class="cultural-tip-row" style="margin-top:12px; font-size:0.88rem; color:#CBD5E1; display:flex; align-items:center; gap:6px;">' +
        '<strong style="color:#FFFFFF;">🏛️ Cultural Etiquette:</strong> <span>' + ((aiDay && aiDay.culturalNote) || (d.culture ? d.culture.etiquette : 'Respect local traditions and photography rules.')) + '</span>' +
      '</div>' +
      '<div class="safety-note" style="margin-top:8px; font-size:0.88rem; color:#CBD5E1; display:flex; align-items:center; gap:6px;">' +
        icon('shield') + '<span>' + ((aiDay && aiDay.safetyTip) || (d.safety && d.safety.points && d.safety.points[0]) || 'Stay on marked trails and keep emergency numbers handy.') + '</span>' +
      '</div>' +
    '</div>';
  }
  return days;
}

/* ── Dedicated Itinerary Hidden Gems Showcase Panel ── */
function renderItineraryHiddenGemsPanel(d, plan) {
  var gems = [];
  if (plan && Array.isArray(plan.hiddenGems) && plan.hiddenGems.length) {
    gems = plan.hiddenGems;
  } else if (Array.isArray(d.hiddenGems) && d.hiddenGems.length) {
    gems = d.hiddenGems;
  }

  if (!gems.length) {
    gems = [
      {
        name: d.name + ' Secret Valley & Pines',
        location: d.name + ' Forest Trail',
        description: 'An untouched nature retreat away from tourist tracks, loved by locals for quiet morning walks.',
        bestFor: 'Solitude & Photography',
        bestTime: '06:30 – 08:30',
        tip: 'Follow the stone path past the stream; carry drinking water.'
      },
      {
        name: d.name + ' Panoramic Sunset Ridge',
        location: d.name + ' East Viewpoint',
        description: 'Spectacular viewpoint overlooking mountain ranges and valleys during golden hour.',
        bestFor: 'Sunsets & Stargazing',
        bestTime: '17:30 – 19:00',
        tip: 'Reach 30 minutes before sunset for the clearest light.'
      }
    ];
  }

  var cardsHtml = gems.map(function(gem) {
    var name = gem.name || (d.name + ' Secret Spot');
    var loc = gem.location || gem.name || (d.name + ' Scenic Spot');
    var desc = gem.description || (gem.tip || 'A tranquil offbeat gem with scenic vistas.');
    var bestTime = gem.bestTime || 'Early morning or golden hour';
    var secretTip = gem.tip || gem.secretTip || 'Ask friendly local shopkeepers for the walking path.';
    var bestFor = gem.bestFor || gem.vibe || 'Solitude & Nature';
    var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(loc + ', ' + d.name + (d.state ? ', ' + d.state : ''));

    return '' +
      '<div class="itinerary-gem-card" style="background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:20px; box-shadow:0 6px 20px rgba(0,0,0,0.3); display:flex; flex-direction:column; justify-content:space-between; gap:12px;">' +
        '<div>' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:8px;">' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span style="font-size:1.4rem;">💎</span>' +
              '<h4 style="margin:0; font-size:1.1rem; font-weight:700; color:#FFFFFF;">' + name + '</h4>' +
            '</div>' +
            '<span style="font-size:0.75rem; padding:4px 10px; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.18); color:#FFFFFF; font-weight:700; text-transform:uppercase;">' + bestFor + '</span>' +
          '</div>' +
          '<p style="font-size:0.92rem; color:#CBD5E1; line-height:1.55; margin:8px 0 14px;">' + desc + '</p>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.04); padding:12px 14px; border-radius:10px; font-size:0.85rem; color:#CBD5E1; display:flex; flex-direction:column; gap:6px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">' +
            '<span>📍 <strong>Location:</strong> <span style="color:#FFFFFF;">' + loc + '</span></span>' +
            '<a href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer" style="color:#FFFFFF; font-weight:700; text-decoration:underline; display:inline-flex; align-items:center; gap:3px;">' +
              'Open in Google Maps ↗' +
            '</a>' +
          '</div>' +
          '<div>⏰ <strong>Best Time:</strong> <span style="color:#FFFFFF;">' + bestTime + '</span></div>' +
          '<div>💡 <strong>Secret Tip:</strong> <span style="color:#FFFFFF;">' + secretTip + '</span></div>' +
        '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel itinerary-gems-panel" style="margin-top:24px; margin-bottom:24px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">' +
        '<div>' +
          '<h3 style="display:flex; align-items:center; gap:8px; margin:0 0 4px; font-size:1.3rem; font-weight:800; color:#FFFFFF;">' +
            '<span>💎</span> Secret Spots & Hidden Gems of ' + d.name +
          '</h3>' +
          '<p class="hint-text" style="margin:0; font-size:0.9rem; color:#CBD5E1;">Vetted offbeat locations, secret viewpoints, and secluded nature trails away from tourist crowds.</p>' +
        '</div>' +
        '<span style="padding:5px 14px; border-radius:999px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.22); color:#FFFFFF; font-size:0.82rem; font-weight:700;">' +
          gems.length + ' Secret Spots Discovered' +
        '</span>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:18px;">' +
        cardsHtml +
      '</div>' +
    '</div>';
}

/* ── Route Map Initialization ── */
function initItineraryRouteMap(dest, duration) {
  if (!window.L || !byId('itinerary-map-canvas') || !dest.coordinates) return;

  var map = initMap('itinerary-map-canvas', dest.coordinates.lat, dest.coordinates.lon, 12);
  if (!map) return;

  // Base destination marker opens the matching Google Maps location.
  var baseMarker = L.marker([dest.coordinates.lat, dest.coordinates.lon], {
    icon: getMarkerIcon('destination')
  }).addTo(map);
  bindGoogleMapsMarker(baseMarker, dest.name + ', ' + dest.state, dest.coordinates.lat, dest.coordinates.lon);

  var points = [[dest.coordinates.lat, dest.coordinates.lon]];

  // Add attraction pins for days
  if (dest.nearbyAttractions && Array.isArray(dest.nearbyAttractions)) {
    dest.nearbyAttractions.slice(0, Math.min(duration + 2, 7)).forEach(function(a, idx) {
      var aLat = (typeof a.lat === 'number') ? a.lat : (dest.coordinates ? dest.coordinates.lat + ((idx + 1) * 0.008 * (idx % 2 === 0 ? 1 : -1)) : null);
      var aLon = (typeof a.lon === 'number') ? a.lon : (dest.coordinates ? dest.coordinates.lon + ((idx + 1) * 0.008 * (idx % 3 === 0 ? 1 : -1)) : null);
      if (aLat !== null && aLon !== null) {
        points.push([aLat, aLon]);
        var attractionMarker = L.marker([aLat, aLon], {
          icon: getMarkerIcon(a.type || 'activity')
        }).addTo(map);
        bindGoogleMapsMarker(attractionMarker, a.name, aLat, aLon, 'Day ' + ((idx % duration) + 1) + ' stop', dest.name);
      }
    });
  }

  // Connect route line
  if (points.length > 1) {
    L.polyline(points, {
      color: '#1BB89A',
      weight: 3,
      dashArray: '6, 6',
      opacity: 0.8
    }).addTo(map);
  }

  setTimeout(function() { map.invalidateSize(); }, 200);
}

function bindGoogleMapsMarker(marker, label, lat, lon, prefix, destName) {
  var googleUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(label + (destName ? ', ' + destName : ''));
  marker.bindPopup(
    '<strong>' + (prefix ? prefix + ': ' : '') + label + '</strong><br>' +
    '<a href="' + googleUrl + '" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>'
  );
  marker.on('click', function() {
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ── AI Generator Request ── */
function requestAiItinerary(d, duration, cost) {
  isGeneratingAi = true;
  var aiBtn = byId('btn-generate-ai');
  if (aiBtn) {
    aiBtn.disabled = true;
    aiBtn.classList.add('loading');
    aiBtn.innerHTML = '<span>⚡ Crafting Itinerary with Gemini AI...</span>';
  }

  var payload = {
    destination: d.name,
    state: d.state,
    duration: duration,
    budget: state.prefs.budget,
    group: state.prefs.group,
    travelers: state.prefs.travelers,
    moods: state.prefs.moods || [],
    origin: state.location.city || ''
  };

  fetch(apiUrl('/api/ai/generate-itinerary'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function(res) {
      if (!res.ok) throw new Error('AI service returned error: ' + res.status);
      return res.json();
    })
    .then(function(data) {
      isGeneratingAi = false;
      var itinerary = data && data.itinerary ? data.itinerary : data;
      if (itinerary && itinerary.days && itinerary.days.length) {
        currentAiPlan = itinerary;
        currentAiPlanDest = d.name;
        if (typeof showToast === 'function') {
          showToast('Gemini AI created a tailored ' + duration + '-day plan! ✨', 'success');
        }
      } else {
        throw new Error('AI returned empty itinerary');
      }
      generateItinerary();
    })
    .catch(function(err) {
      console.warn('AI request fallback:', err.message);
      isGeneratingAi = false;

      // Smart fallback using local generative templates
      currentAiPlan = buildLocalSmartItinerary(d, duration, cost);
      currentAiPlanDest = d.name;
      if (typeof showToast === 'function') {
        showToast('Itinerary ready with curated local locations & tips!', 'info');
      }
      generateItinerary();
    });
}

function buildLocalSmartItinerary(d, duration, cost) {
  var days = [];
  var perDayCost = cost.perDay;
  var gems = d.hiddenGems || [];
  var attrs = d.nearbyAttractions || [];
  var defaultSpots = [
    d.name + ' Heritage & Old Quarter',
    d.name + ' Central Bazaar & Artisan Lane',
    d.name + ' Panoramic Ridge / Viewpoint',
    d.name + ' Nature Sanctuary Trail',
    d.name + ' Lakeside Promenade',
    d.name + ' Historic Temple & Grove'
  ];

  for (var i = 1; i <= duration; i++) {
    var gem = gems[(i - 1) % (gems.length || 1)];
    var attr1 = attrs[(i * 2 - 2) % (attrs.length || 1)];
    var attr2 = attrs[(i * 2 - 1) % (attrs.length || 1)];
    var theme = (d.dayThemes && d.dayThemes.length) ? d.dayThemes[(i - 1) % d.dayThemes.length] : ('Exploration & Discovery Day ' + i);

    var morningLoc = (attr1 && attr1.name) ? attr1.name : defaultSpots[(i * 2 - 2) % defaultSpots.length];
    var middayLoc = d.name + ' Heritage Cafe & Rest Stop';
    var afternoonLoc = (attr2 && attr2.name) ? attr2.name : defaultSpots[(i * 2 - 1) % defaultSpots.length];
    var eveningLoc = (gem && gem.name) ? gem.name : (d.name + ' Sunset Viewpoint');
    var smartLoc = (gem && gem.name) ? gem.name : (d.name + ' Valley Trail');

    days.push({
      day: i,
      theme: theme,
      morning: {
        activity: (d.activities && d.activities.morning && d.activities.morning.length) ? d.activities.morning[(i - 1) % d.activities.morning.length] : ('Morning discovery of ' + morningLoc),
        location: morningLoc,
        tip: 'Best visited early in the morning for fewer crowds.'
      },
      midday: {
        activity: 'Local culinary break and cafe experience in ' + d.name,
        location: middayLoc,
        tip: 'Try authentic local regional delicacies.'
      },
      afternoon: {
        activity: (d.activities && d.activities.afternoon && d.activities.afternoon.length) ? d.activities.afternoon[(i - 1) % d.activities.afternoon.length] : ('Afternoon exploration around ' + afternoonLoc),
        location: afternoonLoc,
        tip: 'Carry comfortable walking shoes and camera.'
      },
      evening: {
        activity: (d.activities && d.activities.evening && d.activities.evening.length) ? d.activities.evening[(i - 1) % d.activities.evening.length] : ('Golden hour sunset and leisure in ' + eveningLoc),
        location: eveningLoc,
        tip: 'Enjoy the vibrant evening atmosphere and sunset.'
      },
      smartTip: {
        activity: gem ? (gem.name + ' — ' + (gem.tip || gem.description || 'Hidden local gem')) : 'Respect local traditions and keep emergency numbers handy.',
        location: smartLoc,
        tip: 'Authentic offbeat recommendation.'
      },
      budget: {
        stay: Math.round(perDayCost * 0.45),
        food: Math.round(perDayCost * 0.25),
        transport: Math.round(perDayCost * 0.15),
        activities: Math.round(perDayCost * 0.15)
      },
      hiddenGem: {
        name: (gem && gem.name) ? gem.name : (d.name + ' Hidden Sanctuary Trail'),
        location: (gem && (gem.location || gem.name)) ? (gem.location || gem.name) : (d.name + ' Mountain Ridge'),
        description: (gem && gem.description) ? gem.description : ('An offbeat quiet trail in ' + d.name + ' known to locals for natural peace.'),
        bestTime: (gem && gem.bestTime) ? gem.bestTime : 'Early morning (06:30 – 08:30)',
        tip: (gem && (gem.tip || gem.secretTip)) ? (gem.tip || gem.secretTip) : 'Carry light snacks and water; ask locals for trail landmarks.'
      }
    });
  }

  return {
    title: duration + '-Day Curated Plan for ' + d.name,
    days: days,
    hiddenGems: (d.hiddenGems && d.hiddenGems.length) ? d.hiddenGems : [
      {
        name: d.name + ' Secret Valley & Pines',
        location: d.name + ' Forest Trail',
        description: 'An untouched nature retreat away from tourist tracks, loved by locals for quiet morning walks.',
        bestFor: 'Solitude & Photography',
        bestTime: '06:30 – 08:30',
        tip: 'Follow the stone path past the stream.'
      }
    ]
  };
}

/* ============================================================
   BUDGET TRACKER (ENHANCED WITH CATEGORIES & CHART)
   ============================================================ */
function renderBudgetTracker(d, cost) {
  return '' +
    '<div class="budget-tracker" id="budget-tracker">' +
      '<div class="budget-tracker-head">' +
        '<div>' +
          '<h3>' + icon('wallet') + ' Expense Logger & Budget Control</h3>' +
          '<span class="hint-text">Track your live trip spending vs estimated budget</span>' +
        '</div>' +
        '<div class="budget-stats-pill" id="budget-stats-pill">0% spent</div>' +
      '</div>' +

      '<div class="budget-total-display">' +
        '<div>' +
          '<div class="budget-spent-num" id="budget-spent-display">' + inr(0) + '</div>' +
          '<div class="budget-of-total">of estimated <strong>' + inr(cost.total) + '</strong></div>' +
        '</div>' +
        '<div class="budget-remaining-wrap">' +
          '<div class="budget-rem-label">Remaining Balance</div>' +
          '<div class="budget-rem-num" id="budget-remaining-display">' + inr(cost.total) + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="budget-bar"><div class="budget-bar-fill" id="budget-bar-fill" style="width:0%"></div></div>' +

      '<div class="budget-cat-breakdown" id="budget-cat-breakdown"></div>' +

      '<div class="budget-entries" id="budget-entries-list"></div>' +

      '<div class="budget-add-card">' +
        '<div class="budget-add-grid">' +
          '<select id="budget-cat-select" class="budget-cat-select" aria-label="Select category">' +
            '<option value="Accommodation">🏨 Accommodation</option>' +
            '<option value="Food & Dining">🍲 Food & Dining</option>' +
            '<option value="Transport">🚖 Transport & Cabs</option>' +
            '<option value="Sightseeing">🎟️ Sightseeing & Entry</option>' +
            '<option value="Shopping">🛍️ Shopping & Souvenirs</option>' +
            '<option value="Misc">📦 Miscellaneous</option>' +
          '</select>' +
          '<input type="text" id="budget-cat-input" placeholder="Description (e.g. Dinner at Beach Shack)" aria-label="Expense description">' +
          '<input type="number" id="budget-amt-input" placeholder="₹ Amount" min="1" aria-label="Amount in rupees">' +
          '<button class="btn btn-forest btn-sm" id="budget-add-btn">Add Spend</button>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function bindBudgetTracker(cost) {
  var totalEst = cost.total;

  function refreshBudget() {
    var spent = state.budgetLog.reduce(function(s, e) { return s + e.amount; }, 0);
    var remaining = Math.max(0, totalEst - spent);
    var pct = clamp(spent / totalEst * 100, 0, 100);

    byId('budget-spent-display').textContent = inr(spent);
    byId('budget-remaining-display').textContent = inr(remaining);
    byId('budget-stats-pill').textContent = Math.round(pct) + '% spent';

    var fill = byId('budget-bar-fill');
    fill.style.width = pct + '%';
    fill.classList.toggle('over', spent > totalEst);

    // Calculate category breakdown
    var catTotals = {};
    state.budgetLog.forEach(function(e) {
      var cat = e.category || 'Misc';
      catTotals[cat] = (catTotals[cat] || 0) + e.amount;
    });

    var catBox = byId('budget-cat-breakdown');
    if (catBox) {
      if (Object.keys(catTotals).length > 0) {
        catBox.innerHTML = Object.keys(catTotals).map(function(c) {
          return '<span class="budget-cat-pill"><strong>' + c + ':</strong> ' + inr(catTotals[c]) + '</span>';
        }).join('');
      } else {
        catBox.innerHTML = '<span class="hint-text">Log expenses to see category breakdown</span>';
      }
    }

    var list = byId('budget-entries-list');
    if (!state.budgetLog.length) {
      list.innerHTML = '<p class="hint-text" style="padding:8px 0;">No expenses logged yet. Add your first spend below!</p>';
      return;
    }

    list.innerHTML = state.budgetLog.map(function(e) {
      return '' +
        '<div class="budget-entry">' +
          '<div class="budget-entry-left">' +
            (e.category ? '<span class="budget-entry-cat-badge">' + e.category + '</span>' : '') +
            '<span class="budget-entry-cat">' + escapeHtml(e.label) + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="budget-entry-amt">' + inr(e.amount) + '</span>' +
            '<button class="budget-entry-del" data-entry-id="' + e.id + '" aria-label="Remove entry">✕</button>' +
          '</div>' +
        '</div>';
    }).join('');

    list.querySelectorAll('.budget-entry-del').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var eid = btn.getAttribute('data-entry-id');
        state.budgetLog = state.budgetLog.filter(function(e) { return e.id !== eid; });
        persistBudgetLog();
        refreshBudget();
      });
    });
  }

  byId('budget-add-btn').addEventListener('click', function() {
    var catSelect = byId('budget-cat-select') ? byId('budget-cat-select').value : 'Misc';
    var desc = byId('budget-cat-input').value.trim() || catSelect;
    var amt = parseInt(byId('budget-amt-input').value, 10);
    if (isNaN(amt) || amt <= 0) return;

    state.budgetLog.push({
      id: Date.now().toString(),
      category: catSelect,
      label: desc,
      amount: amt
    });
    persistBudgetLog();
    byId('budget-cat-input').value = '';
    byId('budget-amt-input').value = '';
    refreshBudget();
  });

  byId('budget-amt-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') byId('budget-add-btn').click();
  });

  refreshBudget();
}

/* ============================================================
   PACKING CHECKLIST (WITH WEATHER ADAPTIVE & CUSTOM ITEMS)
   ============================================================ */
function renderPackingChecklist(d) {
  var weatherExtras = [];
  if (d.weather) {
    if (d.weather.temp.max >= 30) weatherExtras.push('Sunscreen SPF 50+', 'Cooling face mist', 'UV sunglasses', 'Hydration electrolyte tablets');
    if (d.weather.temp.min <= 15) weatherExtras.push('Thermal fleece layer', 'Woolen socks', 'Insulated jacket', 'Lip balm & moisturizer');
  }

  state.customPackingItems = state.customPackingItems || lsGet('customPacking', []);

  var sections = [
    { key: 'documents', label: '📄 Documents & Identity', items: BASE_PACKING.documents },
    { key: 'clothing', label: '👕 Clothing & Apparel', items: BASE_PACKING.clothing },
    { key: 'weather', label: '⛅ Weather-Adaptive Essentials', items: weatherExtras },
    { key: 'health', label: '💊 Health & Safety First-Aid', items: BASE_PACKING.health },
    { key: 'tech', label: '🔌 Tech, Adapters & Power', items: BASE_PACKING.tech },
    { key: 'misc', label: '🎒 Travel Misc & Toiletries', items: BASE_PACKING.misc },
    { key: 'dest', label: '📍 ' + d.name + ' Specific Gear', items: d.packingExtras },
    { key: 'custom', label: '⭐ Your Custom Items', items: state.customPackingItems }
  ];

  var total = 0;
  sections.forEach(function(s) { total += s.items.length; });
  var checked = 0;
  Object.keys(state.packingState).forEach(function(k) { if (state.packingState[k]) checked++; });
  var pct = total ? clamp(checked / total * 100, 0, 100) : 0;

  var inner = sections.map(function(sec) {
    if (!sec.items || !sec.items.length) return '';
    return '' +
      '<div class="packing-section">' +
        '<div class="packing-section-title">' + sec.label + '</div>' +
        sec.items.map(function(item) {
          var pk = sec.key + '__' + item;
          var isCheck = !!state.packingState[pk];
          return '' +
            '<div class="pack-item' + (isCheck ? ' checked' : '') + '" data-pack-key="' + pk + '">' +
              '<div class="pack-check">' + icon('check') + '</div>' +
              '<span>' + item + '</span>' +
            '</div>';
        }).join('') +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel" id="packing-panel" style="margin-top:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<div>' +
          '<h3>' + icon('backpack') + ' Packing Essentials & Gear Checklist</h3>' +
          '<p class="hint-text">Adaptive checklist based on destination weather & local terrain</p>' +
        '</div>' +
        '<div class="packing-summary" id="packing-summary">' + checked + ' of ' + total + ' packed</div>' +
      '</div>' +
      '<div class="packing-progress"><div class="packing-progress-fill" id="packing-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="packing-list" id="packing-list">' + inner + '</div>' +

      /* Add custom item */
      '<div class="packing-custom-add-row" style="margin-top:16px;display:flex;gap:10px;">' +
        '<input type="text" id="custom-pack-input" placeholder="Add custom item (e.g. Drone, Trekking pole)..." style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;">' +
        '<button class="btn btn-forest btn-sm" id="btn-add-custom-pack">+ Add Item</button>' +
      '</div>' +

      '<div class="packing-actions" style="margin-top:16px;">' +
        '<button class="btn btn-ghost btn-sm" id="packing-reset-btn">Clear all</button>' +
        '<button class="btn btn-forest btn-sm" id="packing-check-all-btn">Check all</button>' +
      '</div>' +
    '</div>';
}

function bindPackingChecklist(d) {
  function refreshProgress() {
    var total = document.querySelectorAll('.pack-item').length;
    var checked = document.querySelectorAll('.pack-item.checked').length;
    var pct = total ? clamp(checked / total * 100, 0, 100) : 0;
    byId('packing-progress-fill').style.width = pct + '%';
    byId('packing-summary').textContent = checked + ' of ' + total + ' packed';
  }

  document.querySelectorAll('.pack-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var pk = item.getAttribute('data-pack-key');
      state.packingState[pk] = !state.packingState[pk];
      item.classList.toggle('checked', !!state.packingState[pk]);
      persistPackingState();
      refreshProgress();
    });
  });

  byId('packing-reset-btn').addEventListener('click', function() {
    document.querySelectorAll('.pack-item').forEach(function(item) {
      var pk = item.getAttribute('data-pack-key');
      state.packingState[pk] = false;
      item.classList.remove('checked');
    });
    persistPackingState();
    refreshProgress();
  });

  byId('packing-check-all-btn').addEventListener('click', function() {
    document.querySelectorAll('.pack-item').forEach(function(item) {
      var pk = item.getAttribute('data-pack-key');
      state.packingState[pk] = true;
      item.classList.add('checked');
    });
    persistPackingState();
    refreshProgress();
  });

  // Custom pack item adder
  var addCustomBtn = byId('btn-add-custom-pack');
  var customInput = byId('custom-pack-input');
  if (addCustomBtn && customInput) {
    addCustomBtn.addEventListener('click', function() {
      var val = customInput.value.trim();
      if (!val) return;
      state.customPackingItems = state.customPackingItems || [];
      if (state.customPackingItems.indexOf(val) === -1) {
        state.customPackingItems.push(val);
        lsSet('customPacking', state.customPackingItems);
      }
      customInput.value = '';
      // Re-render packing panel
      var packPanel = byId('packing-panel');
      if (packPanel) {
        packPanel.outerHTML = renderPackingChecklist(d);
        bindPackingChecklist(d);
      }
    });

    customInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomBtn.click();
    });
  }
}

/* ============================================================
   SHARE & SAVE PANEL
   ============================================================ */
function renderSharePanel(d) {
  return '' +
    '<div class="share-panel">' +
      '<h3>' + icon('share') + ' <span>Save & share your itinerary</span></h3>' +
      '<div class="share-actions">' +
        '<button class="btn btn-save-cloud btn-sm" id="btn-save-cloud">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;flex-shrink:0"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
          '<span>Save Trip to Cloud</span>' +
        '</button>' +
        '<button class="btn btn-ghost btn-sm" id="btn-copy-link">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
          '<span>Copy summary</span>' +
        '</button>' +
        '<button class="btn btn-ghost btn-sm" id="btn-print-plan">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>' +
          '<span>Print / Save PDF</span>' +
        '</button>' +
      '</div>' +
      '<div class="share-success" id="share-success">' + icon('check') + ' <span>Link copied to clipboard!</span></div>' +
    '</div>';
}

function saveCurrentTripToCloud(d, duration, cost) {
  if (typeof authState === 'undefined' || !authState.user || !authState.token) {
    if (typeof showToast === 'function') {
      showToast('Please sign in or create an account to save trips to the cloud ✈️', 'info');
    }
    if (typeof openAuthModal === 'function') {
      openAuthModal('login');
    }
    return;
  }

  var btns = [byId('btn-save-cloud'), byId('btn-save-recap')];
  btns.forEach(function(b) {
    if (b) {
      b.disabled = true;
      var span = b.querySelector('span');
      if (span) span.textContent = 'Saving to Atlas... ☁️';
    }
  });

  // Extract day parts
  var itineraryData = [];
  for (var j = 1; j <= duration; j++) {
    var theme = j === 1 ? 'Arrival & first impressions' : (j === duration && duration > 1 ? 'Leisure & departure' : d.dayThemes[(j - 1) % d.dayThemes.length]);
    itineraryData.push({
      morning: d.activities.morning[(j - 1) % d.activities.morning.length],
      afternoon: d.activities.afternoon[(j - 1) % d.activities.afternoon.length],
      evening: d.activities.evening[(j - 1) % d.activities.evening.length],
      safetyTip: d.safety.points[(j - 1) % d.safety.points.length]
    });
  }

  var payload = {
    sessionId: state.sessionId || ('voyager-' + Date.now()),
    origin: {
      city: state.location.city || 'India',
      source: state.location.source || 'manual',
      lat: state.location.lat || null,
      lon: state.location.lon || null
    },
    prefs: {
      destination: d.id,
      budget: state.prefs.budget || 'mid',
      duration: duration,
      group: state.prefs.group || 'couple',
      travelers: state.prefs.travelers || 2
    },
    destinationId: d.id,
    destinationName: d.name,
    customPerDay: state.customPerDay || null,
    estimatedTotal: cost.total,
    itinerary: itineraryData,
    budgetEntries: state.budgetLog || [],
    packingState: state.packingState || {}
  };

  fetch(apiUrl('/api/trips'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + authState.token
    },
    body: JSON.stringify(payload)
  })
    .then(function(res) {
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    })
    .then(function(saved) {
      btns.forEach(function(b) {
        if (b) {
          b.disabled = false;
          b.classList.add('saved');
          var span = b.querySelector('span');
          if (span) span.textContent = 'Saved in Dashboard ✓';
        }
      });
      showItinerarySavedPopup();
    })
    .catch(function(err) {
      btns.forEach(function(b) {
        if (b) {
          b.disabled = false;
          var span = b.querySelector('span');
          if (span) span.textContent = 'Save Trip to Cloud';
        }
      });
      if (typeof showToast === 'function') {
        showToast('Error saving trip: ' + err.message, 'error');
      }
    });
}

/* ── Itinerary Saved Popup ── */
function showItinerarySavedPopup() {
  // Remove existing popup if any
  var existing = document.getElementById('itinerary-saved-popup-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'itinerary-saved-popup-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:99999',
    'display:flex', 'align-items:center', 'justify-content:center',
    'background:rgba(0,0,0,0.55)', 'backdrop-filter:blur(6px)',
    '-webkit-backdrop-filter:blur(6px)',
    'animation:itinOverlayIn 0.25s ease'
  ].join(';');

  overlay.innerHTML = [
    '<style>',
    '@keyframes itinOverlayIn{from{opacity:0}to{opacity:1}}',
    '@keyframes itinPopupIn{from{opacity:0;transform:scale(0.75) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}',
    '@keyframes itinCheckBounce{0%{transform:scale(0)}60%{transform:scale(1.25)}80%{transform:scale(0.9)}100%{transform:scale(1)}}',
    '@keyframes itinConfetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-80px) rotate(360deg);opacity:0}}',
    '#itinerary-saved-popup{',
      'background:rgba(18, 22, 29, 0.96);',
      'border:1px solid rgba(255,255,255,0.2);',
      'border-radius:24px;',
      'padding:48px 40px 40px;',
      'text-align:center;',
      'max-width:420px;',
      'width:90%;',
      'box-shadow:0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15);',
      'backdrop-filter:blur(24px);',
      '-webkit-backdrop-filter:blur(24px);',
      'animation:itinPopupIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;',
      'position:relative;overflow:hidden;',
    '}',
    '#itinerary-saved-popup::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.08) 0%,transparent 65%);pointer-events:none;}',
    '.itin-check-ring{width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.6);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;animation:itinCheckBounce 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both;box-shadow:0 0 30px rgba(255,255,255,0.2);}',
    '.itin-check-svg{width:38px;height:38px;}',
    '.itin-saved-title{font-size:1.55rem;font-weight:800;color:#fff;margin:0 0 8px;letter-spacing:-0.3px;line-height:1.25;}',
    '.itin-saved-sub{font-size:0.95rem;color:rgba(255,255,255,0.65);margin:0 0 28px;line-height:1.5;}',
    '.itin-saved-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:50px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.22);color:#fff;font-size:0.85rem;font-weight:700;margin-bottom:28px;box-shadow:0 4px 16px rgba(0,0,0,0.3);letter-spacing:0.2px;}',
    '.itin-saved-dismiss{width:100%;padding:13px;border-radius:12px;border:none;background:#FFFFFF;color:#0A0D12;font-size:1rem;font-weight:800;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;box-shadow:0 4px 20px rgba(255,255,255,0.25);letter-spacing:0.2px;}',
    '.itin-saved-dismiss:hover{transform:translateY(-2px);background:#F1F5F9;box-shadow:0 8px 24px rgba(255,255,255,0.35);}',
    '.itin-confetti-dot{position:absolute;width:8px;height:8px;border-radius:50%;animation:itinConfetti 1.2s ease forwards;}',
    '</style>',
    '<div id="itinerary-saved-popup">',
      '<span class="itin-confetti-dot" style="top:20%;left:15%;background:#FFFFFF;animation-delay:0.1s;"></span>',
      '<span class="itin-confetti-dot" style="top:15%;left:70%;background:#94A3B8;animation-delay:0.2s;"></span>',
      '<span class="itin-confetti-dot" style="top:25%;left:85%;background:#E2E8F0;animation-delay:0.05s;width:6px;height:6px;"></span>',
      '<span class="itin-confetti-dot" style="top:30%;left:8%;background:#CBD5E1;animation-delay:0.15s;width:5px;height:5px;"></span>',
      '<div class="itin-check-ring">',
        '<svg class="itin-check-svg" viewBox="0 0 24 24" fill="none">',
          '<circle cx="12" cy="12" r="11" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" opacity="0.4"/>',
          '<path d="M7 12.5l3.5 3.5 6.5-7" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
        '</svg>',
      '</div>',
      '<h2 class="itin-saved-title">Itinerary Saved! 🎒</h2>',
      '<p class="itin-saved-sub">Your trip plan has been saved successfully and is ready to access anytime.</p>',
      '<div class="itin-saved-badge">',
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg>',
        'Saved In Your Dashboard',
      '</div>',
      '<button class="itin-saved-dismiss" id="itin-popup-dismiss">View Dashboard &rarr;</button>',
    '</div>'
  ].join('');

  document.body.appendChild(overlay);

  // Dismiss on button click
  document.getElementById('itin-popup-dismiss').addEventListener('click', function() {
    overlay.style.animation = 'itinOverlayIn 0.2s ease reverse forwards';
    setTimeout(function() { overlay.remove(); }, 200);
  });

  // Dismiss on backdrop click
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.animation = 'itinOverlayIn 0.2s ease reverse forwards';
      setTimeout(function() { overlay.remove(); }, 200);
    }
  });

  // Auto-dismiss after 6 seconds
  setTimeout(function() {
    if (document.getElementById('itinerary-saved-popup-overlay')) {
      overlay.style.animation = 'itinOverlayIn 0.3s ease reverse forwards';
      setTimeout(function() { overlay.remove(); }, 300);
    }
  }, 6000);
}

function bindSharePanel(d, duration, cost) {
  var saveCloudBtn = byId('btn-save-cloud');
  if (saveCloudBtn) {
    saveCloudBtn.addEventListener('click', function() {
      saveCurrentTripToCloud(d, duration, cost);
    });
  }

  var saveRecapBtn = byId('btn-save-recap');
  if (saveRecapBtn) {
    saveRecapBtn.addEventListener('click', function() {
      saveCurrentTripToCloud(d, duration, cost);
    });
  }

  byId('btn-copy-link').addEventListener('click', function() {
    var summary = '🗺️ My ' + duration + '-day ' + d.name + ' trip plan (via NextGen Voyagers)\n' +
      '📍 Destination: ' + d.name + ', ' + d.state + '\n' +
      '💰 Estimated cost: ' + inr(cost.total) + '\n' +
      '🛡️ Safety rating: ' + d.safety.score.toFixed(1) + '/5\n' +
      '🌐 Plan yours at: ' + window.location.href;
    navigator.clipboard.writeText(summary).then(function() {
      byId('share-success').classList.add('show');
      setTimeout(function() { byId('share-success').classList.remove('show'); }, 3000);
    }).catch(function() {
      prompt('Copy your itinerary summary:', summary);
    });
  });

  byId('btn-print-plan').addEventListener('click', function() {
    window.print();
  });
}

/* ============================================================
   DAY CHIP SCROLL SYNC
   ============================================================ */
function initDayChipScrollSync(duration) {
  var dayCards = [];
  for (var i = 1; i <= duration; i++) {
    var el = byId('day-' + i);
    if (el) dayCards.push({ idx: i, el: el });
  }

  document.querySelectorAll('.day-chip').forEach(function(chip) {
    chip.addEventListener('click', function(event) {
      event.preventDefault();
      var selected = chip.id.replace('chip-', '');
      dayCards.forEach(function(day) {
        day.el.classList.toggle('day-active', String(day.idx) === selected);
      });
      document.querySelectorAll('.day-chip').forEach(function(item) {
        item.classList.toggle('active', item === chip);
        item.classList.toggle('scrolled-active', item === chip);
      });
      var activeDay = byId('day-' + selected);
      if (activeDay) activeDay.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   SCREEN 5 INIT
   ============================================================ */
function initScreen5() {
  if (!document.getElementById('screen-5')) return;
  byId('btn-back-to-detail').addEventListener('click', function() { goToStep(4); });

  byId('btn-new-trip').addEventListener('click', function() {
    /* Reset state and UI */
    resetPlanner();
    resetPlannerUI();

    goToStep(1);

    /* Scroll back to planner */
    var plannerEl = byId('planner-section');
    if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
