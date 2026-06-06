const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const path1 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.jpg';
const path2 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.png';

async function checkBoundingBox(path, label) {
  try {
    const img = sharp(path);
    const meta = await img.metadata();
    const channels = meta.channels;
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });

    let minX = meta.width;
    let maxX = 0;
    let minY = meta.height;
    let maxY = 0;

    for (let y = 0; y < meta.height; y++) {
      for (let x = 0; x < meta.width; x++) {
        const idx = (y * meta.width + x) * channels;
        // Background color of the images is tan/beige.
        // Let's check if the pixel is different from the background.
        // Tan color of the background is roughly R=222, G=197, B=172 (let's check standard background color)
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = channels === 4 ? data[idx + 3] : 255;
        
        // If it's not the background, it's logo.
        // Let's check distance from background. A simple distance threshold:
        // We see the background is tan/beige. The lines are white!
        // In the images, the background is tan/brown, and the house and deck outlines are WHITE!
        // Let's verify: is the line color white?
        // Let's check if there are white lines (R > 240, G > 240, B > 240).
        if (r > 240 && g > 240 && b > 240) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    console.log(`--- ${label} Bounding Box of White Pixels ---`);
    console.log(`minX: ${minX}, maxX: ${maxX}`);
    console.log(`minY: ${minY}, maxY: ${maxY}`);
    console.log(`Width: ${maxX - minX + 1}, Height: ${maxY - minY + 1}`);

  } catch (err) {
    console.error(`Error checking ${label}:`, err);
  }
}

async function run() {
  await checkBoundingBox(path1, 'Image 1 (JPEG)');
  await checkBoundingBox(path2, 'Image 2 (PNG)');
}

run();
