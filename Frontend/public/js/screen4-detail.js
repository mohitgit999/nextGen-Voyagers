'use strict';

/* ============================================================
   VOYAGER — Screen 4: Detail
   Ratings, cost (editable), safety, weather widget,
   packing list preview, transport panel, local emergency,
   compare drawer render
   ============================================================ */

function selectDestination(id) {
  state.selectedId   = id;
  state.customPerDay = null;
  renderDetail();
  unlockStep(4);
  goToStep(4);

  // Update SOS modal context
  var sosNote = byId('sos-context-note');
  if (sosNote) {
    var d = findDest(id);
    if (d) sosNote.textContent = 'Currently viewing plan for ' + d.name + ', ' + d.state + '.';
  }
}

function renderDetail() {
  var d = findDest(state.selectedId);
  if (!d) return;
  var cost = estimateCost(d, state.prefs, state.customPerDay);
  var sub  = {
    'Experience':       clamp(d.rating + 0.1, 0, 5),
    'Value for money':  clamp(d.rating - 0.15, 0, 5),
    'Safety':           d.safety.score,
    'Cleanliness':      clamp(d.rating - 0.05, 0, 5)
  };

  var html = '' +
    /* Header */
    '<div class="detail-head">' +
      '<div>' +
        '<h2>' + d.name + ' ' + d.emoji + '</h2>' +
        '<span class="dest-state" style="font-size:1rem;margin-bottom:10px;display:block;">' + d.state + '</span>' +
        '<div class="tag-row">' +
          d.tags.map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="detail-rating-pill">' +
        icon('star') +
        '<strong>' + d.rating.toFixed(1) + '</strong>' +
        '<span class="hint-text">(' + d.reviews.toLocaleString('en-IN') + ' reviews)</span>' +
      '</div>' +
    '</div>' +

    '<p class="eyebrow-note" style="margin-bottom:26px;">' + d.blurb + '</p>' +

    /* ── Row 1: Ratings · Cost · Safety ── */
    '<div class="panels">' +

      /* Ratings panel */
      '<div class="panel">' +
        '<h3>' + icon('star') + ' Ratings</h3>' +
        Object.keys(sub).map(function(k) {
          var val = sub[k];
          return '' +
            '<div class="bar-row">' +
              '<div class="bar-row-top"><span>' + k + '</span><span>' + val.toFixed(1) + '/5</span></div>' +
              '<div class="bar-track"><div class="bar-fill" style="width:' + (val / 5 * 100) + '%"></div></div>' +
            '</div>';
        }).join('') +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">' + starRow(d.rating) + '</div>' +
      '</div>' +

      /* Cost panel */
      '<div class="panel" id="cost-panel">' +
        '<h3>' + icon('wallet') + ' Estimated cost</h3>' +
        '<div class="cost-total" id="cost-total-display">' + inr(cost.total) + '</div>' +
        '<div class="cost-sub" id="cost-sub-display">Total for ' + state.prefs.travelers + ' traveller' + (state.prefs.travelers > 1 ? 's' : '') + ', ' + state.prefs.duration + ' days · ' + BUDGET_LABEL[state.prefs.budget] + '</div>' +
        cost.slices.map(function(s) {
          return '<div class="cost-row"><span>' + s.label + '</span><span>' + inr(s.amount) + '</span></div>';
        }).join('') +
        '<div style="margin-top:16px;">' +
          '<label style="font-size:0.8rem;font-weight:700;color:var(--ink-faint);display:block;margin-bottom:6px;">Adjust daily spend (₹):</label>' +
          '<input type="number" class="cost-edit-input" id="cost-per-day-input" min="200" max="50000" step="100" value="' + cost.perDay + '" aria-label="Cost per person per day">' +
          '<p class="cost-note">Changes update the total above and your itinerary estimate.</p>' +
        '</div>' +
      '</div>' +

      /* Safety panel */
      '<div class="panel">' +
        '<h3>' + icon('shield') + ' Safety & Guidelines</h3>' +
        '<div class="safety-score-row">' +
          '<span class="safety-score-badge">' + d.safety.score.toFixed(1) + '/5 safety rating</span>' +
        '</div>' +
        '<ul class="safety-list">' +
          d.safety.points.map(function(p) {
            return '<li>' + icon('check') + '<span>' + p + '</span></li>';
          }).join('') +
        '</ul>' +
      '</div>' +

    '</div>' + /* end panels */

    /* ── Interactive Map Section ── */
    renderMapPanel(d) +

    /* ── Live Weather & Real-time Crowd Intensity ── */
    renderLiveWeatherCrowdPanel(d) +

    /* ── Culture & Heritage Section ── */
    renderCulturePanel(d) +

    /* ── Hidden Gems Section ── */
    renderHiddenGemsDetailPanel(d) +

    /* ── Row: Best Time · Transport · Local Emergency ── */
    '<div class="panels" style="margin-top:20px;">' +

      /* Weather widget */
      '<div class="panel">' +
        '<h3>' + icon('sunny') + ' Best time to visit</h3>' +
        renderWeatherWidget(d) +
      '</div>' +

      /* Transport panel */
      '<div class="panel">' +
        '<h3>' + icon('train') + ' Getting there</h3>' +
        renderTransportPanel(d) +
      '</div>' +

      /* Local emergency */
      '<div class="panel">' +
        '<h3>' + icon('phone') + ' Local emergency contacts</h3>' +
        renderLocalEmergencyPanel(d) +
      '</div>' +

    '</div>' +

    /* Packing preview */
    '<div class="panel" style="margin-top:20px;">' +
      '<h3>' + icon('backpack') + ' Packing essentials preview</h3>' +
      renderPackingPreview(d) +
    '</div>' +

    /* CTA */
    '<div class="actions-row">' +
      '<button class="btn btn-primary" id="btn-build-itinerary">Build my AI day-by-day plan ' + icon('arrow') + '</button>' +
      (state.compareIds.length > 0
        ? '<button class="btn btn-ghost" id="btn-add-to-compare">Add to compare</button>'
        : '') +
    '</div>';

  byId('detail-content').innerHTML = html;

  /* Initialize interactive map */
  setTimeout(function() {
    if (typeof renderDestinationMap === 'function') {
      renderDestinationMap('detail-map-canvas', d, state.location.lat, state.location.lon);
    }
  }, 100);

  /* Fetch live weather and crowd intensity */
  loadLiveWeatherAndCrowd(d);

  /* Bind cost input */
  var costInput = byId('cost-per-day-input');
  if (costInput) {
    costInput.addEventListener('input', function() {
      var val = parseInt(costInput.value, 10);
      if (!isNaN(val) && val >= 200) {
        state.customPerDay = val;
        var updated = estimateCost(d, state.prefs, state.customPerDay);
        byId('cost-total-display').textContent = inr(updated.total);
      }
    });
  }

  /* Bind build itinerary */
  byId('btn-build-itinerary').addEventListener('click', function() {
    state.packingState = lsGet('packingState', {});
    state.budgetLog    = lsGet('budgetLog', []);
    generateItinerary();
    unlockStep(5);
    goToStep(5);
  });

  /* Bind add to compare if present */
  var addCompareBtn = byId('btn-add-to-compare');
  if (addCompareBtn) {
    addCompareBtn.addEventListener('click', function() {
      if (typeof toggleCompare === 'function') {
        toggleCompare(state.selectedId);
        addCompareBtn.textContent = (state.compareIds.indexOf(state.selectedId) !== -1) ? 'Added to compare ✓' : 'Add to compare';
      }
    });
  }
}

