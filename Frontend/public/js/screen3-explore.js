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

  // Mood / vibe match bonus
  if (prefs.moods && prefs.moods.length > 0) {
    var destVibes = (d.vibes || []).concat(d.tags || []);
    prefs.moods.forEach(function(mood) {
      var found = destVibes.some(function(v) { return v.toLowerCase().indexOf(mood.toLowerCase()) !== -1; });
      if (found) score += 14;
    });
  }
  return score;
}

function computeMatches() {
  var scored = DESTINATIONS.map(function(d) {
    var raw = scoreDestination(d, state.prefs);
    return { dest: d, percent: clamp(Math.round(raw), 52, 99) };
  });
  scored.sort(function(a, b) { return b.percent - a.percent; });
  state.matches = scored;  // keep all 10 for filtering
}

/* ===================== FILTER + SORT ===================== */
function filteredAndSorted() {
  var list = state.matches.slice();

  // Filter
  if (exploreCurrentFilter === 'hidden-gems') {
    list = list.filter(function(m) {
      return m.dest.hiddenGems && m.dest.hiddenGems.length > 0;
    });
  } else if (exploreCurrentFilter !== 'all') {
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
function renderExplore(summary, mode) {
  byId('explore-heading').textContent =
    mode === 'state' ? 'AI discoveries from your state search' :
      mode === 'place' ? 'Your place, plus AI-similar locations' :
        'AI matches for your travel vibe';
  byId('explore-sub').textContent =
    summary || 'Ranked from live AI recommendations using your preferences and trip profile.';

  // Show skeletons while "loading"
  var grid = byId('explore-grid');
  grid.innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(6);

  setTimeout(function() {
    renderExploreCards();
  }, 420);
}

/* ===================== CATEGORIZED BACKUP IMAGES ===================== */
// Verified categorized backup images (Rivers, Beaches, Mountains, Heritage, Spiritual, Nature, General)
// Notice: ZERO Taj Mahal unless the city is explicitly Agra!
var CATEGORY_BACKUPS = {
  rivers: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Emerald river & lake valley
  beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Tropical beach & waves
  mountains: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Snow peaks & alpine ridges
  heritage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Historic sandstone royal fort
  spiritual: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', // Mountain monastery with prayer flags
  nature: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', // Lush green forest
  general: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80' // Scenic road through hills
};

function getCategoryBackupImage(d) {
  if (!d) return CATEGORY_BACKUPS.general;
  var name = (d.name || '').toLowerCase();
  var stateStr = (d.state || '').toLowerCase();
  var tags = (d.tags || []).concat(d.vibes || []).map(function(t) { return String(t).toLowerCase(); });
  var combined = [name, stateStr].concat(tags).join(' ');

  // ONLY Agra shows Taj Mahal
  if (combined.indexOf('agra') !== -1 || combined.indexOf('taj mahal') !== -1) {
    return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80';
  }

  // 1. Beaches / Coastal / Islands
  if (combined.indexOf('beach') !== -1 || combined.indexOf('coast') !== -1 || combined.indexOf('island') !== -1 || combined.indexOf('sea') !== -1 || combined.indexOf('ocean') !== -1 || combined.indexOf('sand') !== -1 || combined.indexOf('reef') !== -1 || combined.indexOf('scuba') !== -1 || combined.indexOf('surf') !== -1) {
    return CATEGORY_BACKUPS.beaches;
  }

  // 2. Rivers / Lakes / Waterfalls
  if (combined.indexOf('river') !== -1 || combined.indexOf('lake') !== -1 || combined.indexOf('waterfall') !== -1 || combined.indexOf('falls') !== -1 || combined.indexOf('stream') !== -1 || combined.indexOf('ghat') !== -1 || combined.indexOf('water') !== -1 || combined.indexOf('boat') !== -1 || combined.indexOf('rapid') !== -1 || combined.indexOf('rafting') !== -1) {
    return CATEGORY_BACKUPS.rivers;
  }

  // 3. Mountains / High Altitude / Snow / Valley / Pass / Trek
  if (combined.indexOf('mountain') !== -1 || combined.indexOf('snow') !== -1 || combined.indexOf('altitude') !== -1 || combined.indexOf('himalaya') !== -1 || combined.indexOf('valley') !== -1 || combined.indexOf('pass') !== -1 || combined.indexOf('trek') !== -1 || combined.indexOf('hill') !== -1 || combined.indexOf('peak') !== -1 || combined.indexOf('spiti') !== -1 || combined.indexOf('lahaul') !== -1 || combined.indexOf('ladakh') !== -1 || combined.indexOf('himachal') !== -1 || combined.indexOf('kashmir') !== -1 || combined.indexOf('glacier') !== -1) {
    return CATEGORY_BACKUPS.mountains;
  }

  // 4. Spiritual / Temples / Monasteries
  if (combined.indexOf('temple') !== -1 || combined.indexOf('monastery') !== -1 || combined.indexOf('gompa') !== -1 || combined.indexOf('stupa') !== -1 || combined.indexOf('spiritual') !== -1 || combined.indexOf('sacred') !== -1 || combined.indexOf('yoga') !== -1 || combined.indexOf('meditation') !== -1 || combined.indexOf('aarti') !== -1 || combined.indexOf('ashram') !== -1) {
    return CATEGORY_BACKUPS.spiritual;
  }

  // 5. Heritage / History / Forts / Palaces
  if (combined.indexOf('heritage') !== -1 || combined.indexOf('history') !== -1 || combined.indexOf('historic') !== -1 || combined.indexOf('fort') !== -1 || combined.indexOf('palace') !== -1 || combined.indexOf('royal') !== -1 || combined.indexOf('monument') !== -1 || combined.indexOf('architecture') !== -1 || combined.indexOf('haveli') !== -1 || combined.indexOf('rajasthan') !== -1) {
    return CATEGORY_BACKUPS.heritage;
  }

  // 6. Nature / Forests / Tea / Greenery
  if (combined.indexOf('nature') !== -1 || combined.indexOf('forest') !== -1 || combined.indexOf('wildlife') !== -1 || combined.indexOf('jungle') !== -1 || combined.indexOf('green') !== -1 || combined.indexOf('tea') !== -1 || combined.indexOf('coffee') !== -1 || combined.indexOf('plantation') !== -1 || combined.indexOf('sanctuary') !== -1) {
    return CATEGORY_BACKUPS.nature;
  }

  return CATEGORY_BACKUPS.general;
}

/* ===================== DESTINATION IMAGES ===================== */
function getDestinationImage(d) {
  if (!d) return CATEGORY_BACKUPS.general;

  var id = (d.id || '').toLowerCase();
  var name = (d.name || '').toLowerCase().trim();

  // Core 10 destinations
  var localMap = {
    'manali': '/img/manali.jpg',
    'goa': '/img/goa.jpg',
    'rishikesh': '/img/rishikesh.jpg',
    'jaipur': '/img/jaipur.jpg',
    'munnar': '/img/munnar.jpg',
    'kerala': '/img/munnar.jpg',
    'ladakh': '/img/ladakh.jpg',
    'leh': '/img/ladakh.jpg',
    'varanasi': '/img/varanasi.jpg',
    'andaman': '/img/andaman.jpg',
    'coorg': '/img/coorg.jpg',
    'udaipur': '/img/udaipur.jpg'
  };

  for (var key in localMap) {
    if (id === key || name === key || (key.length > 3 && (id.indexOf(key) !== -1 || name.indexOf(key) !== -1))) {
      return localMap[key];
    }
  }

  // Check if d already has a valid cloud image (filter out any legacy Taj Mahal fallback URLs for non-Agra places)
  var candidate = d.heroImage || d.image;
  if (candidate && typeof candidate === 'string') {
    var isLegacyTaj = (candidate.indexOf('photo-1524492412937-b28074a5d7da') !== -1 || candidate.indexOf('photo-1564507592333-c60657eea523') !== -1);
    if (!isLegacyTaj || name.indexOf('agra') !== -1) {
      return candidate;
    }
  }

  // Curated high-resolution photos for famous Indian destinations
  var curatedPhotos = {
    'gokarna': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    'varkala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'pondicherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'puducherry': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'alibaug': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'kasol': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'shimla': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    'ooty': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    'darjeeling': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    'hampi': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80',
    'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    'amritsar': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
    'jaisalmer': 'https://images.unsplash.com/photo-1572979268688-6625895e6389?auto=format&fit=crop&w=800&q=80',
    'jodhpur': 'https://images.unsplash.com/photo-1572979268688-6625895e6389?auto=format&fit=crop&w=800&q=80',
    'alleppey': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'alappuzha': 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    'shillong': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    'meghalaya': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    'chikmagalur': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    'wayanad': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    'spiti': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'mysore': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80',
    'mysuru': 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80',
    'pushkar': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'mahabaleshwar': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'dharamshala': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'mcleodganj': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    'kodaikanal': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    'nainital': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
  };

  for (var city in curatedPhotos) {
    if (name.indexOf(city) !== -1 || id.indexOf(city) !== -1) {
      return curatedPhotos[city];
    }
  }

  // Fall back to category-based backup image
  return getCategoryBackupImage(d);
}

function renderExploreCards() {
  var grid = byId('explore-grid');
  var list = filteredAndSorted();

  if (!list.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#CBD5E1;">No destinations match this filter. <button class="btn-text" id="clear-filter-btn" style="color:#FFFFFF;font-weight:700;">Clear filter</button></div>';
    byId('clear-filter-btn').addEventListener('click', function() {
      exploreCurrentFilter = 'all';
      document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
      document.querySelector('.filter-chip[data-filter="all"]').classList.add('active');
      renderExploreCards();
    });
    return;
  }

  grid.innerHTML = list.map(function(m) {
    var d        = m.dest;
    var cost     = estimateCost(d, state.prefs, null);
    var isPinned = state.compareIds.indexOf(d.id) !== -1;
    var isTopAi  = m.percent >= 82;
    var gemCount = d.hiddenGems ? d.hiddenGems.length : 0;
    var liveWeather = d.liveWeather && d.liveWeather.source === 'live' ? d.liveWeather : null;
    var destImg  = getDestinationImage(d);

    return '' +
      '<button class="dest-card" data-dest-id="' + d.id + '" aria-label="View details for ' + d.name + '">' +
        '<div class="dest-card-bg" style="background-image: url(\'' + destImg + '\');"></div>' +
        '<div class="dest-card-gradient"></div>' +
        '<div class="dest-card-inner">' +
          '<div class="dest-card-top">' +
            '<div class="dest-icon-badge">' + icon(d.icon) + '</div>' +
            '<div style="display:flex;gap:6px;align-items:center;">' +
              (isTopAi ? '<span class="ai-match-badge">⚡ AI Fit</span>' : '') +
              '<span class="match-badge">' + m.percent + '% match</span>' +
            '</div>' +
          '</div>' +
          '<div class="dest-title-wrap">' +
            '<h3 class="dest-name">' + d.name + ' ' + d.emoji + '</h3>' +
            '<span class="dest-state">' + d.state + '</span>' +
          '</div>' +
          '<p class="dest-blurb">' + d.blurb + (d.whyMatched ? ' ' + d.whyMatched : '') + '</p>' +
          '<div class="tag-row">' +
            d.tags.slice(0, 3).map(function(t) { return '<span class="tag-chip">' + t + '</span>'; }).join('') +
            (gemCount ? '<span class="tag-chip gem-tag">💎 ' + gemCount + ' Gems</span>' : '') +
          '</div>' +
          '<div class="dest-meta-row">' +
            '<span class="rating-inline">' + icon('star') + ' ' + d.rating.toFixed(1) + '</span>' +
            '<span class="safety-chip-mini">🛡️ ' + d.safety.score.toFixed(1) + '</span>' +
            '<span class="weather-chip-mini">' + (liveWeather ? '🌡️ ' + liveWeather.temp + '° live' : '🌡️ Weather pending') + '</span>' +
            '<span class="price-chip">' + inr(cost.perDay) + '/day</span>' +
          '</div>' +
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

  // Asynchronously resolve live cloud images for AI destinations or offbeat places
  setTimeout(function() {
    list.forEach(function(m) {
      var d = m.dest;
      if (!d) return;
      var card = grid.querySelector('.dest-card[data-dest-id="' + d.id + '"]');
      if (!card) return;
      var bg = card.querySelector('.dest-card-bg');
      if (!bg) return;

      // If already a local image or Wikimedia cloud image, it is already verified
      if (d.heroImage && (d.heroImage.indexOf('/img/') !== -1 || d.heroImage.indexOf('wikimedia') !== -1)) {
        return;
      }

      // Fetch live cloud photo
      var apiUrl = '/api/ai/destination-photo?query=' + encodeURIComponent(d.name) + 
                   '&state=' + encodeURIComponent(d.state || '') + 
                   '&tags=' + encodeURIComponent((d.tags || []).join(','));
      fetch(apiUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (data && data.imageUrl) {
            bg.style.backgroundImage = 'url("' + data.imageUrl + '")';
            d.heroImage = data.imageUrl;
            d.image = data.imageUrl;
          }
        })
        .catch(function() {});
    });
  }, 100);

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
  if (!document.getElementById('screen-3')) return;
  initExploreControls();
}

window.initScreen3 = initScreen3;
window.renderExploreCards = renderExploreCards;
window.renderExplore = renderExplore;
window.getDestinationImage = getDestinationImage;
