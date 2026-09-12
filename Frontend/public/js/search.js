'use strict';

/* ============================================================
   VOYAGER — Interactive Destination Search Module
   Search modal with live keyword & tag filtering,
   keyboard shortcuts (Ctrl+K), and 1-click planner selection.
   ============================================================ */

function openSearchModal() {
  var modal = document.getElementById('search-modal');
  var input = document.getElementById('search-dest-input');
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (input) {
    input.value = '';
    setTimeout(function () { input.focus(); }, 150);
  }
  filterSearchResults('');
}

function closeSearchModal() {
  var modal = document.getElementById('search-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function filterSearchResults(query) {
  var container = document.getElementById('search-results-list');
  if (!container) return;

  var dests = window.DESTINATIONS || [];
  query = (query || '').toLowerCase().trim();

  var matched = dests.filter(function (d) {
    if (!query) return true;
    var nameMatch = d.name.toLowerCase().includes(query);
    var stateMatch = (d.state || '').toLowerCase().includes(query);
    var tagMatch = (d.tags || []).some(function (t) { return t.toLowerCase().includes(query); });
    var blurbMatch = (d.blurb || '').toLowerCase().includes(query);
    return nameMatch || stateMatch || tagMatch || blurbMatch;
  });

  if (matched.length === 0) {
    container.innerHTML =
      '<div style="text-align: center; padding: 30px 10px; color: var(--ink-faint); font-size: 14px;">' +
        'No matching destinations found for "<b>' + query + '</b>".<br>Try searching for "beach", "mountain", "heritage", or "Goa".' +
      '</div>';
    return;
  }

  var html = '';
  matched.forEach(function (d) {
    var tagsHtml = (d.tags || []).slice(0, 3).map(function (t) {
      return '<span class="trip-badge-pill" style="font-size:11px; text-transform: capitalize;">' + t + '</span>';
    }).join(' ');

    html +=
      '<div class="search-dest-item" data-dest-id="' + d.id + '">' +
        '<div class="search-dest-left">' +
          '<div class="search-dest-emoji">' + d.emoji + '</div>' +
          '<div>' +
            '<div class="search-dest-title">' + d.name + ' <span style="font-weight: 500; font-size: 12px; color: var(--ink-faint);">(' + d.state + ')</span></div>' +
            '<div style="font-size: 12.5px; color: var(--ink-soft); margin-top: 2px;">' + (d.blurb || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">' +
          '<div style="font-size: 13px; font-weight: 700; color: var(--forest);">' + (d.safety ? d.safety.score.toFixed(1) + ' 🛡️' : '') + '</div>' +
          '<div class="search-dest-tags">' + tagsHtml + '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  // Bind item clicks
  container.querySelectorAll('.search-dest-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var destId = item.getAttribute('data-dest-id');
      selectAndExploreDestination(destId);
    });
  });
}

function selectAndExploreDestination(destId) {
  closeSearchModal();

  var plannerEl = document.getElementById('planner-section');
  if (plannerEl && typeof state !== 'undefined' && typeof selectDestination === 'function') {
    if (!state.prefs.budget) state.prefs.budget = 'mid';
    if (!state.prefs.group) state.prefs.group = 'couple';
    if (!state.location.city) state.location.city = 'India';
    if (!state.prefs.duration) state.prefs.duration = 4;
    if (!state.prefs.travelers) state.prefs.travelers = 2;

    if (typeof computeMatches === 'function') computeMatches();
    if (typeof unlockStep === 'function') {
      unlockStep(2);
      unlockStep(3);
    }
    selectDestination(destId);
    plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.location.href = '/destination/' + destId;
  }
}

/* ── Search Modal Bindings ── */
document.addEventListener('DOMContentLoaded', function () {
  var searchNavBtn = document.querySelector('.nav-search-icon');
  if (searchNavBtn) {
    searchNavBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openSearchModal();
    });
  }

  var closeBtn = document.getElementById('search-modal-close');
  var modalOverlay = document.getElementById('search-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeSearchModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeSearchModal();
    });
  }

  var searchInput = document.getElementById('search-dest-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterSearchResults(searchInput.value);
    });
  }

  // Keyboard shortcut: Ctrl + K or Cmd + K
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      var modal = document.getElementById('search-modal');
      if (modal && modal.classList.contains('open')) {
        closeSearchModal();
      } else {
        openSearchModal();
      }
    } else if (e.key === 'Escape') {
      closeSearchModal();
      if (typeof closeAuthModal === 'function') closeAuthModal();
      if (typeof closeDashboardModal === 'function') closeDashboardModal();
    }
  });
});
