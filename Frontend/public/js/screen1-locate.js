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

    // Autofill the input field so user sees detected location
    if (manualInput) {
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
    if (locateHint) locateHint.textContent = 'Starting point detected & set. Ready to continue →';
    
    // Change "Detecting your location..." text to "Location Detected"
    if (locateStatus) {
      locateStatus.classList.remove('err');
      locateStatus.classList.add('show');
      locateStatus.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #1BB89A; flex-shrink: 0;"><path d="M5 12l4 4 10-10"/></svg>' +
        '<span id="locate-status-text" style="color: #1BB89A; font-weight: 600;">Location Detected: ' + city + '</span>';
    }
  }

  function showLocateError(msg) {
    if (!locateStatus) return;
    locateStatus.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; color: #F87171; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '<span id="locate-status-text" style="color: #F87171;">' + msg + '</span>';
    locateStatus.classList.add('show', 'err');
  }

  function setLoading() {
    if (!locateStatus) return;
    locateStatus.classList.remove('err');
    locateStatus.classList.add('show');
    locateStatus.innerHTML =
      '<div class="spinner" style="width: 16px; height: 16px; border: 2px solid rgba(27,184,154,0.3); border-top-color: #1BB89A; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block;"></div>' +
      '<span id="locate-status-text">Detecting your location…</span>';
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

  /* ---- Manual input ---- */
  function doManualSet() {
    if (!manualInput) return;
    var val = manualInput.value.trim();
    if (!val) {
      showLocateError('Please type a city name first.');
      return;
    }
    setLocation(val, 'manual');
  }

  var btnSetManual = byId('btn-set-manual');
  if (btnSetManual) btnSetManual.addEventListener('click', doManualSet);

  if (manualInput) {
    manualInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doManualSet();
    });

    manualInput.addEventListener('input', function() {
      var val = manualInput.value.trim();
      if (val.length >= 2) {
        state.location.city = val;
        state.location.source = 'manual';
        if (continueLocateBtn) continueLocateBtn.disabled = false;
        if (locateHint) locateHint.textContent = 'Starting point set to ' + val + '. Ready to continue →';
        var echoEl = byId('pref-origin-echo');
        if (echoEl) echoEl.textContent = val;
      } else if (val.length === 0) {
        if (continueLocateBtn) continueLocateBtn.disabled = true;
        if (locateHint) locateHint.textContent = 'Detect or enter a starting city to continue.';
      }
    });
  }

  /* ---- Continue ---- */
  if (continueLocateBtn) {
    continueLocateBtn.addEventListener('click', function() {
      if (!state.location.city) {
        if (manualInput && manualInput.value.trim()) {
          doManualSet();
        } else {
          return;
        }
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
