const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

let emDashes = 0;
let enDashes = 0;

for (const file of files) {
  const filePath = path.join(siteDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check for em-dash (—), en-dash (–), mdash entity, ndash entity
  const emMatches = content.match(/—|&mdash;/g);
  const enMatches = content.match(/–|&ndash;/g);

  if (emMatches) {
    console.log(`[EM-DASH] Found ${emMatches.length} in ${file}`);
    emDashes += emMatches.length;
  }
  if (enMatches) {
    console.log(`[EN-DASH] Found ${enMatches.length} in ${file}`);
    enDashes += enMatches.length;
  }
}

console.log(`Total em-dashes found: ${emDashes}`);
console.log(`Total en-dashes found: ${enDashes}`);