/* ── Weather widget ── */
function renderWeatherWidget(d) {
  var html = '<div class="weather-month-grid">';
  MONTHS.forEach(function(m) {
    var isBest  = d.weather.best.indexOf(m) !== -1;
    var isAvoid = d.weather.avoid.indexOf(m) !== -1;
    var cls     = isBest ? 'best' : (isAvoid ? 'avoid' : 'neutral');
    var em      = isBest ? '☀️' : (isAvoid ? '🌧️' : '⛅');
    html += '<div class="month-cell ' + cls + '" title="' + m + ': ' + (isBest ? 'Great time to visit' : isAvoid ? 'Avoid if possible' : 'OK season') + '">' +
      '<span class="month-abbr">' + m + '</span>' +
      '<span class="month-icon">' + em + '</span>' +
    '</div>';
  });
  html += '</div>';
  html += '<div class="weather-legend">' +
    '<span class="legend-item"><span class="legend-dot best"></span> Best</span>' +
    '<span class="legend-item"><span class="legend-dot neutral"></span> OK</span>' +
    '<span class="legend-item"><span class="legend-dot avoid"></span> Avoid</span>' +
  '</div>';
  html += '<div class="temp-range">' + icon('sunny') +
    '<span>Temperature: <strong>' + d.weather.temp.min + '°C – ' + d.weather.temp.max + '°C</strong></span>' +
  '</div>';
  html += '<p class="weather-note">' + d.weather.note + '</p>';
  return html;
}

