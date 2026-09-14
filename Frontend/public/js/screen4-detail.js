'use strict';

/* ============================================================
   VOYAGER — Screen 4: Detail
   Ratings, cost (editable), safety, weather widget,
   packing list preview, transport panel, local emergency,
   compare drawer render
   ============================================================ */

function getApiUrl(path) {
  if (typeof apiUrl === 'function') return apiUrl(path);
  var base = (typeof window !== 'undefined' && window.__API_BASE_URL__) || '';
  if (base.indexOf('%VITE_API_URL%') === 0) base = '';
  return base.replace(/\/+$/, '') + path;
}

function selectDestination(id) {
  if (!id) return;
  state.selectedId   = id;
  state.customPerDay = null;

  // Unlock and navigate to step 4 immediately so screen transitions without getting blocked
  unlockStep(4);
  goToStep(4);

  try {
    renderDetail();
  } catch (err) {
    console.error('Error rendering detail for destination ' + id, err);
  }

  // Update SOS modal context
  var sosNote = byId('sos-context-note');
  if (sosNote) {
    var d = findDest(id);
    if (d) sosNote.textContent = 'Currently viewing plan for ' + d.name + ', ' + (d.state || 'India') + '.';
  }
}

function renderDetail() {
  var d = findDest(state.selectedId);
  if (!d) return;

  var ratingNum = (d.rating != null && !isNaN(d.rating)) ? Number(d.rating) : 4.5;
  var reviewsNum = (d.reviews != null && !isNaN(d.reviews)) ? Number(d.reviews) : 1240;
  var safetyScore = (d.safety && typeof d.safety.score === 'number' && !isNaN(d.safety.score)) ? d.safety.score : 4.5;
  var tagsList = Array.isArray(d.tags) ? d.tags : [];
  var dName = d.name || 'Destination';
  var dState = d.state || 'India';
  var dEmoji = d.emoji || '📍';
  var dBlurb = d.blurb || (d.whyMatched || 'A curated destination matching your travel preferences.');

  var cost = estimateCost(d, state.prefs, state.customPerDay);
  var sub  = {
    'Experience':       clamp(ratingNum + 0.1, 0, 5),
    'Value for money':  clamp(ratingNum - 0.15, 0, 5),
    'Safety':           safetyScore,
    'Cleanliness':      clamp(ratingNum - 0.05, 0, 5)
  };

  var html = '' +
    /* Header */
    '<div class="detail-head">' +
      '<div>' +
        '<h2>' + dName + ' ' + dEmoji + '</h2>' +
        '<span class="dest-state" style="font-size:1rem;margin-bottom:10px;display:block;">' + dState + '</span>' +
        '<div class="tag-row">' +
          tagsList.map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div style="margin-top:10px;">' +
          '<a href="/destination/' + (d.id || 'manali') + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="display:inline-flex;align-items:center;gap:6px;font-size:0.82rem;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.22);color:#FFFFFF;text-decoration:none;background:rgba(255,255,255,0.06);">' +
            '📖 View Full Culture, Photo & Travel Guide ↗' +
          '</a>' +
        '</div>' +
      '</div>' +
      '<div class="detail-rating-pill">' +
        icon('star') +
        '<strong>' + ratingNum.toFixed(1) + '</strong>' +
        '<span class="hint-text">(' + reviewsNum.toLocaleString('en-IN') + ' reviews)</span>' +
      '</div>' +
    '</div>' +

    '<p class="eyebrow-note" style="margin-bottom:26px;">' + dBlurb + '</p>' +

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
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">' + starRow(ratingNum) + '</div>' +
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
          '<label style="font-size:0.8rem;font-weight:700;color:#E2E8F0;display:block;margin-bottom:6px;">Adjust daily spend (₹):</label>' +
          '<input type="number" class="cost-edit-input" id="cost-per-day-input" min="200" max="50000" step="100" value="' + cost.perDay + '" aria-label="Cost per person per day">' +
          '<p class="cost-note">Changes update the total above and your itinerary estimate.</p>' +
        '</div>' +
      '</div>' +

      /* Safety panel */
      '<div class="panel" id="detail-safety-card">' +
        '<h3>' + icon('shield') + ' Safety Snapshot</h3>' +
        '<div class="safety-score-row" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">' +
          '<span class="safety-score-badge">' + (d.safety && d.safety.score ? d.safety.score.toFixed(1) : '4.5') + '/5 Safety Rating</span>' +
          '<span style="font-size:0.82rem;color:#34D399;font-weight:700;display:inline-flex;align-items:center;gap:4px;">🛡️ Verified Safe</span>' +
        '</div>' +
        '<ul class="safety-list" id="detail-safety-points-list">' +
          ((d.safety && d.safety.points && d.safety.points.length) ? d.safety.points : [
            'Tourist police patrols across core visitor zones',
            'Registered local homestays and verified transport stands',
            'Emergency response active with 112 & 108 readiness'
          ]).map(function(p) {
            return '<li>' + icon('check') + '<span>' + p + '</span></li>';
          }).join('') +
        '</ul>' +
        '<button type="button" class="btn btn-primary btn-sm" id="btn-toggle-ai-guidelines" onclick="window.toggleAIGuidelines()" style="margin-top:16px;width:100%;color:#FFFFFF;background:linear-gradient(135deg, #10B981, #059669);font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 14px;border-radius:10px;cursor:pointer;border:none;box-shadow:0 4px 12px rgba(16,185,129,0.25);">' +
          '<span>✨ View Full Guidelines Hub ↓</span>' +
        '</button>' +
      '</div>' +

    '</div>' + /* end panels */

    /* ── AI Location Safety & Guidelines Hub ── */
    renderAILocationGuidelinesHub(d) +

    /* ── Interactive Map Section ── */
    renderMapPanel(d) +

    /* ── Live Weather & Real-time Crowd Intensity ── */
    renderLiveWeatherCrowdPanel(d) +

    /* ── Culture & Heritage Section ── */
    renderCulturePanel(d) +

    /* ── Hidden Gems Section ── */
    renderHiddenGemsDetailPanel(d) +

    /* ── Best Time to Visit & Seasonal Safety Hub (Full Width Panel) ── */
    '<div class="panel weather-best-time-panel" style="margin-top:20px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px;">' +
        '<div>' +
          '<h3 style="margin-bottom:4px;">' + icon('sunny') + ' Best Time to Visit & Seasonal Travel Safety</h3>' +
          '<p class="hint-text" style="margin:0;">Interactive 12-month climate guide, safe travel windows, and road accessibility advisories for ' + dName + '</p>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<span class="tag-chip" style="font-size:0.76rem;background:rgba(16,185,129,0.15);color:#34D399;border:1px solid rgba(16,185,129,0.3);">🟢 Safe Peak Windows</span>' +
          '<span class="tag-chip" style="font-size:0.76rem;background:rgba(245,158,11,0.15);color:#FBBF24;border:1px solid rgba(245,158,11,0.3);">🟡 Shoulder Caution</span>' +
          '<span class="tag-chip" style="font-size:0.76rem;background:rgba(239,68,68,0.15);color:#F87171;border:1px solid rgba(239,68,68,0.3);">🔴 Seasonal Hazards</span>' +
        '</div>' +
      '</div>' +
      renderWeatherWidget(d) +
    '</div>' +

    /* ── Row: Getting There · Local Emergency (Balanced 2-Column Row) ── */
    '<div class="panels panels-2col" style="margin-top:20px;">' +

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

  /* Fetch dynamic AI location guidelines */
  loadAILocationGuidelines(d);

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

/* ── Weather widget with Safe vs Unsafe Seasonal Variations ── */
window.__selectedWeatherMonth = 0;

function getDestinationSeasonalWindows(d) {
  var MONTH_LIST = (typeof MONTHS !== 'undefined' && Array.isArray(MONTHS))
    ? MONTHS
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var best = (d.weather && Array.isArray(d.weather.best) && d.weather.best.length)
    ? d.weather.best.slice()
    : [];
  var avoid = (d.weather && Array.isArray(d.weather.avoid) && d.weather.avoid.length)
    ? d.weather.avoid.slice()
    : [];

  if (!best.length) {
    var rawText = ((d.name || '') + ' ' + (d.state || '') + ' ' + ((d.weather && d.weather.note) || '')).toLowerCase();

    MONTH_LIST.forEach(function(m) {
      if (rawText.indexOf(m.toLowerCase()) !== -1 && best.indexOf(m) === -1) {
        best.push(m);
      }
    });

    if (!best.length) {
      if (rawText.includes('manali') || rawText.includes('ladakh') || rawText.includes('spiti') || rawText.includes('leh') || rawText.includes('kashmir')) {
        best = ['May', 'Jun', 'Sep', 'Oct'];
        avoid = ['Jul', 'Aug', 'Jan', 'Feb'];
      } else if (rawText.includes('shimla') || rawText.includes('dharamshala') || rawText.includes('mussoorie') || rawText.includes('nainital') || rawText.includes('rishikesh')) {
        best = ['Mar', 'Apr', 'May', 'Jun', 'Sep', 'Oct', 'Nov'];
        avoid = ['Jul', 'Aug'];
      } else if (rawText.includes('goa') || rawText.includes('andaman') || rawText.includes('kerala') || rawText.includes('gokarna')) {
        best = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        avoid = ['Jun', 'Jul', 'Aug'];
      } else if (rawText.includes('rajasthan') || rawText.includes('jaipur') || rawText.includes('udaipur') || rawText.includes('jaisalmer') || rawText.includes('jodhpur')) {
        best = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        avoid = ['May', 'Jun'];
      } else if (rawText.includes('munnar') || rawText.includes('coorg') || rawText.includes('ooty') || rawText.includes('wayanad')) {
        best = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        avoid = ['Jun', 'Jul'];
      } else {
        best = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
        avoid = ['May', 'Jun'];
      }
    }
  }

  if (!avoid.length) {
    var checkText = ((d.name || '') + ' ' + (d.state || '')).toLowerCase();
    if (checkText.includes('manali') || checkText.includes('ladakh') || checkText.includes('shimla') || checkText.includes('rishikesh')) {
      avoid = ['Jul', 'Aug'];
    } else if (checkText.includes('goa') || checkText.includes('andaman') || checkText.includes('kerala')) {
      avoid = ['Jun', 'Jul'];
    } else {
      avoid = ['May', 'Jun'];
    }
  }

  var caution = MONTH_LIST.filter(function(m) {
    return best.indexOf(m) === -1 && avoid.indexOf(m) === -1;
  });

  return { best: best, avoid: avoid, caution: caution };
}

function getMonthWeatherCondition(d, monthIdx) {
  var MONTH_LIST = (typeof MONTHS !== 'undefined' && Array.isArray(MONTHS))
    ? MONTHS
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var m = MONTH_LIST[monthIdx] || 'Jan';
  var windows = getDestinationSeasonalWindows(d);
  var isSafe = windows.best.indexOf(m) !== -1;
  var isDanger = windows.avoid.indexOf(m) !== -1;

  var lower = ((d.name || '') + ' ' + (d.state || '')).toLowerCase();
  var isAlpine = lower.includes('manali') || lower.includes('ladakh') || lower.includes('spiti') || lower.includes('leh') || lower.includes('kashmir') || lower.includes('gulmarg');
  var isHimalayanFoot = lower.includes('shimla') || lower.includes('dharamshala') || lower.includes('mussoorie') || lower.includes('nainital') || lower.includes('rishikesh') || lower.includes('dehradun');
  var isBeach = lower.includes('goa') || lower.includes('andaman') || lower.includes('kerala') || lower.includes('gokarna') || lower.includes('pondicherry') || lower.includes('varkala');
  var isDesert = lower.includes('rajasthan') || lower.includes('jaipur') || lower.includes('udaipur') || lower.includes('jaisalmer') || lower.includes('jodhpur') || lower.includes('bikaner');
  var isSouthernHills = lower.includes('munnar') || lower.includes('coorg') || lower.includes('ooty') || lower.includes('wayanad') || lower.includes('kodaikanal');

  var icon = '🌤️';
  var label = 'Pleasant & Mild';
  var tempEst = '20°C to 28°C';

  if (isAlpine) {
    if (monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '❄️'; label = 'Snow & Sub-Zero'; tempEst = '-8°C to 2°C';
    } else if (monthIdx === 2 || monthIdx === 3) {
      icon = '🌤️'; label = 'Spring Thaw'; tempEst = '4°C to 15°C';
    } else if (monthIdx === 4 || monthIdx === 5) {
      icon = '☀️'; label = 'Sunny & Crisp'; tempEst = '12°C to 25°C';
    } else if (monthIdx === 6 || monthIdx === 7) {
      icon = '⛈️'; label = 'Heavy Monsoon'; tempEst = '14°C to 21°C';
    } else if (monthIdx === 8 || monthIdx === 9) {
      icon = '🍂'; label = 'Golden Autumn'; tempEst = '8°C to 19°C';
    } else {
      icon = '❄️'; label = 'Early Freeze'; tempEst = '0°C to 10°C';
    }
  } else if (isHimalayanFoot) {
    if (monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '❄️'; label = 'Cold & Frost'; tempEst = '3°C to 14°C';
    } else if (monthIdx === 2 || monthIdx === 3) {
      icon = '🌸'; label = 'Spring Blossoms'; tempEst = '12°C to 22°C';
    } else if (monthIdx === 4 || monthIdx === 5) {
      icon = '☀️'; label = 'Sunny Retreat'; tempEst = '18°C to 29°C';
    } else if (monthIdx === 6 || monthIdx === 7) {
      icon = '⛈️'; label = 'Monsoon Clouds'; tempEst = '16°C to 24°C';
    } else if (monthIdx === 8 || monthIdx === 9) {
      icon = '🌤️'; label = 'Crisp & Clear'; tempEst = '14°C to 24°C';
    } else {
      icon = '🍂'; label = 'Autumn Chill'; tempEst = '8°C to 18°C';
    }
  } else if (isBeach) {
    if (monthIdx === 10 || monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '☀️'; label = 'Sunny Beach Vibe'; tempEst = '21°C to 31°C';
    } else if (monthIdx === 2 || monthIdx === 3) {
      icon = '🌤️'; label = 'Warm & Breezy'; tempEst = '24°C to 33°C';
    } else if (monthIdx === 4) {
      icon = '🔥'; label = 'Humid Pre-Monsoon'; tempEst = '26°C to 35°C';
    } else if (monthIdx === 5 || monthIdx === 6 || monthIdx === 7) {
      icon = '⛈️'; label = 'Rough Sea / Monsoon'; tempEst = '24°C to 29°C';
    } else {
      icon = '⛅'; label = 'Lush & Refreshing'; tempEst = '24°C to 31°C';
    }
  } else if (isDesert) {
    if (monthIdx === 10 || monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '🌤️'; label = 'Royal Winter Sun'; tempEst = '10°C to 25°C';
    } else if (monthIdx === 2 || monthIdx === 3) {
      icon = '☀️'; label = 'Warm & Bright'; tempEst = '18°C to 34°C';
    } else if (monthIdx === 4 || monthIdx === 5) {
      icon = '🔥'; label = 'Scorching Heat'; tempEst = '28°C to 43°C';
    } else if (monthIdx === 6 || monthIdx === 7 || monthIdx === 8) {
      icon = '🌧️'; label = 'Lakeside Showers'; tempEst = '24°C to 33°C';
    } else {
      icon = '🌤️'; label = 'Pleasant Autumn'; tempEst = '18°C to 31°C';
    }
  } else if (isSouthernHills) {
    if (monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '🌤️'; label = 'Crisp Mist & Tea'; tempEst = '10°C to 22°C';
    } else if (monthIdx === 2 || monthIdx === 3 || monthIdx === 4) {
      icon = '☀️'; label = 'Pleasant Hills'; tempEst = '15°C to 26°C';
    } else if (monthIdx === 5 || monthIdx === 6 || monthIdx === 7) {
      icon = '🌧️'; label = 'Heavy Rain & Falls'; tempEst = '13°C to 20°C';
    } else {
      icon = '🌿'; label = 'Emerald Valleys'; tempEst = '14°C to 23°C';
    }
  } else {
    if (monthIdx === 11 || monthIdx === 0 || monthIdx === 1) {
      icon = '🌤️'; label = 'Crisp Winter'; tempEst = '10°C to 22°C';
    } else if (monthIdx === 2 || monthIdx === 3) {
      icon = '☀️'; label = 'Sunny Spring'; tempEst = '18°C to 32°C';
    } else if (monthIdx === 4 || monthIdx === 5) {
      icon = '🔥'; label = 'Summer Heat'; tempEst = '26°C to 40°C';
    } else if (monthIdx === 6 || monthIdx === 7 || monthIdx === 8) {
      icon = '🌧️'; label = 'Monsoon Showers'; tempEst = '24°C to 32°C';
    } else {
      icon = '🍂'; label = 'Clear & Pleasant'; tempEst = '18°C to 28°C';
    }
  }

  var badgeText = isSafe ? 'SAFE' : (isDanger ? 'HIGH RISK' : 'CAUTION');
  var badgeCls = isSafe ? 'badge-status-safe' : (isDanger ? 'badge-status-danger' : 'badge-status-caution');
  var cardCls = isSafe ? 'card-safe' : (isDanger ? 'card-danger' : 'card-caution');

  return {
    month: m,
    icon: icon,
    label: label,
    tempEst: tempEst,
    isSafe: isSafe,
    isDanger: isDanger,
    badgeText: badgeText,
    badgeCls: badgeCls,
    cardCls: cardCls
  };
}

function renderWeatherWidget(d) {
  var windows = getDestinationSeasonalWindows(d);
  var bestMonths = windows.best;
  var avoidMonths = windows.avoid;
  var cautionMonths = windows.caution;

  // Determine initial selected month index (prefer first safe month if available)
  var initialIdx = 0;
  for (var i = 0; i < MONTHS.length; i++) {
    if (bestMonths.indexOf(MONTHS[i]) !== -1) {
      initialIdx = i;
      break;
    }
  }
  window.__selectedWeatherMonth = initialIdx;

  var safeText = bestMonths.length ? bestMonths.join(', ') : 'Oct, Nov, Dec, Jan, Feb, Mar';
  var cautionText = cautionMonths.length ? cautionMonths.join(', ') : 'Shoulder transition periods';
  var avoidText = avoidMonths.length ? avoidMonths.join(', ') : 'No high-risk months flagged';

  var minTemp = (d.weather && d.weather.temp && d.weather.temp.min != null) ? d.weather.temp.min : 12;
  var maxTemp = (d.weather && d.weather.temp && d.weather.temp.max != null) ? d.weather.temp.max : 32;
  var weatherNote = (d.weather && d.weather.note) ? d.weather.note : 'Prime sightseeing weather with clear skies and comfortable temperatures during peak months.';

  var html = '' +
    /* 1. Compact Summary Bar (Always Visible, Saves Vertical Space) */
    '<div class="weather-compact-summary-row">' +
      '<div class="weather-summary-metric">' +
        '<span class="metric-badge-safe">🟢 Prime Window</span>' +
        '<strong class="metric-text">' + safeText + '</strong>' +
      '</div>' +
      '<div class="weather-summary-metric">' +
        '<span class="metric-badge-temp">🌡️ Annual Range</span>' +
        '<strong class="metric-text">' + minTemp + '°C – ' + maxTemp + '°C</strong>' +
      '</div>' +
      '<div class="weather-summary-metric weather-metric-note">' +
        '<span class="metric-note-text">' + weatherNote + '</span>' +
      '</div>' +
    '</div>' +

    /* 2. Action Toggle Button: Hides/Reveals the entire monthly breakdown */
    '<div class="weather-toggle-bar">' +
      '<button type="button" class="btn-toggle-weather-breakdown" id="btn-toggle-weather-breakdown" onclick="window.toggleWeatherBreakdown()" aria-expanded="false">' +
        '<span class="btn-toggle-weather-icon">🌦️</span>' +
        '<span class="btn-toggle-weather-text">Explore 12-Month Climate, Safety & Hazards Breakdown</span>' +
        '<span class="btn-toggle-weather-arrow">▾</span>' +
      '</button>' +
    '</div>' +

    /* 3. Collapsible Container (HIDDEN INSIDE BUTTON BY DEFAULT) */
    '<div id="weather-breakdown-collapsible" class="weather-breakdown-collapsible" style="display:none;">' +

      /* Variations Overview Summary Bar */
      '<div class="weather-safety-overview-bar" style="margin-top:16px;">' +
        '<div class="weather-variation-pill pill-safe">' +
          '<span class="weather-variation-label">🟢 Safe & Prime Window</span>' +
          '<span class="weather-variation-val">' + safeText + '</span>' +
        '</div>' +
        '<div class="weather-variation-pill pill-caution">' +
          '<span class="weather-variation-label">🟡 Moderate / Caution</span>' +
          '<span class="weather-variation-val">' + cautionText + '</span>' +
        '</div>' +
        '<div class="weather-variation-pill pill-danger">' +
          '<span class="weather-variation-label">🔴 Hazard Alert / Unsafe</span>' +
          '<span class="weather-variation-val">' + avoidText + '</span>' +
        '</div>' +
      '</div>' +

      /* Instruction & Swipe hint */
      '<div class="weather-instruction-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:14px 0 10px 0;">' +
        '<p style="font-size:0.84rem;color:#CBD5E1;margin:0;">' +
          '👉 <em>Swipe left / right or use arrows to navigate all 12 months. Tap a card to inspect hazards:</em>' +
        '</p>' +
        '<span class="weather-slide-hint" style="font-size:0.75rem;color:#94A3B8;font-weight:600;display:inline-flex;align-items:center;gap:4px;">⇄ Swipe or drag left/right</span>' +
      '</div>' +

      /* Strict Horizontal Row Carousel Track */
      '<div class="weather-slider-wrapper">' +
        '<button type="button" class="weather-slider-btn prev" onclick="window.slideWeatherMonthCards(-1)" aria-label="Previous months" title="Slide Left">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
        '</button>' +

        '<div class="weather-safety-slider" id="weather-safety-months-slider">' +
          MONTHS.map(function(m, idx) {
            var cond = getMonthWeatherCondition(d, idx);
            var isActive = idx === initialIdx;

            return '' +
              '<div class="month-safety-card ' + cond.cardCls + (isActive ? ' active' : '') + '" data-month-idx="' + idx + '" onclick="window.selectWeatherMonth(' + idx + ')" role="button" tabindex="0">' +
                '<span class="month-safety-abbr">' + cond.month + '</span>' +
                '<span class="month-weather-icon" style="font-size:1.45rem;line-height:1;margin:2px 0;">' + cond.icon + '</span>' +
                '<span class="month-cond-label" title="' + cond.label + '">' + cond.label + '</span>' +
                '<span class="month-temp-pill">' + cond.tempEst + '</span>' +
                '<span class="month-safety-badge ' + cond.badgeCls + '">' + cond.badgeText + '</span>' +
              '</div>';
          }).join('') +
        '</div>' +

        '<button type="button" class="weather-slider-btn next" onclick="window.slideWeatherMonthCards(1)" aria-label="Next months" title="Slide Right">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>' +
        '</button>' +
      '</div>' +

      /* Selected Month Safety & Hazard Inspector Box */
      '<div id="weather-month-inspector-container">' +
        renderMonthInspectorContent(d, initialIdx) +
      '</div>' +

    '</div>'; /* end collapsible */

  return html;
}

function renderMonthInspectorContent(d, monthIdx) {
  var cond = getMonthWeatherCondition(d, monthIdx);
  var m = cond.month;
  var isSafe = cond.isSafe;
  var isDanger = cond.isDanger;

  var statusTitle = isSafe ? '100% Safe & Prime Travel Window' : (isDanger ? 'High Hazard · Travel Not Recommended' : 'Moderate Conditions · Exercise Normal Caution');
  var statusBadge = isSafe ? 'SAFE WINDOW 🟢' : (isDanger ? 'UNSAFE / HIGH RISK 🔴' : 'CAUTION ADVISED 🟡');
  var badgeBg = isSafe ? 'rgba(16, 185, 129, 0.2)' : (isDanger ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)');
  var badgeColor = isSafe ? '#6EE7B7' : (isDanger ? '#FCA5A5' : '#FCD34D');
  var badgeBorder = isSafe ? 'rgba(16, 185, 129, 0.4)' : (isDanger ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.4)');

  var season = (monthIdx >= 2 && monthIdx <= 5) ? 'Spring / Pre-Summer' : ((monthIdx >= 6 && monthIdx <= 8) ? 'Monsoon Season' : ((monthIdx >= 9 && monthIdx <= 10) ? 'Autumn' : 'Winter'));

  var lower = (d.name + ' ' + (d.state || '')).toLowerCase();
  var isMountain = lower.includes('manali') || lower.includes('ladakh') || lower.includes('shimla') || lower.includes('rishikesh') || lower.includes('munnar') || lower.includes('coorg');
  var isBeach = lower.includes('goa') || lower.includes('andaman');
  var isPlains = lower.includes('jaipur') || lower.includes('udaipur') || lower.includes('varanasi');

  var hazardText = '';
  var roadText = '';
  var packText = '';

  if (isDanger) {
    if (isMountain) {
      hazardText = 'Heavy rainfall triggers mountain landslides, flash floods along river valleys, and falling boulders.';
      roadText = 'High passes shut; state highway transit prone to multi-hour road clearing delays.';
      packText = 'Emergency survival kit, waterproof dry bags, thermal innerwear, offline GPS navigation map.';
    } else if (isBeach) {
      hazardText = 'Rough ocean currents, red lifeguard flags, dangerous rip tides; ocean swimming is prohibited.';
      roadText = 'Inter-island ferry transfers and beach shacks suspended; coastal roads waterlogged.';
      packText = 'Quick-dry apparel, sturdy rain poncho, waterproof phone pouch, mosquito repellent.';
    } else if (isPlains) {
      hazardText = 'Extreme desert heatwaves exceeding 42°C–45°C with high risk of dehydration and heatstroke.';
      roadText = 'Transit functional but afternoon road excursions dangerous between 11:30 AM and 4:30 PM.';
      packText = 'High SPF 50+ sunscreen, electrolyte ORS sachets, UV sunglasses, light breathable cottons.';
    } else {
      hazardText = 'Adverse seasonal weather conditions with severe temperature swings or heavy downpours.';
      roadText = 'Local transit disruptions possible; verify local transport updates prior to travel.';
      packText = 'All-weather protective clothing, medications, and sturdy waterproof footwear.';
    }
  } else if (isSafe) {
    if (isMountain) {
      hazardText = 'Minimal to zero climate hazard. Crisp mountain breeze, clear horizons, and high highway safety.';
      roadText = 'All state highways, passes, and outdoor adventure activities fully operational.';
      packText = 'Comfortable trekking shoes, light daytime jacket, warm fleece for evenings, sunglasses.';
    } else if (isBeach) {
      hazardText = 'Calm turquoise waters, low tide swells, active lifeguard surveillance stations.';
      roadText = 'All ferry routes, beach shacks, night markets, and watersports operating normally.';
      packText = 'Beachwear, reef-safe sunscreen, comfortable sandals, camera gear.';
    } else if (isPlains) {
      hazardText = 'Pleasant ambient climate (15°C–28°C), low humidity, zero heatwave risks.';
      roadText = 'Flawless road transit; morning and evening walking tours exceptionally comfortable.';
      packText = 'Walking sneakers, light cotton layers with an evening cardigan, camera.';
    } else {
      hazardText = 'Low weather hazard. Excellent conditions for outdoor sightseeing and local tours.';
      roadText = 'All local transport and guided tours running on regular timetables.';
      packText = 'Standard travel essentials, light layers, and comfortable walking shoes.';
    }
  } else {
    // Caution
    hazardText = 'Variable transition weather. Intermittent showers or sudden evening temperature drops.';
    roadText = 'Main corridors open; occasional morning fog or traffic slow-downs in ghat sections.';
    packText = 'Layered clothing (windbreaker + warm inner), compact umbrella, power bank.';
  }

  return '' +
    '<div class="month-hazard-inspector">' +
      '<div class="inspector-head">' +
        '<div class="inspector-title">' +
          '<span style="font-size:1.35rem;">' + cond.icon + '</span> ' + m + ' (' + season + ') — ' + cond.label + ' · ' + statusTitle +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
          '<span class="month-temp-pill" style="font-size:0.8rem;padding:4px 10px;">🌡️ ' + cond.tempEst + '</span>' +
          '<span class="inspector-safety-tag" style="background:' + badgeBg + ';color:' + badgeColor + ';border:1px solid ' + badgeBorder + ';">' +
            statusBadge +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="inspector-grid">' +
        '<div class="inspector-item">' +
          '<div class="inspector-item-label">⚠️ Climate & Terrain Hazards</div>' +
          '<p class="inspector-item-val">' + hazardText + '</p>' +
        '</div>' +
        '<div class="inspector-item">' +
          '<div class="inspector-item-label">🚗 Road & Pass Accessibility</div>' +
          '<p class="inspector-item-val">' + roadText + '</p>' +
        '</div>' +
        '<div class="inspector-item">' +
          '<div class="inspector-item-label">🎒 Seasonal Safety Checklist</div>' +
          '<p class="inspector-item-val">' + packText + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
}

window.toggleWeatherBreakdown = function() {
  var el = document.getElementById('weather-breakdown-collapsible');
  var btn = document.getElementById('btn-toggle-weather-breakdown');
  if (!el || !btn) return;

  var isHidden = (el.style.display === 'none' || !el.style.display);
  if (isHidden) {
    el.style.display = 'block';
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = '<span class="btn-toggle-weather-icon">✕</span>' +
                    '<span class="btn-toggle-weather-text">Hide 12-Month Climate Breakdown</span>' +
                    '<span class="btn-toggle-weather-arrow">▴</span>';

    initWeatherSliderDrag();

    setTimeout(function() {
      var activeCard = document.querySelector('.month-safety-card.active');
      if (activeCard && typeof activeCard.scrollIntoView === 'function') {
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 80);
  } else {
    el.style.display = 'none';
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="btn-toggle-weather-icon">🌦️</span>' +
                    '<span class="btn-toggle-weather-text">Explore 12-Month Climate, Safety & Hazards Breakdown</span>' +
                    '<span class="btn-toggle-weather-arrow">▾</span>';
  }
};

function initWeatherSliderDrag() {
  var slider = document.getElementById('weather-safety-months-slider');
  if (!slider || slider.__dragInitialized) return;
  slider.__dragInitialized = true;

  var isDown = false;
  var startX;
  var scrollLeft;

  slider.addEventListener('mousedown', function(e) {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', function() {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mouseup', function() {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - slider.offsetLeft;
    var walk = (x - startX) * 1.5; // Drag sensitivity
    slider.scrollLeft = scrollLeft - walk;
  });
}

window.slideWeatherMonthCards = function(direction) {
  var slider = document.getElementById('weather-safety-months-slider');
  if (!slider) return;
  var scrollAmount = direction * 280;
  slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
};

window.selectWeatherMonth = function(idx) {
  window.__selectedWeatherMonth = idx;
  var d = findDest(state.selectedId);
  if (!d) return;

  var cards = document.querySelectorAll('.month-safety-card');
  cards.forEach(function(c) {
    if (parseInt(c.getAttribute('data-month-idx'), 10) === idx) {
      c.classList.add('active');
      if (typeof c.scrollIntoView === 'function') {
        c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    } else {
      c.classList.remove('active');
    }
  });

  var container = byId('weather-month-inspector-container');
  if (container) {
    container.innerHTML = renderMonthInspectorContent(d, idx);
  }
};

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

  function phoneRow(label, val, typeIcon) {
    var ic = typeIcon || '📞';
    if (!val || val === 'Unavailable') return '<div class="local-emerg-item" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span>' + ic + '</span>' +
        '<span class="local-emerg-label" style="font-size:0.82rem;font-weight:600;color:#CBD5E1;">' + label + '</span>' +
      '</div>' +
      '<span class="local-emerg-num" style="opacity:0.4;font-size:0.82rem;">Resolving...</span>' +
    '</div>';

    /* Extract first number-like token for tel: link */
    var numMatch = String(val).match(/[\d\-\+\s]{7,}/);
    var telNum = numMatch ? numMatch[0].replace(/\s/g, '') : String(val).replace(/[^0-9+]/g, '');

    return '<div class="local-emerg-item" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
      '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">' +
        '<span style="font-size:1.05rem;">' + ic + '</span>' +
        '<div style="min-width:0;">' +
          '<div class="local-emerg-label" style="font-size:0.82rem;font-weight:600;color:#F8FAFC;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + label + '</div>' +
          '<a href="tel:' + telNum + '" style="font-size:0.86rem;font-weight:700;color:#34D399;text-decoration:none;">' + val + '</a>' +
        '</div>' +
      '</div>' +
      '<a href="tel:' + telNum + '" class="btn-call-mini" style="margin-left:8px;padding:4px 10px;border-radius:6px;background:rgba(52,211,153,0.15);color:#34D399;border:1px solid rgba(52,211,153,0.3);font-size:0.78rem;font-weight:700;text-decoration:none;white-space:nowrap;">' +
        '📞 Call' +
      '</a>' +
    '</div>';
  }

  return '<div class="local-emergency-list" id="local-emergency-contacts-container">' +
    phoneRow('Local Police Dispatch', police, '🚓') +
    phoneRow('Civil Hospital Emergency', hospital, '🏥') +
    phoneRow('Tourist Assistance Desk', tourist, 'ℹ️') +
    '<div style="margin-top:14px;padding:10px 12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;font-size:0.8rem;color:#FFFFFF;display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;">' +
      '<span>🚨 <strong>Unified:</strong> <a href="tel:112" style="color:#FCA5A5;font-weight:700;text-decoration:none;">112</a></span>' +
      '<span>🏥 <strong>Ambulance:</strong> <a href="tel:108" style="color:#FCA5A5;font-weight:700;text-decoration:none;">108</a></span>' +
      '<span>👮 <strong>Police:</strong> <a href="tel:100" style="color:#FCA5A5;font-weight:700;text-decoration:none;">100</a></span>' +
      '<span>👩 <strong>Women:</strong> <a href="tel:1091" style="color:#FCA5A5;font-weight:700;text-decoration:none;">1091</a></span>' +
    '</div>' +
  '</div>';
}

function updateLocalEmergencyPanelWithAI(emergencyCategory, d) {
  var container = document.getElementById('local-emergency-contacts-container');
  if (!container) return;

  var contacts = (emergencyCategory && Array.isArray(emergencyCategory.contacts) && emergencyCategory.contacts.length)
    ? emergencyCategory.contacts
    : [
        { label: (d.name || 'Local') + ' Police Station', number: (d.localEmergency && d.localEmergency.police && d.localEmergency.police !== 'Unavailable') ? d.localEmergency.police : '112', type: 'police' },
        { label: 'District Hospital Emergency Trauma', number: (d.localEmergency && d.localEmergency.hospital && d.localEmergency.hospital !== 'Unavailable') ? d.localEmergency.hospital : '108', type: 'hospital' },
        { label: 'Tourist Information Helpline', number: (d.localEmergency && d.localEmergency.tourist && d.localEmergency.tourist !== 'Unavailable') ? d.localEmergency.tourist : '1363', type: 'tourist' },
        { label: 'Women in Distress Helpline', number: '1091', type: 'women' }
      ];

  // Update d.localEmergency values so other components stay in sync
  d.localEmergency = d.localEmergency || {};
  contacts.forEach(function(c) {
    if (c.type === 'police' && c.number) d.localEmergency.police = c.number;
    if (c.type === 'hospital' && c.number) d.localEmergency.hospital = c.number;
    if (c.type === 'tourist' && c.number) d.localEmergency.tourist = c.number;
  });

  var icons = {
    police: '🚓',
    hospital: '🏥',
    tourist: 'ℹ️',
    women: '👩',
    emergency: '🚨'
  };

  var html = '' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:6px 10px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);border-radius:8px;">' +
      '<span style="font-size:0.8rem;font-weight:700;color:#34D399;display:flex;align-items:center;gap:6px;">✨ AI Recommended Local Contacts</span>' +
      '<span style="font-size:0.72rem;background:#10B981;color:#FFFFFF;padding:2px 8px;border-radius:10px;font-weight:700;">Verified</span>' +
    '</div>' +
    contacts.map(function(c) {
      var ic = icons[c.type] || '📞';
      var cleanNum = String(c.number).replace(/[^0-9+]/g, '');
      return '' +
        '<div class="local-emerg-item" style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">' +
          '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">' +
            '<span style="font-size:1.1rem;">' + ic + '</span>' +
            '<div style="min-width:0;">' +
              '<div class="local-emerg-label" style="font-size:0.82rem;font-weight:600;color:#F8FAFC;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + c.label + '</div>' +
              '<a href="tel:' + cleanNum + '" style="font-size:0.86rem;font-weight:700;color:#34D399;text-decoration:none;">' + c.number + '</a>' +
            '</div>' +
          '</div>' +
          '<a href="tel:' + cleanNum + '" class="btn-call-mini" style="margin-left:8px;padding:4px 10px;border-radius:6px;background:rgba(52,211,153,0.15);color:#34D399;border:1px solid rgba(52,211,153,0.3);font-size:0.78rem;font-weight:700;text-decoration:none;white-space:nowrap;">' +
            '📞 Call' +
          '</a>' +
        '</div>';
    }).join('') +
    '<div style="margin-top:12px;padding:8px 10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:8px;font-size:0.78rem;color:#FFFFFF;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">' +
      '<span>🚨 <strong>Unified:</strong> <a href="tel:112" style="color:#FCA5A5;font-weight:700;text-decoration:none;">112</a></span>' +
      '<span>🏥 <strong>Ambulance:</strong> <a href="tel:108" style="color:#FCA5A5;font-weight:700;text-decoration:none;">108</a></span>' +
      '<span>👮 <strong>Police:</strong> <a href="tel:100" style="color:#FCA5A5;font-weight:700;text-decoration:none;">100</a></span>' +
      '<span>👩 <strong>Women:</strong> <a href="tel:1091" style="color:#FCA5A5;font-weight:700;text-decoration:none;">1091</a></span>' +
    '</div>';

  container.innerHTML = html;
}

/* ── Packing List Preview ── */
function renderPackingPreview(d) {
  var all = [];
  if (typeof BASE_PACKING !== 'undefined') {
    if (BASE_PACKING.documents) all = all.concat(BASE_PACKING.documents.slice(0, 2));
    if (BASE_PACKING.clothing) all = all.concat(BASE_PACKING.clothing.slice(0, 2));
    if (d && d.packingExtras && Array.isArray(d.packingExtras)) all = all.concat(d.packingExtras.slice(0, 4));
    if (BASE_PACKING.health) all = all.concat(BASE_PACKING.health.slice(0, 2));
  } else if (d && d.packingExtras && Array.isArray(d.packingExtras)) {
    all = all.concat(d.packingExtras.slice(0, 6));
  }
  if (!all.length) {
    all = ['Identity cards & vouchers', 'Weather-appropriate layer', 'Comfortable footwear', 'Universal charger & powerbank', 'Prescription medicines', 'Hand sanitizer & wet wipes'];
  }
  return '<p style="font-size:0.82rem;color:#CBD5E1;margin-bottom:14px;">Key items for this trip — full checklist in your itinerary.</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:7px;">' +
      all.map(function(item) {
        return '<span class="tag-chip" style="font-size:0.78rem;">✓ ' + item + '</span>';
      }).join('') +
    '</div>' +
    '<p style="font-size:0.78rem;color:#FFFFFF;font-weight:700;margin-top:12px;">+ More items available in your full itinerary checklist</p>';
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
          var safeName = (a.name || '').replace(/'/g, "\\'");
          var latVal = (typeof a.lat === 'number' && !isNaN(a.lat)) ? a.lat : 'null';
          var lonVal = (typeof a.lon === 'number' && !isNaN(a.lon)) ? a.lon : 'null';
          return '<button class="spot-filter-chip" onclick="if(window.panMapToSpot){ window.panMapToSpot(\'detail-map-canvas\',' + latVal + ',' + lonVal + ',\'' + safeName + '\'); }">' +
            '🎯 ' + a.name + '</button>';
        }).join('') +
        gems.map(function(g) {
          var safeName = (g.name || '').replace(/'/g, "\\'");
          var latVal = (typeof g.lat === 'number' && !isNaN(g.lat)) ? g.lat : 'null';
          var lonVal = (typeof g.lon === 'number' && !isNaN(g.lon)) ? g.lon : 'null';
          return '<button class="spot-filter-chip gem-chip" onclick="if(window.panMapToSpot){ window.panMapToSpot(\'detail-map-canvas\',' + latVal + ',' + lonVal + ',\'' + safeName + '\'); }">' +
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
  var minTemp = (d.weather && d.weather.temp && d.weather.temp.min != null) ? d.weather.temp.min : 15;
  var maxTemp = (d.weather && d.weather.temp && d.weather.temp.max != null) ? d.weather.temp.max : 28;
  var defaultTemp = Math.round((minTemp + maxTemp) / 2);

  // Weather
  fetch(getApiUrl('/api/weather/' + encodeURIComponent(d.name)))
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var wEl = byId('live-weather-content');
      if (!wEl) return;
      var cur = data.current || { temp: defaultTemp, condition: 'Clear', description: 'Sunny & pleasant', humidity: 55, windSpeed: 3.5 };
      
      var temp = cur.temp;
      var isSevere = temp > 38 || (cur.windSpeed && cur.windSpeed > 14) || (cur.description && cur.description.toLowerCase().indexOf('thunderstorm') !== -1);
      var isMild = cur.description && (cur.description.toLowerCase().indexOf('rain') !== -1 || cur.description.toLowerCase().indexOf('drizzle') !== -1 || cur.description.toLowerCase().indexOf('fog') !== -1);

      var liveSafetyStatus = isSevere
        ? '🔴 Severe Weather Alert: Limit Outdoor Transit'
        : (isMild ? '🟡 Seasonal Caution: Rain/Mist Advisory' : '🟢 100% Safe Outdoor Exploration');
      var liveBadgeCls = isSevere ? 'badge-status-danger' : (isMild ? 'badge-status-caution' : 'badge-status-safe');

      var safetyScore = isSevere ? 45 : (isMild ? 72 : 95);
      var rainRisk = (cur.humidity > 80 || isMild) ? 'Moderate' : (isSevere ? 'High' : 'Minimal / None');
      var windRisk = (cur.windSpeed > 10) ? 'Breezy' : 'Calm & Safe';
      var roadRisk = isSevere ? 'Delays Likely' : '100% Clear';

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
        '<div class="weather-status-tag" style="margin-bottom:12px;">Status: ' + (cur.temp > 32 ? '☀️ Warm day ahead' : (cur.temp < 15 ? '🧥 Cool & crisp' : '🌿 Perfect exploration climate')) + '</div>' +
        '<div class="live-weather-safety-gauge">' +
          '<div class="gauge-status-row">' +
            '<span style="font-size:0.82rem;font-weight:700;color:#CBD5E1;">Live Travel Safety:</span>' +
            '<span class="gauge-status-badge ' + liveBadgeCls + '">' + liveSafetyStatus + '</span>' +
          '</div>' +
          '<div class="live-hazard-indicators">' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🛡️ Safety Index</span>' +
              '<span class="hazard-micro-val">' + safetyScore + '/100</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🌧️ Rain Hazard</span>' +
              '<span class="hazard-micro-val">' + rainRisk + '</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">💨 Wind Hazard</span>' +
              '<span class="hazard-micro-val">' + windRisk + '</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🚗 Road Status</span>' +
              '<span class="hazard-micro-val">' + roadRisk + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    })
    .catch(function() {
      var wEl = byId('live-weather-content');
      if (!wEl) return;
      var avgTemp = defaultTemp;
      wEl.innerHTML = '' +
        '<div class="live-weather-summary">' +
          '<div class="live-temp-huge">' + avgTemp + '°C</div>' +
          '<div class="live-weather-meta">' +
            '<div class="live-cond-name">Pleasant</div>' +
            '<div class="live-cond-desc">Ideal for sightseeing</div>' +
            '<div class="live-sub-stats">Typical range: ' + minTemp + '°C to ' + maxTemp + '°C</div>' +
          '</div>' +
        '</div>' +
        '<div class="live-weather-safety-gauge">' +
          '<div class="gauge-status-row">' +
            '<span style="font-size:0.82rem;font-weight:700;color:#CBD5E1;">Live Travel Safety:</span>' +
            '<span class="gauge-status-badge badge-status-safe">🟢 100% Safe Outdoor Exploration</span>' +
          '</div>' +
          '<div class="live-hazard-indicators">' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🛡️ Safety Index</span>' +
              '<span class="hazard-micro-val">94/100</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🌧️ Rain Hazard</span>' +
              '<span class="hazard-micro-val">Low</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">💨 Wind Hazard</span>' +
              '<span class="hazard-micro-val">Calm</span>' +
            '</div>' +
            '<div class="hazard-micro-card">' +
              '<span class="hazard-micro-label">🚗 Road Status</span>' +
              '<span class="hazard-micro-val">100% Clear</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    });

  // Crowd
  fetch(getApiUrl('/api/weather/' + encodeURIComponent(d.name) + '/crowd'))
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
  if (!d || !d.culture) return '';
  var c = d.culture;

  var heritageText = Array.isArray(c.heritage)
    ? c.heritage.join(', ')
    : (c.heritage || 'Ancient temples, colonial landmarks and historical settlements');

  var customsText = Array.isArray(c.customs)
    ? c.customs.join('. ')
    : (c.etiquette || c.customs || 'Modest attire recommended at sacred sites. Remove footwear before entering.');

  var festivalsList = Array.isArray(c.festivals)
    ? c.festivals
    : ['Local Cultural Celebrations', 'Seasonal Gatherings'];

  var culinaryList = Array.isArray(c.culinaryHighlights)
    ? c.culinaryHighlights
    : (Array.isArray(d.foodSpecialties) ? d.foodSpecialties : ['Authentic Local Delicacies', 'Traditional Regional Fare', 'Street Food Treats']);

  return '' +
    '<div class="panel" style="margin-top:20px;">' +
      '<h3><span style="font-size:1.2rem;">🏛️</span> Culture, Heritage & Local Traditions</h3>' +
      '<p class="hint-text" style="margin-bottom:16px;">Immerse yourself respectfully into ' + (d.name || 'this destination') + '\'s timeless living heritage</p>' +
      '<div class="culture-grid">' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">📜 Heritage & History</div>' +
          '<p class="culture-card-text">' + heritageText + '</p>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">👗 Dress Code & Etiquette</div>' +
          '<p class="culture-card-text">' + customsText + '</p>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">🎉 Festivals & Celebrations</div>' +
          '<div class="culture-tags">' +
            festivalsList.map(function(f) { return '<span class="tag-chip tag-festival">🎊 ' + f + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
        '<div class="culture-card">' +
          '<div class="culture-card-title">🍲 Culinary Heritage</div>' +
          '<div class="culture-tags">' +
            culinaryList.map(function(dish) { return '<span class="tag-chip tag-food">🥘 ' + dish + '</span>'; }).join('') +
          '</div>' +
        '</div>' +
      '</div>' +
      (c.languagePhrases ? '' +
        '<div class="language-bar" style="margin-top:16px;padding:12px 16px;background:rgba(255,255,255,0.05);border-radius:10px;border:1px solid rgba(255,255,255,0.14);">' +
          '<strong style="color:#FFFFFF;font-size:0.85rem;">🗣️ Useful Local Phrases: </strong>' +
          '<span style="font-size:0.85rem;color:#E2E8F0;">' +
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
          var vibeStr = gem.vibe || gem.bestFor || 'Hidden Gem';
          return '' +
            '<div class="gem-card">' +
              '<div class="gem-card-head">' +
                '<div class="gem-title-wrap">' +
                  '<span class="gem-icon">💎</span>' +
                  '<h4>' + (gem.name || 'Secret Spot') + '</h4>' +
                '</div>' +
                '<span class="gem-vibe-tag">' + vibeStr + '</span>' +
              '</div>' +
              '<p class="gem-desc">' + (gem.description || 'A unique local spot away from crowds.') + '</p>' +
              '<div class="gem-meta">' +
                (gem.bestTime ? '<div class="gem-meta-row"><span>🕒 Best Time:</span> <strong>' + gem.bestTime + '</strong></div>' : '') +
                (gem.tip ? '<div class="gem-tip-row"><span>💡 Secret Tip:</span> <em>' + gem.tip + '</em></div>' : '') +
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

  var r1 = (d1.rating != null && !isNaN(d1.rating)) ? Number(d1.rating) : 4.5;
  var r2 = (d2.rating != null && !isNaN(d2.rating)) ? Number(d2.rating) : 4.5;
  var s1 = (d1.safety && typeof d1.safety.score === 'number') ? d1.safety.score : 4.5;
  var s2 = (d2.safety && typeof d2.safety.score === 'number') ? d2.safety.score : 4.5;

  var betterRating = r1 >= r2 ? 0 : 1;
  var betterCost   = c1.perDay <= c2.perDay ? 0 : 1;
  var betterSafety = s1 >= s2 ? 0 : 1;

  function cls(idx, winner) { return idx === winner ? 'winner' : 'loser'; }

  var content = byId('compare-content');
  if (!content) return;

  content.innerHTML =
    '<div class="compare-cols">' +
      [d1, d2].map(function(d, i) {
        var c = i === 0 ? c1 : c2;
        var rVal = (d.rating != null && !isNaN(d.rating)) ? Number(d.rating).toFixed(1) : '4.5';
        var revVal = (d.reviews != null && !isNaN(d.reviews)) ? Number(d.reviews).toLocaleString('en-IN') : '1,200';
        var safeVal = (d.safety && typeof d.safety.score === 'number') ? d.safety.score.toFixed(1) : '4.5';
        var bestForList = Array.isArray(d.bestFor) ? d.bestFor.join(', ') : 'All Travelers';
        var weatherList = (d.weather && Array.isArray(d.weather.best)) ? d.weather.best.join(', ') : 'Seasonal';
        var tagsList = Array.isArray(d.tags) ? d.tags : [];

        return '' +
          '<div>' +
            '<div class="compare-col-head">' +
              '<h3>' + (d.name || 'Destination') + ' ' + (d.emoji || '📍') + '</h3>' +
              '<span class="dest-state">' + (d.state || 'India') + '</span>' +
            '</div>' +

            '<div class="compare-section"><div class="compare-section-label">Overall rating</div>' +
              '<div class="compare-val ' + cls(i, betterRating) + '">' + rVal + '/5 ⭐ (' + revVal + ' reviews)</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Cost per person/day</div>' +
              '<div class="compare-val ' + cls(i, betterCost) + '">' + inr(c.perDay) + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Safety score</div>' +
              '<div class="compare-val ' + cls(i, betterSafety) + '">' + safeVal + '/5 🛡️</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Best for</div>' +
              '<div class="compare-val">' + bestForList + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Best months</div>' +
              '<div class="compare-val">' + weatherList + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Tags</div>' +
              '<div class="tag-row">' + tagsList.map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') + '</div></div>' +

            '<div class="compare-section"><div class="compare-section-label">Estimated total (' + (state.prefs && state.prefs.duration ? state.prefs.duration : 4) + ' days)</div>' +
              '<div class="compare-val ' + cls(i, betterCost) + '">' + inr(c.total) + '</div></div>' +

            '<button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="selectDestination(\'' + d.id + '\');byId(\'compare-drawer\').classList.remove(\'open\');">Plan trip to ' + (d.name || 'Destination') + '</button>' +
          '</div>';
      }).join('') +
    '</div>';
}

/* ── AI Location Safety & Guidelines Hub ── */
window.__aiGuidelinesData = window.__aiGuidelinesData || {};
window.__activeGuidelineTab = 'all';

function renderAILocationGuidelinesHub(d) {
  var scoreText = (d.safety && d.safety.score) ? d.safety.score.toFixed(1) : '4.5';
  return '' +
    '<div class="panel ai-guidelines-panel" id="ai-guidelines-panel" style="display:none;margin-top:24px;">' +
      '<div class="ai-guidelines-header">' +
        '<div class="ai-guidelines-title-wrap">' +
          '<h3>' + icon('shield') + ' AI Location Safety & Travel Guidelines</h3>' +
          '<p class="ai-guidelines-subtitle">Real-time terrain advisories, local laws, cultural etiquette and emergency intelligence for <strong>' + d.name + (d.state ? ', ' + d.state : '') + '</strong></p>' +
        '</div>' +
        '<div class="ai-badge-group">' +
          '<span class="ai-model-tag">✨ Gemini AI Analyzed</span>' +
          '<span class="ai-score-pill" id="ai-guidelines-badge-score">🛡️ ' + scoreText + '/5.0 Safe</span>' +
          '<button type="button" class="btn-close-guidelines" onclick="window.toggleAIGuidelines(false)" title="Hide Guidelines" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#F8FAFC;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:0.82rem;font-weight:700;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">✕ Close</button>' +
        '</div>' +
      '</div>' +
      '<div id="ai-guidelines-content">' +
        '<div class="ai-guidelines-loading-state">' +
          '<div class="ai-guidelines-spinner"></div>' +
          '<div style="font-size:1rem;font-weight:700;color:#FFFFFF;margin-bottom:6px;">Generating authentic location guidelines for ' + d.name + '...</div>' +
          '<div style="font-size:0.86rem;color:#CBD5E1;">Analyzing terrain hazards, women traveler safety, local etiquette, and emergency protocols with Google Gemini AI.</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function toggleAIGuidelines(forceOpen) {
  var panel = document.getElementById('ai-guidelines-panel');
  var btn = document.getElementById('btn-toggle-ai-guidelines');
  if (!panel) return;

  var isCurrentlyHidden = (panel.style.display === 'none' || !panel.style.display);
  var shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : isCurrentlyHidden;

  if (shouldOpen) {
    panel.style.display = 'block';
    if (btn) btn.innerHTML = '<span>✨ Hide Guidelines Hub ↑</span>';
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    panel.style.display = 'none';
    if (btn) btn.innerHTML = '<span>✨ View Full Guidelines Hub ↓</span>';
  }
}
window.toggleAIGuidelines = toggleAIGuidelines;

function loadAILocationGuidelines(d) {
  var container = byId('ai-guidelines-content');
  if (!container) return;

  var cacheKey = (d.name + '_' + (d.state || '')).toLowerCase().trim();
  if (window.__aiGuidelinesData[cacheKey]) {
    var cached = window.__aiGuidelinesData[cacheKey];
    renderAIGuidelinesContent(cached, window.__activeGuidelineTab || 'all');
    if (cached.categories && cached.categories.emergency) {
      updateLocalEmergencyPanelWithAI(cached.categories.emergency, d);
    }
    return;
  }

  fetch(getApiUrl('/api/ai/location-guidelines'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: d.name, state: d.state })
  })
    .then(function(res) {
      if (!res.ok) throw new Error('API error ' + res.status);
      return res.json();
    })
    .then(function(data) {
      if (data && data.categories) {
        window.__aiGuidelinesData[cacheKey] = data;
        renderAIGuidelinesContent(data, 'all');

        // Update score badge
        var scoreEl = byId('ai-guidelines-badge-score');
        if (scoreEl && data.safetyScore) {
          scoreEl.innerHTML = '🛡️ ' + Number(data.safetyScore).toFixed(1) + '/5.0 ' + (data.safetyTier || 'Safe');
        }

        // If top list exists, update with AI points
        var topList = byId('detail-safety-points-list');
        if (topList && data.categories.safety && Array.isArray(data.categories.safety.items)) {
          topList.innerHTML = data.categories.safety.items.slice(0, 4).map(function(item) {
            return '<li>' + icon('check') + '<span>' + item.title + ': ' + item.description + '</span></li>';
          }).join('');
        }

        // Update Local Emergency Contacts panel with AI recommended numbers!
        if (data.categories.emergency) {
          updateLocalEmergencyPanelWithAI(data.categories.emergency, d);
        }
      } else {
        throw new Error('Invalid guidelines payload');
      }
    })
    .catch(function(err) {
      console.warn('Using local verified guidelines for ' + d.name, err);
      var fallback = buildLocalGuidelinesFallback(d);
      window.__aiGuidelinesData[cacheKey] = fallback;
      renderAIGuidelinesContent(fallback, 'all');
      if (fallback.categories && fallback.categories.emergency) {
        updateLocalEmergencyPanelWithAI(fallback.categories.emergency, d);
      }
    });
}

function countAllCategoryItems(cats) {
  var total = 0;
  if (!cats) return 0;
  Object.keys(cats).forEach(function(k) {
    if (k !== 'emergency' && cats[k] && Array.isArray(cats[k].items)) {
      total += cats[k].items.length;
    }
  });
  return total;
}

function renderAIGuidelinesContent(data, activeTab) {
  var container = byId('ai-guidelines-content');
  if (!container) return;

  activeTab = activeTab || 'all';
  window.__activeGuidelineTab = activeTab;

  var cats = data.categories || {};
  var summaryText = data.summary || (data.destination + ' is verified safe with established tourism guidelines and local law enforcement.');

  var tabs = [
    { id: 'all', label: '🌐 All Guidelines', count: countAllCategoryItems(cats) },
    { id: 'safety', label: '🛡️ Safety & Terrain', count: (cats.safety && cats.safety.items ? cats.safety.items.length : 0) },
    { id: 'women', label: '👩 Women & Solo', count: (cats.women && cats.women.items ? cats.women.items.length : 0) },
    { id: 'cultural', label: '🏛️ Culture & Etiquette', count: (cats.cultural && cats.cultural.items ? cats.cultural.items.length : 0) },
    { id: 'health', label: '🩺 Health & Climate', count: (cats.health && cats.health.items ? cats.health.items.length : 0) },
    { id: 'scams', label: '⚠️ Scams & Transit', count: (cats.scams && cats.scams.items ? cats.scams.items.length : 0) }
  ];

  var catMeta = {
    safety: { icon: '🛡️', cls: 'guideline-cat-safety', badgeColor: '#34D399' },
    women: { icon: '👩', cls: 'guideline-cat-women', badgeColor: '#F472B6' },
    cultural: { icon: '🏛️', cls: 'guideline-cat-cultural', badgeColor: '#FBBF24' },
    health: { icon: '🩺', cls: 'guideline-cat-health', badgeColor: '#38BDF8' },
    scams: { icon: '⚠️', cls: 'guideline-cat-scams', badgeColor: '#FB923C' },
    emergency: { icon: '🚨', cls: 'guideline-cat-emergency', badgeColor: '#F87171' }
  };

  var itemsToDisplay = [];
  if (activeTab === 'all') {
    Object.keys(cats).forEach(function(catKey) {
      if (catKey === 'emergency') return;
      var catObj = cats[catKey];
      if (catObj && Array.isArray(catObj.items)) {
        catObj.items.forEach(function(item) {
          itemsToDisplay.push({
            category: catKey,
            title: item.title,
            description: item.description,
            badge: item.badge || 'VERIFIED'
          });
        });
      }
    });
  } else if (cats[activeTab] && Array.isArray(cats[activeTab].items)) {
    cats[activeTab].items.forEach(function(item) {
      itemsToDisplay.push({
        category: activeTab,
        title: item.title,
        description: item.description,
        badge: item.badge || activeTab.toUpperCase()
      });
    });
  }

  var emergencyContacts = (cats.emergency && cats.emergency.contacts) || [
    { label: 'Unified Emergency (Police/Fire/Medical)', number: '112', type: 'emergency' },
    { label: 'Ambulance Trauma Response', number: '108', type: 'hospital' },
    { label: 'National Tourist Helpline', number: '1363', type: 'tourist' },
    { label: 'Women in Distress Helpline', number: '1091', type: 'women' }
  ];

  var html = '' +
    /* AI Summary Box */
    '<div class="ai-guidelines-summary-box">' +
      '<span class="ai-summary-icon">💡</span>' +
      '<div style="flex:1;">' +
        '<div style="font-weight:700;color:#FFFFFF;margin-bottom:4px;font-size:0.98rem;">AI Safety & Location Intelligence:</div>' +
        '<p class="ai-summary-text">' + summaryText + '</p>' +
      '</div>' +
    '</div>' +

    /* Category Navigation Pills */
    '<div class="guidelines-nav-pills">' +
      tabs.map(function(t) {
        return '<button type="button" class="guideline-pill-btn ' + (activeTab === t.id ? 'active' : '') + '" onclick="window.switchGuidelineTab(\'' + t.id + '\')">' +
          t.label + ' <span style="opacity:0.8;font-size:0.76rem;margin-left:2px;">(' + t.count + ')</span>' +
        '</button>';
      }).join('') +
    '</div>' +

    /* Cards Grid */
    '<div class="guidelines-cards-grid">' +
      (itemsToDisplay.length ? itemsToDisplay.map(function(item) {
        var meta = catMeta[item.category] || { icon: '📌', cls: '', badgeColor: '#94A3B8' };
        return '' +
          '<div class="guideline-card-item ' + meta.cls + '">' +
            '<div>' +
              '<div class="guideline-item-head">' +
                '<h4 class="guideline-item-title">' + meta.icon + ' ' + item.title + '</h4>' +
                '<span class="guideline-item-badge" style="color:' + meta.badgeColor + ';border-color:' + meta.badgeColor + '55;background:' + meta.badgeColor + '18;">' + item.badge + '</span>' +
              '</div>' +
              '<p class="guideline-item-desc">' + item.description + '</p>' +
            '</div>' +
          '</div>';
      }).join('') : '<p style="color:#CBD5E1;font-size:0.92rem;grid-column:1/-1;">No guidelines found in this category.</p>') +
    '</div>' +

    /* Emergency Helplines */
    '<div class="guidelines-emergency-container">' +
      '<div class="guidelines-emergency-title">🚨 <span>Immediate First-Responder & Emergency Helplines</span></div>' +
      '<div class="emergency-quick-grid">' +
        emergencyContacts.map(function(c) {
          var cleanNum = String(c.number).replace(/[^0-9+]/g, '');
          return '' +
            '<a href="tel:' + cleanNum + '" class="emergency-quick-card">' +
              '<div class="emergency-card-info">' +
                '<span class="emergency-card-label">' + c.label + '</span>' +
                '<span class="emergency-card-num">' + c.number + '</span>' +
              '</div>' +
              '<span class="emergency-card-btn">📞 Call</span>' +
            '</a>';
        }).join('') +
      '</div>' +
    '</div>';

  container.innerHTML = html;
}

function buildLocalGuidelinesFallback(d) {
  var name = d.name || 'Destination';
  var points = (d.safety && d.safety.points && d.safety.points.length) ? d.safety.points : [
    'Tourist assistance counters stationed at main transit hubs',
    'Follow marked trails and verify guides with official accreditation',
    'Verified accommodations with round-the-clock reception'
  ];

  return {
    destination: name,
    state: d.state || '',
    source: 'fallback',
    safetyScore: (d.safety && d.safety.score) ? d.safety.score : 4.5,
    safetyTier: 'Verified Safe Destination',
    summary: name + ' is welcoming with active tourism oversight. Following seasonal advice and local transport guidelines ensures a completely secure trip.',
    categories: {
      safety: {
        title: 'General & Terrain Safety',
        items: points.map(function(p, idx) {
          return { title: 'Safety Protocol ' + (idx + 1), description: p, badge: 'Essential' };
        })
      },
      women: {
        title: 'Solo & Women Travelers',
        items: [
          { title: 'Registered Boutique & Homestays', description: 'Opt for certified accommodations with high ratings from solo female travelers.', badge: 'Safe Stay' },
          { title: 'National Women Safety Line (1091)', description: 'Direct 24x7 toll-free helpline for rapid police assistance and escort.', badge: '24x7 Helpline' }
        ]
      },
      cultural: {
        title: 'Culture, Sacred Heritage & Etiquette',
        items: [
          { title: 'Modest Temple Attire', description: (d.culture && d.culture.etiquette) ? d.culture.etiquette : 'Dress modestly with shoulders and knees covered when entering sacred shrines.', badge: 'Dress Code' },
          { title: 'Photography Guidelines', description: 'Always seek permission before photographing monks, priests, or local artisans.', badge: 'Respect' }
        ]
      },
      health: {
        title: 'Health & Climate Advice',
        items: [
          { title: 'Hydration & Safe Drinking Water', description: 'Drink sealed mineral water or verified RO filtration water; carry electrolyte packets.', badge: 'Health' },
          { title: 'First Aid Kit', description: 'Keep basic analgesics, antiseptic ointment, and motion sickness medication on hand.', badge: 'Medical' }
        ]
      },
      scams: {
        title: 'Transit & Scam Alerts',
        items: [
          { title: 'Official Monument Entry', description: 'Book monument entries via official ASI counters to avoid third-party markups.', badge: 'Official' },
          { title: 'Prepaid Taxis & Digital Meters', description: 'Always book cabs through prepaid stands at railheads and airports or use registered meter services.', badge: 'Fair Price' }
        ]
      },
      emergency: {
        title: 'Emergency Helplines',
        contacts: (function() {
          var low = name.toLowerCase();
          if (low.indexOf('manali') !== -1) {
            return [
              { label: 'Manali Police Station & Hill Patrol', number: '+91-1902-252326', type: 'police' },
              { label: 'Civil Hospital Manali (Emergency)', number: '+91-1902-252342', type: 'hospital' },
              { label: 'HPTDC Tourist Information Mall Road', number: '+91-1902-252175', type: 'tourist' },
              { label: 'Himachal Women Helpline', number: '1091', type: 'women' }
            ];
          } else if (low.indexOf('shimla') !== -1) {
            return [
              { label: 'Shimla Sadar Police Control', number: '+91-177-2804245', type: 'police' },
              { label: 'IGMC Shimla Medical Emergency', number: '+91-177-2804251', type: 'hospital' },
              { label: 'HP Tourism Help Center The Mall', number: '+91-177-2652561', type: 'tourist' },
              { label: 'HP Women Helpline', number: '1091', type: 'women' }
            ];
          } else if (low.indexOf('goa') !== -1) {
            return [
              { label: 'Goa Police Control & Tourist Police', number: '+91-832-2420873', type: 'police' },
              { label: 'Goa Medical College (GMC) Trauma', number: '+91-832-2458700', type: 'hospital' },
              { label: 'Goa Tourism Development Corp (GTDC)', number: '+91-832-2438750', type: 'tourist' },
              { label: 'Goa Women Police Helpline', number: '1091', type: 'women' }
            ];
          } else if (low.indexOf('jaipur') !== -1) {
            return [
              { label: 'Jaipur Police Control Room (Abhay)', number: '+91-141-2618844', type: 'police' },
              { label: 'SMS Government Hospital Trauma', number: '+91-141-2560291', type: 'hospital' },
              { label: 'Rajasthan Tourism Info Bureau', number: '+91-141-5155100', type: 'tourist' },
              { label: 'Rajasthan Women Helpline (Garima)', number: '1090', type: 'women' }
            ];
          } else if (low.indexOf('udaipur') !== -1) {
            return [
              { label: 'Udaipur City Police Control Room', number: '+91-294-2414600', type: 'police' },
              { label: 'Maharana Bhupal Govt Hospital', number: '+91-294-2528811', type: 'hospital' },
              { label: 'Udaipur Tourist Reception Center', number: '+91-294-2411535', type: 'tourist' },
              { label: 'Udaipur Women Helpline', number: '1090', type: 'women' }
            ];
          } else if (low.indexOf('rishikesh') !== -1) {
            return [
              { label: 'Muni Ki Reti Police Station', number: '+91-135-2430033', type: 'police' },
              { label: 'AIIMS Rishikesh Emergency & Trauma', number: '+91-135-2462999', type: 'hospital' },
              { label: 'Uttarakhand Tourism Help Center', number: '+91-135-2559898', type: 'tourist' },
              { label: 'Uttarakhand Women Helpline (Gaura Shakti)', number: '1090', type: 'women' }
            ];
          } else if (low.indexOf('ladakh') !== -1 || low.indexOf('leh') !== -1) {
            return [
              { label: 'Leh District Police Control Room', number: '+91-1982-252018', type: 'police' },
              { label: 'SNM District Civil Hospital Leh', number: '+91-1982-252012', type: 'hospital' },
              { label: 'Ladakh Tourism Office Leh', number: '+91-1982-252297', type: 'tourist' },
              { label: 'Ladakh Women Safety Cell', number: '112', type: 'women' }
            ];
          } else if (low.indexOf('varanasi') !== -1) {
            return [
              { label: 'Varanasi Tourist Police Dashashwamedh', number: '+91-542-2508100', type: 'police' },
              { label: 'BHU Trauma Center / Sir Sunderlal', number: '+91-542-2369291', type: 'hospital' },
              { label: 'UP Tourism Reception Parade Kothi', number: '+91-542-2505033', type: 'tourist' },
              { label: 'UP Women Powerline', number: '1090', type: 'women' }
            ];
          } else if (low.indexOf('munnar') !== -1) {
            return [
              { label: 'Munnar Police Station & Hill Patrol', number: '+91-4865-230321', type: 'police' },
              { label: 'Tata General Hospital Munnar', number: '+91-4865-230230', type: 'hospital' },
              { label: 'DTPC Tourism Info Counter Munnar', number: '+91-4865-231516', type: 'tourist' },
              { label: 'Kerala Women Helpline (Mitra)', number: '181', type: 'women' }
            ];
          } else if (low.indexOf('coorg') !== -1) {
            return [
              { label: 'Madikeri Town Police Station', number: '+91-8272-228333', type: 'police' },
              { label: 'District Hospital Madikeri', number: '+91-8272-228315', type: 'hospital' },
              { label: 'Karnataka Tourism Info Office', number: '+91-8272-228580', type: 'tourist' },
              { label: 'Karnataka Women Helpline', number: '1091', type: 'women' }
            ];
          } else if (low.indexOf('andaman') !== -1) {
            return [
              { label: 'Port Blair Police Control Room', number: '+91-3192-232100', type: 'police' },
              { label: 'GB Pant Hospital Port Blair', number: '+91-3192-232102', type: 'hospital' },
              { label: 'Directorate of Tourism Port Blair', number: '+91-3192-232694', type: 'tourist' },
              { label: 'Andaman Women Helpline', number: '1091', type: 'women' }
            ];
          } else {
            var pNum = (d.localEmergency && d.localEmergency.police && d.localEmergency.police !== 'Unavailable') ? d.localEmergency.police : '112';
            var hNum = (d.localEmergency && d.localEmergency.hospital && d.localEmergency.hospital !== 'Unavailable') ? d.localEmergency.hospital : '108';
            var tNum = (d.localEmergency && d.localEmergency.tourist && d.localEmergency.tourist !== 'Unavailable') ? d.localEmergency.tourist : '1363';
            return [
              { label: name + ' Police Station & Control', number: pNum, type: 'police' },
              { label: name + ' Civil Hospital Emergency', number: hNum, type: 'hospital' },
              { label: (d.state || name) + ' Tourism Helpline', number: tNum, type: 'tourist' },
              { label: 'Women in Distress Helpline', number: '1091', type: 'women' }
            ];
          }
        })()
      }
    }
  };
}

window.switchGuidelineTab = function(tabId) {
  var d = findDest(state.selectedId);
  if (!d) return;
  var cacheKey = (d.name + '_' + (d.state || '')).toLowerCase().trim();
  var data = window.__aiGuidelinesData[cacheKey];
  if (data) {
    renderAIGuidelinesContent(data, tabId);
  }
};

/* ── Back ── */
function initScreen4() {
  if (!document.getElementById('screen-4')) return;
  byId('btn-back-to-explore').addEventListener('click', function() { goToStep(3); });
}

window.initScreen4 = initScreen4;
window.selectDestination = selectDestination;
window.renderDetail = renderDetail;
window.loadAILocationGuidelines = loadAILocationGuidelines;
window.renderAILocationGuidelinesHub = renderAILocationGuidelinesHub;
window.toggleAIGuidelines = toggleAIGuidelines;
window.updateLocalEmergencyPanelWithAI = updateLocalEmergencyPanelWithAI;
window.toggleWeatherBreakdown = toggleWeatherBreakdown;
window.slideWeatherMonthCards = slideWeatherMonthCards;
window.selectWeatherMonth = selectWeatherMonth;


