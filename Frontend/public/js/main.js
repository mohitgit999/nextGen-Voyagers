'use strict';

/* ============================================================
   VOYAGER — Main Entry Point
   Initialises all modules in correct dependency order
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* Load persisted data */
  loadPersistedState();

  /* Fetch dynamic destinations from API, fallback to local data.js */
  fetch('/api/destinations')
    .then(function(res) {
      if (!res.ok) throw new Error('API failed');
      return res.json();
    })
    .then(function(data) {
      if (data && data.length > 0) {
        window.DESTINATIONS = data; // Override static data
        console.log('Loaded destinations from API:', data.length);
      }
      initApp();
    })
    .catch(function(err) {
      console.warn('Backend API unavailable, using local fallback data.', err);
      initApp();
    });

  function initApp() {
    /* Navigation (step routing) */
    initNavigation();

    /* Planner screens */
    initScreen1();
    initScreen2();
    initScreen3();
    initScreen4();
    initScreen5();

    /* SOS modal */
    initSOS();

    /* Landing page enhancements */
    initScrollReveal();
    initCounters();
    initFeaturedScroll();
    initLandingCTA();

    /* Start on step 1 */
    goToStep(1, true);
  }
});

/* ===================== LANDING PAGE ===================== */

/* Reset the UI elements for a fresh planner start */
function resetPlannerUI() {
  var inputs = ['manual-city-input', 'pref-destination'];
  inputs.forEach(function(id) { if (byId(id)) byId(id).value = ''; });
  
  var ls = byId('locate-status');
  if (ls) ls.className = 'locate-status';
  
  var clb = byId('btn-continue-locate');
  if (clb) clb.disabled = true;
  
  var lh = byId('locate-continue-hint');
  if (lh) lh.textContent = 'Detect or enter a starting city to continue.';
  
  if (byId('duration-value')) byId('duration-value').textContent   = '4';
  if (byId('travelers-value')) byId('travelers-value').textContent  = '1';
  
  document.querySelectorAll('#budget-tiles .tile, #group-tiles .group-tile').forEach(function(t) { 
    t.classList.remove('selected'); 
  });
  
  if (byId('btn-show-destinations')) byId('btn-show-destinations').disabled = true;
  if (byId('itinerary-content')) byId('itinerary-content').innerHTML = '';
}

function initLandingCTA() {
  /* "Start planning" buttons and nav links restart the planner and jump to it */
  document.querySelectorAll('[data-cta="start-planning"], a[href="#planner-section"]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      
      /* Reset planner state and UI */
      if (typeof resetPlanner === 'function') resetPlanner();
      if (typeof resetPlannerUI === 'function') resetPlannerUI();
      goToStep(1, true); // Update the active step classes

      var plannerEl = byId('planner-section');
      if (plannerEl) {
        // Scroll exactly to the top of the planner
        plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Featured destination chips on hero jump to explore */
  document.querySelectorAll('.hero-dest-chip[data-dest]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var destId = chip.getAttribute('data-dest');
      /* Pre-fill prefs with sensible defaults if not yet set */
      if (!state.prefs.budget)   state.prefs.budget   = 'mid';
      if (!state.prefs.group)    state.prefs.group     = 'couple';
      if (!state.location.city)  state.location.city   = 'India';
      state.prefs.duration = 4;
      state.prefs.travelers = 2;

      /* Update UI echoes */
      var echo = byId('pref-origin-echo');
      if (echo) echo.textContent = 'India';

      computeMatches();
      renderExplore();
      unlockStep(3);

      var plannerEl = byId('planner-section');
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(function() { goToStep(3); }, 600);
    });
  });
}

/* Featured scroll drag support */
function initFeaturedScroll() {
  var scroll = document.querySelector('.featured-scroll');
  if (!scroll) return;
  var isDown = false, startX, scrollLeft;
  scroll.addEventListener('mousedown',  function(e) { isDown = true; startX = e.pageX - scroll.offsetLeft; scrollLeft = scroll.scrollLeft; });
  scroll.addEventListener('mouseleave', function() { isDown = false; });
  scroll.addEventListener('mouseup',    function() { isDown = false; });
  scroll.addEventListener('mousemove',  function(e) {
    if (!isDown) return;
    e.preventDefault();
    scroll.scrollLeft = scrollLeft - (e.pageX - scroll.offsetLeft - startX);
  });

  /* Featured card clicks */
  document.querySelectorAll('.featured-card[data-dest]').forEach(function(card) {
    card.addEventListener('click', function() {
      var destId = card.getAttribute('data-dest');
      if (!state.prefs.budget)  state.prefs.budget  = 'mid';
      if (!state.prefs.group)   state.prefs.group   = 'couple';
      if (!state.location.city) state.location.city = 'India';
      state.prefs.duration  = 4;
      state.prefs.travelers = 2;
      computeMatches();
      unlockStep(3);
      selectDestination(destId);
      var plannerEl = byId('planner-section');
      if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
