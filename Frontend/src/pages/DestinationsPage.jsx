// Frontend/src/pages/DestinationsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DESTINATIONS_DATA } from '../data/destinationsData';
import '../assets/css/destination-detail.css';

const CATEGORIES = [
  { id: 'all', label: 'All Destinations' },
  { id: 'mountain', label: '🏔️ Mountains' },
  { id: 'beach', label: '🏖️ Coastal & Beaches' },
  { id: 'heritage', label: '🏯 Royal Heritage' },
  { id: 'spiritual', label: '🧘 Spiritual & Yoga' },
  { id: 'nature', label: '🌿 Nature & Hills' }
];

const DestinationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allDestinations = Object.values(DESTINATIONS_DATA);

  const filteredDestinations = allDestinations.filter(d => {
    const matchesCategory = selectedCategory === 'all' || d.tags.includes(selectedCategory);
    const matchesSearch = !searchQuery.trim() || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="dest-page-wrapper">
      {/* ── Directory Hero ── */}
      <section className="dest-directory-hero">
        <span className="dest-section-tag" style={{ color: '#10B981' }}>Discover Incredible India</span>
        <h1 className="dest-directory-title">Explore 10 Iconic Destinations</h1>
        <p className="dest-directory-subtitle">
          From snow-capped Himalayan ridges and cobalt atolls to royal desert palaces and ancient river ghats. Detailed guides with living culture, food, safety ratings, and AI trip planning.
        </p>

        {/* Live Search Input */}
        <div style={{ maxWidth: '480px', margin: '28px auto 0', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search by city, state (e.g. Manali, Goa, Rajasthan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 20px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#FFFFFF',
              fontSize: '0.94rem',
              outline: 'none',
              backdropFilter: 'blur(16px)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </section>

      {/* ── Category Filter Pills ── */}
      <div className="dest-filters-row">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Destinations Grid ── */}
      <div className="dest-cards-grid">
        {filteredDestinations.map(item => (
          <Link key={item.id} to={`/destination/${item.id}`} className="dest-catalog-card">
            <div className="catalog-img-wrap">
              <img src={item.heroImage} alt={item.name} className="catalog-img" loading="lazy" />
              <div className="catalog-badge-rating">⭐ {item.rating}</div>
            </div>
            <div className="catalog-body">
              <h3 className="catalog-name">{item.name}</h3>
              <div className="catalog-state">📍 {item.state}, India</div>
              <p className="catalog-desc">{item.tagline}</p>

              <div className="catalog-footer">
                <div className="catalog-tags">
                  {item.tags.map(t => (
                    <span key={t} className="catalog-tag">{t}</span>
                  ))}
                </div>
                <span className="catalog-cta-arrow">
                  Explore Guide →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '8px' }}>No destinations matched "{searchQuery}"</p>
          <button 
            className="filter-btn active" 
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            style={{ marginTop: '12px' }}
          >
            Clear Search Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
