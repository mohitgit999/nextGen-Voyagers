const fs = require('fs');

// 1. Remove stats-bar from PlannerPage.jsx
let plannerJsx = fs.readFileSync('src/pages/PlannerPage.jsx', 'utf-8');
const statsStart = plannerJsx.indexOf('<div className="stats-bar"');
const statsEnd = plannerJsx.indexOf('</>', statsStart); // The </> at the end of PlannerPage
const statsHtml = plannerJsx.substring(statsStart, statsEnd);

plannerJsx = plannerJsx.substring(0, statsStart) + plannerJsx.substring(statsEnd);
fs.writeFileSync('src/pages/PlannerPage.jsx', plannerJsx);

// 2. Extract footer and sos-fab from App.jsx
let appJsx = fs.readFileSync('src/App.jsx', 'utf-8');
const footerStart = appJsx.indexOf('<footer className="dark-footer"');
const sosModalStart = appJsx.indexOf('<div className="modal-overlay hidden" id="sos-modal"');

const footerAndSosFabHtml = appJsx.substring(footerStart, sosModalStart);

appJsx = appJsx.substring(0, footerStart) + appJsx.substring(sosModalStart);
fs.writeFileSync('src/App.jsx', appJsx);

// 3. Insert them into HomePage.jsx
let homeJsx = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const homeEnd = homeJsx.lastIndexOf('</>');

homeJsx = homeJsx.substring(0, homeEnd) + statsHtml + footerAndSosFabHtml + homeJsx.substring(homeEnd);
fs.writeFileSync('src/pages/HomePage.jsx', homeJsx);

console.log("Layout fixed");
