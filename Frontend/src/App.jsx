import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import AppLayout from './components/AppLayout';

function App() {
  useEffect(() => {
    window.__API_BASE_URL__ = import.meta.env.VITE_API_URL || '';

    const loadScripts = () => {
      const scripts = [
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
        '/js/main.js'
      ];

      const scriptVersion = '?v=2.3.0';
      let loadedCount = 0;
      const totalScripts = scripts.length;

      const onAllScriptsReady = () => {
        // Dispatch DOMContentLoaded to trigger vanilla JS initialization
        window.document.dispatchEvent(new Event('DOMContentLoaded', {
          bubbles: true,
          cancelable: true
        }));
        setTimeout(() => {
          if (typeof window.initScrollReveal === 'function') {
            window.initScrollReveal();
          }
        }, 120);
      };

      scripts.forEach((src) => {
        const scriptUrl = src + scriptVersion;
        if (document.querySelector(`script[src="${scriptUrl}"]`)) {
          loadedCount++;
          if (loadedCount === totalScripts) {
            onAllScriptsReady();
          }
          return;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        // Setting async = false guarantees strict FIFO execution order while downloading concurrently in parallel!
        script.async = false;
        script.onload = () => {
          loadedCount++;
          if (loadedCount === totalScripts) {
            onAllScriptsReady();
          }
        };
        script.onerror = () => {
          loadedCount++;
          if (loadedCount === totalScripts) {
            onAllScriptsReady();
          }
        };
        document.body.appendChild(script);
      });
    };

    loadScripts();
  }, []);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlannerPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destination/:id" element={<DestinationDetailPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
