'use strict';

/* ============================================================
   VOYAGER — Screen 5: Itinerary
   Day-by-day plan, interactive budget tracker,
   full packing checklist, share/print, scroll-sync day chips,
   new trip reset
   ============================================================ */

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
    chips += '<a href="#day-' + i + '" class="day-chip" id="chip-' + i + '">' + i + '</a>';
  }

  /* ── Day cards ── */
  var days = '';
  for (var j = 1; j <= duration; j++) {
    var theme;
    if (j === 1)               theme = 'Arrival & first impressions';
    else if (j === duration && duration > 1) theme = 'Leisure & departure';
    else theme = d.dayThemes[(j - 1) % d.dayThemes.length];

    var morning   = d.activities.morning[  (j - 1) % d.activities.morning.length];
    var afternoon = d.activities.afternoon[(j - 1) % d.activities.afternoon.length];
    var evening   = d.activities.evening[  (j - 1) % d.activities.evening.length];
    var tip       = d.safety.points[(j - 1) % d.safety.points.length];

    days += '' +
      '<div class="day-card" id="day-' + j + '">' +
        '<div class="day-card-head">' +
          '<span class="day-num">' + String(j).padStart(2, '0') + '</span>' +
          '<span class="day-theme">' + theme + '</span>' +
        '</div>' +
        '<div class="day-parts">' +
          '<div class="day-part"><div class="day-part-label"><span class="part-dot dot-morning"></span>Morning</div><div class="day-part-text">' + morning + '</div></div>' +
          '<div class="day-part"><div class="day-part-label"><span class="part-dot dot-afternoon"></span>Afternoon</div><div class="day-part-text">' + afternoon + '</div></div>' +
          '<div class="day-part"><div class="day-part-label"><span class="part-dot dot-evening"></span>Evening</div><div class="day-part-text">' + evening + '</div></div>' +
        '</div>' +
        '<div class="safety-note">' + icon('shield') + '<span>' + tip + '</span></div>' +
      '</div>';
  }

  /* ── Full itinerary HTML ── */
  var html = '' +
    /* Hero banner */
    '<div class="itinerary-header-hero">' +
      '<div class="itinerary-hero-text">' +
        '<h2>' + duration + '-day ' + d.name + ' Itinerary ' + d.emoji + '</h2>' +
        '<p>Built for your ' + (state.prefs.group || '') + ' trip · starting from ' + (state.location.city || 'your location') + '</p>' +
      '</div>' +
    '</div>' +

    /* Recap bar */
    '<div class="itinerary-recap">' +
      '<div class="recap-item"><div class="recap-label">Estimated total</div><div class="recap-val">' + inr(cost.total) + '</div></div>' +
      '<div class="recap-item"><div class="recap-label">Travellers</div><div class="recap-val">' + state.prefs.travelers + '</div></div>' +
      '<div class="recap-item"><div class="recap-label">Duration</div><div class="recap-val">' + duration + ' days</div></div>' +
      '<div class="recap-item"><div class="recap-label">Safety rating</div><div class="recap-val">' + d.safety.score.toFixed(1) + '/5 🛡️</div></div>' +
      '<div class="recap-item" style="display:flex;align-items:center;justify-content:center;">' +
        '<button class="btn btn-save-cloud btn-sm" id="btn-save-recap" style="padding:8px 16px;">' +
          '<span>💾 Save to Cloud</span>' +
        '</button>' +
      '</div>' +
    '</div>' +

    /* Day chip navigation */
    '<div class="day-chip-row" id="day-chip-row">' + chips + '</div>' +

    /* Day cards */
    days +

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

  /* Update SOS note */
  var sosNote = byId('sos-context-note');
  if (sosNote) {
    sosNote.textContent = 'You\'re viewing the plan for ' + d.name + ', ' + d.state + '. Local safety notes are in each day above.';
  }
}

/* ============================================================
   BUDGET TRACKER
   ============================================================ */
function renderBudgetTracker(d, cost) {
  return '' +
    '<div class="budget-tracker" id="budget-tracker">' +
      '<div class="budget-tracker-head">' +
        '<h3>' + icon('wallet') + ' Budget tracker</h3>' +
        '<span class="hint-text">Log your actual spends below</span>' +
      '</div>' +
      '<div class="budget-total-display">' +
        '<div class="budget-spent-num" id="budget-spent-display">' + inr(0) + '</div>' +
        '<div class="budget-of-total">of estimated <strong>' + inr(cost.total) + '</strong></div>' +
      '</div>' +
      '<div class="budget-bar"><div class="budget-bar-fill" id="budget-bar-fill" style="width:0%"></div></div>' +
      '<div class="budget-entries" id="budget-entries-list"></div>' +
      '<div class="budget-add-row">' +
        '<input type="text" id="budget-cat-input" placeholder="Category (e.g. Lunch)" aria-label="Expense category">' +
        '<input type="number" id="budget-amt-input" placeholder="₹ Amount" min="1" aria-label="Amount in rupees">' +
        '<button class="btn btn-forest btn-sm" id="budget-add-btn">Add</button>' +
      '</div>' +
    '</div>';
}