/* ── Transport panel ── */
function renderTransportPanel(d) {
  if (!d.transport) {
    return '<p class="hint-text">Transport details unavailable for this destination.</p>';
  }
  var t = d.transport;
  var train  = t.train  || {};
  var flight = t.flight || {};
  var road   = t.road   || {};

  var trainLabel   = train.label   || train.station  || 'Train';
  var trainDetail  = train.station || '';
  var trainNote    = train.note    || '';
  var flightLabel  = flight.label  || flight.airport || 'Flight';
  var flightDetail = flight.airport || '';
  var flightNote   = flight.note   || '';
  var roadLabel    = road.label    || 'By Road';
  var roadNote     = road.note     || '';

  function mapsLink(query) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query + ', India');
  }

  return '<div class="transport-list">' +

    /* Train */
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('train') + '</div>' +
      '<div style="flex:1;">' +
        '<div class="transport-label">' + trainLabel + '</div>' +
        (trainDetail ? '<div class="transport-detail">' +
          '<a href="' + mapsLink(trainLabel) + '" target="_blank" rel="noopener" style="color:var(--teal);font-weight:600;text-decoration:none;">' + trainDetail + ' ↗</a>' +
        '</div>' : '') +
        (trainNote ? '<div class="transport-note">' + trainNote + '</div>' : '') +
      '</div>' +
    '</div>' +

    /* Flight */
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('plane') + '</div>' +
      '<div style="flex:1;">' +
        '<div class="transport-label">' + flightLabel + '</div>' +
        (flightDetail ? '<div class="transport-detail">' +
          '<a href="' + mapsLink(flightDetail) + '" target="_blank" rel="noopener" style="color:var(--teal);font-weight:600;text-decoration:none;">' + flightDetail + ' ↗</a>' +
        '</div>' : '') +
        (flightNote ? '<div class="transport-note">' + flightNote + '</div>' : '') +
      '</div>' +
    '</div>' +

    /* Road */
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('car') + '</div>' +
      '<div style="flex:1;">' +
        '<div class="transport-label">' + roadLabel + '</div>' +
        (roadNote ? '<div class="transport-note">' + roadNote + '</div>' : '') +
        '<a href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(d.name + ', ' + d.state) + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;font-size:0.8rem;color:var(--teal);font-weight:700;text-decoration:none;">🗺️ Get Directions →</a>' +
      '</div>' +
    '</div>' +

  '</div>';
}

