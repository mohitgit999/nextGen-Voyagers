// Frontend/src/pages/DestinationDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS_DATA } from '../data/destinationsData';
import '../assets/css/destination-detail.css';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState(null);
  const [copied, setCopied] = useState(false);

  // Normalize ID and retrieve destination
  const destId = (id || '').toLowerCase();
  const dest = DESTINATIONS_DATA[destId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!dest) {
    return (
      <div className="dest-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', padding: '40px', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '12px', color: '#FFFFFF' }}>Destination Not Found</h1>
          <p style={{ color: '#94A3B8', marginBottom: '24px', lineHeight: 1.6 }}>
            We couldn't find a destination profile matching "{id}". Explore one of our 10 iconic Indian travel destinations.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/destinations" className="btn-dest-plan" style={{ textDecoration: 'none' }}>
              Browse All Destinations
            </Link>
            <Link to="/" className="btn-dest-share" style={{ textDecoration: 'none' }}>
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle direct handoff to the AI Trip Planner
  const handlePlanTrip = (e) => {
    e.preventDefault();
    try {
      // Store intent in localStorage so planner picks it up
      const locationState = {
        city: `${dest.name}, ${dest.state}`,
        source: 'destination-page',
        lat: null,
        lon: null
      };
      localStorage.setItem('location', JSON.stringify(locationState));
      localStorage.setItem('selectedDestinationId', dest.id);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    navigate('/plan');
  };

  // Handle Link Sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${dest.name} Travel & Culture Guide — NextGen Voyagers`,
        text: `Check out this complete travel and culture guide for ${dest.name}, ${dest.state}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Get 3 related destinations (excluding current)
  const allDestKeys = Object.keys(DESTINATIONS_DATA);
  const relatedDests = allDestKeys
    .filter(key => key !== dest.id)
    .slice(0, 3)
    .map(key => DESTINATIONS_DATA[key]);

  return (
    <div className="dest-page-wrapper">
      {/* ── Top Bar & Breadcrumb ── */}
      <div className="dest-top-bar">
        <div className="dest-breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/destinations">Destinations</Link>
          <span className="sep">/</span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{dest.name}</span>
        </div>
        <div className="dest-top-actions">
          <button className="btn-dest-share" onClick={handleShare} aria-label="Share this guide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {copied ? 'Link Copied!' : 'Share'}
          </button>
          <button className="btn-dest-plan" onClick={handlePlanTrip}>
            <span>✨ Plan Trip Here</span>
          </button>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <section className="dest-hero-section">
        <div className="dest-hero-card">
          <img src={dest.heroImage} alt={dest.name} className="dest-hero-img" />
          <div className="dest-hero-overlay">
            <div className="dest-badges-row">
              <span className="dest-badge badge-safety">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                  <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                {dest.safetyScore} Safety Score
              </span>
              <span className="dest-badge badge-rating">
                ⭐ {dest.rating} ({dest.reviews.toLocaleString()} traveler reviews)
              </span>
              {dest.tags.map(t => (
                <span key={t} className="dest-badge badge-tag">#{t}</span>
              ))}
            </div>
            <h1 className="dest-hero-title">{dest.name}</h1>
            <div className="dest-hero-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {dest.state}, {dest.country}
            </div>
            <p className="dest-hero-tagline">{dest.tagline}</p>
          </div>
        </div>
      </section>

      {/* ── Quick Stats Grid ── */}
      <div className="dest-quick-stats">
        <div className="stat-pill">
          <div className="stat-pill-icon">⏱️</div>
          <div className="stat-pill-content">
            <span className="stat-pill-label">Ideal Duration</span>
            <span className="stat-pill-val">{dest.idealDuration}</span>
          </div>
        </div>
        <div className="stat-pill">
          <div className="stat-pill-icon">💰</div>
          <div className="stat-pill-content">
            <span className="stat-pill-label">Mid-Range / Day</span>
            <span className="stat-pill-val">{dest.budgetPerDay.mid}</span>
          </div>
        </div>
        <div className="stat-pill">
          <div className="stat-pill-icon">☀️</div>
          <div className="stat-pill-content">
            <span className="stat-pill-label">Best Season</span>
            <span className="stat-pill-val">{dest.bestSeason}</span>
          </div>
        </div>
        <div className="stat-pill">
          <div className="stat-pill-icon">🛡️</div>
          <div className="stat-pill-content">
            <span className="stat-pill-label">Safety Rating</span>
            <span className="stat-pill-val">{dest.safetyScore} / 5.0</span>
          </div>
        </div>
      </div>

      {/* ── Sticky Sub-Navigation ── */}
      <nav className="dest-nav-tabs-sticky" aria-label="Page sub-navigation">
        <div className="dest-nav-tabs-inner">
          <a href="#overview" className="dest-tab-link">Overview</a>
          <a href="#gallery" className="dest-tab-link">Photos</a>
          <a href="#why-visit" className="dest-tab-link">Why Visit</a>
          <a href="#culture" className="dest-tab-link">Culture & Heritage</a>
          <a href="#cuisine" className="dest-tab-link">Local Cuisine</a>
          <a href="#attractions" className="dest-tab-link">Attractions</a>
          <a href="#weather" className="dest-tab-link">When to Visit</a>
          <a href="#safety-sidebar" className="dest-tab-link">Safety & Transport</a>
        </div>
      </nav>

      {/* ── Main Content Grid ── */}
      <div className="dest-content-container">
        {/* Main Column */}
        <div className="dest-main-column">
          {/* Overview */}
          <section id="overview" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">About the Destination</span>
              <h2 className="dest-section-title">Welcome to {dest.name}</h2>
            </div>
            <p className="dest-overview-text">{dest.overview}</p>
          </section>

          {/* Photo Gallery */}
          <section id="gallery" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Visual Showcase</span>
              <h2 className="dest-section-title">Photos & Scenery</h2>
            </div>
            <div className="dest-gallery-grid">
              {dest.gallery.map((photo, idx) => (
                <div 
                  key={idx} 
                  className="gallery-item"
                  onClick={() => setActivePhoto(photo)}
                  tabIndex="0"
                  role="button"
                  aria-label={`View full photo: ${photo.caption}`}
                >
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <div className="gallery-item-overlay">
                    <span className="gallery-caption">{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Visit */}
          <section id="why-visit" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Unforgettable Experiences</span>
              <h2 className="dest-section-title">Why Visit {dest.name}</h2>
            </div>
            <div className="why-visit-grid">
              {dest.whyVisit.map((item, idx) => (
                <div key={idx} className="why-card">
                  <div className="why-card-icon">{item.icon}</div>
                  <h3 className="why-card-title">{item.title}</h3>
                  <p className="why-card-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Culture & Heritage */}
          <section id="culture" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Roots & Traditions</span>
              <h2 className="dest-section-title">Culture & Living Heritage</h2>
            </div>
            <div className="culture-card">
              <p className="culture-lead-summary">{dest.culture.summary}</p>
              
              <div className="culture-sub-grid">
                <div className="culture-block">
                  <h4 className="culture-block-title">
                    <span>📜</span> Historical Roots
                  </h4>
                  <p className="culture-block-text">{dest.culture.history}</p>
                </div>
                <div className="culture-block">
                  <h4 className="culture-block-title">
                    <span>🎭</span> Living Traditions
                  </h4>
                  <p className="culture-block-text">{dest.culture.traditions}</p>
                </div>
              </div>

              {/* Festivals */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px' }}>
                  🎉 Iconic Festivals & Celebrations
                </h4>
                <div className="festivals-list">
                  {dest.culture.festivals.map((fest, idx) => (
                    <div key={idx} className="festival-item">
                      <span className="fest-badge">{fest.timing}</span>
                      <div>
                        <div className="fest-title">{fest.name}</div>
                        <p className="fest-desc">{fest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Etiquette & Language */}
              <div className="culture-bottom-row">
                <div className="etiquette-card">
                  <h4>💡 Traveler Etiquette</h4>
                  <ul className="etiquette-list">
                    {dest.culture.etiquette.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="language-card">
                  <h4>🗣️ Local Language & Useful Phrases</h4>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '10px' }}>
                    Primary: <b style={{ color: '#FFFFFF' }}>{dest.culture.language.primary}</b>
                  </div>
                  <div className="phrases-list">
                    {dest.culture.language.phrases.map((ph, idx) => (
                      <div key={idx} className="phrase-row">
                        <span className="phrase-term">"{ph.phrase}"</span>
                        <span className="phrase-meaning">{ph.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Local Cuisine */}
          <section id="cuisine" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Taste of {dest.name}</span>
              <h2 className="dest-section-title">Local Food & Dining Guide</h2>
            </div>
            <div className="cuisine-card">
              <p className="cuisine-summary">{dest.cuisine.summary}</p>
              
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 14px' }}>
                Signature Regional Dishes
              </h4>
              <div className="dishes-grid">
                {dest.cuisine.signatureDishes.map((dish, idx) => (
                  <div key={idx} className="dish-item">
                    <div className="dish-header">
                      <span className="dish-name">{dish.name}</span>
                      <span className={`dish-pill ${dish.type}`}>{dish.type}</span>
                    </div>
                    <p className="dish-desc">{dish.description}</p>
                  </div>
                ))}
              </div>

              <div className="food-spots-box">
                <h4>🍽️ Iconic Food Spots & Eateries</h4>
                <div className="spots-list">
                  {dest.cuisine.famousFoodSpots.map((spot, idx) => (
                    <div key={idx} className="spot-item">
                      <div>
                        <div className="spot-name">{spot.name}</div>
                        <div className="spot-spec">{spot.specialty}</div>
                      </div>
                      <div className="spot-loc">📍 {spot.location}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local beverages */}
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 600 }}>Signature Drinks:</span>
                {dest.cuisine.localBeverages.map((bev, idx) => (
                  <span key={idx} className="dest-badge badge-tag" style={{ fontSize: '0.76rem' }}>
                    ☕ {bev}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Top Attractions */}
          <section id="attractions" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Must-See Sights</span>
              <h2 className="dest-section-title">Top Attractions & Experiences</h2>
            </div>
            <div className="attractions-list">
              {dest.attractions.map((att, idx) => (
                <div key={idx} className="attraction-card">
                  <div className="attraction-head">
                    <h3 className="attraction-name">{att.name}</h3>
                    <span className="attraction-cat">{att.category}</span>
                  </div>
                  <p className="attraction-desc">{att.description}</p>
                  <div className="attraction-meta-row">
                    <div className="attraction-meta-item">
                      <span>⏰ Best Time:</span> <b>{att.bestTime}</b>
                    </div>
                    <div className="attraction-meta-item">
                      <span>💡 Insider Tip:</span> <b>{att.insiderTip}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* When to Visit & Weather */}
          <section id="weather" className="dest-section">
            <div className="dest-section-title-wrap">
              <span className="dest-section-tag">Climate & Planning</span>
              <h2 className="dest-section-title">When to Visit {dest.name}</h2>
            </div>
            <div className="weather-card">
              <p style={{ fontSize: '0.96rem', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 16px' }}>
                {dest.weather.overview}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 600 }}>Best Months:</span>
                {dest.weather.bestMonths.map((m, idx) => (
                  <span key={idx} className="dest-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                    ✓ {m}
                  </span>
                ))}
              </div>

              <div className="seasons-grid">
                {dest.weather.seasons.map((s, idx) => (
                  <div key={idx} className="season-box">
                    <div className="season-name">{s.name}</div>
                    <div className="season-months">{s.months}</div>
                    <div className="season-temp">🌡️ {s.tempRange}</div>
                    <div className="season-highlights">
                      <div style={{ marginBottom: '6px' }}><b>Highlights:</b> {s.highlights}</div>
                      <div><b>Advice:</b> {s.advice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <aside className="dest-sidebar-column" id="safety-sidebar">
          {/* AI Planner CTA */}
          <div className="sidebar-cta-card">
            <div className="sidebar-cta-icon">✨</div>
            <h3 className="sidebar-cta-title">Plan Your Trip to {dest.name}</h3>
            <p className="sidebar-cta-text">
              Let our Gemini AI craft your customized day-by-day itinerary with verified budget estimates and safety alerts.
            </p>
            <button className="btn-sidebar-plan" onClick={handlePlanTrip}>
              Launch AI Trip Planner →
            </button>
          </div>

          {/* Safety & Helplines */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <span>🛡️</span> Safety & Helplines
            </h3>
            <div className="safety-score-box">
              <div className="safety-num">{dest.safetyScore}</div>
              <div className="safety-note-sm">
                <b>Verified Safe Destination</b><br />
                Monitored tourist zones & 24x7 support.
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
              {dest.safety.womenTravelerNote}
            </p>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
                Emergency Contacts
              </div>
              <div className="emergency-contact-item">
                <span className="emergency-contact-label">Police Control Room</span>
                <a href={`tel:${dest.safety.emergencyContacts.police.split('/')[0].trim()}`} className="emergency-call-link">
                  📞 {dest.safety.emergencyContacts.police.split('/')[0].trim()}
                </a>
              </div>
              <div className="emergency-contact-item">
                <span className="emergency-contact-label">Main Hospital</span>
                <a href={`tel:${dest.safety.emergencyContacts.hospital.split(':')[1]?.trim() || '108'}`} className="emergency-call-link">
                  🏥 Call Hospital
                </a>
              </div>
              <div className="emergency-contact-item">
                <span className="emergency-contact-label">Tourism Helpline</span>
                <a href={`tel:${dest.safety.emergencyContacts.touristHelpline.split(':')[1]?.trim() || '1363'}`} className="emergency-call-link">
                  ℹ️ Call Helpline
                </a>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              <b>Key Travel Safety Tips:</b>
              <ul style={{ paddingLeft: '16px', margin: '6px 0 0', lineHeight: 1.45 }}>
                {dest.safety.tips.map((t, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* How to Reach & Commute */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <span>✈️</span> Getting There
            </h3>
            <div className="transport-item">
              <div className="transport-title">✈️ By Air</div>
              <p className="transport-text">
                <b>{dest.transport.air.airport}</b> ({dest.transport.air.distance}). {dest.transport.air.details}
              </p>
            </div>
            <div className="transport-item">
              <div className="transport-title">🚆 By Train</div>
              <p className="transport-text">
                <b>{dest.transport.train.station}</b>. {dest.transport.train.details}
              </p>
            </div>
            <div className="transport-item">
              <div className="transport-title">🛣️ By Road</div>
              <p className="transport-text">
                <b>{dest.transport.road.highways}</b>. {dest.transport.road.details}
              </p>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                Local Commute Options:
              </div>
              <ul style={{ fontSize: '0.78rem', color: '#94A3B8', paddingLeft: '16px', margin: 0, lineHeight: 1.45 }}>
                {dest.transport.localCommute.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Related Destinations Section ── */}
      <section style={{ maxWidth: '1240px', margin: '60px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="dest-section-tag">Keep Exploring</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              Other Iconic Destinations
            </h3>
          </div>
          <Link to="/destinations" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            View All 10 →
          </Link>
        </div>

        <div className="dest-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {relatedDests.map(item => (
            <Link key={item.id} to={`/destination/${item.id}`} className="dest-catalog-card">
              <div className="catalog-img-wrap">
                <img src={item.heroImage} alt={item.name} className="catalog-img" loading="lazy" />
                <div className="catalog-badge-rating">⭐ {item.rating}</div>
              </div>
              <div className="catalog-body">
                <h4 className="catalog-name">{item.name}</h4>
                <div className="catalog-state">{item.state}</div>
                <p className="catalog-desc">{item.tagline}</p>
                <div className="catalog-footer">
                  <div className="catalog-tags">
                    {item.tags.slice(0, 2).map(t => (
                      <span key={t} className="catalog-tag">{t}</span>
                    ))}
                  </div>
                  <span className="catalog-cta-arrow">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Lightbox Modal ── */}
      {activePhoto && (
        <div className="dest-lightbox-overlay" onClick={() => setActivePhoto(null)}>
          <div className="dest-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="dest-lightbox-close" onClick={() => setActivePhoto(null)} aria-label="Close photo preview">
              ×
            </button>
            <img src={activePhoto.url} alt={activePhoto.caption} className="dest-lightbox-img" />
            <div className="dest-lightbox-caption">
              <b>{activePhoto.tag}:</b> {activePhoto.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetailPage;
