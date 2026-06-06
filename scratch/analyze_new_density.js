const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const inputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714161194.jpg';

async function analyzeDensity() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    const channels = metadata.channels;
    
    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    
    const rowCounts = new Array(height).fill(0);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // If not white, it's a logo pixel
        if (r < 240 || g < 240 || b < 240) {
          rowCounts[y]++;
        }
      }
    }
    
    console.log('Vertical Density Profile (sampled every 20 rows):');
    for (let y = 0; y < height; y += 20) {
      console.log(`Row ${y.toString().padStart(4, ' ')}: ${rowCounts[y].toString().padStart(4, ' ')} pixels`);
    }
    
    // Find gaps where rowCounts is 0 (or close to 0) after row 500
    console.log('\nScanning for empty rows (gap between house and text):');
    let gapStart = -1;
    let gapEnd = -1;
    for (let y = 500; y < height; y++) {
      if (rowCounts[y] === 0) {
        if (gapStart === -1) gapStart = y;
        gapEnd = y;
      } else {
        if (gapStart !== -1) {
          console.log(`Gap found from row ${gapStart} to ${gapEnd} (size ${gapEnd - gapStart + 1} rows)`);
          gapStart = -1;
          gapEnd = -1;
        }
      }
    }
  } catch (err) {
    console.error('Error analyzing density:', err);
  }
}

analyzeDensity();