/* ── Local emergency panel ── */
function renderLocalEmergencyPanel(d) {
  var e = d.localEmergency || {};
  var police   = e.police   || null;
  var hospital = e.hospital || null;
  var tourist  = e.tourist  || null;

  function phoneRow(label, val) {
    if (!val) return '<div class="local-emerg-item">' +
      '<span class="local-emerg-label">' + label + '</span>' +
      '<span class="local-emerg-num" style="opacity:0.4;">Not listed</span>' +
    '</div>';

    /* Extract first number-like token for tel: link */
    var numMatch = val.match(/[\d\-\+\s]{7,}/);
    var telNum = numMatch ? numMatch[0].replace(/\s/g, '') : null;

    return '<div class="local-emerg-item">' +
      '<span class="local-emerg-label">' + label + '</span>' +
      '<span class="local-emerg-num">' +
        icon('phone') +
        (telNum
          ? '<a href="tel:' + telNum + '" style="color:var(--teal);font-weight:700;text-decoration:none;">' + val + '</a>'
          : '<strong>' + val + '</strong>') +
      '</span>' +
    '</div>';
  }

  return '<div class="local-emergency-list">' +
    phoneRow('Local Police', police) +
    phoneRow('Hospital', hospital) +
    phoneRow('Tourism Helpline', tourist) +
    '<div style="margin-top:14px;padding:10px 12px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;font-size:0.82rem;color:var(--ink-soft);">' +
      '🚨 <strong>National Emergency:</strong> <a href="tel:112" style="color:#ef4444;font-weight:700;text-decoration:none;">112</a> &nbsp;|&nbsp; ' +
      '🏥 <strong>Ambulance:</strong> <a href="tel:108" style="color:#ef4444;font-weight:700;text-decoration:none;">108</a> &nbsp;|&nbsp; ' +
      '👮 <strong>Police:</strong> <a href="tel:100" style="color:#ef4444;font-weight:700;text-decoration:none;">100</a>' +
    '</div>' +
  '</div>';
}

/* ── Packing preview ── */
function renderPackingPreview(d) {
  var all = [];
  all = all.concat(BASE_PACKING.documents.slice(0, 2));
  all = all.concat(BASE_PACKING.clothing.slice(0, 2));
  all = all.concat(d.packingExtras.slice(0, 4));
  all = all.concat(BASE_PACKING.health.slice(0, 2));

  return '<p style="font-size:0.82rem;color:var(--ink-faint);margin-bottom:14px;">Key items for this trip — full checklist in your itinerary.</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:7px;">' +
      all.map(function(item) {
        return '<span class="tag-chip" style="font-size:0.78rem;">✓ ' + item + '</span>';
      }).join('') +
    '</div>' +
    '<p style="font-size:0.78rem;color:var(--forest);font-weight:700;margin-top:12px;">+ ' + (BASE_PACKING.documents.length + BASE_PACKING.clothing.length + BASE_PACKING.health.length + BASE_PACKING.tech.length + BASE_PACKING.misc.length + d.packingExtras.length - all.length) + ' more items in your full itinerary checklist</p>';
}

/* ── Interactive Map Panel ── */
function renderMapPanel(d) {
  var attractions = (d.nearbyAttractions || []).slice(0, 6);
  var gems = (d.hiddenGems || []).slice(0, 4);

  return '' +
    '<div class="panel map-panel-container" style="margin-top:20px;">' +
      '<div class="map-panel-head">' +
        '<div>' +
          '<h3>' + icon('location') + ' Interactive Destination & Route Map</h3>' +
          '<p class="hint-text">Explore points of interest, nearby attractions, and secret spots</p>' +
        '</div>' +
        '<div class="map-legend-pills">' +
          '<span class="legend-pill pin-dest">📍 Main Area</span>' +
          '<span class="legend-pill pin-attr">🎯 Attractions</span>' +
          '<span class="legend-pill pin-gem">💎 Hidden Gems</span>' +
        '</div>' +
      '</div>' +
      '<div id="detail-map-canvas" class="detail-map-canvas" style="height:380px;border-radius:12px;margin:14px 0;"></div>' +
      '<div class="map-spot-chips">' +
        attractions.map(function(a) {
          return '<button class="spot-filter-chip" onclick="if(window.voyagerMaps && window.voyagerMaps[\'detail-map-canvas\']) { window.voyagerMaps[\'detail-map-canvas\'].setView([' + a.lat + ',' + a.lon + '], 14); }">' +
            '🎯 ' + a.name + '</button>';
        }).join('') +
        gems.map(function(g) {
          return '<button class="spot-filter-chip gem-chip" onclick="if(window.voyagerMaps && window.voyagerMaps[\'detail-map-canvas\']) { window.voyagerMaps[\'detail-map-canvas\'].setView([' + g.lat + ',' + g.lon + '], 14); }">' +
            '💎 ' + g.name + '</button>';
        }).join('') +
      '</div>' +
    '</div>';
}

