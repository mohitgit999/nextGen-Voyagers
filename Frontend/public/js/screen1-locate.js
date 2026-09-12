'use strict';

/* ============================================================
   VOYAGER — Screen 1: Locate
   GPS geolocation + Nominatim reverse geocode + manual entry
   ============================================================ */

function initScreen1() {
  if (!document.getElementById('screen-1')) return;
  var locateStatus      = byId('locate-status');
  var locateStatusText  = byId('locate-status-text');
  var continueLocateBtn = byId('btn-continue-locate');
  var locateHint        = byId('locate-continue-hint');
  var manualInput       = byId('manual-city-input');

  /* ---- helpers ---- */
  function setLocation(city, source, lat, lon) {
    state.location.city   = city;
    state.location.source = source;
    state.location.lat    = lat  || null;
    state.location.lon    = lon  || null;

    // Autofill the input field if it is not currently focused with this value
    if (manualInput && manualInput.value !== city && document.activeElement !== manualInput) {
      manualInput.value = city;
      manualInput.classList.add('autofilled');
      setTimeout(function() {
        if (manualInput) manualInput.classList.remove('autofilled');
      }, 2000);
    }

    // Update Step 2 echo text
    var echoEl = byId('pref-origin-echo');
    if (echoEl) {
      echoEl.textContent = city;
    }

    // Persist
    lsSet('location', state.location);

    // Enable continue
    if (continueLocateBtn) continueLocateBtn.disabled = false;
    if (locateHint) locateHint.textContent = 'Starting point set to ' + city + '. Ready to continue →';
    
    // Change status text to "Location Selected"
    if (locateStatus) {
      locateStatus.classList.remove('err');
      locateStatus.classList.add('show');
      locateStatus.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #FFFFFF; flex-shrink: 0;"><path d="M5 12l4 4 10-10"/></svg>' +
        '<span id="locate-status-text" style="color: #FFFFFF; font-weight: 600;">Location Selected: ' + city + '</span>';
    }
  }

  function showLocateError(msg) {
    if (!locateStatus) return;
    locateStatus.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #F87171; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '<span id="locate-status-text" style="color: #F87171; font-weight: 600;">' + msg + '</span>';
    locateStatus.classList.add('show', 'err');
  }

  function setLoading() {
    if (!locateStatus) return;
    locateStatus.classList.remove('err');
    locateStatus.classList.add('show');
    locateStatus.innerHTML =
      '<div class="spinner" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #FFFFFF; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></div>' +
      '<span id="locate-status-text" style="color: #FFFFFF; font-weight: 600;">Detecting your location…</span>';
  }

  /* ---- Reverse Geocoding with Fallback ---- */
  function reverseGeocode(lat, lon) {
    // 1. Primary: Nominatim OpenStreetMap
    fetch(
      'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10',
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'NextGenVoyagers/1.0' } }
    )
    .then(function(r) {
      if (!r.ok) throw new Error('Nominatim HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      var addr   = data && data.address ? data.address : {};
      var city   = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || addr.state_district;
      var region = addr.state;
      var label  = city
        ? (region && region !== city ? city + ', ' + region : city)
        : (data.display_name ? data.display_name.split(',')[0] : null);

      if (label) {
        setLocation(label, 'gps', lat, lon);
      } else {
        throw new Error('No city name in Nominatim result');
      }
    })
    .catch(function() {
      // 2. Secondary fallback: BigDataCloud client API
      fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=en')
        .then(function(r) { return r.json(); })
        .then(function(bdc) {
          var city = bdc.city || bdc.locality || bdc.principalSubdivision;
          var stateName = bdc.principalSubdivision;
          var label = city
            ? (stateName && stateName !== city ? city + ', ' + stateName : city)
            : ('near ' + lat.toFixed(2) + '°N, ' + lon.toFixed(2) + '°E');
          setLocation(label, 'gps', lat, lon);
        })
        .catch(function() {
          var fallback = 'near ' + lat.toFixed(2) + '°N, ' + lon.toFixed(2) + '°E';
          setLocation(fallback, 'gps-coords', lat, lon);
        });
    });
  }

  /* ---- GPS button ---- */
  var btnUseLoc = byId('btn-use-location');
  if (btnUseLoc) {
    btnUseLoc.addEventListener('click', function() {
      if (!('geolocation' in navigator)) {
        showLocateError("Your browser doesn't support geolocation — enter your city manually below.");
        return;
      }
      setLoading();

      navigator.geolocation.getCurrentPosition(
        function(pos) {
          reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        },
        function(err) {
          if (err.code === err.PERMISSION_DENIED) {
            showLocateError('Location permission denied — please type your city name below.');
          } else {
            showLocateError('Could not detect location — please type your city name below.');
          }
        },
        { timeout: 12000, enableHighAccuracy: true }
      );
    });
  }

  /* ---- Online Location Autocomplete & Fetch-and-Fill ---- */
  var suggestionsDropdown = byId('manual-location-suggestions');
  var currentSuggestions = [];
  var activeSuggestionIndex = -1;
  var searchDebounceTimer = null;
  var latestSearchQuery = '';

  function hideSuggestions() {
    if (suggestionsDropdown) {
      suggestionsDropdown.style.display = 'none';
      suggestionsDropdown.innerHTML = '';
    }
    currentSuggestions = [];
    activeSuggestionIndex = -1;
  }

  function highlightSuggestion(index) {
    if (!suggestionsDropdown) return;
    var items = suggestionsDropdown.querySelectorAll('.location-suggestion-item');
    items.forEach(function(el, idx) {
      if (idx === index) {
        el.classList.add('active');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('active');
      }
    });
    activeSuggestionIndex = index;
  }

  function selectSuggestion(item) {
    if (!item) return;
    var displayName = item.shortName || item.name;
    if (manualInput) {
      manualInput.value = displayName;
      manualInput.classList.add('location-filled');
      setTimeout(function() {
        if (manualInput) manualInput.classList.remove('location-filled');
      }, 1500);
    }
    setLocation(displayName, 'online-geocoded', item.lat, item.lon);
    hideSuggestions();
  }

  // Fetch locations from backend API with fallback to direct Photon
  function fetchLocationsOnline(query, callback) {
    var q = query.trim();
    if (!q || q.length < 2) {
      callback([]);
      return;
    }

    // 1. Try Backend search API (which handles Google Geocoding, Photon, and Nominatim)
    fetch('/api/location/search?q=' + encodeURIComponent(q))
      .then(function(r) {
        if (!r.ok) throw new Error('Backend HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        if (data && data.success && Array.isArray(data.results)) {
          callback(data.results);
        } else {
          throw new Error('Invalid backend response');
        }
      })
      .catch(function() {
        // 2. Fallback directly to Photon online API
        fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&limit=6')
          .then(function(r) { return r.json(); })
          .then(function(photonData) {
            var items = [];
            if (photonData && Array.isArray(photonData.features)) {
              items = photonData.features.map(function(f) {
                var p = f.properties || {};
                var name = p.name || p.city || p.county || '';
                var stateName = p.state || '';
                var country = p.country || '';
                var shortName = name;
                if (stateName && stateName !== name) shortName += ', ' + stateName;
                return {
                  name: name,
                  state: stateName,
                  country: country,
                  shortName: shortName,
                  fullName: shortName + (country ? ', ' + country : ''),
                  lat: f.geometry && f.geometry.coordinates ? f.geometry.coordinates[1] : null,
                  lon: f.geometry && f.geometry.coordinates ? f.geometry.coordinates[0] : null
                };
              }).filter(function(i) { return !!i.name; });
            }
            callback(items);
          })
          .catch(function() {
            callback([]);
          });
      });
  }

  function renderSuggestions(results, query) {
    if (!suggestionsDropdown) return;
    currentSuggestions = results || [];
    activeSuggestionIndex = -1;

    if (!currentSuggestions.length) {
      suggestionsDropdown.innerHTML =
        '<div class="sugg-status sugg-empty">' +
          '<span>No online matches found for "<b>' + escapeHtml(query) + '</b>". Press Enter to use as-is.</span>' +
        '</div>';
      suggestionsDropdown.style.display = 'block';
      return;
    }

    var html = '';
    currentSuggestions.forEach(function(item, idx) {
      var title = item.shortName || item.name;
      var sub = item.country ? (item.state && item.state !== item.name ? item.state + ', ' + item.country : item.country) : (item.fullName || '');
      html +=
        '<div class="location-suggestion-item" data-index="' + idx + '">' +
          '<span class="sugg-icon">📍</span>' +
          '<div class="sugg-text">' +
            '<div class="sugg-title">' + escapeHtml(title) + '</div>' +
            (sub ? '<div class="sugg-sub">' + escapeHtml(sub) + '</div>' : '') +
          '</div>' +
        '</div>';
    });

    suggestionsDropdown.innerHTML = html;
    suggestionsDropdown.style.display = 'block';

    var items = suggestionsDropdown.querySelectorAll('.location-suggestion-item');
    items.forEach(function(el) {
      el.addEventListener('mousedown', function(e) {
        // Use mousedown so it triggers before blur
        e.preventDefault();
        var idx = parseInt(el.getAttribute('data-index'), 10);
        if (!isNaN(idx) && currentSuggestions[idx]) {
          selectSuggestion(currentSuggestions[idx]);
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function triggerSearch(val) {
    var query = val.trim();
    latestSearchQuery = query;

    if (query.length < 2) {
      hideSuggestions();
      if (query.length === 0) {
        state.location.city = null;
        if (continueLocateBtn) continueLocateBtn.disabled = true;
        if (locateHint) locateHint.textContent = 'Detect or enter a starting city to continue.';
        if (locateStatus) locateStatus.classList.remove('show');
      }
      return;
    }

    // Show loading state in dropdown
    if (suggestionsDropdown) {
      suggestionsDropdown.innerHTML =
        '<div class="sugg-status sugg-loading">' +
          '<div class="spinner-sm"></div>' +
          '<span>Fetching locations online…</span>' +
        '</div>';
      suggestionsDropdown.style.display = 'block';
    }

    fetchLocationsOnline(query, function(results) {
      // Discard if query has changed in the meantime
      if (manualInput && manualInput.value.trim() !== query && latestSearchQuery !== query) {
        return;
      }
      renderSuggestions(results, query);
    });
  }

  /* ---- Manual input and Set City action ---- */
  function fetchAndFillTopMatch(val, onComplete) {
    var query = (val || '').trim();
    if (!query) {
      showLocateError('Please enter a city or location name.');
      return;
    }

    var btnSet = byId('btn-set-manual');
    var originalBtnText = btnSet ? btnSet.textContent : '';
    if (btnSet) {
      btnSet.disabled = true;
      btnSet.textContent = 'Fetching…';
    }

    fetchLocationsOnline(query, function(results) {
      if (btnSet) {
        btnSet.disabled = false;
        btnSet.textContent = originalBtnText || 'Set City';
      }

      if (results && results.length > 0) {
        // Fill with the best matching online location
        selectSuggestion(results[0]);
      } else {
        // Fallback to typed text if online returns 0 matches
        setLocation(query, 'manual');
        hideSuggestions();
      }

      if (typeof onComplete === 'function') onComplete();
    });
  }

  var btnSetManual = byId('btn-set-manual');
  if (btnSetManual) {
    btnSetManual.addEventListener('click', function(e) {
      e.preventDefault();
      var val = manualInput ? manualInput.value.trim() : '';
      fetchAndFillTopMatch(val);
    });
  }

  if (manualInput) {
    manualInput.addEventListener('input', function() {
      clearTimeout(searchDebounceTimer);
      var val = manualInput.value;
      searchDebounceTimer = setTimeout(function() {
        triggerSearch(val);
      }, 220);
    });

    manualInput.addEventListener('focus', function() {
      var val = manualInput.value.trim();
      if (val.length >= 2 && (!suggestionsDropdown || suggestionsDropdown.style.display === 'none')) {
        triggerSearch(val);
      }
    });

    manualInput.addEventListener('keydown', function(e) {
      if (suggestionsDropdown && suggestionsDropdown.style.display === 'block' && currentSuggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var nextIdx = activeSuggestionIndex + 1;
          if (nextIdx >= currentSuggestions.length) nextIdx = 0;
          highlightSuggestion(nextIdx);
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prevIdx = activeSuggestionIndex - 1;
          if (prevIdx < 0) prevIdx = currentSuggestions.length - 1;
          highlightSuggestion(prevIdx);
          return;
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
            selectSuggestion(currentSuggestions[activeSuggestionIndex]);
          } else if (currentSuggestions.length > 0) {
            selectSuggestion(currentSuggestions[0]);
          } else {
            fetchAndFillTopMatch(manualInput.value.trim());
          }
          return;
        } else if (e.key === 'Escape') {
          e.preventDefault();
          hideSuggestions();
          return;
        }
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        fetchAndFillTopMatch(manualInput.value.trim());
      }
    });
  }

  // Close suggestions on outside click
  document.addEventListener('click', function(e) {
    if (!manualInput || !suggestionsDropdown) return;
    if (!manualInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
      hideSuggestions();
    }
  });

  /* ---- Continue ---- */
  if (continueLocateBtn) {
    continueLocateBtn.addEventListener('click', function() {
      var typedVal = manualInput ? manualInput.value.trim() : '';

      // If user typed something but hasn't finalized selection yet
      if ((!state.location.city || !state.location.city.trim()) && typedVal) {
        fetchAndFillTopMatch(typedVal, function() {
          var echoEl = byId('pref-origin-echo');
          if (echoEl) echoEl.textContent = state.location.city;
          unlockStep(2);
          goToStep(2);
        });
        return;
      }

      if (!state.location.city || !state.location.city.trim()) {
        showLocateError('Please enter or detect your starting location to proceed.');
        return;
      }

      var echoEl = byId('pref-origin-echo');
      if (echoEl) echoEl.textContent = state.location.city;
      unlockStep(2);
      goToStep(2);
    });
  }

  /* ---- Restore saved location if present ---- */
  var savedLoc = lsGet('location', null);
  if (savedLoc && savedLoc.city && !state.location.city) {
    setLocation(savedLoc.city, savedLoc.source || 'persisted', savedLoc.lat, savedLoc.lon);
  }
}
