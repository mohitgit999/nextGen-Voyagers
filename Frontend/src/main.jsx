import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Import Global CSS in correct order
import './assets/css/tokens.css';
import './assets/css/reset.css';
import './assets/css/base.css';
import './assets/css/animations.css';
import './assets/css/layout.css';
import './assets/css/components.css';
import './assets/css/screens.css';
import './assets/css/landing.css';
import './assets/css/enhanced.css';
import './assets/css/auth-dashboard.css';
import './assets/css/responsive.css';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  // NOTE: React.StrictMode intentionally omitted — it double-invokes useEffect
  // in development which causes vanilla JS scripts to load and execute twice,
  // triggering global variable conflicts and white-screen crashes.
  // ErrorBoundary provides equivalent safety-net for production crashes.
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>
);
