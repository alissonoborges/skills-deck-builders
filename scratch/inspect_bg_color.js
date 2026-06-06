const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const path1 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.jpg';
const path2 = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.png';

async function inspectBg(path, label) {
  try {
    const img = sharp(path);
    const meta = await img.metadata();
    const channels = meta.channels;
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });
    
    console.log(`\n=== Background Pixels for ${label} ===`);
    const samples = [
      { x: 5, y: 5 },
      { x: 10, y: 10 },
      { x: meta.width - 5, y: 5 },
      { x: 5, y: meta.height - 5 }
    ];
    samples.forEach(s => {
      const idx = (s.y * meta.width + s.x) * channels;
      console.log(`Coord (${s.x}, ${s.y}): R:${data[idx]}, G:${data[idx+1]}, B:${data[idx+2]}`);
    });
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await inspectBg(path1, 'Image 1 (JPEG)');
  await inspectBg(path2, 'Image 2 (PNG)');
}

run();
