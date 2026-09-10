import React from 'react';
import GlobalNav from './GlobalNav';
import SiteFooter from './SiteFooter';

const AppLayout = ({ children }) => {
  return (
    <div className="site-layout-wrapper">
      {/* Global sticky navigation */}
      <GlobalNav />

      {/* Main page content container */}
      <main id="main-content" className="site-main-content">
        {children}
      </main>

      {/* Shared site-wide footer */}
      <SiteFooter />

      {/* Floating SOS Emergency Action Button */}
      <button className="sos-fab" id="sos-fab" aria-haspopup="dialog" aria-label="Emergency SOS" title="Emergency Help & Helplines">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        SOS
      </button>

      {/* SOS Emergency Modal */}
      <div className="modal-overlay hidden" id="sos-modal" role="dialog" aria-modal="true" aria-labelledby="sos-title">
        <div className="modal-box">
          <div className="modal-box-head">
            <h3 id="sos-title">🚨 Emergency Assistance</h3>
            <button className="modal-close-btn" id="sos-close" aria-label="Close emergency modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </div>

          <p className="hint-text">India-wide helplines — reachable toll-free from any telecom network, 24x7.</p>

          <ul className="emergency-list">
            <li>
              <span>National Emergency Number</span>
              <a href="tel:112" className="call-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
                112
              </a>
            </li>
            <li><span>Police</span><a href="tel:112" className="call-btn">112</a></li>
            <li><span>Medical Ambulance</span><a href="tel:108" className="call-btn">108</a></li>
            <li><span>Fire Brigade</span><a href="tel:101" className="call-btn">101</a></li>
            <li><span>Women's Safety Helpline</span><a href="tel:181" className="call-btn">181</a></li>
            <li><span>Tourist Helpline (Ministry of Tourism)</span><a href="tel:1363" className="call-btn">1363</a></li>
            <li><span>Railway Assistance Helpline</span><a href="tel:139" className="call-btn">139</a></li>
            <li><span>Cyber Crime Cyber Helpline</span><a href="tel:1930" className="call-btn">1930</a></li>
          </ul>

          <button className="share-gps-btn" id="sos-share-gps">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Share My Live GPS Coordinates
          </button>

          <div className="first-aid-section">
            <button className="first-aid-toggle" id="first-aid-toggle" aria-expanded="false">
              <span>🩹 While you wait — Quick Emergency First Aid</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="first-aid-content" id="first-aid-content">
              <div className="first-aid-item">• Stay calm and keep the injured person still.</div>
              <div className="first-aid-item">• Do not move anyone with a potential spinal or neck injury.</div>
              <div className="first-aid-item">• Apply firm pressure to bleeding wounds using a clean cloth.</div>
              <div className="first-aid-item">• Keep the person warm, sheltered, and hydrated if conscious.</div>
              <div className="first-aid-item">• For altitude sickness: descend immediately, rest, and hydrate with warm water.</div>
            </div>
          </div>

          <p className="modal-note" id="sos-context-note">Press and hold the power button for 3 seconds on your phone to trigger emergency SOS on most mobile devices.</p>
        </div>
      </div>

      {/* Authentication Modal (Login / Sign Up / Demo) */}
      <div className="app-modal-overlay" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div className="app-modal-card">
          <div className="modal-header-bar">
            <div className="modal-header-title" id="auth-modal-title">
              <span>✈️</span> NextGen Voyagers Account
            </div>
            <button className="modal-close-icon-btn" id="auth-modal-close" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="auth-tabs">
            <button className="auth-tab-btn active" id="tab-btn-login">Sign In</button>
            <button className="auth-tab-btn" id="tab-btn-register">Create Account</button>
          </div>

          <div className="auth-body-content">
            <div className="auth-error-msg" id="auth-error-msg"></div>

            {/* Login Form */}
            <form className="auth-form active" id="form-login">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <input className="form-input" type="email" id="login-email" placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="form-input-wrapper">
                  <input className="form-input" type="password" id="login-password" placeholder="Enter your password" required autoComplete="current-password" />
                  <button type="button" className="form-input-toggle-pw" data-target="login-password">Show</button>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn">Sign In to Voyagers</button>
              <div className="auth-divider">or explore instantly</div>
              <button type="button" className="btn-demo-quick">⚡ One-Click Demo Login</button>
            </form>

            {/* Register Form */}
            <form className="auth-form" id="form-register">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input className="form-input" type="text" id="reg-name" placeholder="Traveler Name" required autoComplete="name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <input className="form-input" type="email" id="reg-email" placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password (min 6 characters)</label>
                <div className="form-input-wrapper">
                  <input className="form-input" type="password" id="reg-password" placeholder="Create a secure password" minLength="6" required autoComplete="new-password" />
                  <button type="button" className="form-input-toggle-pw" data-target="reg-password">Show</button>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn">Create Free Account</button>
              <div className="auth-divider">or explore instantly</div>
              <button type="button" className="btn-demo-quick">⚡ One-Click Demo Login</button>
            </form>
          </div>
        </div>
      </div>

      {/* Travel Dashboard Modal */}
      <div className="app-modal-overlay" id="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dash-modal-title">
        <div className="app-modal-card large-card">
          <div className="modal-header-bar">
            <div className="modal-header-title" id="dash-modal-title">
              <span>📊</span> My Travel Dashboard
            </div>
            <button className="modal-close-icon-btn" id="dashboard-modal-close" aria-label="Close dashboard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="dashboard-scroll-body">
            <div className="dashboard-user-hero">
              <div className="dash-profile-info">
                <div className="dash-avatar-large" id="dash-user-avatar">T</div>
                <div>
                  <div className="dash-user-name" id="dash-user-name">Traveler</div>
                  <div className="dash-user-email" id="dash-user-email">traveler@voyagers.com</div>
                </div>
              </div>
              <a href="/plan" className="btn btn-primary btn-sm" id="dash-btn-new-trip" style={{ padding: '10px 18px', textDecoration: 'none' }}>
                + Plan New Trip
              </a>
            </div>

            <div className="dash-stats-grid">
              <div className="dash-stat-card">
                <span className="dash-stat-label">Saved Itineraries</span>
                <span className="dash-stat-val" id="dash-stat-trips">0</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Total Budget Allocated</span>
                <span className="dash-stat-val" id="dash-stat-budget">₹0</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-label">Favorite Destination</span>
                <span className="dash-stat-val" id="dash-stat-top">None</span>
              </div>
            </div>

            <div className="dash-section-header">
              <div className="dash-section-title">Saved Cloud Itineraries</div>
            </div>
            <div className="saved-trips-grid" id="saved-trips-container"></div>
          </div>
        </div>
      </div>

      {/* Destination Search Modal (Ctrl+K) */}
      <div className="app-modal-overlay" id="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
        <div className="app-modal-card search-modal-card">
          <div className="search-input-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', color: 'var(--ink-faint)', flexShrink: '0' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" className="search-field" id="search-dest-input" placeholder="Search Goa, Manali, Ladakh, beaches, mountains, winter..." autoComplete="off" />
            <button className="modal-close-icon-btn" id="search-modal-close" aria-label="Close search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="search-results-list" id="search-results-list"></div>
        </div>
      </div>

      {/* Universal Toast Container */}
      <div className="toast-container" id="toast-container"></div>
    </div>
  );
};

export default AppLayout;
