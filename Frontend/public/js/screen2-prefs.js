'use strict';

/* ============================================================
   VOYAGER — Screen 2: Preferences
   Budget, duration, group type, traveller count, validation
   ============================================================ */

function initScreen2() {
  if (!document.getElementById('screen-2')) return;
  var showDestBtn  = byId('btn-show-destinations');
  var prefValidation = byId('pref-validation');
  var durationValue  = byId('duration-value');
  var travelersValue = byId('travelers-value');

  /* ---- Back ---- */
  byId('btn-back-to-locate').addEventListener('click', function() { goToStep(1); });

  /* ---- Destination vibe input ---- */
  byId('pref-destination').addEventListener('input', function(e) {
    state.prefs.destination = e.target.value;
  });

  /* ---- Budget tiles ---- */
  document.querySelectorAll('#budget-tiles .tile').forEach(function(tile) {
    tile.addEventListener('click', function() {
      document.querySelectorAll('#budget-tiles .tile').forEach(function(t) { t.classList.remove('selected'); });
      tile.classList.add('selected');
      state.prefs.budget = tile.getAttribute('data-budget');
      validatePrefs();
    });
  });

  /* ---- Duration stepper ---- */
  byId('duration-minus').addEventListener('click', function() {
    if (state.prefs.duration > 2) {
      state.prefs.duration--;
      durationValue.textContent = state.prefs.duration;
    }
    byId('duration-minus').disabled = (state.prefs.duration <= 2);
  });
  byId('duration-plus').addEventListener('click', function() {
    if (state.prefs.duration < 21) {
      state.prefs.duration++;
      durationValue.textContent = state.prefs.duration;
    }
    byId('duration-plus').disabled = (state.prefs.duration >= 21);
  });

  /* ---- Group tiles ---- */
  document.querySelectorAll('#group-tiles .group-tile').forEach(function(tile) {
    tile.addEventListener('click', function() {
      document.querySelectorAll('#group-tiles .group-tile').forEach(function(t) { t.classList.remove('selected'); });
      tile.classList.add('selected');
      state.prefs.group = tile.getAttribute('data-group');
      var def = parseInt(tile.getAttribute('data-default-travelers'), 10);
      state.prefs.travelers = def;
      travelersValue.textContent = state.prefs.travelers;
      updateTravelerBtns();
      validatePrefs();
    });
  });

  /* ---- Traveller stepper ---- */
  function updateTravelerBtns() {
    byId('travelers-minus').disabled = (state.prefs.travelers <= 1);
    byId('travelers-plus').disabled  = (state.prefs.travelers >= 12);
  }
  byId('travelers-minus').addEventListener('click', function() {
    if (state.prefs.travelers > 1) {
      state.prefs.travelers--;
      travelersValue.textContent = state.prefs.travelers;
      updateTravelerBtns();
    }
  });
  byId('travelers-plus').addEventListener('click', function() {
    if (state.prefs.travelers < 12) {
      state.prefs.travelers++;
      travelersValue.textContent = state.prefs.travelers;
      updateTravelerBtns();
    }
  });

  /* ---- Validation ---- */
  function validatePrefs() {
    var ok = !!state.prefs.budget && !!state.prefs.group;
    showDestBtn.disabled = !ok;
    prefValidation.textContent = ok ? '' : 'Pick a budget and who you\'re travelling with to continue.';
  }

  /* ---- Show destinations ---- */
  showDestBtn.addEventListener('click', function() {
    state.customPerDay = null;         // reset any custom cost
    state.compareIds   = [];           // reset compare
    showDestBtn.disabled = true;
    showDestBtn.textContent = 'Finding AI matches...';
    prefValidation.textContent = '';

    fetch(apiUrl('/api/ai/recommend-destinations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: state.prefs.destination,
        moods: state.prefs.moods,
        duration: state.prefs.duration,
        budget: state.prefs.budget,
        group: state.prefs.group,
        travelers: state.prefs.travelers,
        origin: state.location.city
      })
    })
      .then(function(res) {
        if (!res.ok) throw new Error('AI recommendations unavailable');
        return res.json();
      })
      .then(function(result) {
        if (!result.destinations || !result.destinations.length) throw new Error('No AI matches found');
        window.DESTINATIONS = result.destinations;
        state.matches = result.destinations.map(function(dest, index) {
          return { dest: dest, percent: dest.isPrimary || dest.isExactMatch ? 99 - index : 92 - index };
        });
        renderExplore(result.summary, result.mode);
        unlockStep(3);
        goToStep(3);
      })
      .catch(function(error) {
        console.warn('AI destination recommendation failed, using curated destinations fallback:', error);
        var fallbackDests = window.DESTINATIONS || [];
        if (fallbackDests.length) {
          state.matches = fallbackDests.slice(0, 8).map(function(dest, index) {
            return { dest: dest, percent: 95 - index * 2 };
          });
          renderExplore('Showing curated destinations tailored for your trip.', 'mood');
          unlockStep(3);
          goToStep(3);
        } else {
          prefValidation.textContent = 'Could not load destinations. Please try again in a moment.';
        }
      })
      .finally(function() {
        showDestBtn.disabled = false;
        showDestBtn.textContent = 'Show AI Destinations →';
        validatePrefs();
      });
  });

  /* ---- Mood/vibe tiles (multi-select) ---- */
  document.querySelectorAll('#mood-tiles .mood-tile').forEach(function(tile) {
    tile.addEventListener('click', function() {
      var mood = tile.getAttribute('data-mood');
      var idx = state.prefs.moods.indexOf(mood);
      if (idx === -1) {
        state.prefs.moods.push(mood);
        tile.classList.add('selected');
        tile.setAttribute('aria-pressed', 'true');
      } else {
        state.prefs.moods.splice(idx, 1);
        tile.classList.remove('selected');
        tile.setAttribute('aria-pressed', 'false');
      }
      validatePrefs();
    });
  });
}
