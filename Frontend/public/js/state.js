'use strict';

/* ============================================================
   VOYAGER — Shared State & Helpers
   ============================================================ */

var state = {
  maxStep:     1,
  currentStep: 1,
  location:    { city: null, source: null, lat: null, lon: null },
  prefs:       { destination: '', budget: null, duration: 4, group: null, travelers: 1, moods: [] },
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
  if (!id) return null;

  // 0. Cache check
  if (typeof window !== 'undefined' && window.__VOYAGER_DEST_CACHE__ && window.__VOYAGER_DEST_CACHE__[id]) {
    return window.__VOYAGER_DEST_CACHE__[id];
  }

  var list = (typeof window !== 'undefined' && window.DESTINATIONS && Array.isArray(window.DESTINATIONS))
    ? window.DESTINATIONS
    : (typeof DESTINATIONS !== 'undefined' && Array.isArray(DESTINATIONS) ? DESTINATIONS : []);

  // 1. Exact ID match in list
  for (var i = 0; i < list.length; i++) {
    if (list[i] && list[i].id === id) return list[i];
  }

  // 2. Exact ID match in state.matches
  if (typeof state !== 'undefined' && state && state.matches && Array.isArray(state.matches)) {
    for (var j = 0; j < state.matches.length; j++) {
      if (state.matches[j] && state.matches[j].dest && state.matches[j].dest.id === id) {
        return state.matches[j].dest;
      }
    }
  }

  // 3. Normalize ID (stripping 'ai-' prefix, trailing indices like '-0', punctuation)
  var strId = String(id).trim().toLowerCase();
  var baseSlug = strId.replace(/^ai-/, '').replace(/-\d+$/, '');
  var normSlug = baseSlug.replace(/[^a-z0-9]/g, '');

  function matchesDest(d) {
    if (!d) return false;
    var dId = String(d.id || '').trim().toLowerCase();
    var dName = String(d.name || '').trim().toLowerCase();
    if (dId === strId || dId === baseSlug) return true;
    if (dId.replace(/[^a-z0-9]/g, '') === normSlug) return true;
    if (dName === strId || dName === baseSlug) return true;
    if (dName.replace(/[^a-z0-9]/g, '') === normSlug) return true;
    if (baseSlug.length >= 3 && (dName.indexOf(baseSlug) !== -1 || baseSlug.indexOf(dName) !== -1)) return true;
    return false;
  }

  // Search list with normalization
  for (var k = 0; k < list.length; k++) {
    if (matchesDest(list[k])) return list[k];
  }

  // Search state.matches with normalization
  if (typeof state !== 'undefined' && state && state.matches && Array.isArray(state.matches)) {
    for (var m = 0; m < state.matches.length; m++) {
      if (state.matches[m] && matchesDest(state.matches[m].dest)) {
        return state.matches[m].dest;
      }
    }
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

/* Reset the planner to its initial state */
function resetPlanner() {
  state.maxStep    = 1;
  state.currentStep = 1;
  state.location   = { city: null, source: null, lat: null, lon: null };
  state.prefs      = { destination: '', budget: null, duration: 4, group: null, travelers: 1, moods: [] };
  state.matches    = [];
  state.selectedId = null;
  state.compareIds = [];
  state.customPerDay = null;
  state.packingState = {};
  state.budgetLog    = [];
  clearPersistedState();
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
  if (!d) return { perDay: 2500, total: 2500, slices: [] };
  var pBudget = (prefs && prefs.budget) ? prefs.budget : 'mid';
  var pDuration = (prefs && prefs.duration && !isNaN(prefs.duration)) ? Number(prefs.duration) : 4;
  var pTravelers = (prefs && prefs.travelers && !isNaN(prefs.travelers)) ? Number(prefs.travelers) : 1;
  var costObj = d.cost || { budget: 1500, mid: 3000, luxury: 7000 };
  var perDay = (customPerDay !== null && customPerDay !== undefined && !isNaN(customPerDay))
    ? Number(customPerDay)
    : (costObj[pBudget] || costObj.mid || costObj.budget || 2500);
  var total = perDay * pDuration * pTravelers;
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
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
  els.forEach(function(el) { observer.observe(el); });
}
window.initScrollReveal = initScrollReveal;

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
