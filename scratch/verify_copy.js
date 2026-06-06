const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

const aiKeywords = [
  'discerning',
  'discover what is possible',
  'elevating',
  'elevate',
  'testament',
  'seamless',
  'meticulous'
];

const forbiddenPunctuation = [
  '—', // em-dash
  '–', // en-dash
  ' - ' // spaced hyphen
];

let outputLines = [];

for (const file of files) {
  const filePath = path.join(siteDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Check keywords
    for (const word of aiKeywords) {
      if (line.toLowerCase().includes(word)) {
        outputLines.push(`[KEYWORD] ${file}:${index + 1} (${word}): "${line.trim()}"`);
      }
    }
    
    // Check punctuation
    for (const punct of forbiddenPunctuation) {
      if (line.includes(punct)) {
        outputLines.push(`[PUNCT] ${file}:${index + 1} (${punct}): "${line.trim()}"`);
      }
    }
  });
}

fs.writeFileSync(path.join(__dirname, 'matches.txt'), outputLines.join('\n'), 'utf8');
console.log(`Saved ${outputLines.length} matches to scratch/matches.txt`);
