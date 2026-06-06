const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const path1 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.jpg';
const path2 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.png';

async function analyze(path, label) {
  try {
    const img = sharp(path);
    const meta = await img.metadata();
    const channels = meta.channels;
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });
    
    const rowCounts = new Array(meta.height).fill(0);
    for (let y = 0; y < meta.height; y++) {
      for (let x = 0; x < meta.width; x++) {
        const idx = (y * meta.width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // If it's a white pixel (part of the logo drawing/text)
        if (r > 200 && g > 200 && b > 200) {
          rowCounts[y]++;
        }
      }
    }
    
    console.log(`\n=== Vertical Density Profile for ${label} ===`);
    let activeRows = [];
    for (let y = 0; y < meta.height; y++) {
      if (rowCounts[y] > 5) {
        activeRows.push(y);
      }
    }
    
    if (activeRows.length === 0) {
      console.log('No active rows found.');
      return;
    }
    
    console.log(`Active range: Row ${activeRows[0]} to Row ${activeRows[activeRows.length - 1]}`);
    
    // Scan for gaps (where rowCounts is close to 0) in the active range
    let inGap = false;
    let gapStart = -1;
    for (let y = activeRows[0]; y <= activeRows[activeRows.length - 1]; y++) {
      if (rowCounts[y] < 5) {
        if (!inGap) {
          inGap = true;
          gapStart = y;
        }
      } else {
        if (inGap) {
          console.log(`Gap from row ${gapStart} to ${y - 1} (size ${y - gapStart} rows)`);
          inGap = false;
        }
      }
    }
  } catch (err) {
    console.error(`Error analyzing ${label}:`, err);
  }
}

async function run() {
  await analyze(path1, 'Image 1 (JPEG)');
  await analyze(path2, 'Image 2 (PNG)');
}

run();
