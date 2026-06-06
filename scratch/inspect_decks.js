const sharp = require('../Site/node_modules/sharp');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'Site', 'images');

async function check() {
  const beforeMeta = await sharp(path.join(imgDir, 'deck-before.webp')).metadata();
  const afterMeta = await sharp(path.join(imgDir, 'deck-after.webp')).metadata();
  const beforeFullMeta = await sharp(path.join(imgDir, 'deck-before-full.webp')).metadata();
  const afterFullMeta = await sharp(path.join(imgDir, 'deck-after-full.webp')).metadata();

  console.log('deck-before.webp:', beforeMeta.width, 'x', beforeMeta.height);
  console.log('deck-after.webp:', afterMeta.width, 'x', afterMeta.height);
  console.log('deck-before-full.webp:', beforeFullMeta.width, 'x', beforeFullMeta.height);
  console.log('deck-after-full.webp:', afterFullMeta.width, 'x', afterFullMeta.height);
}

check();
