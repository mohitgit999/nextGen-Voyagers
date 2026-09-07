'use strict';

/* ============================================================
   VOYAGER — Step Navigation
   goToStep, unlockStep, stepper UI, progress line
   ============================================================ */

function goToStep(n, noScroll) {
  if (n > state.maxStep) return;
  state.currentStep = n;

  // Toggle screen visibility
  document.querySelectorAll('.screen').forEach(function(s) {
    var num = parseInt(s.getAttribute('data-screen'), 10);
    s.classList.toggle('active', num === n);
  });

  // Update stepper dots
  document.querySelectorAll('.step-item').forEach(function(el) {
    var step = parseInt(el.getAttribute('data-step'), 10);
    el.classList.toggle('active',    step === n);
    el.classList.toggle('done',      step < n);
    el.classList.toggle('reachable', step <= state.maxStep);
  });

  // Update progress fill line
  var stepper = byId('stepper');
  if (stepper) stepper.setAttribute('data-progress', n);

  // Scroll to top of planner
  if (!noScroll) {
    var plannerEl = byId('planner-section');
    if (plannerEl) {
      setTimeout(function() {
        plannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (typeof updateCompareBar === 'function') {
    updateCompareBar();
  }
}

function unlockStep(n) {
  if (n > state.maxStep) state.maxStep = n;
  // Make all steps up to maxStep reachable
  document.querySelectorAll('.step-item').forEach(function(el) {
    var step = parseInt(el.getAttribute('data-step'), 10);
    el.classList.toggle('reachable', step <= state.maxStep);
  });
}

function initNavigation() {
  document.querySelectorAll('.step-hit').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var step = parseInt(btn.parentElement.getAttribute('data-step'), 10);
      if (step <= state.maxStep) goToStep(step);
    });
  });

  // Mobile Hamburger & Drawer
  var hamburger = document.getElementById('nav-hamburger');
  var drawer = document.getElementById('mobile-nav-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = drawer.classList.contains('open');
      hamburger.classList.toggle('active', !isOpen);
      drawer.classList.toggle('open', !isOpen);
      hamburger.setAttribute('aria-expanded', !isOpen);
    });

    // Close drawer when clicking any link in drawer
    drawer.querySelectorAll('.mobile-nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#mobile-nav-drawer') && !e.target.closest('#nav-hamburger')) {
        hamburger.classList.remove('active');
        drawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile search buttons
  var mobSearchBtn = document.getElementById('nav-search-btn-mobile');
  if (mobSearchBtn) {
    mobSearchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openSearchModal === 'function') openSearchModal();
    });
  }

  var drawerSearchBtn = document.getElementById('mobile-btn-search');
  if (drawerSearchBtn) {
    drawerSearchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof openSearchModal === 'function') openSearchModal();
    });
  }
}
