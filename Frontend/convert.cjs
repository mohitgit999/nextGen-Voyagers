const fs = require('fs');

const html = fs.readFileSync('../Archive/Frontend_Vanilla/index.html', 'utf-8');

// Extract the body content, excluding the <script> tags at the bottom
const bodyMatch = html.match(/<body>([\s\S]*?)<script src="js\/data\.js">/);
if (!bodyMatch) {
  console.error("Could not extract body");
  process.exit(1);
}

let bodyContent = bodyMatch[1];

// Convert to JSX
bodyContent = bodyContent
  .replace(/class=/g, 'className=')
  .replace(/for=/g, 'htmlFor=')
  .replace(/stroke-width=/g, 'strokeWidth=')
  .replace(/stroke-linecap=/g, 'strokeLinecap=')
  .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
  .replace(/aria-hidden="true"/g, 'aria-hidden="true"')
  // Self closing tags
  .replace(/<img(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.replace(/>$/, ' />');
  })
  .replace(/<input(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.replace(/>$/, ' />');
  })
  .replace(/<br(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.replace(/>$/, ' />');
  })
  .replace(/<hr(.*?)>/g, (match) => {
    if (match.endsWith('/>')) return match;
    return match.replace(/>$/, ' />');
  })
  // Fix inline styles
  .replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1.split(';').reduce((acc, rule) => {
      if (!rule.trim()) return acc;
      let [key, value] = rule.split(':');
      if (!key || !value) return acc;
      key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      value = value.trim();
      acc.push(`${key}: '${value}'`);
      return acc;
    }, []).join(', ');
    return `style={{${styleObj}}}`;
  })
  .replace(/<!--[\s\S]*?-->/g, ''); // Remove HTML comments

const jsxComponent = `
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const loadScripts = async () => {
      // Import the original JS files so they execute on mount
      await import('./assets/js/data.js');
      await import('./assets/js/state.js');
      await import('./assets/js/auth.js');
      await import('./assets/js/dashboard.js');
      await import('./assets/js/search.js');
      await import('./assets/js/navigation.js');
      await import('./assets/js/screen1-locate.js');
      await import('./assets/js/screen2-prefs.js');
      await import('./assets/js/screen3-explore.js');
      await import('./assets/js/screen4-detail.js');
      await import('./assets/js/screen5-itinerary.js');
      await import('./assets/js/sos.js');
      await import('./assets/js/hero.js');
      await import('./assets/js/contact.js');
      await import('./assets/js/main.js');
    };
    
    loadScripts();
  }, []);

  return (
    <>
      ${bodyContent}
    </>
  );
}

export default App;
`;

fs.writeFileSync('src/App.jsx', jsxComponent);
console.log('App.jsx generated successfully.');