/* ── Live Weather & Real-time Crowd Intensity ── */
function renderLiveWeatherCrowdPanel(d) {
  return '' +
    '<div class="panels" style="margin-top:20px;">' +

      /* Live Weather */
      '<div class="panel" id="live-weather-card">' +
        '<h3>' + icon('sunny') + ' Live Weather Forecast</h3>' +
        '<div id="live-weather-content">' +
          '<div class="weather-loading-shim">Fetching real-time atmospheric data for ' + d.name + '...</div>' +
        '</div>' +
      '</div>' +

      /* Crowd Intensity */
      '<div class="panel" id="live-crowd-card">' +
        '<h3><span style="font-size:1.2rem;">👥</span> Crowd Intensity & Peak Times</h3>' +
        '<div id="live-crowd-content">' +
          '<div class="weather-loading-shim">Analyzing crowd patterns for ' + d.name + '...</div>' +
        '</div>' +
      '</div>' +

    '</div>';
}

function loadLiveWeatherAndCrowd(d) {
  // Weather
  fetch(apiUrl('/api/weather/' + encodeURIComponent(d.name)))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var wEl = byId('live-weather-content');
      if (!wEl) return;
      var cur = data.current || { temp: Math.round((d.weather.temp.min + d.weather.temp.max) / 2), condition: 'Clear', description: 'Sunny & pleasant', humidity: 55, windSpeed: 3.5 };
      wEl.innerHTML = '' +
        '<div class="live-weather-summary">' +
          '<div class="live-temp-huge">' + cur.temp + '°C</div>' +
          '<div class="live-weather-meta">' +
            '<div class="live-cond-name">' + cur.condition + '</div>' +
            '<div class="live-cond-desc">' + cur.description + '</div>' +
            '<div class="live-sub-stats">' +
              '<span>💧 Humidity: ' + cur.humidity + '%</span> · ' +
              '<span>💨 Wind: ' + cur.windSpeed + ' m/s</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="weather-status-tag">Status: ' + (cur.temp > 32 ? '☀️ Warm day ahead' : (cur.temp < 15 ? '🧥 Cool & crisp' : '🌿 Perfect exploration climate')) + '</div>';
    })
    .catch(function() {
      var wEl = byId('live-weather-content');
      if (!wEl) return;
      var avgTemp = Math.round((d.weather.temp.min + d.weather.temp.max) / 2);
      wEl.innerHTML = '' +
        '<div class="live-weather-summary">' +
          '<div class="live-temp-huge">' + avgTemp + '°C</div>' +
          '<div class="live-weather-meta">' +
            '<div class="live-cond-name">Pleasant</div>' +
            '<div class="live-cond-desc">Ideal for sightseeing</div>' +
            '<div class="live-sub-stats">Typical range: ' + d.weather.temp.min + '°C to ' + d.weather.temp.max + '°C</div>' +
          '</div>' +
        '</div>';
    });

  // Crowd
  fetch(apiUrl('/api/weather/' + encodeURIComponent(d.name) + '/crowd'))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var cEl = byId('live-crowd-content');
      if (!cEl) return;
      var crowd = data.crowd || {
        level: d.crowdPatterns ? d.crowdPatterns.generalLevel : 'Moderate',
        score: 55,
        peakHours: d.crowdPatterns ? d.crowdPatterns.peakHours : '11:00 AM – 4:00 PM',
        bestHours: d.crowdPatterns ? d.crowdPatterns.bestHours : 'Early Morning (7:00 AM – 9:30 AM)',
        tip: d.crowdPatterns ? d.crowdPatterns.visitingTip : 'Visit key attractions early in the morning.'
      };
      renderCrowdMeter(cEl, crowd);
    })
    .catch(function() {
      var cEl = byId('live-crowd-content');
      if (!cEl) return;
      var cp = d.crowdPatterns || { generalLevel: 'Moderate', peakHours: '11:00 AM – 4:00 PM', bestHours: '7:00 AM – 9:30 AM', visitingTip: 'Start your tours before 10 AM to avoid peak rush.' };
      renderCrowdMeter(cEl, {
        level: cp.generalLevel,
        score: cp.generalLevel === 'High' ? 78 : (cp.generalLevel === 'Low' ? 30 : 55),
        peakHours: cp.peakHours,
        bestHours: cp.bestHours,
        tip: cp.visitingTip
      });
    });
}

