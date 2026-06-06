const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const inputPath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\images\\logo-nobg.png';

async function analyze() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    console.log(`Image dimensions: ${width}x${height}`);
    
    const { data } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Scan rows to find rows with gold pixels (RGB < 240)
    const activeRows = new Array(height).fill(false);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r < 240 || g < 240 || b < 240) {
          activeRows[y] = true;
          break;
        }
      }
    }
    
    // Find active row segments
    const segments = [];
    let inSegment = false;
    let start = 0;
    for (let y = 0; y < height; y++) {
      if (activeRows[y] && !inSegment) {
        start = y;
        inSegment = true;
      } else if (!activeRows[y] && inSegment) {
        segments.push({ start, end: y - 1 });
        inSegment = false;
      }
    }
    if (inSegment) {
      segments.push({ start, end: height - 1 });
    }
    
    console.log('Detected active gold row segments:', segments);
    
    // For each segment, find its horizontal bounding box and average width/pixel count
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      let minX = width;
      let maxX = 0;
      let pixelCount = 0;
      for (let y = seg.start; y <= seg.end; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 3;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          if (r < 240 || g < 240 || b < 240) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            pixelCount++;
          }
        }
      }
      console.log(`Segment ${i}: Y: ${seg.start}..${seg.end} (height: ${seg.end - seg.start + 1}), X: ${minX}..${maxX} (width: ${maxX - minX + 1}), Gold pixels: ${pixelCount}`);
    }
  } catch (err) {
    console.error('Error analyzing image:', err);
  }
}

analyze();
