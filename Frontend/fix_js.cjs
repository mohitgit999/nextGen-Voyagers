const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'public', 'js');

const filesToFix = [
  { name: 'screen1-locate.js', func: 'initScreen1', id: 'screen-1' },
  { name: 'screen2-prefs.js', func: 'initScreen2', id: 'screen-2' },
  { name: 'screen3-explore.js', func: 'initScreen3', id: 'screen-3' },
  { name: 'screen4-detail.js', func: 'initScreen4', id: 'screen-4' },
  { name: 'screen5-itinerary.js', func: 'initScreen5', id: 'screen-5' }
];

filesToFix.forEach(f => {
  const filePath = path.join(jsDir, f.name);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const funcDecl = `function ${f.func}() {`;
    if (content.includes(funcDecl)) {
      const replacement = `${funcDecl}\n  if (!document.getElementById('${f.id}')) return;`;
      content = content.replace(funcDecl, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${f.name}`);
    }
  }
});
