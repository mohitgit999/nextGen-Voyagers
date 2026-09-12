import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const GlobalNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isPlanner = location.pathname === '/plan';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);


  return (
    <>
      <nav className="global-nav" id="global-nav" aria-label="Main navigation">
        <Link to="/" className="nav-brand" aria-label="NextGen Voyagers home" onClick={closeMobileMenu}>
          <div className="nav-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
              <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.2" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="nav-brand-name">NextGen Voyagers</span>
        </Link>

        {!isPlanner && (
          <ul className="nav-links" role="list">
            <li>
              <Link to="/" className={!isPlanner ? 'nav-link-active' : ''}>Home</Link>
            </li>
            <li><span className="nav-dot" aria-hidden="true"></span></li>
            <li>
              <Link to="/destinations">Destinations</Link>
            </li>
            <li><span className="nav-dot" aria-hidden="true"></span></li>
            <li>
              <Link to="/plan" className={isPlanner ? 'nav-link-active' : ''} style={isPlanner ? { color: '#FFFFFF', fontWeight: 700 } : {}}>
                ✨ AI Trip Planner
              </Link>
            </li>
            <li><span className="nav-dot" aria-hidden="true"></span></li>
            <li>
              <a href="/#features-section">Features</a>
            </li>
            <li><span className="nav-dot" aria-hidden="true"></span></li>
            <li>
              <a href="/#how-it-works">How It Works</a>
            </li>
            <li><span className="nav-dot" aria-hidden="true"></span></li>
            <li>
              <a href="/#contact-section">Contact</a>
            </li>
            <li>
              <button className="nav-search-icon" id="nav-search-btn" aria-label="Search destinations" title="Search destinations (Ctrl+K)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </li>
          </ul>
        )}

        <div className="nav-actions">
          {!isPlanner && (
            <button className="nav-search-icon mobile-search-btn-nav" id="nav-search-btn-mobile" aria-label="Search destinations" style={{ display: 'none' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
          
          <button className="nav-btn-login" id="nav-btn-login">Log in</button>
          
          {!isPlanner && (
            <>
              <Link
                to="/plan"
                className="nav-btn-signup"
                id="nav-btn-signup"
                data-cta="start-planning"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Start Planning
              </Link>
              <button
                className={`nav-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                id="nav-hamburger"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </>
          )}
        </div>
      </nav>

      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-nav-drawer">
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Home
          </Link>
          <Link to="/plan" className="mobile-nav-link" onClick={closeMobileMenu} style={isPlanner ? { color: '#FFFFFF', fontWeight: 700 } : {}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
            AI Trip Planner
          </Link>
          <Link to="/destinations" className="mobile-nav-link" id="mobile-link-destinations" onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Destinations
          </Link>
          <a href="/#features-section" className="mobile-nav-link" id="mobile-link-features" onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            Features
          </a>
          <a href="/#how-it-works" className="mobile-nav-link" id="mobile-link-how" onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            How It Works
          </a>
          <a href="/#contact-section" className="mobile-nav-link" id="mobile-link-contact" onClick={closeMobileMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
            Contact
          </a>
          <button className="mobile-nav-link" id="mobile-btn-search" onClick={() => { closeMobileMenu(); const btn = document.getElementById('nav-search-btn'); if (btn) btn.click(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: '18px', height: '18px' }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search Destinations (Ctrl+K)
          </button>
        </div>
      </div>
    </>
  );
};

export default GlobalNav;
