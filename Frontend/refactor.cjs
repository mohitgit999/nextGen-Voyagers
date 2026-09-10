const fs = require('fs');

const appJsx = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Identify chunks
const navStart = appJsx.indexOf('<nav className="global-nav"');
const heroStart = appJsx.indexOf('<section className="landing-hero"');
const plannerStart = appJsx.indexOf('<div id="planner-section"');
const destStart = appJsx.indexOf('<div id="destinations-section"');
const footerStart = appJsx.indexOf('<footer className="dark-footer"');

if (navStart === -1 || heroStart === -1 || plannerStart === -1 || destStart === -1 || footerStart === -1) {
  throw new Error('Could not find all sections in App.jsx');
}

// 2. Extract pieces
const topApp = appJsx.substring(0, heroStart); // up to <section className="landing-hero" (contains Nav and Mobile Nav)
const heroContent = appJsx.substring(heroStart, plannerStart);
const plannerContent = appJsx.substring(plannerStart, destStart);
const homeRestContent = appJsx.substring(destStart, footerStart);
const bottomApp = appJsx.substring(footerStart); // contains Footer, Modals, and closing tags

// 3. Create HomePage.jsx
let homePage = `import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
${heroContent}
${homeRestContent}
    </>
  );
};

export default HomePage;
`;

// Replace <a href="#planner-section" with <Link to="/plan" target="_blank"
// Replace <button ... data-cta="start-planning">Start Planning</button> with <Link to="/plan" target="_blank" ...
homePage = homePage.replace(/<a href="#planner-section"([^>]*)>/g, '<Link to="/plan" target="_blank"$1>');
homePage = homePage.replace(/<a href="#planner-section">Plan Trip<\/a>/g, '<Link to="/plan" target="_blank">Plan Trip</Link>');
homePage = homePage.replace(/<span className="hero-book-action">Start Planning Now!<\/span>/g, '<Link to="/plan" target="_blank" className="hero-book-action" style={{textDecoration: "none", display: "inline-block"}}>Start Planning Now!</Link>');
// Fix end tags for Link if we replaced <a>
homePage = homePage.replace(/<\/a>/g, (match, offset, str) => {
  // Rough heuristic: if the nearest open tag before this is <Link, replace with </Link>
  const before = str.substring(0, offset);
  const lastOpenA = before.lastIndexOf('<a ');
  const lastOpenLink = before.lastIndexOf('<Link ');
  if (lastOpenLink > lastOpenA) {
    return '</Link>';
  }
  return match;
});


// 4. Create PlannerPage.jsx
let plannerPage = `import React from 'react';

const PlannerPage = () => {
  return (
    <>
${plannerContent}
    </>
  );
};

export default PlannerPage;
`;

// 5. Update App.jsx
// We need to add import for Routes, Route, HomePage, PlannerPage
const appImports = `import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';\n`;

// Let's find where imports end
const appStartIdx = topApp.indexOf('function App()');
let newTopApp = topApp.substring(0, appStartIdx) + appImports + topApp.substring(appStartIdx);

// Also need to replace the data-cta="start-planning" inside the Nav with Link
newTopApp = newTopApp.replace(/<button className="nav-btn-signup"([^>]*)>Start Planning<\/button>/g, '<Link to="/plan" target="_blank" className="nav-btn-signup" $1 style={{textDecoration:"none", display:"inline-flex", alignItems:"center", justifyContent:"center"}}>Start Planning</Link>');
newTopApp = newTopApp.replace(/<a href="#planner-section"([^>]*)>Plan Trip<\/a>/g, '<Link to="/plan" target="_blank"$1>Plan Trip</Link>');
newTopApp = newTopApp.replace(/<a href="#planner-section"([^>]*)>([^<]*)Plan Trip([^<]*)<\/a>/g, '<Link to="/plan" target="_blank"$1>$2Plan Trip$3</Link>');

// Assemble new App.jsx
const newAppJsx = `${newTopApp}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plan" element={<PlannerPage />} />
      </Routes>
${bottomApp}`;

// 6. Write files
fs.mkdirSync('src/pages', { recursive: true });
fs.writeFileSync('src/pages/HomePage.jsx', homePage);
fs.writeFileSync('src/pages/PlannerPage.jsx', plannerPage);
fs.writeFileSync('src/App.jsx', newAppJsx);

console.log('Successfully refactored App.jsx into HomePage and PlannerPage');
