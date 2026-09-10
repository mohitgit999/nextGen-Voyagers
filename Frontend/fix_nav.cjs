const fs = require('fs');

// 1. Fix App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf-8');

const replacementNav = `      {location.pathname !== '/plan' && (
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
    <li><Link to="/plan" target="_blank">Plan Trip</Link></li>
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
    <Link to="/plan" target="_blank" className="nav-btn-signup"  id="nav-btn-signup" data-cta="start-planning" style={{textDecoration:"none", display:"inline-flex", alignItems:"center", justifyContent:"center"}}>Start Planning</Link>
    <button className="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
      <span className="hamburger-line"></span>
    </button>
  </div>
</nav>
      )}`;

// We need to find where to put this back in App.jsx.
// The broken nav is between `<>` and `<div className="mobile-nav-drawer"`.
const appParts = appJsx.split('<div className="mobile-nav-drawer"');
const firstPart = appParts[0];
const returnIdx = firstPart.lastIndexOf('<>');
appJsx = firstPart.substring(0, returnIdx + 2) + "\n" + replacementNav + "\n\n<div className=\"mobile-nav-drawer\"" + appParts[1];
fs.writeFileSync('src/App.jsx', appJsx);

// 2. Fix PlannerPage.jsx
let plannerJsx = fs.readFileSync('src/pages/PlannerPage.jsx', 'utf-8');
const topbarStart = plannerJsx.indexOf('<header className="topbar">');
const topbarEnd = plannerJsx.indexOf('</header>') + 9;
plannerJsx = plannerJsx.substring(0, topbarStart) + plannerJsx.substring(topbarEnd);
fs.writeFileSync('src/pages/PlannerPage.jsx', plannerJsx);

console.log('Fixed');
