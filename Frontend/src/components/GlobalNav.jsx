import React, { useState } from 'react';

const GlobalNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="global-nav" id="global-nav" aria-label="Main navigation">
        <a href="#" className="nav-brand" aria-label="NextGen Voyagers home">
          <div className="nav-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
              <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/>
              <circle cx="12" cy="9" r="2.2" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <span className="nav-brand-name">NextGen Voyagers</span>
        </a>

        <ul className="nav-links" role="list">
          <li><a href="#destinations-section">Destinations</a></li>
          <li><span className="nav-dot" aria-hidden="true"></span></li>
          <li><a href="#planner-section">Plan Trip</a></li>
          <li><span className="nav-dot" aria-hidden="true"></span></li>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><span className="nav-dot" aria-hidden="true"></span></li>
          <li><a href="#contact-section">Contact</a></li>
          <li>
            <button className="nav-search-icon" id="nav-search-btn" aria-label="Search destinations">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          <button className="nav-search-icon mobile-search-btn-nav" id="nav-search-btn-mobile" aria-label="Search destinations" style={{display: 'none'}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button className="nav-btn-login" id="nav-btn-login">Log in</button>
          <button className="nav-btn-signup" id="nav-btn-signup" data-cta="start-planning">Start Planning</button>
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
        </div>
      </nav>

      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} id="mobile-nav-drawer">
        <div className="mobile-nav-links">
          <a href="#destinations-section" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
            Destinations
          </a>
          <a href="#planner-section" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            Plan Trip
          </a>
          <a href="#how-it-works" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            How It Works
          </a>
          <a href="#contact-section" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
            Contact
          </a>
        </div>
      </div>
    </>
  );
};

export default GlobalNav;
