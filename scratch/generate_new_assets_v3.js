const fs = require('fs');
const path = require('path');
const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const fullLogoInputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.jpg';
const faviconInputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.png';

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
    // ==========================================
    // 1. GENERATE logo-white.webp (Full Logo, All White, Transparent Background)
    // ==========================================
    console.log('Processing Image 1 (JPEG) for logo-white.webp...');
    const originalFullImg = sharp(fullLogoInputPath);
    const metaFull = await originalFullImg.metadata();
    const { data: rgbDataFull } = await originalFullImg.raw().toBuffer({ resolveWithObject: true });
    
    // Bounding box with 10px padding:
    // minX: 114, maxX: 920, minY: 95, maxY: 921
    const pad = 10;
    const cropLeft = Math.max(0, 114 - pad);
    const cropTop = Math.max(0, 95 - pad);
    const cropWidth = Math.min(metaFull.width - cropLeft, (920 + pad) - cropLeft + 1);
    const cropHeight = Math.min(metaFull.height - cropTop, (921 + pad) - cropTop + 1);
    
    const logoWhiteBuffer = Buffer.alloc(cropWidth * cropHeight * 4);
    for (let cy = 0; cy < cropHeight; cy++) {
      const y = cropTop + cy;
      for (let cx = 0; cx < cropWidth; cx++) {
        const x = cropLeft + cx;
        const inIdx = (y * metaFull.width + x) * metaFull.channels;
        const outIdx = (cy * cropWidth + cx) * 4;
        
        const r = rgbDataFull[inIdx];
        const g = rgbDataFull[inIdx + 1];
        const b = rgbDataFull[inIdx + 2];
        
        // Key out the background. Tan background minVal ~160. White line minVal ~255.
        const minVal = Math.min(r, Math.min(g, b));
        const alpha = minVal < 175 ? 0 : (minVal > 230 ? 255 : Math.round((minVal - 175) / 55 * 255));
        
        logoWhiteBuffer[outIdx] = 255;
        logoWhiteBuffer[outIdx + 1] = 255;
        logoWhiteBuffer[outIdx + 2] = 255;
        logoWhiteBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Save logo-white.webp resized to exactly 300x306px to match HTML dimensions
    await sharp(logoWhiteBuffer, {
      raw: { width: cropWidth, height: cropHeight, channels: 4 }
    })
    .resize(300, 306)
    .webp({ quality: 95 })
    .toFile(path.join(workspacePath, 'images', 'logo-white.webp'));
    
    console.log('Saved images/logo-white.webp (300x306)');
    
    // ==========================================
    // 2. GENERATE logo-share.png (Social share, Gold Full Logo, Dark Background)
    // ==========================================
    console.log('Generating logo-share.png...');
    
    const logoGoldBuffer = Buffer.alloc(cropWidth * cropHeight * 4);
    for (let cy = 0; cy < cropHeight; cy++) {
      const y = cropTop + cy;
      for (let cx = 0; cx < cropWidth; cx++) {
        const x = cropLeft + cx;
        const inIdx = (y * metaFull.width + x) * metaFull.channels;
        const outIdx = (cy * cropWidth + cx) * 4;
        
        const r = rgbDataFull[inIdx];
        const g = rgbDataFull[inIdx + 1];
        const b = rgbDataFull[inIdx + 2];
        
        const minVal = Math.min(r, Math.min(g, b));
        const alpha = minVal < 175 ? 0 : (minVal > 230 ? 255 : Math.round((minVal - 175) / 55 * 255));
        
        // Brand gold color #B8956A
        logoGoldBuffer[outIdx] = 184;     // R
        logoGoldBuffer[outIdx + 1] = 149; // G
        logoGoldBuffer[outIdx + 2] = 106; // B
        logoGoldBuffer[outIdx + 3] = alpha; // A
      }
    }
    
    const goldLogoResized = await sharp(logoGoldBuffer, {
      raw: { width: cropWidth, height: cropHeight, channels: 4 }
    })
    .resize(700, 714)
    .png()
    .toBuffer();
    
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
    console.log('Processing Image 2 (PNG) for crisp favicon...');
    const originalFavImg = sharp(faviconInputPath);
    const metaFav = await originalFavImg.metadata();
    const { data: rgbDataFav } = await originalFavImg.raw().toBuffer({ resolveWithObject: true });
    
    // Bounding box for house:
    // minX: 170, maxX: 853, minY: 94, maxY: 748
    // Width: 684, Height: 655
    // Pad to square: add 29px vertically (14px top, 15px bottom)
    const favLeft = 170;
    const favTop = 94 - 14;
    const favSize = 684;
    
    // 3a. Extract house icon into a temporary binary mask (1 = logo, 0 = background)
    const mask = new Uint8Array(favSize * favSize);
    for (let cy = 0; cy < favSize; cy++) {
      const y = favTop + cy;
      for (let cx = 0; cx < favSize; cx++) {
        const x = favLeft + cx;
        
        // Symmetrical boundary safety check
        if (y < 0 || y >= metaFav.height || x < 0 || x >= metaFav.width) {
          mask[cy * favSize + cx] = 0;
          continue;
        }
        
        const inIdx = (y * metaFav.width + x) * metaFav.channels;
        const r = rgbDataFav[inIdx];
        const g = rgbDataFav[inIdx + 1];
        const b = rgbDataFav[inIdx + 2];
        const minVal = Math.min(r, Math.min(g, b));
        
        mask[cy * favSize + cx] = minVal > 210 ? 1 : 0;
      }
    }
    
    // 3b. Apply Dilation to thicken lines for the favicon
    const dilatedMask = new Uint8Array(favSize * favSize);
    const radius = 10; // Dilation radius in pixels for 684px canvas
    
    console.log(`Applying dilation filter to house icon with radius ${radius}px...`);
    for (let cy = 0; cy < favSize; cy++) {
      for (let cx = 0; cx < favSize; cx++) {
        let active = false;
        const minValY = Math.max(0, cy - radius);
        const maxValY = Math.min(favSize - 1, cy + radius);
        const minValX = Math.max(0, cx - radius);
        const maxValX = Math.min(favSize - 1, cx + radius);
        
        for (let ny = minValY; ny <= maxValY; ny++) {
          for (let nx = minValX; nx <= maxValX; nx++) {
            if (mask[ny * favSize + nx] === 1) {
              active = true;
              break;
            }
          }
          if (active) break;
        }
        
        dilatedMask[cy * favSize + cx] = active ? 1 : 0;
      }
    }
    
    // 3c. Create the gold favicon buffer using the dilated mask
    const faviconBuffer = Buffer.alloc(favSize * favSize * 4);
    for (let i = 0; i < favSize * favSize; i++) {
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
      raw: { width: favSize, height: favSize, channels: 4 }
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
    
    console.log('\nAll new assets updated and generated successfully!');
  } catch (err) {
    console.error('Error generating assets:', err);
  }
}

run();
