const fs = require('fs');
let plannerJsx = fs.readFileSync('src/pages/PlannerPage.jsx', 'utf-8');

const oldScreen1 = `<section className="screen active" id="screen-1" data-screen="1" aria-labelledby="screen1-heading">
      <div className="screen-head center-align">
        <h2 id="screen1-heading">Where are you starting from?</h2>
        <p className="eyebrow-note">We use your starting point to work out travel time and cost. Nothing is stored beyond this session.</p>
      </div>

      <div className="locate-card symmetrical-card">
        <h3>Share your location</h3>
        <p>One tap detects your city automatically via GPS.</p>

        <div className="actions-row center-row" style={{marginTop: '15px'}}>
          <button className="btn btn-primary" id="btn-use-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>
            Use my current location
          </button>
        </div>

        <div className="locate-status" id="locate-status" role="status" style={{ justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>
          <span id="locate-status-text"></span>
        </div>

        <div className="or-divider" style={{ textAlign: 'center', margin: '20px 0' }}>— or enter it yourself —</div>
        
        <div className="manual-row center-row" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <input type="text" id="manual-city-input" placeholder="e.g. Bareilly, Uttar Pradesh" aria-label="Your city or starting location" />
          <button className="btn btn-ghost" id="btn-set-manual">Set</button>
        </div>

        <div className="actions-row center-row" style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <button className="btn btn-primary" id="btn-continue-locate" disabled>Continue →</button>
          <span className="hint-text" id="locate-continue-hint">Detect or enter a starting city to continue.</span>
        </div>
      </div>
    </section>`;

const newScreen1 = `<section className="screen active" id="screen-1" data-screen="1" aria-labelledby="screen1-heading">
      <div className="screen-head">
        <h2 id="screen1-heading">Where are you starting from?</h2>
        <p className="eyebrow-note">We use your starting point to work out travel time and cost. Nothing is stored beyond this session.</p>
      </div>

      <div className="locate-card">
        <h3>Share your location</h3>
        <p>One tap detects your city automatically via GPS.</p>

        <div className="actions-row" style={{marginTop: '15px'}}>
          <button className="btn btn-primary" id="btn-use-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width: '18px', height: '18px'}}><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>
            Use my current location
          </button>
        </div>

        <div className="locate-status" id="locate-status" role="status">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10"/></svg>
          <span id="locate-status-text"></span>
        </div>

        <div className="or-divider">— or enter it yourself —</div>
        
        <div className="manual-row">
          <input type="text" id="manual-city-input" placeholder="e.g. Bareilly, Uttar Pradesh" aria-label="Your city or starting location" />
          <button className="btn btn-ghost" id="btn-set-manual">Set</button>
        </div>

        <div className="actions-row" style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <button className="btn btn-primary" id="btn-continue-locate" disabled>Continue →</button>
          <span className="hint-text" id="locate-continue-hint">Detect or enter a starting city to continue.</span>
        </div>
      </div>
    </section>`;

let startIdx = plannerJsx.indexOf('<section className="screen active" id="screen-1"');
let endIdx = plannerJsx.indexOf('</section>', startIdx) + 10;
if (startIdx !== -1 && endIdx !== -1) {
  plannerJsx = plannerJsx.substring(0, startIdx) + newScreen1 + plannerJsx.substring(endIdx);
  fs.writeFileSync('src/pages/PlannerPage.jsx', plannerJsx);
  console.log("Replaced successfully");
} else {
  console.log("Could not find screen 1");
}
