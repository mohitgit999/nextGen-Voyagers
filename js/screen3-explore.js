'use strict';

/* ============================================================
   VOYAGER — Screen 3: Explore
   Matching algorithm, filter by tag, sort, compare toggle,
   destination cards with shimmer loading
   ============================================================ */

var exploreCurrentFilter = 'all';
var exploreCurrentSort   = 'match';

/* ===================== SCORING ===================== */
function scoreDestination(d, prefs) {
  var score = 40 + (d.rating - 4) * 40;
  var q = (prefs.destination || '').trim().toLowerCase();
  if (q) {
    var words   = q.split(/\s+/).filter(Boolean);
    var haystack = (d.name + ' ' + d.state + ' ' + d.tags.join(' ') + ' ' + d.blurb).toLowerCase();
    words.forEach(function(w) { if (haystack.indexOf(w) !== -1) score += 22; });
  }
  if (d.bestFor.indexOf(prefs.group) !== -1) score += 18;
  if ((d.id === 'andaman' || d.id === 'ladakh') && prefs.duration < 5) score -= 15;
  return score;
}

function computeMatches() {
  var scored = DESTINATIONS.map(function(d) {
    var raw = scoreDestination(d, state.prefs);
    return { dest: d, percent: clamp(Math.round(raw), 52, 98) };
  });
  scored.sort(function(a, b) { return b.percent - a.percent; });
  state.matches = scored;  // keep all 10 for filtering
}

/* ===================== FILTER + SORT ===================== */
function filteredAndSorted() {
  var list = state.matches.slice();

  // Filter
  if (exploreCurrentFilter !== 'all') {
    list = list.filter(function(m) {
      return m.dest.tags.indexOf(exploreCurrentFilter) !== -1;
    });
  }

  // Sort
  if (exploreCurrentSort === 'rating') {
    list.sort(function(a, b) { return b.dest.rating - a.dest.rating; });
  } else if (exploreCurrentSort === 'price-asc') {
    list.sort(function(a, b) {
      return a.dest.cost[state.prefs.budget] - b.dest.cost[state.prefs.budget];
    });
  }
  // 'match' keeps original order

  return list;
}

/* ===================== RENDER ===================== */
function renderExplore() {
  byId('explore-heading').textContent =
    'Best matches for your ' + state.prefs.duration + '-day ' + (state.prefs.group || '') + ' trip';
  byId('explore-sub').textContent =
    'Ranked by fit for a ' + (BUDGET_LABEL[state.prefs.budget] || '').toLowerCase() +
    ' budget — tap a card to deep-dive.';

  // Show skeletons while "loading"
  var grid = byId('explore-grid');
  grid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);

  setTimeout(function() {
    renderExploreCards();
  }, 420);
}

function renderExploreCards() {
  var grid = byId('explore-grid');
  var list = filteredAndSorted();

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--ink-faint);">No destinations match this filter. <button class="btn-text" id="clear-filter-btn">Clear filter</button></div>';
    byId('clear-filter-btn').addEventListener('click', function() {
      exploreCurrentFilter = 'all';
      document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
      document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
      renderExploreCards();
    });
    return;
  }

  grid.innerHTML = list.map(function(m) {
    var d    = m.dest;
    var cost = estimateCost(d, state.prefs, null);
    var isPinned = state.compareIds.indexOf(d.id) !== -1;

    return '' +
      '<button class="dest-card" data-dest-id="' + d.id + '" aria-label="View details for ' + d.name + '">' +
        '<div class="dest-card-top">' +
          '<div class="dest-icon-badge">' + icon(d.icon) + '</div>' +
          '<span class="match-badge">' + m.percent + '% match</span>' +
        '</div>' +
        '<div>' +
          '<h3 class="dest-name">' + d.name + ' ' + d.emoji + '</h3>' +
          '<span class="dest-state">' + d.state + '</span>' +
        '</div>' +
        '<p class="dest-blurb">' + d.blurb + '</p>' +
        '<div class="tag-row">' +
          d.tags.slice(0, 3).map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') +
        '</div>' +
        '<div class="dest-meta-row">' +
          '<span class="rating-inline">' + icon('star') + ' ' + d.rating.toFixed(1) + '</span>' +
          '<span class="price-chip">' + inr(cost.perDay) + '/day</span>' +
        '</div>' +
        '<button class="compare-btn' + (isPinned ? ' active' : '') + '" data-compare-id="' + d.id + '" aria-label="' + (isPinned ? 'Remove from' : 'Add to') + ' comparison" title="Compare">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4M9 3h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>' +
        '</button>' +
      '</button>';
  }).join('');

  // Card click → detail
  grid.querySelectorAll('.dest-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.compare-btn')) return;
      selectDestination(card.getAttribute('data-dest-id'));
    });
  });

  // Compare button
  grid.querySelectorAll('.compare-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = btn.getAttribute('data-compare-id');
      toggleCompare(id);
    });
  });

  updateCompareBar();
}

/* ===================== COMPARE TOGGLE ===================== */
function toggleCompare(id) {
  var idx = state.compareIds.indexOf(id);
  if (idx !== -1) {
    state.compareIds.splice(idx, 1);
  } else {
    if (state.compareIds.length >= 2) {
      // Replace oldest
      state.compareIds.shift();
    }
    state.compareIds.push(id);
  }
  renderExploreCards();
  updateCompareBar();
}

function updateCompareBar() {
  var bar = byId('compare-bar');
  if (!bar) return;
  if (state.compareIds.length === 2 && state.currentStep === 3) {
    var d1 = findDest(state.compareIds[0]);
    var d2 = findDest(state.compareIds[1]);
    byId('compare-bar-names').innerHTML =
      '<strong>' + (d1 ? d1.name : '') + '</strong> vs <strong>' + (d2 ? d2.name : '') + '</strong>';
    bar.classList.add('show');
  } else {
    bar.classList.remove('show');
  }
}

/* ===================== FILTER + SORT CONTROLS ===================== */
function initExploreControls() {
  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      exploreCurrentFilter = chip.getAttribute('data-filter');
      renderExploreCards();
    });
  });

  // Sort select
  var sortSel = byId('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', function() {
      exploreCurrentSort = sortSel.value;
      renderExploreCards();
    });
  }

  // Back button
  byId('btn-back-to-prefs').addEventListener('click', function() { goToStep(2); });

  // Compare bar buttons
  var compareNowBtn = byId('btn-compare-now');
  if (compareNowBtn) {
    compareNowBtn.addEventListener('click', function() {
      renderCompareDrawer();
      byId('compare-drawer').classList.add('open');
    });
  }
  var compareClearBtn = byId('btn-compare-clear');
  if (compareClearBtn) {
    compareClearBtn.addEventListener('click', function() {
      state.compareIds = [];
      renderExploreCards();
      updateCompareBar();
    });
  }

  // Close compare drawer
  var closeDrawer = byId('btn-close-compare');
  if (closeDrawer) {
    closeDrawer.addEventListener('click', function() {
      byId('compare-drawer').classList.remove('open');
    });
  }
}

function initScreen3() {
  initExploreControls();
}
