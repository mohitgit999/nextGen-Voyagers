'use strict';

/* ============================================================
   VOYAGER — Screen 2: Preferences
   Budget, duration, group type, traveller count, validation
   ============================================================ */

function initScreen2() {
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
    computeMatches();
    renderExplore();
    unlockStep(3);
    goToStep(3);
  });
}
