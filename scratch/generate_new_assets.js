const fs = require('fs');
const path = require('path');
const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const inputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714161194.jpg';

// Helper function to build a valid multi-resolution ICO file from PNG buffers
function makeIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const dirSize = 6 + 16 * count;
  
  const out = Buffer.alloc(dirSize);
  out.writeUInt16LE(0, 0); // Reserved
  out.writeUInt16LE(1, 2); // Type (1 = ICO)
  out.writeUInt16LE(count, 4); // Number of images
  
  let currentOffset = dirSize;
  for (let i = 0; i < count; i++) {
    const png = pngBuffers[i];
    const size = sizes[i];
    const offset = 6 + 16 * i;
    
    out.writeUInt8(size === 256 ? 0 : size, offset); // Width
    out.writeUInt8(size === 256 ? 0 : size, offset + 1); // Height
    out.writeUInt8(0, offset + 2); // Palette
    out.writeUInt8(0, offset + 3); // Reserved
    out.writeUInt16LE(1, offset + 4); // Color planes
    out.writeUInt16LE(32, offset + 6); // Bits per pixel
    out.writeUInt32LE(png.length, offset + 8); // Size of image data
    out.writeUInt32LE(currentOffset, offset + 12); // Offset of image data
    
    currentOffset += png.length;
  }
  
  return Buffer.concat([out, ...pngBuffers]);
}

