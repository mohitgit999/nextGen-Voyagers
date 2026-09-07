'use strict';

/* ============================================================
   VOYAGER — SOS Modal (Enhanced)
   Open/close, GPS share, first aid tips accordion
   ============================================================ */

function initSOS() {
  var sosModal = byId('sos-modal');

  function openSOS() { sosModal.classList.remove('hidden'); }
  function closeSOS() { sosModal.classList.add('hidden'); }

  byId('sos-fab').addEventListener('click', openSOS);
  byId('sos-close').addEventListener('click', closeSOS);
  sosModal.addEventListener('click', function(e) {
    if (e.target === sosModal) closeSOS();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSOS();
  });

  /* ---- Share GPS coordinates ---- */
  var shareGpsBtn = byId('sos-share-gps');
  if (shareGpsBtn) {
    shareGpsBtn.addEventListener('click', function() {
      if (state.location.lat && state.location.lon) {
        var coords = 'My location: ' + state.location.lat.toFixed(5) + ', ' + state.location.lon.toFixed(5) +
          '\nhttps://maps.google.com/?q=' + state.location.lat + ',' + state.location.lon;
        navigator.clipboard.writeText(coords).then(function() {
          shareGpsBtn.textContent = '✓ Coordinates copied!';
          setTimeout(function() {
            shareGpsBtn.innerHTML = icon('map') + ' Share my GPS coordinates';
          }, 2500);
        }).catch(function() {
          prompt('Copy these coordinates and send to someone:', coords);
        });
      } else if ('geolocation' in navigator) {
        shareGpsBtn.textContent = 'Getting location…';
        navigator.geolocation.getCurrentPosition(function(pos) {
          var lat = pos.coords.latitude;
          var lon = pos.coords.longitude;
          var coords = 'My current location: ' + lat.toFixed(5) + ', ' + lon.toFixed(5) +
            '\nhttps://maps.google.com/?q=' + lat + ',' + lon;
          navigator.clipboard.writeText(coords).then(function() {
            shareGpsBtn.textContent = '✓ Coordinates copied!';
            setTimeout(function() {
              shareGpsBtn.innerHTML = icon('map') + ' Share my GPS coordinates';
            }, 2500);
          }).catch(function() {
            prompt('Your coordinates:', coords);
            shareGpsBtn.innerHTML = icon('map') + ' Share my GPS coordinates';
          });
        }, function() {
          shareGpsBtn.textContent = 'Location unavailable';
          setTimeout(function() {
            shareGpsBtn.innerHTML = icon('map') + ' Share my GPS coordinates';
          }, 2500);
        }, { timeout: 8000 });
      }
    });
  }

  /* ---- First aid accordion ---- */
  var toggle = byId('first-aid-toggle');
  var content = byId('first-aid-content');
  if (toggle && content) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('open');
      content.classList.toggle('show');
    });
  }
}
