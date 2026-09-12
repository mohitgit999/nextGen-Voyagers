import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
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

      <div className="hero-book-card" data-cta="start-planning">
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
          <Link to="/plan" target="_blank" className="hero-book-action" style={{textDecoration: "none", display: "inline-block"}}>Start Planning Now!</Link>
        </div>
      </div>
    </div>
  </div>


</section>



<div id="destinations-section" style={{background: 'var(--surface)'}}>
  <div className="section-wrapper">
    <div className="section-head reveal">
      <span className="section-label">Explore India</span>
      <h2>10 incredible destinations</h2>
      <p>From snow-capped Himalayan passes to sun-drenched beaches — each carefully rated for safety, value and experience. Click any card to explore photos, culture, and travel guides.</p>
      <div style={{ marginTop: '14px' }}>
        <Link to="/destinations" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none', borderRadius: '999px', fontSize: '0.86rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span>🗺️ View All 10 Destination Guides →</span>
        </Link>
      </div>
    </div>

    <div className="featured-scroll" role="list" aria-label="Featured destinations">
      <Link to="/destination/manali" className="featured-card reveal" data-dest="manali" role="listitem" tabIndex="0" aria-label="Manali, Himachal Pradesh" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/goa" className="featured-card reveal" data-dest="goa" role="listitem" tabIndex="0" aria-label="Goa" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/jaipur" className="featured-card reveal" data-dest="jaipur" role="listitem" tabIndex="0" aria-label="Jaipur, Rajasthan" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/rishikesh" className="featured-card reveal" data-dest="rishikesh" role="listitem" tabIndex="0" aria-label="Rishikesh, Uttarakhand" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/udaipur" className="featured-card reveal" data-dest="udaipur" role="listitem" tabIndex="0" aria-label="Udaipur, Rajasthan" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/ladakh" className="featured-card reveal" data-dest="ladakh" role="listitem" tabIndex="0" aria-label="Ladakh" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/andaman" className="featured-card reveal" data-dest="andaman" role="listitem" tabIndex="0" aria-label="Andaman Islands" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/coorg" className="featured-card reveal" data-dest="coorg" role="listitem" tabIndex="0" aria-label="Coorg, Karnataka" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/munnar" className="featured-card reveal" data-dest="munnar" role="listitem" tabIndex="0" aria-label="Munnar, Kerala" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
      <Link to="/destination/varanasi" className="featured-card reveal" data-dest="varanasi" role="listitem" tabIndex="0" aria-label="Varanasi, Uttar Pradesh" style={{ textDecoration: 'none', color: 'inherit' }}>
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
      </Link>
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
        <Link to="/plan" target="_blank" className="btn-safety" data-cta="start-planning">
          Start your safe trip
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '16px', height: '16px'}}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
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
    </>
  );
};

export default HomePage;