function bindBudgetTracker(cost) {
  var totalEst = cost.total;

  function refreshBudget() {
    var spent = state.budgetLog.reduce(function(s, e) { return s + e.amount; }, 0);
    byId('budget-spent-display').textContent = inr(spent);
    var pct = clamp(spent / totalEst * 100, 0, 100);
    var fill = byId('budget-bar-fill');
    fill.style.width = pct + '%';
    fill.classList.toggle('over', spent > totalEst);

    var list = byId('budget-entries-list');
    if (!state.budgetLog.length) {
      list.innerHTML = '<p class="hint-text" style="padding:8px 0;">No expenses logged yet.</p>';
      return;
    }
    list.innerHTML = state.budgetLog.map(function(e) {
      return '' +
        '<div class="budget-entry">' +
          '<span class="budget-entry-cat">' + escapeHtml(e.label) + '</span>' +
          '<span class="budget-entry-amt">' + inr(e.amount) + '</span>' +
          '<button class="budget-entry-del" data-entry-id="' + e.id + '" aria-label="Remove entry">✕</button>' +
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
    var cat = byId('budget-cat-input').value.trim();
    var amt = parseInt(byId('budget-amt-input').value, 10);
    if (!cat || isNaN(amt) || amt <= 0) return;
    state.budgetLog.push({ id: Date.now().toString(), label: cat, amount: amt });
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
   PACKING CHECKLIST
   ============================================================ */
function renderPackingChecklist(d) {
  var sections = [
    { key: 'documents',  label: 'Documents & ID',    items: BASE_PACKING.documents },
    { key: 'clothing',   label: 'Clothing',           items: BASE_PACKING.clothing  },
    { key: 'health',     label: 'Health & Safety',    items: BASE_PACKING.health    },
    { key: 'tech',       label: 'Tech & Gadgets',     items: BASE_PACKING.tech      },
    { key: 'misc',       label: 'Misc & Essentials',  items: BASE_PACKING.misc      },
    { key: 'dest',       label: d.name + ' Extras',   items: d.packingExtras        }
  ];

  var total = 0;
  sections.forEach(function(s) { total += s.items.length; });
  var checked = 0;
  Object.keys(state.packingState).forEach(function(k) { if (state.packingState[k]) checked++; });
  var pct = total ? clamp(checked / total * 100, 0, 100) : 0;

  var inner = sections.map(function(sec) {
    return '' +
      '<div class="packing-section">' +
        '<div class="packing-section-title">' + sec.label + '</div>' +
        sec.items.map(function(item) {
          var pk      = sec.key + '__' + item;
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
    '<div class="panel" id="packing-panel" style="margin-top:18px;">' +
      '<h3>' + icon('backpack') + ' Packing checklist</h3>' +
      '<div class="packing-summary" id="packing-summary">' + checked + ' of ' + total + ' items packed</div>' +
      '<div class="packing-progress"><div class="packing-progress-fill" id="packing-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="packing-list" id="packing-list">' + inner + '</div>' +
      '<div class="packing-actions">' +
        '<button class="btn btn-ghost btn-sm" id="packing-reset-btn">Clear all</button>' +
        '<button class="btn btn-forest btn-sm" id="packing-check-all-btn">Check all</button>' +
      '</div>' +
    '</div>';
}

function bindPackingChecklist(d) {
  var allSections = [
    { key: 'documents', items: BASE_PACKING.documents },
    { key: 'clothing',  items: BASE_PACKING.clothing  },
    { key: 'health',    items: BASE_PACKING.health    },
    { key: 'tech',      items: BASE_PACKING.tech      },
    { key: 'misc',      items: BASE_PACKING.misc      },
    { key: 'dest',      items: d.packingExtras        }
  ];

  function countAll() {
    var total = 0;
    allSections.forEach(function(s) { total += s.items.length; });
    return total;
  }

  function refreshProgress() {
    var total   = countAll();
    var checked = Object.keys(state.packingState).filter(function(k) { return state.packingState[k]; }).length;
    var pct     = total ? clamp(checked / total * 100, 0, 100) : 0;
    byId('packing-progress-fill').style.width = pct + '%';
    byId('packing-summary').textContent = checked + ' of ' + total + ' items packed';
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

  window.addEventListener('scroll', function() {
    var scrollMid = window.scrollY + window.innerHeight / 2;
    dayCards.forEach(function(d) {
      var top = d.el.getBoundingClientRect().top + window.scrollY;
      var bot = top + d.el.offsetHeight;
      var chip = byId('chip-' + d.idx);
      if (chip) chip.classList.toggle('scrolled-active', scrollMid >= top && scrollMid < bot);
    });
  }, { passive: true });
}

/* ============================================================
   SCREEN 5 INIT
   ============================================================ */
function initScreen5() {
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
