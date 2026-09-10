'use strict';

/* ============================================================
   VOYAGER — Screen 5: Itinerary
   AI-powered day-by-day plan, Leaflet day routing map,
   interactive category budget tracker, dynamic packing checklist,
   share/print, scroll-sync day chips, new trip reset
   ============================================================ */

var currentAiPlan = null;
var isGeneratingAi = false;

/* ============================================================
   GENERATE ITINERARY
   ============================================================ */
function generateItinerary() {
  var d        = findDest(state.selectedId);
  if (!d) return;
  var duration = state.prefs.duration;
  var cost     = estimateCost(d, state.prefs, state.customPerDay);

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
      theme = d.dayThemes[(j - 1) % d.dayThemes.length];
    }

    var morning = aiDay && aiDay.morning ? (aiDay.morning.activity + (aiDay.morning.location ? ' (📍 ' + aiDay.morning.location + ')' : '')) : d.activities.morning[(j - 1) % d.activities.morning.length];
    var afternoon = aiDay && aiDay.afternoon ? (aiDay.afternoon.activity + (aiDay.afternoon.location ? ' (📍 ' + aiDay.afternoon.location + ')' : '')) : d.activities.afternoon[(j - 1) % d.activities.afternoon.length];
    var evening = aiDay && aiDay.evening ? (aiDay.evening.activity + (aiDay.evening.location ? ' (📍 ' + aiDay.evening.location + ')' : '')) : d.activities.evening[(j - 1) % d.activities.evening.length];
    var safetyPoints = d.safety && Array.isArray(d.safety.points) && d.safety.points.length
      ? d.safety.points
      : ['Follow current local safety guidance and keep emergency contacts accessible.'];
    var tip = aiDay && aiDay.safetyTip ? aiDay.safetyTip : safetyPoints[(j - 1) % safetyPoints.length];
    var culturalNote = aiDay && aiDay.culturalNote ? aiDay.culturalNote : (d.culture ? d.culture.etiquette : 'Respect local customs and sacred sites.');
    var hiddenGem = aiDay && aiDay.hiddenGem ? aiDay.hiddenGem : (d.hiddenGems && d.hiddenGems[(j - 1) % d.hiddenGems.length] ? d.hiddenGems[(j - 1) % d.hiddenGems.length].name + ' — ' + (d.hiddenGems[(j - 1) % d.hiddenGems.length].tip || d.hiddenGems[(j - 1) % d.hiddenGems.length].description || '') : null);
    var taskText = function(task, fallback) {
      if (!task) return fallback;
      var activity = task.activity || task.description || fallback;
      var location = task.location ? ' <span class="task-location">📍 ' + task.location + '</span>' : '';
      return activity + location;
    };

    days += '' +
      '<div class="day-card' + (j === 1 ? ' day-active' : '') + '" id="day-' + j + '" data-day="' + j + '">' +
        '<div class="day-card-head">' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span class="day-num">' + String(j).padStart(2, '0') + '</span>' +
            '<div>' +
              '<span class="day-theme">' + theme + '</span>' +
              '<div class="day-meta-pill-row">' +
                '<span class="day-sub-pill crowd-pill">👥 ' + crowdLevel + ' Crowd</span>' +
                '<span class="day-sub-pill peak-pill">⏰ Peak: ' + peakHours + '</span>' +
                '<span class="day-sub-pill weather-pill">☀️ ' + d.weather.temp.min + '-' + d.weather.temp.max + '°C</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="day-budget-badge">' + inr(perDayCost) + '/person</div>' +
        '</div>' +

        '<div class="day-parts day-task-grid">' +
          '<div class="day-part">' +
            '<div class="day-part-label"><span class="part-dot dot-morning"></span>Morning (08:30 – 12:30)</div>' +
            '<div class="day-part-text">' + (aiDay && aiDay.morning ? taskText(aiDay.morning, morning) : morning) + '</div>' +
          '</div>' +
          '<div class="day-part">' +
            '<div class="day-part-label"><span class="part-dot dot-afternoon"></span>Midday (12:30 – 13:00)</div>' +
            '<div class="day-part-text">Travel to the next AI-selected stop and take a short break.</div>' +
          '</div>' +
          '<div class="day-part">' +
            '<div class="day-part-label"><span class="part-dot dot-afternoon"></span>Afternoon (13:00 – 17:00)</div>' +
            '<div class="day-part-text">' + (aiDay && aiDay.afternoon ? taskText(aiDay.afternoon, afternoon) : afternoon) + '</div>' +
          '</div>' +
          '<div class="day-part">' +
            '<div class="day-part-label"><span class="part-dot dot-evening"></span>Evening & Night (18:00 – 22:00)</div>' +
            '<div class="day-part-text">' + (aiDay && aiDay.evening ? taskText(aiDay.evening, evening) : evening) + '</div>' +
          '</div>' +
          '<div class="day-part">' +
            '<div class="day-part-label"><span class="part-dot dot-evening"></span>Smart Tip</div>' +
            '<div class="day-part-text">' + (hiddenGem || culturalNote) + '</div>' +
          '</div>' +
        '</div>' +

        /* Day budget breakdown */
        '<div class="day-budget-row">' +
          '<span class="budget-mini-chip">🏨 Stay: ' + inr(stayAlloc) + '</span>' +
          '<span class="budget-mini-chip">🍲 Food: ' + inr(foodAlloc) + '</span>' +
          '<span class="budget-mini-chip">🚖 Transport: ' + inr(transAlloc) + '</span>' +
          '<span class="budget-mini-chip">🎟️ Activities: ' + inr(actAlloc) + '</span>' +
        '</div>' +

        /* Hidden gem & culture callouts */
        (hiddenGem ? '' +
          '<div class="day-gem-callout">' +
            '<strong>💎 Off-beat Gem:</strong> <span>' + hiddenGem + '</span>' +
          '</div>' : '') +

        '<div class="cultural-tip-row">' +
          '<strong>🏛️ Cultural Etiquette:</strong> <span>' + culturalNote + '</span>' +
        '</div>' +

        '<div class="safety-note">' + icon('shield') + '<span>' + tip + '</span></div>' +
      '</div>';
  }
  return days;
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
  if (dest.nearbyAttractions) {
    dest.nearbyAttractions.slice(0, Math.min(duration + 2, 7)).forEach(function(a, idx) {
      points.push([a.lat, a.lon]);
      var attractionMarker = L.marker([a.lat, a.lon], {
        icon: getMarkerIcon(a.type)
      }).addTo(map);
      bindGoogleMapsMarker(attractionMarker, a.name, a.lat, a.lon, 'Day ' + ((idx % duration) + 1) + ' stop');
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

function bindGoogleMapsMarker(marker, label, lat, lon, prefix) {
  var googleUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lat + ',' + lon);
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

  fetch('/api/ai/generate-itinerary', {
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
      if (typeof showToast === 'function') {
        showToast('Smart local itinerary generated with hidden gems & cultural tips!', 'info');
      }
      generateItinerary();
    });
}

function buildLocalSmartItinerary(d, duration, cost) {
  var days = [];
  var perDayCost = cost.perDay;
  var gems = d.hiddenGems || [];
  var attrs = d.nearbyAttractions || [];

  for (var i = 1; i <= duration; i++) {
    var gem = gems[(i - 1) % (gems.length || 1)];
    var attr = attrs[(i - 1) % (attrs.length || 1)];
    var theme = d.dayThemes[(i - 1) % d.dayThemes.length];

    days.push({
      day: i,
      theme: theme + (gem ? ' & Secret Discovery' : ''),
      morning: {
        activity: d.activities.morning[(i - 1) % d.activities.morning.length],
        location: attr ? attr.name : d.name + ' Old Quarter'
      },
      afternoon: {
        activity: d.activities.afternoon[(i - 1) % d.activities.afternoon.length],
        location: gem ? gem.name : d.name + ' Central'
      },
      evening: {
        activity: d.activities.evening[(i - 1) % d.activities.evening.length],
        location: d.name + ' Scenic Vista'
      },
      budget: {
        stay: Math.round(perDayCost * 0.45),
        food: Math.round(perDayCost * 0.25),
        transport: Math.round(perDayCost * 0.15),
        activities: Math.round(perDayCost * 0.15)
      },
      safetyTip: d.safety.points[(i - 1) % d.safety.points.length],
      culturalNote: d.culture ? d.culture.etiquette : 'Respect local traditions and photography rules.',
      hiddenGem: gem ? gem.name + ' — ' + gem.tip : null
    });
  }

  return {
    title: duration + '-Day Curated Voyager Plan',
    days: days
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
      '<h3>' + icon('share') + ' Save & share your itinerary</h3>' +
      '<div class="share-actions">' +
        '<button class="btn btn-save-cloud btn-sm" id="btn-save-cloud">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>' +
          '<span>Save Trip to Cloud</span>' +
        '</button>' +
        '<button class="btn btn-ghost btn-sm" id="btn-copy-link">' + icon('share') + ' Copy summary</button>' +
        '<button class="btn btn-ghost btn-sm" id="btn-print-plan">' + icon('print') + ' Print / Save PDF</button>' +
      '</div>' +
      '<div class="share-success" id="share-success">' + icon('check') + 'Link copied to clipboard!</div>' +
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
          if (span) span.textContent = 'Saved in Cloud ✓';
        }
      });
      if (typeof showToast === 'function') {
        showToast('Itinerary saved to your account in MongoDB Atlas! 🎒', 'success');
      }
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
