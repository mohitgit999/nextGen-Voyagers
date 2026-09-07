import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
