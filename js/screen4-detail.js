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
        '<h3>' + icon('shield') + ' Safety</h3>' +
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

    /* ── Row 2: Weather · Transport · Local Emergency ── */
    '<div class="panels" style="margin-top:18px;">' +

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
    '<div class="panel" style="margin-top:18px;">' +
      '<h3>' + icon('backpack') + ' Packing essentials</h3>' +
      renderPackingPreview(d) +
    '</div>' +

    /* CTA */
    '<div class="actions-row">' +
      '<button class="btn btn-primary" id="btn-build-itinerary">Build my day-by-day plan ' + icon('arrow') + '</button>' +
      (state.compareIds.length > 0
        ? '<button class="btn btn-ghost" id="btn-add-to-compare">Add to compare</button>'
        : '') +
    '</div>';

  byId('detail-content').innerHTML = html;

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
  var t = d.transport;
  return '<div class="transport-list">' +
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('train') + '</div>' +
      '<div><div class="transport-label">' + t.train.label + '</div><div class="transport-detail">' + t.train.station + '</div><div class="transport-note">' + t.train.note + '</div></div>' +
    '</div>' +
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('plane') + '</div>' +
      '<div><div class="transport-label">' + t.flight.label + '</div><div class="transport-detail">' + t.flight.airport + '</div><div class="transport-note">' + t.flight.note + '</div></div>' +
    '</div>' +
    '<div class="transport-item">' +
      '<div class="transport-icon-wrap">' + icon('car') + '</div>' +
      '<div><div class="transport-label">' + t.road.label + '</div><div class="transport-note">' + t.road.note + '</div></div>' +
    '</div>' +
  '</div>';
}

/* ── Local emergency panel ── */
function renderLocalEmergencyPanel(d) {
  var e = d.localEmergency;
  return '<div class="local-emergency-list">' +
    '<div class="local-emerg-item"><span class="local-emerg-label">Local police</span>' +
      '<a href="tel:' + e.police + '" class="local-emerg-num">' + icon('phone') + e.police + '</a></div>' +
    '<div class="local-emerg-item"><span class="local-emerg-label">Hospital</span>' +
      '<span class="local-emerg-num" style="color:var(--ink);font-size:0.82rem;font-family:var(--font-body);">' + e.hospital + '</span></div>' +
    '<div class="local-emerg-item"><span class="local-emerg-label">Tourism helpline</span>' +
      '<span class="local-emerg-num" style="color:var(--forest-deep);">' + icon('phone') + e.tourist + '</span></div>' +
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
  byId('btn-back-to-explore').addEventListener('click', function() { goToStep(3); });
}
