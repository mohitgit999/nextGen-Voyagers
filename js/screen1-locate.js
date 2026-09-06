'use strict';

/* ============================================================
   VOYAGER — Screen 1: Locate
   GPS geolocation + Nominatim reverse geocode + manual entry
   ============================================================ */

function initScreen1() {
  var locateStatus    = byId('locate-status');
  var locateStatusText= byId('locate-status-text');
  var continueLocateBtn = byId('btn-continue-locate');
  var locateHint      = byId('locate-continue-hint');

  /* ---- helpers ---- */
  function setLocation(city, source, lat, lon) {
    state.location.city   = city;
    state.location.source = source;
    state.location.lat    = lat  || null;
    state.location.lon    = lon  || null;
    continueLocateBtn.disabled = false;
    locateHint.textContent = 'Starting point set. Ready to continue →';
    locateStatus.classList.remove('err');
    locateStatus.classList.add('show');
    locateStatusText.textContent = '📍 ' + city;
  }

  function showLocateError(msg) {
    locateStatus.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '<span id="locate-status-text">' + msg + '</span>';
    locateStatus.classList.add('show', 'err');
  }

  function setLoading() {
    locateStatus.innerHTML = '<div class="spinner"></div><span id="locate-status-text">Detecting your location…</span>';
    locateStatus.classList.remove('err');
    locateStatus.classList.add('show');
  }

  /* ---- GPS button ---- */
  byId('btn-use-location').addEventListener('click', function() {
    if (!('geolocation' in navigator)) {
      showLocateError("Your browser doesn't support geolocation — enter your city manually below.");
      return;
    }
    setLoading();

    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        fetch(
          'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10',
          { headers: { 'Accept-Language': 'en' } }
        )
        .then(function(r) { return r.json(); })
        .then(function(data) {
          var addr  = data && data.address ? data.address : {};
          var city  = addr.city || addr.town || addr.village || addr.county || addr.state_district;
          var region= addr.state;
          var label = city
            ? (region ? city + ', ' + region : city)
            : ('near ' + lat.toFixed(2) + '°N, ' + lon.toFixed(2) + '°E');
          setLocation(label, 'gps', lat, lon);
        })
        .catch(function() {
          setLocation('near ' + lat.toFixed(2) + '°N, ' + lon.toFixed(2) + '°E', 'gps-coords', lat, lon);
        });
      },
      function() {
        showLocateError('Location access was denied — enter your city manually below.');
      },
      { timeout: 10000 }
    );
  });

  /* ---- Manual set ---- */
  function doManualSet() {
    var val = byId('manual-city-input').value.trim();
    if (!val) {
      showLocateError('Please type a city name first.');
      return;
    }
    setLocation(val, 'manual');
  }

  byId('btn-set-manual').addEventListener('click', doManualSet);
  byId('manual-city-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doManualSet();
  });

  /* ---- Continue ---- */
  continueLocateBtn.addEventListener('click', function() {
    if (!state.location.city) return;
    byId('pref-origin-echo').textContent = state.location.city;
    unlockStep(2);
    goToStep(2);
  });
}
