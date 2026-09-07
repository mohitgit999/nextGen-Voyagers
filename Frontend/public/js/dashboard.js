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
      if (confirm('Are you sure you want to remove this trip from your cloud account?')) {
        deleteUserTrip(tripId);
      }
    });
  });
}

function resumeTrip(trip) {
  // Populate global state with trip data
  if (typeof state !== 'undefined') {
    state.sessionId = trip.sessionId || state.sessionId;
    if (trip.origin) state.location = { ...state.location, ...trip.origin };
    if (trip.prefs) state.prefs = { ...state.prefs, ...trip.prefs };
    state.selectedId = trip.destinationId;
    if (trip.customPerDay) state.customPerDay = trip.customPerDay;
    if (trip.budgetEntries) state.budgetLog = trip.budgetEntries;
    if (trip.packingState) state.packingState = trip.packingState;

    // Echo location into UI
    var echo = document.getElementById('pref-origin-echo');
    if (echo && state.location.city) echo.textContent = state.location.city;

    if (typeof computeMatches === 'function') computeMatches();
    if (typeof unlockStep === 'function') {
      unlockStep(2);
      unlockStep(3);
      unlockStep(4);
      unlockStep(5);
    }

    if (typeof generateItinerary === 'function') {
      generateItinerary();
    }

    closeDashboardModal();

    // Smooth scroll to planner
    var plannerEl = document.getElementById('planner-section');
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (typeof goToStep === 'function') {
      goToStep(5);
    }

    showToast('Loaded ' + (trip.destinationName || 'itinerary') + ' from cloud! 🌟', 'success');
  }
}

function deleteUserTrip(tripId) {
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
      showToast('Trip removed from cloud', 'info');
      loadUserDashboard();
    })
    .catch(function (err) {
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