async function run() {
  try {
    console.log('Reading input image media__1780714161194.jpg...');
    const originalImage = sharp(inputPath);
    const metadata = await originalImage.metadata();
    const width = metadata.width;
    const height = metadata.height;
    const channels = metadata.channels;
    
    console.log(`Original Dimensions: ${width}x${height}, Channels: ${channels}`);
    const { data: rgbData } = await originalImage.raw().toBuffer({ resolveWithObject: true });
    
    // Bounding box for full logo:
    // Left: 94, Top: 78, Right: 963, Bottom: 965
    const fullLeft = 94;
    const fullTop = 78;
    const fullWidth = 963 - 94 + 1; // 870
    const fullHeight = 965 - 78 + 1; // 888
    
    // ==========================================
    // 1. GENERATE logo-white.webp (Entire Logo, All White, Transparent Background)
    // ==========================================
    console.log('Generating logo-white.webp...');
    
    const logoWhiteBuffer = Buffer.alloc(fullWidth * fullHeight * 4);
    for (let cy = 0; cy < fullHeight; cy++) {
      const y = fullTop + cy;
      for (let cx = 0; cx < fullWidth; cx++) {
        const x = fullLeft + cx;
        const inIdx = (y * width + x) * channels;
        const outIdx = (cy * fullWidth + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        
        // Calculate distance from white
        const d = 255 - Math.min(r, Math.min(g, b));
        
        // Apply soft threshold for transparency
        const alpha = d < 20 ? 0 : (d > 75 ? 255 : Math.round((d - 20) / 55 * 255));
        
        // Solid white color #FFFFFF
        logoWhiteBuffer[outIdx] = 255;     // R
        logoWhiteBuffer[outIdx + 1] = 255; // G
        logoWhiteBuffer[outIdx + 2] = 255; // B
        logoWhiteBuffer[outIdx + 3] = alpha; // A
      }
    }
    
    // Save logo-white.webp resized to width 300px (retaining aspect ratio, height ~306px)
    const targetWhiteWidth = 300;
    const targetWhiteHeight = Math.round(targetWhiteWidth * fullHeight / fullWidth);
    
    await sharp(logoWhiteBuffer, {
      raw: { width: fullWidth, height: fullHeight, channels: 4 }
    })
    .resize(targetWhiteWidth, targetWhiteHeight)
    .webp({ quality: 95 })
    .toFile(path.join(workspacePath, 'images', 'logo-white.webp'));
    
    console.log(`Saved images/logo-white.webp (${targetWhiteWidth}x${targetWhiteHeight})`);
    
    // ==========================================
    // 2. GENERATE logo-share.png (Social share, Full original Gold Logo, Dark Background)
    // ==========================================
    console.log('Generating logo-share.png...');
    
    const logoGoldBuffer = Buffer.alloc(fullWidth * fullHeight * 4);
    for (let cy = 0; cy < fullHeight; cy++) {
      const y = fullTop + cy;
      for (let cx = 0; cx < fullWidth; cx++) {
        const x = fullLeft + cx;
        const inIdx = (y * width + x) * channels;
        const outIdx = (cy * fullWidth + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        
        // Calculate distance from white
        const d = 255 - Math.min(r, Math.min(g, b));
        const alpha = d < 20 ? 0 : (d > 75 ? 255 : Math.round((d - 20) / 55 * 255));
        
        // Retain original colors (gold gradient)
        logoGoldBuffer[outIdx] = r;
        logoGoldBuffer[outIdx + 1] = g;
        logoGoldBuffer[outIdx + 2] = b;
        logoGoldBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Resize gold logo to fit nicely in 1200x1200px canvas (e.g. width = 700px, height ~715px)
    const targetShareLogoWidth = 700;
    const targetShareLogoHeight = Math.round(targetShareLogoWidth * fullHeight / fullWidth);
    
    const goldLogoResized = await sharp(logoGoldBuffer, {
      raw: { width: fullWidth, height: fullHeight, channels: 4 }
    })
    .resize(targetShareLogoWidth, targetShareLogoHeight)
    .png()
    .toBuffer();
    
    // Create dark background (#1A1816) and overlay the gold logo
    await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 3,
        background: { r: 26, g: 24, b: 22 }
      }
    })
    .composite([{
      input: goldLogoResized,
      blend: 'over'
    }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(workspacePath, 'images', 'logo-share.png'));
    
    console.log('Saved images/logo-share.png (1200x1200px)');

    // ==========================================
    // 3. GENERATE crisp favicon (House Icon only, Gold, Line Dilation)
    // ==========================================
    console.log('Generating crisp favicon (house icon only)...');
    
    // Bounding box for house part:
    // Left: 94, Top: 78, Right: 963, Bottom: 896
    const houseLeft = 94;
    const houseTop = 78;
    const houseWidth = 963 - 94 + 1; // 870
    const houseHeight = 896 - 78 + 1; // 819
    
    // 3a. Extract house icon into a temporary binary mask (1 = logo, 0 = background)
    const mask = new Uint8Array(houseWidth * houseHeight);
    for (let cy = 0; cy < houseHeight; cy++) {
      const y = houseTop + cy;
      for (let cx = 0; cx < houseWidth; cx++) {
        const x = houseLeft + cx;
        const inIdx = (y * width + x) * channels;
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        mask[cy * houseWidth + cx] = d > 40 ? 1 : 0;
      }
    }
    
    // 3b. Apply Dilation to thicken lines for the favicon
    const dilatedMask = new Uint8Array(houseWidth * houseHeight);
    const radius = 12; // Dilation radius in pixels
    
    console.log(`Applying dilation filter to house icon with radius ${radius}px...`);
    for (let cy = 0; cy < houseHeight; cy++) {
      for (let cx = 0; cx < houseWidth; cx++) {
        let active = false;
        const minValY = Math.max(0, cy - radius);
        const maxValY = Math.min(houseHeight - 1, cy + radius);
        const minValX = Math.max(0, cx - radius);
        const maxValX = Math.min(houseWidth - 1, cx + radius);
        
        for (let ny = minValY; ny <= maxValY; ny++) {
          for (let nx = minValX; nx <= maxValX; nx++) {
            if (mask[ny * houseWidth + nx] === 1) {
              active = true;
              break;
            }
          }
          if (active) break;
        }
        
        dilatedMask[cy * houseWidth + cx] = active ? 1 : 0;
      }
    }
    
    // 3c. Create the gold favicon buffer using the dilated mask
    const faviconBuffer = Buffer.alloc(houseWidth * houseHeight * 4);
    for (let i = 0; i < houseWidth * houseHeight; i++) {
      const outIdx = i * 4;
      const isActive = dilatedMask[i];
      
      // Brand gold color #B8956A
      faviconBuffer[outIdx] = 184;     // R
      faviconBuffer[outIdx + 1] = 149; // G
      faviconBuffer[outIdx + 2] = 106; // B
      faviconBuffer[outIdx + 3] = isActive ? 255 : 0; // A
    }
    
    // 3d. Resize dilated house icon and pad to 512x512 square
    const favBase = await sharp(faviconBuffer, {
      raw: { width: houseWidth, height: houseHeight, channels: 4 }
    })
    .resize({
      width: 512,
      height: 512,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();
    
    const favBaseSharp = sharp(favBase);
    
    // Save favicon.png (32x32)
    const png32 = await favBaseSharp.clone().resize(32, 32).png().toBuffer();
    fs.writeFileSync(path.join(workspacePath, 'favicon.png'), png32);
    console.log('Saved favicon.png (32x32)');
    
    // Save apple-touch-icon.png (180x180)
    await favBaseSharp.clone().resize(180, 180).png().toFile(path.join(workspacePath, 'apple-touch-icon.png'));
    console.log('Saved apple-touch-icon.png (180x180)');
    
    // Generate multi-resolution ICO file
    const png16 = await favBaseSharp.clone().resize(16, 16).png().toBuffer();
    const png48 = await favBaseSharp.clone().resize(48, 48).png().toBuffer();
    
    const icoBuffer = makeIco([png16, png32, png48], [16, 32, 48]);
    fs.writeFileSync(path.join(workspacePath, 'favicon.ico'), icoBuffer);
    console.log('Saved favicon.ico (multi-resolution 16/32/48)');
    
    console.log('\nAll new assets generated successfully!');
  } catch (err) {
    console.error('Error generating assets:', err);
  }
}

run();