function renderCrowdMeter(cEl, crowd) {
  var levelColors = {
    Low: '#2A9D8F',
    Moderate: '#E9C46A',
    High: '#F4A261',
    Peak: '#E76F51'
  };
  var color = levelColors[crowd.level] || '#2A9D8F';

  cEl.innerHTML = '' +
    '<div class="crowd-meter-head">' +
      '<span class="crowd-level-badge" style="background:' + color + '20;color:' + color + ';border:1px solid ' + color + ';">' +
        'Intensity: ' + crowd.level +
      '</span>' +
      '<span class="crowd-score-num">' + crowd.score + '/100</span>' +
    '</div>' +
    '<div class="crowd-bar-track"><div class="crowd-bar-fill" style="width:' + crowd.score + '%;background:' + color + ';"></div></div>' +
    '<div class="crowd-details-grid">' +
      '<div class="crowd-detail-item"><span class="crowd-label">⏰ Peak Crowd Hours:</span> <strong class="crowd-val">' + crowd.peakHours + '</strong></div>' +
      '<div class="crowd-detail-item"><span class="crowd-label">🌅 Best Time to Visit:</span> <strong class="crowd-val" style="color:var(--forest);">' + crowd.bestHours + '</strong></div>' +
    '</div>' +
    '<div class="crowd-tip-box">💡 ' + crowd.tip + '</div>';
}

