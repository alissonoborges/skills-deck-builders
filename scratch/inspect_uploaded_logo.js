const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');
const fs = require('fs');

const inputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714161194.jpg';

async function inspect() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log('--- Image Metadata ---');
    console.log(`Format: ${metadata.format}`);
    console.log(`Width: ${metadata.width}`);
    console.log(`Height: ${metadata.height}`);
    console.log(`Channels: ${metadata.channels}`);
    console.log(`Has Alpha: ${metadata.hasAlpha}`);

    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Find bounding box of non-white pixels
    // Let's assume white is above 240 in R, G, B
    let minX = metadata.width;
    let maxX = 0;
    let minY = metadata.height;
    let maxY = 0;

    const channels = metadata.channels;
    for (let y = 0; y < metadata.height; y++) {
      for (let x = 0; x < metadata.width; x++) {
        const idx = (y * metadata.width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // If it's not white (or close to white), it is part of the logo
        if (r < 240 || g < 240 || b < 240) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    console.log('--- Logo Bounding Box ---');
    console.log(`minX: ${minX}`);
    console.log(`maxX: ${maxX}`);
    console.log(`minY: ${minY}`);
    console.log(`maxY: ${maxY}`);
    console.log(`Logo Width: ${maxX - minX + 1}`);
    console.log(`Logo Height: ${maxY - minY + 1}`);
    console.log(`Aspect Ratio (W/H): ${(maxX - minX + 1) / (maxY - minY + 1)}`);

  } catch (err) {
    console.error('Error:', err);
  }
}

inspect();
