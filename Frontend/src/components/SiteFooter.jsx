import React from 'react';
import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="dark-footer" id="site-footer">
      <div className="dark-footer-inner">
        <div className="footer-top-brand">
          <Link to="/" className="footer-brand-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>NEXTGEN VOYAGERS</h2>
          </Link>
          <p>Not just where to go — how to get there safely, affordably, and meaningfully.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>CONTACT US</h4>
            <a href="mailto:support@nextgenvoyagers.com">support@nextgenvoyagers.com</a>
            <a href="tel:+911800118692">+91 1800 118 692</a>
            <span style={{ fontSize: '0.82rem', color: 'var(--ink-faint, #9CA3AF)', marginTop: '6px' }}>
              24/7 Emergency Tourist Line
            </span>
          </div>

          <div className="footer-col">
            <h4>QUICK MENU</h4>
            <Link to="/">Home</Link>
            <Link to="/plan">AI Trip Planner</Link>
            <a href="/#destinations-section">Destinations</a>
            <a href="/#features-section">Features</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#contact-section">Contact Us</a>
          </div>

          <div className="footer-col">
            <h4>SAFETY &amp; LEGAL</h4>
            <a href="#sos" onClick={(e) => { e.preventDefault(); if (typeof window.openSosModal === 'function') window.openSosModal(); }}>Emergency SOS</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms &amp; Conditions</a>
            <a href="#accessibility">Accessibility</a>
          </div>

          <div className="footer-col newsletter-col">
            <h4>STAY UPDATED</h4>
            <p>Get the latest updates on safe travel routes, hidden gems, and AI tools.</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (typeof window.showToast === 'function') {
                  window.showToast('Thank you for subscribing to NextGen Voyagers!', 'success');
                } else {
                  alert('Thank you for subscribing!');
                }
              }}
            >
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} NextGen Voyagers. All rights reserved. Empowering safe, intelligent travel across India.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