/* ── Culture & Heritage Section ── */
function renderCulturePanel(d) {
  if (!d.culture) return '';
  var c = d.culture;

  return '' +
    '<div class="panel" style="margin-top:20px;">' +
      '<h3><span style="font-size:1.2rem;">🏛️</span> Culture, Heritage & Local Traditions</h3>' +
      '<p class="hint-text" style="margin-bottom:16px;">Immerse yourself respectfully into ' + d.name + '\'s timeless living heritage</p>' +
      '<div class="culture-grid">' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">📜 Heritage & History</div>' +
          '<p class="culture-card-text">' + c.heritage + '</p>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">👗 Dress Code & Etiquette</div>' +
          '<p class="culture-card-text">' + c.etiquette + '</p>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">🎉 Festivals & Celebrations</div>' +
          '<div class="culture-tags">' +
            c.festivals.map(function(f) { return '<span class="tag-chip tag-festival">🎊 ' + f + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">🍲 Culinary Heritage</div>' +
          '<div class="culture-tags">' +
            c.culinaryHighlights.map(function(dish) { return '<span class="tag-chip tag-food">🥘 ' + dish + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
      (c.languagePhrases ? '' +
        '<div class="language-bar" style="margin-top:16px;padding:12px 16px;background:rgba(27,184,154,0.06);border-radius:10px;border:1px solid rgba(27,184,154,0.2);">' +
          '<strong style="color:var(--forest);font-size:0.85rem;">🗣️ Useful Local Phrases: </strong>' +
          '<span style="font-size:0.85rem;color:var(--ink);">' +
            Object.keys(c.languagePhrases).map(function(k) { return '<strong>"' + k + '"</strong> = ' + c.languagePhrases[k]; }).join(' · ') +
          '</span>' +
        '</div>' : '') +
    '</div>';
}

/* ── Hidden Gems Showcase Panel ── */
function renderHiddenGemsDetailPanel(d) {
  if (!d.hiddenGems || !d.hiddenGems.length) return '';

  return '' +
    '<div class="panel" style="margin-top:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<div>' +
          '<h3><span style="font-size:1.2rem;">💎</span> Secret Spots & Hidden Gems</h3>' +
          '<p class="hint-text">Off-the-beaten-path locations vetted by locals & seasoned voyagers</p>' +
        '</div>' +
        '<span class="badge-gem-count">' + d.hiddenGems.length + ' Discovered</span>' +
      '</div>' +
      '<div class="hidden-gems-grid">' +
        d.hiddenGems.map(function(gem) {
          return '' +
            '<div class="gem-card">' +
              '<div class="gem-card-head">' +
                '<div class="gem-title-wrap">' +
                  '<span class="gem-icon">💎</span>' +
                  '<h4>' + gem.name + '</h4>' +
                '</div>' +
                '<span class="gem-vibe-tag">' + gem.vibe + '</span>' +
              '</div>' +
              '<p class="gem-desc">' + gem.description + '</p>' +
              '<div class="gem-meta">' +
                '<div class="gem-meta-row"><span>🕒 Best Time:</span> <strong>' + gem.bestTime + '</strong></div>' +
                '<div class="gem-tip-row"><span>💡 Secret Tip:</span> <em>' + gem.tip + '</em></div>' +
              '</div>' +
            '</div>';
        }).join('') +
      '</div>' +
    '</div>';
}

/* ── Compare drawer ── */
function renderCompareDrawer() {
  if (state.compareIds.length < 2) return;
  var d1 = findDest(state.compareIds[0]);
  var d2 = findDest(state.compareIds[1]);
  if (!d1 || !d2) return;

  var c1 = estimateCost(d1, state.prefs, null);
  var c2 = estimateCost(d2, state.prefs, null);

  var betterRating = d1.rating >= d2.rating ? 0 : 1;
  var betterCost   = c1.perDay <= c2.perDay ? 0 : 1;
  var betterSafety = d1.safety.score >= d2.safety.score ? 0 : 1;

  function cls(idx, winner) { return idx === winner ? 'winner' : 'loser'; }

  var content = byId('compare-content');
  if (!content) return;

  content.innerHTML =
    '<div class="compare-cols">' +
      [d1, d2].map(function(d, i) {
        var c = i === 0 ? c1 : c2;
        return '' +
          '<div>' +
            '<div class="compare-col-head">' +
              '<h3>' + d.name + ' ' + d.emoji + '</h3>' +
              '<span class="dest-state">' + d.state + '</span>' +
            '</div>' +

            '<div class="compare-section"><div class="compare-section-label">Overall rating</div>' +
              '<div class="compare-val ' + cls(i, betterRating) + '">' + d.rating.toFixed(1) + '/5 ⭐ (' + d.reviews.toLocaleString('en-IN') + ' reviews)</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Cost per person/day</div>' +
              '<div class="compare-val ' + cls(i, betterCost) + '">' + inr(c.perDay) + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Safety score</div>' +
              '<div class="compare-val ' + cls(i, betterSafety) + '">' + d.safety.score.toFixed(1) + '/5 🛡️</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Best for</div>' +
              '<div class="compare-val">' + d.bestFor.join(', ') + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Best months</div>' +
              '<div class="compare-val">' + d.weather.best.join(', ') + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Tags</div>' +
              '<div class="tag-row">' + d.tags.map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Estimated total (' + state.prefs.duration + ' days)</div>' +
              '<div class="compare-val ' + cls(i, betterCost) + '">' + inr(c.total) + '</div></div>' +

            '<button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="selectDestination(\'' + d.id + '\');byId(\'compare-drawer\').classList.remove(\'open\');">Plan trip to ' + d.name + '</button>' +
          '</div>';
      }).join('') +
    '</div>';
}

/* ── Back ── */
function initScreen4() {
  if (!document.getElementById('screen-4')) return;
  byId('btn-back-to-explore').addEventListener('click', function() { goToStep(3); });
}
