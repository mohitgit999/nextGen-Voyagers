
import React, { useEffect } from 'react';

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
        if (document.querySelector(`script[src="\${scripts[index]}"]`)) {
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
    <li><a href="#features-section">Features</a></li>
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
    <button className="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  </div>
</nav>


<div className="mobile-nav-drawer" id="mobile-nav-drawer">
  <div className="mobile-nav-links">
    <a href="#destinations-section" className="mobile-nav-link" id="mobile-link-destinations">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
      Destinations
    </a>
    <a href="#features-section" className="mobile-nav-link" id="mobile-link-features">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      Features
    </a>
    <a href="#planner-section" className="mobile-nav-link" id="mobile-link-planner" data-cta="start-planning">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
      Plan Trip
    </a>
    <a href="#how-it-works" className="mobile-nav-link" id="mobile-link-how">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      How It Works
    </a>
    <a href="#contact-section" className="mobile-nav-link" id="mobile-link-contact">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
      Contact
    </a>
    <button className="mobile-nav-link" id="mobile-btn-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width: '18px', height: '18px'}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      Search Destinations (Ctrl+K)
    </button>
  </div>
</div>


<section className="landing-hero" aria-label="Hero" id="hero-section">

  
  <div className="hero-bg" aria-hidden="true">
    <div className="hero-bg-img" id="hero-bg-img"></div>
    <div className="hero-bg-overlay"></div>
  </div>

  
  <div className="hero-indicators" aria-hidden="true">
    <button className="hero-indicator active" data-slide="0"></button>
    <button className="hero-indicator" data-slide="1"></button>
    <button className="hero-indicator" data-slide="2"></button>
    <button className="hero-indicator" data-slide="3"></button>
  </div>



  
  <div className="hero-content">
    <div className="hero-eyebrow">
      <span className="hero-eyebrow-line"></span>
      <span className="hero-eyebrow-text" id="hero-eyebrow-text">The Andaman Islands</span>
    </div>

    <h1 className="hero-h1" id="hero-title">Andaman &amp; Nicobar</h1>

    <div className="hero-bottom-row">
      <div>
        <div className="hero-weather">
          <span className="hero-temp" id="hero-temp">28°C</span>
          <span className="hero-weather-sep"></span>
          <span className="hero-weather-label" id="hero-weather-label">Tropical &amp; Warm</span>
        </div>
        <div className="hero-nav-arrows">
          <button className="hero-arrow" id="hero-prev" aria-label="Previous destination">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="hero-arrow" id="hero-next" aria-label="Next destination">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <a href="#planner-section" className="hero-book-card" data-cta="start-planning">
        <div className="hero-book-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M7 15s1-1 5-1 5 1 5 1"/>
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div className="hero-book-text">
          <span className="hero-book-label">Plan safely, travel smart</span>
          <span className="hero-book-action">Start Planning Now!</span>
        </div>
      </a>
    </div>
  </div>


</section>


<div id="planner-section" style={{ background: 'linear-gradient(to bottom, rgba(18, 38, 42, 0.4), rgba(18, 38, 42, 0.85)), url(/img/andaman.jpg) center/cover fixed', color: '#ffffff', minHeight: '100vh', borderTop: 'none', paddingBottom: '100px' }}>

  
  <div className="planner-bg"></div>

  <div className="app">

    
    <header className="topbar">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/>
          <circle cx="12" cy="9" r="2.4"/>
        </svg>
        <div className="brand-text">
          <h1>Voyager</h1>
          <p>Plan the trip. Know the risks. Go anyway, prepared.</p>
        </div>
      </div>
    </header>




    
    <nav className="route-stepper" id="stepper" data-progress="1" aria-label="Trip planning steps">
      <div className="step-item active" data-step="1">
        <button className="step-hit" aria-label="Go to step 1: Locate"></button>
        <div className="step-dot">1</div>
        <span className="step-label">Locate you</span>
      </div>
      <div className="step-item" data-step="2">
        <button className="step-hit" aria-label="Go to step 2: Trip details"></button>
        <div className="step-dot">2</div>
        <span className="step-label">Trip details</span>
      </div>
      <div className="step-item" data-step="3">
        <button className="step-hit" aria-label="Go to step 3: Explore"></button>
        <div className="step-dot">3</div>
        <span className="step-label">Explore</span>
      </div>
      <div className="step-item" data-step="4">
        <button className="step-hit" aria-label="Go to step 4: Deep dive"></button>
        <div className="step-dot">4</div>
        <span className="step-label">Deep dive</span>
      </div>
      <div className="step-item" data-step="5">
        <button className="step-hit" aria-label="Go to step 5: Itinerary"></button>
        <div className="step-dot">5</div>
        <span className="step-label">Itinerary</span>
      </div>
    </nav>

    
    <section className="screen active" id="screen-1" data-screen="1" aria-labelledby="screen1-heading">
      <div className="screen-head">
        <h2 id="screen1-heading">Where are you starting from?</h2>
        <p className="eyebrow-note">We use your starting point to work out travel time and cost. Nothing is stored beyond this session.</p>
      </div>

      <div className="locate-card">
        <svg className="locate-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>
        </svg>
        <h3>Share your location</h3>
        <p>One tap detects your city automatically via GPS.</p>

        <div className="actions-row" style={{marginTop: '20px'}}>
          <button className="btn btn-primary" id="btn-use-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>
            Use my current location
          </button>
        </div>

        <div className="locate-status" id="locate-status" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>
          <span id="locate-status-text"></span>
        </div>

        <div className="or-divider">or enter it yourself</div>
        <div className="manual-row">
          <input type="text" id="manual-city-input" placeholder="e.g. Bareilly, Uttar Pradesh" aria-label="Your city or starting location" />
          <button className="btn btn-ghost" id="btn-set-manual">Set</button>
        </div>
      </div>

      <div className="actions-row">
        <button className="btn btn-primary" id="btn-continue-locate" disabled>Continue →</button>
        <span className="hint-text" id="locate-continue-hint">Detect or enter a starting city to continue.</span>
      </div>
    </section>

    
    <section className="screen" id="screen-2" data-screen="2" aria-labelledby="screen2-heading">
      <div className="screen-head">
        <h2 id="screen2-heading">Tell us about the trip</h2>
        <p className="eyebrow-note">Starting from <strong id="pref-origin-echo">your location</strong>. A few details and we'll shortlist the best places.</p>
      </div>

      <div className="field-group">
        <label htmlFor="pref-destination">Any place, region or vibe in mind?</label>
        <span className="field-sub">Try "beach", "mountains", "heritage" or a city name. Leave blank and we'll surprise you.</span>
        <input type="text" className="text-input" id="pref-destination" placeholder="Optional — e.g. hills, Rajasthan, spiritual" />
      </div>

      <div className="field-group">
        <span className="field-legend">What's the budget like, per person per day?</span>
        <div className="tile-row" id="budget-tiles" role="group" aria-label="Budget options">
          <button className="tile" data-budget="budget" aria-pressed="false">
            <span className="tile-title">Budget-friendly</span>
            <span className="tile-sub">Around ₹1,000–1,500/day</span>
          </button>
          <button className="tile" data-budget="mid" aria-pressed="false">
            <span className="tile-title">Mid-range</span>
            <span className="tile-sub">Around ₹2,500–4,000/day</span>
          </button>
          <button className="tile" data-budget="luxury" aria-pressed="false">
            <span className="tile-title">Luxury</span>
            <span className="tile-sub">₹6,000 and up/day</span>
          </button>
        </div>
      </div>

      <div className="field-group">
        <span className="field-legend">How many days?</span>
        <div className="duration-inline">
          <span className="hint-text">Total days:</span>
          <div className="stepper-control">
            <button className="num-btn" id="duration-minus" aria-label="Decrease duration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
            </button>
            <div className="num-display" id="duration-value">4</div>
            <button className="num-btn" id="duration-plus" aria-label="Increase duration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="field-group">
        <span className="field-legend">Travelling as?</span>
        <div className="tile-row" id="group-tiles" role="group" aria-label="Group type">
          <button className="group-tile" data-group="solo" data-default-travelers="1" aria-pressed="false">
            <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="20" cy="10" r="6"/></svg>
            <span>Solo</span>
          </button>
          <button className="group-tile" data-group="couple" data-default-travelers="2" aria-pressed="false">
            <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="15" cy="10" r="6"/><circle cx="25" cy="10" r="6"/></svg>
            <span>Couple</span>
          </button>
          <button className="group-tile" data-group="friends" data-default-travelers="4" aria-pressed="false">
            <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="10" r="5.2"/><circle cx="20" cy="10" r="5.2"/><circle cx="31" cy="10" r="5.2"/></svg>
            <span>Friends</span>
          </button>
          <button className="group-tile" data-group="family" data-default-travelers="4" aria-pressed="false">
            <svg viewBox="0 0 40 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="13" cy="8" r="6"/><circle cx="27" cy="8" r="6"/><circle cx="20" cy="16" r="3.6"/></svg>
            <span>Family</span>
          </button>
        </div>
        <div className="travelers-inline">
          <span className="hint-text">Total travellers:</span>
          <div className="stepper-control">
            <button className="num-btn" id="travelers-minus" aria-label="Decrease travellers">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>
            </button>
            <div className="num-display" id="travelers-value">1</div>
            <button className="num-btn" id="travelers-plus" aria-label="Increase travellers">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="actions-row">
        <button className="btn btn-ghost" id="btn-back-to-locate">← Back</button>
        <button className="btn btn-primary" id="btn-show-destinations" disabled>Show me destinations →</button>
      </div>
      <p className="validation-msg" id="pref-validation" role="alert"></p>
    </section>

    
    <section className="screen" id="screen-3" data-screen="3" aria-labelledby="explore-heading">
      <div className="screen-head">
        <h2 id="explore-heading">Best matches for your trip</h2>
        <p className="eyebrow-note" id="explore-sub">Ranked by fit — tap a card to see ratings, cost and safety details.</p>
      </div>

      
      <div className="explore-controls">
        <div className="filter-chips-row">
          <span className="filter-label">Filter:</span>
          <button className="tag-chip filter-chip active" data-filter="all">All</button>
          <button className="tag-chip filter-chip" data-filter="mountain">Mountain</button>
          <button className="tag-chip filter-chip" data-filter="beach">Beach</button>
          <button className="tag-chip filter-chip" data-filter="heritage">Heritage</button>
          <button className="tag-chip filter-chip" data-filter="nature">Nature</button>
          <button className="tag-chip filter-chip" data-filter="spiritual">Spiritual</button>
          <button className="tag-chip filter-chip" data-filter="island">Island</button>
        </div>
        <div className="sort-row">
          <span className="filter-label">Sort:</span>
          <select className="sort-select" id="sort-select" aria-label="Sort destinations">
            <option defaultValue="match">Best match</option>
            <option defaultValue="rating">Highest rated</option>
            <option defaultValue="price-asc">Price: low → high</option>
          </select>
        </div>
      </div>

      <div className="explore-grid" id="explore-grid" role="list" aria-label="Destination cards"></div>

      <div className="actions-row">
        <button className="btn btn-ghost" id="btn-back-to-prefs">← Adjust trip details</button>
      </div>
    </section>

    
    <section className="screen" id="screen-4" data-screen="4" aria-label="Destination details">
      <button className="btn-text" id="btn-back-to-explore">← Back to matches</button>
      <div id="detail-content"></div>
    </section>

    
    <section className="screen" id="screen-5" data-screen="5" aria-label="Your itinerary">
      <button className="btn-text" id="btn-back-to-detail">← Back to destination</button>
      <div id="itinerary-content"></div>
      <div className="actions-row">
        <button className="btn btn-ghost" id="btn-new-trip">Plan a new trip</button>
      </div>
    </section>


  </div>

  
  <div className="compare-bar" id="compare-bar" role="region" aria-label="Destination comparison bar">
    <span className="compare-bar-names" id="compare-bar-names"></span>
    <button className="btn btn-primary btn-sm" id="btn-compare-now">Compare Now</button>
    <button className="btn btn-ghost btn-sm" id="btn-compare-clear" style={{color: 'var(--white)'}}>Clear</button>
  </div>

  
  <div className="compare-drawer" id="compare-drawer" role="dialog" aria-modal="true" aria-label="Compare Destinations">
    <div className="compare-drawer-head">
      <h2>Side-by-Side Destination Comparison</h2>
      <button className="modal-close-icon-btn" id="btn-close-compare" aria-label="Close comparison">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px'}}><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div className="compare-content" id="compare-content"></div>
  </div>

</div>



<div className="stats-bar" aria-label="Key stats">
  <div className="stats-inner">
    <div className="stat-item">
      <div className="stat-num" data-count-to="10">10+</div>
      <div className="stat-label">Destinations</div>
    </div>
    <div className="stat-item">
      <div className="stat-num" data-count-to="7">7</div>
      <div className="stat-label">Core Features</div>
    </div>
    <div className="stat-item">
      <div className="stat-num">100%</div>
      <div className="stat-label">Free to Use</div>
    </div>
    <div className="stat-item">
      <div className="stat-num">24/7</div>
      <div className="stat-label">SOS Emergency</div>
    </div>
    <div className="stat-item">
      <div className="stat-num">AI</div>
      <div className="stat-label">Powered Planning</div>
    </div>
  </div>
</div>


<div id="destinations-section" style={{background: 'var(--surface)'}}>
  <div className="section-wrapper">
    <div className="section-head reveal">
      <span className="section-label">Explore India</span>
      <h2>10 incredible destinations</h2>
      <p>From snow-capped Himalayan passes to sun-drenched beaches — each carefully rated for safety, value and experience.</p>
    </div>

    <div className="featured-scroll" role="list" aria-label="Featured destinations">
      <div className="featured-card reveal" data-dest="manali" role="listitem" tabIndex="0" aria-label="Manali, Himachal Pradesh">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/manali.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.8rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.5</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Manali</div>
          <div className="featured-card-state">Himachal Pradesh</div>
          <div className="featured-card-tags">
            <span className="tag-chip">mountain</span><span className="tag-chip">adventure</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="goa" role="listitem" tabIndex="0" aria-label="Goa">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/goa.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.8rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.3</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Goa</div>
          <div className="featured-card-state">Goa</div>
          <div className="featured-card-tags">
            <span className="tag-chip">beach</span><span className="tag-chip">coastal</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="jaipur" role="listitem" tabIndex="0" aria-label="Jaipur, Rajasthan">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/jaipur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.8rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.6</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Jaipur</div>
          <div className="featured-card-state">Rajasthan</div>
          <div className="featured-card-tags">
            <span className="tag-chip">heritage</span><span className="tag-chip">culture</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="rishikesh" role="listitem" tabIndex="0" aria-label="Rishikesh, Uttarakhand">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/rishikesh.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.8rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.5</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Rishikesh</div>
          <div className="featured-card-state">Uttarakhand</div>
          <div className="featured-card-tags">
            <span className="tag-chip">spiritual</span><span className="tag-chip">adventure</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="udaipur" role="listitem" tabIndex="0" aria-label="Udaipur, Rajasthan">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/udaipur.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.7</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Udaipur</div>
          <div className="featured-card-state">Rajasthan · ⭐ 4.7</div>
          <div className="featured-card-tags">
            <span className="tag-chip">romantic</span><span className="tag-chip">lake</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="ladakh" role="listitem" tabIndex="0" aria-label="Ladakh">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/ladakh.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.8</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Ladakh</div>
          <div className="featured-card-state">Ladakh (UT) · ⭐ 4.8</div>
          <div className="featured-card-tags">
            <span className="tag-chip">mountain</span><span className="tag-chip">offbeat</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="andaman" role="listitem" tabIndex="0" aria-label="Andaman Islands">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/andaman.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.7</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Andaman</div>
          <div className="featured-card-state">A&N Islands · ⭐ 4.7</div>
          <div className="featured-card-tags">
            <span className="tag-chip">island</span><span className="tag-chip">diving</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="coorg" role="listitem" tabIndex="0" aria-label="Coorg, Karnataka">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/coorg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.4</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Coorg</div>
          <div className="featured-card-state">Karnataka · ⭐ 4.4</div>
          <div className="featured-card-tags">
            <span className="tag-chip">hill</span><span className="tag-chip">coffee</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="munnar" role="listitem" tabIndex="0" aria-label="Munnar, Kerala">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/munnar.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.5</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Munnar</div>
          <div className="featured-card-state">Kerala · ⭐ 4.5</div>
          <div className="featured-card-tags">
            <span className="tag-chip">tea</span><span className="tag-chip">nature</span>
          </div>
        </div>
      </div>
      <div className="featured-card reveal" data-dest="varanasi" role="listitem" tabIndex="0" aria-label="Varanasi, Uttar Pradesh">
        <div className="featured-card-img-wrap">
          <div style={{width: '100%', height: '160px', backgroundImage: 'url(img/varanasi.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: '0.9'}}></div>
          <div className="featured-card-badge">⭐ 4.4</div>
        </div>
        <div className="featured-card-body">
          <div className="featured-card-name">Varanasi</div>
          <div className="featured-card-state">Uttar Pradesh · ⭐ 4.4</div>
          <div className="featured-card-tags">
            <span className="tag-chip">spiritual</span><span className="tag-chip">heritage</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


{/* ===================== FEATURES SHOWCASE ===================== */}
<div id="features-section" className="features-section">
  <div className="section-wrapper">
    <div className="section-head reveal" style={{textAlign: 'center'}}>
      <span className="section-label">Everything You Need</span>
      <h2>Engineered for Smarter, Safer Travel</h2>
      <p>Not just where to go — how to get there safely, affordably, and meaningfully.</p>
    </div>

    <div className="features-grid">
      {/* 1. AI Trip Planner */}
      <div className="feature-card highlight reveal">
        <span className="feature-card-badge">AI Core</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
          </svg>
        </div>
        <h3>AI Trip Planner</h3>
        <p>Generates tailored day-by-day itineraries matching your exact budget, group type (solo, friends, family, couple), and pace.</p>
      </div>

      {/* 2. Safety-First Design */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Safety First</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h3>Safety-First Architecture</h3>
        <p>Integrated destination safety scores, verified operators, solo &amp; women travel advisories, and instant emergency response.</p>
      </div>

      {/* 3. Offline Maps */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Offline Ready</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
        </div>
        <h3>Offline Maps &amp; Key Info</h3>
        <p>Cache critical itineraries, offline route guides, and local emergency contacts so you stay oriented with zero connectivity.</p>
      </div>

      {/* 4. Weather Integration */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Real-Time</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
        </div>
        <h3>Weather Intelligence</h3>
        <p>Live forecasts, seasonal climate graphs, and packing recommendations dynamically adjusted to destination conditions.</p>
      </div>

      {/* 5. Trip Sharing */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Social</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <h3>Collaborative Trip Sharing</h3>
        <p>Share planned itineraries with co-travelers via one-click links, sync expense budgets, and share live location status.</p>
      </div>

      {/* 6. Smart Itineraries */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Optimized</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <h3>Smart Itineraries</h3>
        <p>Algorithmic route grouping reduces transit fatigue and optimizes budget allocation across stays, travel, and activities.</p>
      </div>

      {/* 7. All-in-One Discovery */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">All-in-One</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </div>
        <h3>All-in-One Discovery</h3>
        <p>Compare places, stays, authentic food spots, and tourist reviews across 10 top destinations without switching 5 different apps.</p>
      </div>

      {/* 8. Local Economic Impact */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Sustainable</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h3>Local Economic Impact</h3>
        <p>Prioritizes verified regional guides, community-run homestays, and artisanal vendors, keeping tourist revenue in local hands.</p>
      </div>

      {/* 9. Privacy & Data Security */}
      <div className="feature-card reveal">
        <span className="feature-card-badge">Privacy First</span>
        <div className="feature-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3>Privacy &amp; DPDP Compliant</h3>
        <p>Zero third-party tracking, localized temporary storage, end-to-end encrypted sharing, and full user data control by design.</p>
      </div>
    </div>
  </div>
</div>


<div id="how-it-works" className="how-section">
  <div className="section-wrapper">
    <div className="section-head reveal" style={{textAlign: 'center'}}>
      <span className="section-label">Simple process</span>
      <h2>Plan your trip in 5 steps</h2>
      <p>AI-assisted personalization with zero tracking or stored personal data.</p>
    </div>
    <div className="how-grid">
      <div className="how-card reveal">
        <div className="how-num">01</div>
        <div className="how-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg></div>
        <h3>Share your location</h3>
        <p>Detect your city via GPS or enter it manually to calibrate precise travel distances and transit costs.</p>
      </div>
      <div className="how-card reveal">
        <div className="how-num">02</div>
        <div className="how-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg></div>
        <h3>Set your preferences</h3>
        <p>Pick a budget tier, trip duration, travel party type (solo, friends, family, couple), and desired pace.</p>
      </div>
      <div className="how-card reveal">
        <div className="how-num">03</div>
        <div className="how-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
        <h3>Explore destinations</h3>
        <p>Browse 10 ranked Indian destinations filtered by tag, sorted by AI match, safety rating, or cost.</p>
      </div>
      <div className="how-card reveal">
        <div className="how-num">04</div>
        <div className="how-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <h3>Deep-dive safely</h3>
        <p>Access safety scores, weather seasons, verified hospital &amp; police contacts, and local scam advisories.</p>
      </div>
      <div className="how-card reveal">
        <div className="how-num">05</div>
        <div className="how-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg></div>
        <h3>Build &amp; share itinerary</h3>
        <p>Get a personalized day-by-day itinerary with an interactive packing checklist, budget calculator, and offline save.</p>
      </div>
    </div>
  </div>
</div>


<div style={{background: 'var(--surface)'}}>
  <div className="section-wrapper">
    <div className="safety-promise reveal">
      <div style={{maxWidth: '720px', marginBottom: '36px'}}>
        <span className="section-label" style={{color: 'rgba(255,255,255,0.7)'}}>Our commitment</span>
        <h2>Safety is not an afterthought — it's the foundation</h2>
        <p>Every destination is evaluated not just for beauty and experience, but for how well it protects you when you're away from home.</p>
      </div>

      <div className="safety-6-grid">
        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <h4>SOS One-Tap with GPS &amp; 112</h4>
            <p>Instant emergency trigger broadcasting live coordinates directly to national helplines and trusted contacts.</p>
          </div>
        </div>

        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
          </div>
          <div>
            <h4>Offline Emergency Access</h4>
            <p>Local police, hospital coordinates, and emergency protocols remain accessible with zero cellular reception.</p>
          </div>
        </div>

        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
          <div>
            <h4>Live Location Sharing</h4>
            <p>Generate secure, time-limited tracking links for family and travel partners with a single tap.</p>
          </div>
        </div>

        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
          </div>
          <div>
            <h4>Safety Ratings Per Location</h4>
            <p>Independent safety ratings analyzing lighting, crowd density, emergency response, and women-traveler feedback.</p>
          </div>
        </div>

        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h4>Verified Guides &amp; Operators</h4>
            <p>Every featured tour guide, trek leader, and homestay is cross-checked against official state tourism registries.</p>
          </div>
        </div>

        <div className="safety-item">
          <div className="safety-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div>
            <h4>Check-in Reminders &amp; Scam Alerts</h4>
            <p>Automated safety prompts upon arrival and proactive cautions against prevalent regional taxi and ticket scams.</p>
          </div>
        </div>
      </div>

      <div style={{marginTop: '36px'}}>
        <a href="#planner-section" className="btn-safety" data-cta="start-planning">
          Start your safe trip
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px'}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</div>


<div style={{background: 'var(--surface-soft)', borderTop: '1px solid var(--line)'}}>
  <div className="section-wrapper">
    <div className="section-head reveal" style={{textAlign: 'center'}}>
      <span className="section-label">Real travellers</span>
      <h2>What people are saying</h2>
    </div>
    <div className="testimonials-grid">
      <div className="testimonial-card reveal">
        <div className="testimonial-stars">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
        </div>
        <p className="testimonial-quote">"The safety ratings completely changed how I planned my solo Ladakh trip. Knowing which operators were verified gave me real peace of mind."</p>
        <div className="testimonial-author">
          <div className="testimonial-avatar">P</div>
          <div>
            <div className="testimonial-name">Priya Sharma</div>
            <div className="testimonial-trip">Solo · Ladakh, 7 days</div>
          </div>
        </div>
      </div>
      <div className="testimonial-card reveal">
        <div className="testimonial-stars">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
        </div>
        <p className="testimonial-quote">"Used the cost breakdown to settle arguments in our friend group about who spends what. The budget tracker during the trip was a lifesaver."</p>
        <div className="testimonial-author">
          <div className="testimonial-avatar">R</div>
          <div>
            <div className="testimonial-name">Rahul &amp; Friends</div>
            <div className="testimonial-trip">Group of 5 · Goa, 5 days</div>
          </div>
        </div>
      </div>
      <div className="testimonial-card reveal">
        <div className="testimonial-stars">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
        </div>
        <p className="testimonial-quote">"My husband and I compared Udaipur vs Coorg side-by-side. The weather grid sealed it — October in Coorg it was. Perfect call."</p>
        <div className="testimonial-author">
          <div className="testimonial-avatar">A</div>
          <div>
            <div className="testimonial-name">Anjali &amp; Vikram</div>
            <div className="testimonial-trip">Couple · Coorg, 4 days</div>
          </div>
        </div>
      </div>
      <div className="testimonial-card reveal">
        <div className="testimonial-stars">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9Z"/></svg>
        </div>
        <p className="testimonial-quote">"As a solo woman traveler, the real-time SOS button, safety scores, and verified local operator badges gave me the confidence to explore remote trails worry-free."</p>
        <div className="testimonial-author">
          <div className="testimonial-avatar">S</div>
          <div>
            <div className="testimonial-name">Sneha Kulkarni</div>
            <div className="testimonial-trip">Solo Traveler · Manali &amp; Rishikesh, 6 days</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<footer className="dark-footer">
  <div className="dark-footer-inner">
    <div className="footer-top-brand">
      <h2>NEXTGEN VOYAGERS</h2>
      <p>Not just where to go — how to get there safely, affordably, and meaningfully.</p>
    </div>
    
    <div className="footer-columns">
      <div className="footer-col">
        <h4>CONTACT US</h4>
        <a href="mailto:support@nextgenvoyagers.com">support@nextgenvoyagers.com</a>
        <a href="tel:+911800118692">+91 1800118692</a>
      </div>
      
      <div className="footer-col">
        <h4>QUICK MENU</h4>
        <a href="#hero">Home</a>
        <a href="#features-section">Features</a>
        <a href="#destinations-section">Destinations</a>
        <a href="#planner-section">Plan Trip</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#contact-section">Contact</a>
      </div>
      
      <div className="footer-col">
        <h4>LEGAL</h4>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms</a>
        <a href="#accessibility">Accessibility</a>
      </div>
      
      <div className="footer-col newsletter-col">
        <h4>STAY UPDATED</h4>
        <p>Get the latest updates on safe travel and new features.</p>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
          <input type="email" placeholder="Email Address" required />
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
    
    <div className="footer-copyright">
      <p>© 2026 NextGen Voyagers. All rights reserved.</p>
    </div>
  </div>
</footer>
<button className="sos-fab" id="sos-fab" aria-haspopup="dialog" aria-label="Emergency SOS">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
  SOS
</button>


<div className="modal-overlay hidden" id="sos-modal" role="dialog" aria-modal="true" aria-labelledby="sos-title">
  <div className="modal-box">
    <div className="modal-box-head">
      <h3 id="sos-title">🚨 Emergency help</h3>
      <button className="modal-close-btn" id="sos-close" aria-label="Close emergency modal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>

    <p className="hint-text">India-wide helplines — reachable from any network, anywhere.</p>

    <ul className="emergency-list">
      <li>
        <span>National emergency</span>
        <a href="tel:112" className="call-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
          112
        </a>
      </li>
      <li><span>Police</span><a href="tel:112" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>112</a></li>
      <li><span>Fire</span><a href="tel:101" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 1 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>101</a></li>
      <li><span>Ambulance</span><a href="tel:108" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>108</a></li>
      <li><span>Women's helpline</span><a href="tel:181" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>181</a></li>
      <li><span>Child helpline</span><a href="tel:1098" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>1098</a></li>
      <li><span>Cyber Crime</span><a href="tel:1930" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 1 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>1930</a></li>
      <li><span>Railway helpline</span><a href="tel:139" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>139</a></li>
      <li><span>Tourist helpline</span><a href="tel:1363" className="call-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>1363</a></li>
    </ul>

    
    <button className="share-gps-btn" id="sos-share-gps">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px'}}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
      Share my GPS coordinates
    </button>

    
    <div className="first-aid-section">
      <button className="first-aid-toggle" id="first-aid-toggle" aria-expanded="false">
        <span>🩹 While you wait — quick first aid</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div className="first-aid-content" id="first-aid-content">
        <div className="first-aid-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Stay calm and keep the injured person still.</div>
        <div className="first-aid-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Do not move anyone with a potential spinal injury.</div>
        <div className="first-aid-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Apply pressure to bleeding wounds with a clean cloth.</div>
        <div className="first-aid-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Keep the person warm and hydrated if conscious.</div>
        <div className="first-aid-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>For altitude sickness: descend immediately, rest, and hydrate.</div>
      </div>
    </div>

    <p className="modal-note" id="sos-context-note">Press and hold the SOS button for 3 seconds on your phone to trigger emergency calling on most devices.</p>
  </div>
</div>




<div className="app-modal-overlay" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
  <div className="app-modal-card">
    <div className="modal-header-bar">
      <div className="modal-header-title" id="auth-modal-title">
        <span>✈️</span> NextGen Voyagers
      </div>
      <button className="modal-close-icon-btn" id="auth-modal-close" aria-label="Close modal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px'}}><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>

    
    <div className="auth-tabs">
      <button className="auth-tab-btn active" id="tab-btn-login">Sign In</button>
      <button className="auth-tab-btn" id="tab-btn-register">Create Account</button>
    </div>

    <div className="auth-body-content">
      <div className="auth-error-msg" id="auth-error-msg"></div>

      
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
        <button type="submit" className="auth-submit-btn">
          Sign In to Voyagers
        </button>
        <div className="auth-divider">or explore instantly</div>
        <button type="button" className="btn-demo-quick">
          ⚡ One-Click Demo Login
        </button>
      </form>

      
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
        <button type="submit" className="auth-submit-btn">
          Create Free Account
        </button>
        <div className="auth-divider">or explore instantly</div>
        <button type="button" className="btn-demo-quick">
          ⚡ One-Click Demo Login
        </button>
      </form>
    </div>
  </div>
</div>


<div className="app-modal-overlay" id="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dash-modal-title">
  <div className="app-modal-card large-card">
    <div className="modal-header-bar">
      <div className="modal-header-title" id="dash-modal-title">
        <span>📊</span> My Travel Dashboard
      </div>
      <button className="modal-close-icon-btn" id="dashboard-modal-close" aria-label="Close dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px'}}><path d="M18 6 6 18M6 6l12 12"/></svg>
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
        <button className="btn btn-primary btn-sm" id="dash-btn-new-trip" style={{padding: '10px 18px'}}>
          + Plan New Trip
        </button>
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
      <div className="saved-trips-grid" id="saved-trips-container">
        
      </div>
    </div>
  </div>
</div>


<div className="app-modal-overlay" id="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
  <div className="app-modal-card search-modal-card">
    <div className="search-input-header">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px', color: 'var(--ink-faint)', flexShrink: '0'}}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input type="text" className="search-field" id="search-dest-input" placeholder="Search Goa, Manali, Ladakh, beaches, mountains, winter..." autoComplete="off" />
      <button className="modal-close-icon-btn" id="search-modal-close" aria-label="Close search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '18px', height: '18px'}}><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div className="search-results-list" id="search-results-list">
      
    </div>
  </div>
</div>


<div className="toast-container" id="toast-container"></div>



    </>
  );
}

export default App;
