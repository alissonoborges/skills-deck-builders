const fs = require('fs');
const path = require('path');

const sitePath = 'C:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\Site';

function printLines(filename, keyword) {
  const filePath = path.join(sitePath, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`\n=== Lines containing "${keyword}" in ${filename} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(keyword)) {
      const start = Math.max(0, idx - 8);
      const end = Math.min(lines.length - 1, idx + 15);
      console.log(`--- Lines ${start + 1} to ${end + 1} ---`);
      for (let i = start; i <= end; i++) {
        console.log(`${(i+1).toString().padStart(4, ' ')}: ${lines[i]}`);
      }
    }
  });
}

printLines('index.html', 'Sarah M.');
printLines('reviews.html', 'Sarah M.');
