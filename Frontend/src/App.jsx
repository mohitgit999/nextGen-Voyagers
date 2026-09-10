import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
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

      const loadScript = (index) => {
        if (index >= scripts.length) {
          // Dispatch DOMContentLoaded to trigger vanilla JS initialization
          window.document.dispatchEvent(new Event('DOMContentLoaded', {
            bubbles: true,
            cancelable: true
          }));
          setTimeout(() => {
            if (typeof window.initScrollReveal === 'function') {
              window.initScrollReveal();
            }
          }, 150);
          return;
        }

        // Prevent duplicate script loading in development strict mode
        if (document.querySelector(`script[src="${scripts[index]}"]`)) {
          loadScript(index + 1);
          return;
        }

        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => loadScript(index + 1);
        document.body.appendChild(script);
      };

      loadScript(0);
    };

    loadScripts();
  }, []);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlannerPage />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
