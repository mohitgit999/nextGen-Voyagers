import React from 'react';
import '../assets/css/planner.css';

const PlannerPage = () => {
  return (
    <div id="planner-section" className="planner-page-container">
      {/* Background overlay */}
      <div className="planner-bg-backdrop" aria-hidden="true"></div>

      {/* Hero Banner Header */}
      <header className="planner-hero">
        <div className="planner-hero-inner">
          <span className="planner-hero-badge">✨ NextGen AI Travel Suite</span>
          <h1 className="planner-hero-title">Craft Your Perfect India Itinerary</h1>
          <p className="planner-hero-subtitle">
            Personalized day-by-day itineraries, live weather &amp; crowd predictions, free interactive Leaflet maps, verified safety guidelines, and budget tracking — tailored to your unique travel vibe in 5 simple steps.
          </p>

          <div className="planner-hero-pill-row">
            <span className="hero-feature-pill">🛡️ 100% Verified Safe Routes</span>
            <span className="hero-feature-pill">🤖 Google Gemini AI Engine</span>
            <span className="hero-feature-pill">🗺️ Free Interactive Maps</span>
            <span className="hero-feature-pill">💎 Secret Hidden Gems</span>
            <span className="hero-feature-pill">👥 Live Crowd Intensity</span>
          </div>
        </div>
      </header>

      {/* Main App Canvas */}
      <div className="app planner-app-canvas">
        {/* Step Progress Bar */}
        <nav className="route-stepper" id="stepper" data-progress="1" aria-label="Trip planning steps">
          <div className="step-item active" data-step="1">
            <button className="step-hit" aria-label="Go to step 1: Locate departure"></button>
            <div className="step-dot">1</div>
            <span className="step-label">Departure</span>
          </div>
          <div className="step-item" data-step="2">
            <button className="step-hit" aria-label="Go to step 2: Trip preferences"></button>
            <div className="step-dot">2</div>
            <span className="step-label">Trip Details</span>
          </div>
          <div className="step-item" data-step="3">
            <button className="step-hit" aria-label="Go to step 3: Explore matches"></button>
            <div className="step-dot">3</div>
            <span className="step-label">Explore Fits</span>
          </div>
          <div className="step-item" data-step="4">
            <button className="step-hit" aria-label="Go to step 4: Destination deep dive"></button>
            <div className="step-dot">4</div>
            <span className="step-label">Deep Dive</span>
          </div>
          <div className="step-item" data-step="5">
            <button className="step-hit" aria-label="Go to step 5: Day-by-day plan"></button>
            <div className="step-dot">5</div>
            <span className="step-label">AI Itinerary</span>
          </div>
        </nav>

        {/* ── SCREEN 1: LOCATE ── */}
        <section className="screen active" id="screen-1" data-screen="1" aria-labelledby="screen1-heading">
          <div className="screen-head">
            <h2 id="screen1-heading">Where are you starting from?</h2>
            <p className="eyebrow-note">We use your departure hub to calculate realistic transit routes, door-to-door budgets, and travel time.</p>
          </div>

          <div className="locate-card modern-locate-card">
            <div className="locate-grid">
              {/* Option A: GPS Auto-Detect */}
              <div className="locate-method-box">
                <div className="locate-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                    <circle cx="12" cy="12" r="7" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <h3>Automatic GPS Detection</h3>
                <p>One-tap detection using your browser location. Fast, accurate, and completely private.</p>
                <button className="btn btn-primary" id="btn-use-location">
                  <span>📍 Auto-Detect My City</span>
                </button>
              </div>

              {/* Option B: Manual City Input */}
              <div className="locate-method-box">
                <div className="locate-icon-wrap secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>Type Departure City</h3>
                <p>Or manually search any city, town, or state across India.</p>
                <div className="manual-row">
                  <input type="text" id="manual-city-input" placeholder="Enter your departure city or area" aria-label="Your city or starting location" />
                  <button className="btn btn-ghost" id="btn-set-manual">Set City</button>
                </div>
                <p className="ai-location-note">Your personalized destination suggestions will appear after you share your travel preferences.</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="locate-status" id="locate-status" role="status">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
              <span id="locate-status-text"></span>
            </div>

            {/* Next Action Bar */}
            <div className="locate-footer-bar">
              <div>
                <span className="hint-text" id="locate-continue-hint">Detect or enter a starting city to unlock preferences.</span>
              </div>
              <button className="btn btn-primary" id="btn-continue-locate" disabled>
                Continue to Trip Details →
              </button>
            </div>
          </div>
        </section>

        {/* ── SCREEN 2: PREFERENCES ── */}
        <section className="screen" id="screen-2" data-screen="2" aria-labelledby="screen2-heading">
          <div className="screen-head">
            <h2 id="screen2-heading">Personalize Your Journey</h2>
            <p className="eyebrow-note">
              Starting from <strong id="pref-origin-echo" style={{ color: 'var(--teal, #1BB89A)' }}>your location</strong>. Tune your parameters so our AI recommends destinations with the ideal vibe and budget fit.
            </p>
          </div>

          <div className="pref-cards-container">
            {/* Card 1: Destination vibe / search */}
            <div className="pref-card">
              <div className="pref-card-header">
                <span className="pref-step-icon">🎯</span>
                <div>
                  <label htmlFor="pref-destination" className="field-legend">Any specific destination, region, or theme in mind?</label>
                  <span className="field-sub">Optional — describe a travel style, interest, or region. Leave blank and let the recommendation engine find the best fits.</span>
                </div>
              </div>
              <input type="text" className="text-input modern-text-input" id="pref-destination" placeholder="Describe the kind of experience you want" />
            </div>

            {/* Card 2: Duration with Presets */}
            <div className="pref-card">
              <div className="pref-card-header">
                <span className="pref-step-icon">📅</span>
                <div>
                  <span className="field-legend">How many days do you want to travel?</span>
                  <span className="field-sub">Choose from quick presets or customize exact day count below.</span>
                </div>
              </div>

              <div className="duration-presets-row">
                {[
                  { days: 3, label: '3 Days', desc: 'Weekend Escape' },
                  { days: 5, label: '5 Days', desc: 'Short Vacation' },
                  { days: 7, label: '7 Days', desc: 'Full Week Explorer' },
                  { days: 10, label: '10 Days', desc: 'Extended Journey' },
                  { days: 14, label: '14 Days', desc: 'Grand Expedition' }
                ].map((p) => (
                  <button
                    key={p.days}
                    type="button"
                    className="duration-preset-btn"
                    onClick={() => {
                      const display = document.getElementById('duration-value');
                      if (display && window.state) {
                        window.state.prefs.duration = p.days;
                        display.textContent = p.days;
                        document.querySelectorAll('.duration-preset-btn').forEach(b => b.classList.remove('active'));
                        // Highlight active button
                        const allBtns = document.querySelectorAll('.duration-preset-btn');
                        allBtns.forEach(btn => {
                          if (btn.textContent.includes(p.label)) btn.classList.add('active');
                        });
                      }
                    }}
                  >
                    <strong>{p.label}</strong>
                    <span>{p.desc}</span>
                  </button>
                ))}
              </div>

              <div className="duration-inline modern-counter-row">
                <span className="counter-label">Custom Duration:</span>
                <div className="stepper-control">
                  <button className="num-btn" id="duration-minus" aria-label="Decrease duration">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                  </button>
                  <div className="num-display" id="duration-value">4</div>
                  <button className="num-btn" id="duration-plus" aria-label="Increase duration">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
                <span className="counter-unit">Days</span>
              </div>
            </div>

            {/* Card 3: Budget Tier */}
            <div className="pref-card">
              <div className="pref-card-header">
                <span className="pref-step-icon">💰</span>
                <div>
                  <span className="field-legend">What is your daily budget tier (per person per day)?</span>
                  <span className="field-sub">All recommendations will be filtered to match your financial comfort zone.</span>
                </div>
              </div>

              <div className="tile-row modern-tiles-row" id="budget-tiles" role="group" aria-label="Budget options">
                <button className="tile modern-tier-tile" data-budget="budget" aria-pressed="false">
                  <span className="tile-badge">₹</span>
                  <span className="tile-title">Budget Friendly</span>
                  <span className="tile-sub">Around ₹1,000–1,500 / day</span>
                  <span className="tile-desc">Hostels, local trains, scenic walks &amp; authentic street dining.</span>
                </button>
                <button className="tile modern-tier-tile" data-budget="mid" aria-pressed="false">
                  <span className="tile-badge">₹₹</span>
                  <span className="tile-title">Comfort / Balanced</span>
                  <span className="tile-sub">Around ₹2,500–4,000 / day</span>
                  <span className="tile-desc">Boutique hotels, private cabs, guided visits &amp; great dining.</span>
                </button>
                <button className="tile modern-tier-tile" data-budget="luxury" aria-pressed="false">
                  <span className="tile-badge">₹₹₹</span>
                  <span className="tile-title">Luxury &amp; Heritage</span>
                  <span className="tile-sub">₹6,000+ / day</span>
                  <span className="tile-desc">5-star heritage palaces, luxury villas, flights &amp; private tours.</span>
                </button>
              </div>
            </div>

            {/* Card 4: Travelers & Group */}
            <div className="pref-card">
              <div className="pref-card-header">
                <span className="pref-step-icon">👥</span>
                <div>
                  <span className="field-legend">Who is traveling?</span>
                  <span className="field-sub">Helps curate safety, activity pacing, and group-appropriate stays.</span>
                </div>
              </div>

              <div className="tile-row modern-tiles-row" id="group-tiles" role="group" aria-label="Group type">
                <button className="group-tile modern-group-tile" data-group="solo" data-default-travelers="1" aria-pressed="false">
                  <span className="group-emoji">🎒</span>
                  <span className="group-name">Solo Explorer</span>
                </button>
                <button className="group-tile modern-group-tile" data-group="couple" data-default-travelers="2" aria-pressed="false">
                  <span className="group-emoji">💑</span>
                  <span className="group-name">Couple Getaway</span>
                </button>
                <button className="group-tile modern-group-tile" data-group="friends" data-default-travelers="4" aria-pressed="false">
                  <span className="group-emoji">👥</span>
                  <span className="group-name">Friends Group</span>
                </button>
                <button className="group-tile modern-group-tile" data-group="family" data-default-travelers="4" aria-pressed="false">
                  <span className="group-emoji">👨‍👩‍👧‍👦</span>
                  <span className="group-name">Family Holiday</span>
                </button>
              </div>

              <div className="travelers-inline modern-counter-row" style={{ marginTop: '16px' }}>
                <span className="counter-label">Number of Travelers:</span>
                <div className="stepper-control">
                  <button className="num-btn" id="travelers-minus" aria-label="Decrease travellers">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                  </button>
                  <div className="num-display" id="travelers-value">1</div>
                  <button className="num-btn" id="travelers-plus" aria-label="Increase travellers">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                </div>
                <span className="counter-unit">People</span>
              </div>
            </div>

            {/* Card 5: Vibe & Mood Selector */}
            <div className="pref-card">
              <div className="pref-card-header">
                <span className="pref-step-icon">✨</span>
                <div>
                  <span className="field-legend">What vibe are you seeking?</span>
                  <span className="field-sub">Select one or multiple — this trains Gemini AI to craft your perfect itinerary activities.</span>
                </div>
              </div>

              <div className="mood-tiles-grid" id="mood-tiles" role="group" aria-label="Trip mood selection">
                <button className="mood-tile" data-mood="heritage" aria-pressed="false">
                  <span className="mood-emoji">🏛️</span>
                  <span className="mood-label">Heritage &amp; History</span>
                </button>
                <button className="mood-tile" data-mood="hidden-gems" aria-pressed="false">
                  <span className="mood-emoji">💎</span>
                  <span className="mood-label">Secret Hidden Gems</span>
                </button>
                <button className="mood-tile" data-mood="beach" aria-pressed="false">
                  <span className="mood-emoji">🏖️</span>
                  <span className="mood-label">Beach &amp; Coastal</span>
                </button>
                <button className="mood-tile" data-mood="adventure" aria-pressed="false">
                  <span className="mood-emoji">🏔️</span>
                  <span className="mood-label">Mountain Adventure</span>
                </button>
                <button className="mood-tile" data-mood="spiritual" aria-pressed="false">
                  <span className="mood-emoji">🙏</span>
                  <span className="mood-label">Peace &amp; Spiritual</span>
                </button>
                <button className="mood-tile" data-mood="nightlife" aria-pressed="false">
                  <span className="mood-emoji">🎉</span>
                  <span className="mood-label">Nightlife &amp; Cafes</span>
                </button>
                <button className="mood-tile" data-mood="food" aria-pressed="false">
                  <span className="mood-emoji">🍽️</span>
                  <span className="mood-label">Food &amp; Culinary</span>
                </button>
                <button className="mood-tile" data-mood="photography" aria-pressed="false">
                  <span className="mood-emoji">📸</span>
                  <span className="mood-label">Scenic Photography</span>
                </button>
              </div>
            </div>
          </div>

          <div className="actions-row screen-actions-sticky">
            <button className="btn btn-ghost" id="btn-back-to-locate">← Back to Departure</button>
            <button className="btn btn-primary" id="btn-show-destinations" disabled>Show Matched Destinations →</button>
          </div>
          <p className="validation-msg" id="pref-validation" role="alert"></p>
        </section>

        {/* ── SCREEN 3: EXPLORE ── */}
        <section className="screen" id="screen-3" data-screen="3" aria-labelledby="explore-heading">
          <div className="screen-head">
            <h2 id="explore-heading">Best Destination Fits</h2>
            <p className="eyebrow-note" id="explore-sub">Ranked by algorithm fit based on your vibe, safety score, and budget profile.</p>
          </div>

          <div className="explore-controls modern-explore-toolbar">
            <div className="filter-chips-row">
              <span className="filter-label">Filter:</span>
              <button className="tag-chip filter-chip active" data-filter="all">All</button>
              <button className="tag-chip filter-chip" data-filter="mountain">Mountain</button>
              <button className="tag-chip filter-chip" data-filter="beach">Beach</button>
              <button className="tag-chip filter-chip" data-filter="heritage">Heritage</button>
              <button className="tag-chip filter-chip" data-filter="nature">Nature</button>
              <button className="tag-chip filter-chip" data-filter="spiritual">Spiritual</button>
              <button className="tag-chip filter-chip" data-filter="island">Island</button>
              <button className="tag-chip filter-chip gem-filter" data-filter="hidden-gems">✨ Hidden Gems</button>
            </div>

            <div className="sort-row">
              <span className="filter-label">Sort By:</span>
              <select className="sort-select" id="sort-select" aria-label="Sort destinations">
                <option value="match">Best AI Match</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low → High</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="explore-grid" id="explore-grid" role="list" aria-label="Destination cards"></div>

          <div className="actions-row">
            <button className="btn btn-ghost" id="btn-back-to-prefs">← Adjust Trip Preferences</button>
          </div>
        </section>

        {/* ── SCREEN 4: DETAIL ── */}
        <section className="screen" id="screen-4" data-screen="4" aria-label="Destination details">
          <div className="screen-back-bar">
            <button className="btn-text" id="btn-back-to-explore">← Back to Matched Destinations</button>
          </div>
          <div id="detail-content"></div>
        </section>

        {/* ── SCREEN 5: ITINERARY ── */}
        <section className="screen" id="screen-5" data-screen="5" aria-label="Your itinerary">
          <div className="screen-back-bar">
            <button className="btn-text" id="btn-back-to-detail">← Back to Destination Details</button>
          </div>
          <div id="itinerary-content"></div>
          <div className="actions-row" style={{ marginTop: '24px' }}>
            <button className="btn btn-ghost" id="btn-new-trip">Plan Another Trip</button>
          </div>
        </section>
      </div>

      {/* Floating Compare Bar */}
      <div className="compare-bar" id="compare-bar" role="region" aria-label="Destination comparison bar">
        <span className="compare-bar-names" id="compare-bar-names"></span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary btn-sm" id="btn-compare-now">Compare Now</button>
          <button className="btn btn-ghost btn-sm" id="btn-compare-clear" style={{ color: 'var(--white)' }}>Clear</button>
        </div>
      </div>

      {/* Compare Drawer Modal */}
      <div className="compare-drawer" id="compare-drawer" role="dialog" aria-modal="true" aria-label="Compare Destinations">
        <div className="compare-drawer-head">
          <h2>Side-by-Side Destination Comparison</h2>
          <button className="modal-close-icon-btn" id="btn-close-compare" aria-label="Close comparison">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="compare-content" id="compare-content"></div>
      </div>
    </div>
  );
};

export default PlannerPage;
