import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import AppLayout from './components/AppLayout';

/* ─────────────────────────────────────────────────────────────────────────────
   Sequential script loader — loads scripts one-by-one in guaranteed order.
   Uses a global flag so React StrictMode double-invocation (or any hot-reload)
   never appends the same scripts twice, preventing re-execution crashes.
───────────────────────────────────────────────────────────────────────────── */
const SCRIPT_LIST = [
  '/js/api.js',
  '/js/data.js',
  '/js/state.js',
  '/js/auth.js',
  '/js/dashboard.js',
  '/js/search.js',
  '/js/navigation.js',
  '/js/screen1-locate.js',
  '/js/screen2-prefs.js',
  '/js/map-utils.js',
  '/js/screen3-explore.js',
  '/js/screen4-detail.js',
  '/js/screen5-itinerary.js',
  '/js/sos.js',
  '/js/hero.js',
  '/js/contact.js',
  '/js/main.js',
];

const SCRIPT_VERSION = '?v=2.5.0'; // bump this to bust cache when scripts change

function loadScriptsSequentially(scripts, version, onComplete) {
  // Guard: only load once per page lifetime (survives StrictMode double-invoke)
  if (window.__VOYAGER_SCRIPTS_LOADED__) {
    onComplete();
    return;
  }
  window.__VOYAGER_SCRIPTS_LOADED__ = true; // claim the slot immediately

  let index = 0;

  function loadNext() {
    if (index >= scripts.length) {
      onComplete();
      return;
    }

    const src = scripts[index];
    const scriptUrl = src + version;
    index++;

    // Skip if this exact URL is already in the DOM
    if (document.querySelector(`script[data-voyager-src="${src}"]`)) {
      loadNext();
      return;
    }

    const el = document.createElement('script');
    el.src = scriptUrl;
    el.setAttribute('data-voyager-src', src);
    el.onload = loadNext;
    el.onerror = (e) => {
      console.warn('[Voyager] Script failed to load:', src, e);
      loadNext(); // continue chain even if one fails
    };
    document.body.appendChild(el);
  }

  loadNext();
}

function App() {
  useEffect(() => {
    // Set API base URL before any script runs
    window.__API_BASE_URL__ = import.meta.env.VITE_API_URL || '';

    loadScriptsSequentially(SCRIPT_LIST, SCRIPT_VERSION, () => {
      // All scripts loaded — trigger vanilla JS init
      window.document.dispatchEvent(
        new Event('DOMContentLoaded', { bubbles: true, cancelable: true })
      );
      // Scroll reveal needs a brief delay for DOM paint
      setTimeout(() => {
        if (typeof window.initScrollReveal === 'function') {
          window.initScrollReveal();
        }
      }, 120);
    });
  }, []); // runs once on mount — StrictMode guard is inside loadScriptsSequentially

  return (
    <AppLayout>
      <Routes>
        <Route path="/"               element={<HomePage />} />
        <Route path="/plan"           element={<PlannerPage />} />
        <Route path="/destinations"   element={<DestinationsPage />} />
        <Route path="/destination/:id" element={<DestinationDetailPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
