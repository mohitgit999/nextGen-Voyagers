'use strict';

/* ============================================================
   VOYAGER — Shared State & Helpers
   ============================================================ */

var state = {
  maxStep:     1,
  currentStep: 1,
  location:    { city: null, source: null, lat: null, lon: null },
  prefs:       { destination: '', budget: null, duration: 4, group: null, travelers: 1 },
  matches:     [],
  selectedId:  null,
  compareIds:  [],           // up to 2 destination IDs for comparison
  budgetLog:   [],           // { id, cat, label, amount }
  packingState:{},           // { itemKey: true/false }
  customPerDay:null          // user-overridden per-day cost
};

/* ===================== HELPERS ===================== */
function inr(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function byId(id) {
  return document.getElementById(id);
}

function findDest(id) {
  for (var i = 0; i < DESTINATIONS.length; i++) {
    if (DESTINATIONS[i].id === id) return DESTINATIONS[i];
  }
  return null;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function escapeHtml(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

/* localStorage helpers */
function lsSet(key, val) {
  try { localStorage.setItem('voyager_' + key, JSON.stringify(val)); } catch(e) {}
}
function lsGet(key, fallback) {
  try {
    var v = localStorage.getItem('voyager_' + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

/* Load persisted state on boot */
function loadPersistedState() {
  state.packingState = lsGet('packingState', {});
  state.budgetLog    = lsGet('budgetLog', []);
}

/* Persist on change */
function persistPackingState() { lsSet('packingState', state.packingState); }
function persistBudgetLog()    { lsSet('budgetLog', state.budgetLog); }

/* Clear all saved state */
function clearPersistedState() {
  try {
    localStorage.removeItem('voyager_packingState');
    localStorage.removeItem('voyager_budgetLog');
  } catch(e) {}
}

/* ===================== COST ESTIMATE ===================== */
function estimateCost(d, prefs, customPerDay) {
  var perDay = customPerDay !== null && customPerDay !== undefined
    ? customPerDay
    : d.cost[prefs.budget];
  var total = perDay * prefs.duration * prefs.travelers;
  var slices = [
    { label: 'Stay',                 pct: 0.35 },
    { label: 'Food & drinks',        pct: 0.25 },
    { label: 'Local transport',      pct: 0.20 },
    { label: 'Activities & entries', pct: 0.20 }
  ];
  slices.forEach(function(s) { s.amount = Math.round(total * s.pct); });
  return { perDay: perDay, total: total, slices: slices };
}

/* ===================== SCROLL REVEAL ===================== */
function initScrollReveal() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el) { observer.observe(el); });
}

/* ===================== STAT COUNTER ===================== */
function animateCounter(el, target, duration) {
  var start = 0;
  var step  = target / (duration / 16);
  function tick() {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start).toLocaleString('en-IN');
    if (start < target) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  document.querySelectorAll('[data-count-to]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        animateCounter(el, target, 1200);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}
