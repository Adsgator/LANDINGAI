const fs = require('fs');
const js = fs.readFileSync('assets/app.js', 'utf8');

// Extract all getElementById calls
const matches = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)];
const ids = [...new Set(matches.map(m => m[1]))].sort();
console.log('All getElementById IDs used in app.js:');
ids.forEach(id => console.log(' -', id));
