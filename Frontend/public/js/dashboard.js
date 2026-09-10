'use strict';

/* ============================================================
   VOYAGER — User Dashboard Module
   Displays travel statistics, saved trips list from Atlas,
   and enables 1-click itinerary restore and trip deletion.
   ============================================================ */

function openDashboardModal(initialTab) {
  var modal = document.getElementById('dashboard-modal');
  if (!modal) return;

  if (!authState.user || !authState.token) {
    showToast('Please sign in to view your dashboard', 'info');
    openAuthModal('login');
    return;
  }

  loadUserDashboard();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDashboardModal() {
  var modal = document.getElementById('dashboard-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function loadUserDashboard() {
  var user = authState.user;
  if (!user) return;

  // Set Profile info
  var nameEl = document.getElementById('dash-user-name');
  var emailEl = document.getElementById('dash-user-email');
  var avatarEl = document.getElementById('dash-user-avatar');

  if (nameEl) nameEl.textContent = user.name || 'Traveler';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avatarEl) {
    avatarEl.textContent = (user.name || 'T')
      .split(' ')
      .map(function (n) { return n[0]; })
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Fetch user's saved trips from MongoDB Atlas
  var tripsGrid = document.getElementById('saved-trips-container');
  if (tripsGrid) {
    tripsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--ink-faint);">Loading your cloud itineraries... ✈️</div>';
  }

  fetch(apiUrl('/api/trips/user/my-trips'), {
    headers: {
      Authorization: 'Bearer ' + authState.token,
    },
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load trips');
      return res.json();
    })
    .then(function (trips) {
      renderDashboardStats(trips);
      renderSavedTrips(trips);
    })
    .catch(function (err) {
      if (tripsGrid) {
        tripsGrid.innerHTML =
          '<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--danger);">' +
          'Failed to load trips: ' + err.message +
          '</div>';
      }
    });
}

function renderDashboardStats(trips) {
  var totalTrips = trips.length;
  var totalBudget = 0;
  var destinationsCount = {};

  trips.forEach(function (t) {
    totalBudget += (t.estimatedTotal || 0);
    var dName = t.destinationName || t.destinationId;
    if (dName) {
      destinationsCount[dName] = (destinationsCount[dName] || 0) + 1;
    }
  });

  var topDest = 'None';
  var topCount = 0;
  for (var d in destinationsCount) {
    if (destinationsCount[d] > topCount) {
      topCount = destinationsCount[d];
      topDest = d;
    }
  }

  var statTrips = document.getElementById('dash-stat-trips');
  var statBudget = document.getElementById('dash-stat-budget');
  var statTop = document.getElementById('dash-stat-top');

  if (statTrips) statTrips.textContent = totalTrips;
  if (statBudget) statBudget.textContent = typeof inr === 'function' ? inr(totalBudget) : '₹' + totalBudget.toLocaleString('en-IN');
  if (statTop) statTop.textContent = topDest;
}

function renderSavedTrips(trips) {
  var container = document.getElementById('saved-trips-container');
  if (!container) return;

  if (!trips || trips.length === 0) {
    container.innerHTML =
      '<div class="empty-trips-box" style="grid-column: 1/-1;">' +
        '<div style="font-size: 32px; margin-bottom: 8px;">🎒</div>' +
        '<div style="font-weight: 700; font-size: 16px; color: var(--ink); margin-bottom: 4px;">No saved itineraries yet</div>' +
        '<p style="font-size: 13.5px; margin-bottom: 16px;">Customize and save your first travel plan to access it anytime from the cloud.</p>' +
        '<button class="btn btn-primary btn-sm" id="btn-dash-plan-new" style="display:inline-flex; align-items:center; gap:6px;">' +
          'Start Planning a Trip →' +
        '</button>' +
      '</div>';

    var planBtn = document.getElementById('btn-dash-plan-new');
    if (planBtn) {
      planBtn.addEventListener('click', function () {
        closeDashboardModal();
        var plannerEl = document.getElementById('planner-section');
        if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    return;
  }

  var html = '';
  trips.forEach(function (t) {
    var dateStr = new Date(t.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    var costStr = typeof inr === 'function' ? inr(t.estimatedTotal) : '₹' + (t.estimatedTotal || 0).toLocaleString('en-IN');
    var dest = typeof findDest === 'function' ? findDest(t.destinationId) : null;
    var emoji = dest ? dest.emoji : '📍';

    html +=
      '<div class="saved-trip-card" data-trip-id="' + t._id + '">' +
        '<div class="saved-trip-head">' +
          '<div>' +
            '<div class="saved-trip-dest-name">' + emoji + ' ' + (t.destinationName || 'Destination') + '</div>' +
            '<div class="saved-trip-date">Saved on ' + dateStr + '</div>' +
          '</div>' +
          '<div class="saved-trip-cost">' + costStr + '</div>' +
        '</div>' +
        '<div class="saved-trip-pills">' +
          '<span class="trip-badge-pill">⏱️ ' + (t.prefs ? t.prefs.duration : 4) + ' Days</span>' +
          '<span class="trip-badge-pill">👥 ' + (t.prefs ? t.prefs.group : 'Travelers') + '</span>' +
          '<span class="trip-badge-pill">🏷️ ' + (t.prefs ? t.prefs.budget : 'Mid') + ' tier</span>' +
          (t.origin && t.origin.city ? '<span class="trip-badge-pill">📍 From ' + t.origin.city + '</span>' : '') +
        '</div>' +
        '<div class="saved-trip-actions">' +
          '<button class="btn-trip-action primary btn-resume-trip" data-trip-json="' + encodeURIComponent(JSON.stringify(t)) + '">' +
            '<span>Open Itinerary</span>' +
          '</button>' +
          '<button class="btn-trip-action danger btn-delete-trip" data-trip-id="' + t._id + '" title="Delete from cloud">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  // Bind Open Itinerary buttons
  container.querySelectorAll('.btn-resume-trip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var raw = decodeURIComponent(btn.getAttribute('data-trip-json'));
      try {
        var trip = JSON.parse(raw);
        resumeTrip(trip);
      } catch (e) {
        showToast('Error opening trip', 'error');
      }
    });
  });

  // Bind Delete buttons
  container.querySelectorAll('.btn-delete-trip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tripId = btn.getAttribute('data-trip-id');
      var card = btn.closest('.saved-trip-card');
      var destName = card ? (card.querySelector('.saved-trip-dest-name') || {}).textContent : 'this trip';
      showDeleteTripConfirm(tripId, destName ? destName.trim() : 'this trip');
    });
  });
}

function resumeTrip(trip) {
  if (typeof state === 'undefined') return;

  // 1. Restore state from saved trip
  state.sessionId = trip.sessionId || state.sessionId;
  if (trip.origin) state.location = Object.assign({}, state.location, trip.origin);
  if (trip.prefs) state.prefs = Object.assign({}, state.prefs, trip.prefs);
  state.selectedId = trip.destinationId;
  if (trip.customPerDay) state.customPerDay = trip.customPerDay;
  if (trip.budgetEntries) state.budgetLog = trip.budgetEntries;
  if (trip.packingState) state.packingState = trip.packingState;

  // 2. Echo location into prefs UI
  var echo = document.getElementById('pref-origin-echo');
  if (echo && state.location.city) echo.textContent = state.location.city;

  // 3. Unlock all steps up to 5 (MUST happen before goToStep)
  if (typeof unlockStep === 'function') {
    unlockStep(2);
    unlockStep(3);
    unlockStep(4);
    unlockStep(5);
  }
  // Ensure maxStep is 5 so goToStep(5) doesn't bail out
  if (typeof state !== 'undefined') state.maxStep = 5;

  if (typeof computeMatches === 'function') computeMatches();

  // 4. Close modal first
  closeDashboardModal();

  // 5. Navigate to step 5 (makes screen-5 active in the DOM)
  if (typeof goToStep === 'function') {
    goToStep(5);
  }

  // 6. Generate itinerary AFTER screen is active so DOM targets exist
  setTimeout(function() {
    if (typeof generateItinerary === 'function') {
      generateItinerary();
    }
    // Scroll to planner after generation starts
    var plannerEl = document.getElementById('planner-section');
    if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);

  showToast('Loaded ' + (trip.destinationName || 'itinerary') + ' from cloud! 🌟', 'success');
}

function showDeleteTripConfirm(tripId, destName) {
  var existing = document.getElementById('delete-trip-confirm-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'delete-trip-confirm-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:999999',
    'display:flex', 'align-items:center', 'justify-content:center',
    'background:rgba(0,0,0,0.65)', 'backdrop-filter:blur(8px)',
    '-webkit-backdrop-filter:blur(8px)',
    'animation:dtOverlayIn 0.2s ease both'
  ].join(';');

  overlay.innerHTML = [
    '<style>',
    '@keyframes dtOverlayIn{from{opacity:0}to{opacity:1}}',
    '@keyframes dtPopIn{from{opacity:0;transform:scale(0.8) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}',
    '#delete-trip-confirm-box{background:linear-gradient(160deg,#0f1923,#13243a);border:1px solid rgba(239,68,68,0.3);border-radius:20px;padding:40px 36px 32px;max-width:380px;width:90%;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(239,68,68,0.1);animation:dtPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;}',
    '.dt-icon-ring{width:68px;height:68px;border-radius:50%;background:rgba(239,68,68,0.12);border:2px solid rgba(239,68,68,0.4);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:1.8rem;}',
    '.dt-title{font-size:1.25rem;font-weight:800;color:#fff;margin:0 0 8px;}',
    '.dt-sub{font-size:0.88rem;color:rgba(255,255,255,0.5);margin:0 0 6px;line-height:1.5;}',
    '.dt-dest{font-size:0.92rem;color:rgba(255,255,255,0.75);font-weight:600;margin:0 0 28px;padding:8px 14px;background:rgba(255,255,255,0.06);border-radius:8px;border:1px solid rgba(255,255,255,0.1);}',
    '.dt-actions{display:flex;gap:12px;}',
    '.dt-cancel{flex:1;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.7);font-size:0.95rem;font-weight:600;cursor:pointer;transition:background 0.15s;}',
    '.dt-cancel:hover{background:rgba(255,255,255,0.08);}',
    '.dt-delete{flex:1;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;box-shadow:0 4px 14px rgba(239,68,68,0.4);}',
    '.dt-delete:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(239,68,68,0.5);}',
    '.dt-delete:disabled{opacity:0.6;transform:none;cursor:not-allowed;}',
    '</style>',
    '<div id="delete-trip-confirm-box">',
      '<div class="dt-icon-ring">🗑️</div>',
      '<h3 class="dt-title">Delete Itinerary?</h3>',
      '<p class="dt-sub">This will permanently remove your saved trip from the cloud. This action cannot be undone.</p>',
      '<div class="dt-dest">' + (destName || 'Saved Trip') + '</div>',
      '<div class="dt-actions">',
        '<button class="dt-cancel" id="dt-cancel-btn">Cancel</button>',
        '<button class="dt-delete" id="dt-confirm-btn">🗑️ Delete from Cloud</button>',
      '</div>',
    '</div>'
  ].join('');

  document.body.appendChild(overlay);

  document.getElementById('dt-cancel-btn').addEventListener('click', function() {
    overlay.style.animation = 'dtOverlayIn 0.15s ease reverse forwards';
    setTimeout(function() { overlay.remove(); }, 150);
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.style.animation = 'dtOverlayIn 0.15s ease reverse forwards';
      setTimeout(function() { overlay.remove(); }, 150);
    }
  });

  document.getElementById('dt-confirm-btn').addEventListener('click', function() {
    var btn = document.getElementById('dt-confirm-btn');
    btn.disabled = true;
    btn.textContent = 'Deleting...';
    deleteUserTrip(tripId, overlay);
  });
}

function deleteUserTrip(tripId, overlay) {
  fetch(apiUrl('/api/trips/' + tripId), {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + authState.token,
    },
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    })
    .then(function () {
      if (overlay) {
        overlay.style.animation = 'dtOverlayIn 0.15s ease reverse forwards';
        setTimeout(function() { overlay.remove(); }, 150);
      }
      showToast('✅ Trip deleted from cloud successfully', 'success');
      loadUserDashboard();
    })
    .catch(function (err) {
      if (overlay) overlay.remove();
      showToast('Could not delete trip: ' + err.message, 'error');
    });
}

/* ── Init Dashboard Modal Events ── */
document.addEventListener('DOMContentLoaded', function () {
  var closeBtn = document.getElementById('dashboard-modal-close');
  var modalOverlay = document.getElementById('dashboard-modal');

  if (closeBtn) closeBtn.addEventListener('click', closeDashboardModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeDashboardModal();
    });
  }

  var newTripBtn = document.getElementById('dash-btn-new-trip');
  if (newTripBtn) {
    newTripBtn.addEventListener('click', function () {
      closeDashboardModal();
      var plannerEl = document.getElementById('planner-section');
      if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
