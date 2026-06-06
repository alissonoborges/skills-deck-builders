const fs = require('fs');
const path = require('path');
const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const inputPath = path.join(workspacePath, 'images', 'logo-nobg.png');

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
    console.log('Reading input image logo-nobg.png...');
    const originalImage = sharp(inputPath);
    const metadata = await originalImage.metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    if (metadata.channels !== 3) {
      console.warn(`Warning: Expected 3 channels but found ${metadata.channels}. Script is configured for 3 channels.`);
    }
    
    // Get raw RGB buffer
    const { data: rgbData } = await originalImage.raw().toBuffer({ resolveWithObject: true });
    
    // ==========================================
    // 1. GENERATE logo-white.webp
    // ==========================================
    console.log('Generating logo-white.webp...');
    // Crop bounding box: left: 144, top: 213, width: 1729, height: 1516 (40px padding)
    const cropLeft = 144;
    const cropTop = 213;
    const cropWidth = 1729;
    const cropHeight = 1516;
    
    // Create new RGBA buffer for the cropped white logo
    const whiteLogoBuffer = Buffer.alloc(cropWidth * cropHeight * 4);
    
    for (let cy = 0; cy < cropHeight; cy++) {
      const y = cropTop + cy;
      for (let cx = 0; cx < cropWidth; cx++) {
        const x = cropLeft + cx;
        
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * cropWidth + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        
        // Calculate distance from white
        const d = 255 - Math.min(r, Math.min(g, b));
        
        let alpha = 0;
        if (d < 15) {
          alpha = 0; // Transparent background
        } else if (d > 80) {
          alpha = 255; // Fully opaque logo
        } else {
          alpha = Math.round((d - 15) / 65 * 255); // Smooth anti-aliased edge
        }
        
        whiteLogoBuffer[outIdx] = 255;     // R
        whiteLogoBuffer[outIdx + 1] = 255; // G
        whiteLogoBuffer[outIdx + 2] = 255; // B
        whiteLogoBuffer[outIdx + 3] = alpha; // A
      }
    }
    
    // Save white logo in WebP format (resized to width 400px, height auto)
    const finalWhiteHeight = Math.round(400 * cropHeight / cropWidth); // ~351px
    await sharp(whiteLogoBuffer, {
      raw: { width: cropWidth, height: cropHeight, channels: 4 }
    })
    .resize(400, finalWhiteHeight)
    .webp({ quality: 90 })
    .toFile(path.join(workspacePath, 'images', 'logo-white.webp'));
    console.log(`Saved images/logo-white.webp (400x${finalWhiteHeight})`);
    
    // ==========================================
    // 2. GENERATE FAVICONS (favicon.ico / favicon.png)
    // ==========================================
    console.log('Generating favicons...');
    // House icon crop box (Segment 0): left: 183, top: 21, width: 1650, height: 1650
    const favLeft = 183;
    const favTop = 21;
    const favSize = 1650;
    
    // Create RGBA buffer for the favicon (color: brand gold #B8956A / rgb: 184, 149, 106)
    const faviconBuffer = Buffer.alloc(favSize * favSize * 4);
    
    for (let cy = 0; cy < favSize; cy++) {
      const y = favTop + cy;
      for (let cx = 0; cx < favSize; cx++) {
        const x = favLeft + cx;
        
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * favSize + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        
        const d = 255 - Math.min(r, Math.min(g, b));
        
        let alpha = 0;
        if (d < 15) {
          alpha = 0;
        } else if (d > 80) {
          alpha = 255;
        } else {
          alpha = Math.round((d - 15) / 65 * 255);
        }
        
        // Brand gold color #B8956A
        faviconBuffer[outIdx] = 184;     // R
        faviconBuffer[outIdx + 1] = 149; // G
        faviconBuffer[outIdx + 2] = 106; // B
        faviconBuffer[outIdx + 3] = alpha; // A
      }
    }
    
    const favBase = sharp(faviconBuffer, {
      raw: { width: favSize, height: favSize, channels: 4 }
    });
    
    // Save favicon.png (32x32)
    const png32 = await favBase.clone().resize(32, 32).png().toBuffer();
    fs.writeFileSync(path.join(workspacePath, 'favicon.png'), png32);
    console.log('Saved favicon.png (32x32)');
    
    // Save apple-touch-icon.png (180x180)
    await favBase.clone().resize(180, 180).png().toFile(path.join(workspacePath, 'apple-touch-icon.png'));
    console.log('Saved apple-touch-icon.png (180x180)');
    
    // Generate multi-resolution ICO file
    const png16 = await favBase.clone().resize(16, 16).png().toBuffer();
    const png48 = await favBase.clone().resize(48, 48).png().toBuffer();
    
    const icoBuffer = makeIco([png16, png32, png48], [16, 32, 48]);
    fs.writeFileSync(path.join(workspacePath, 'favicon.ico'), icoBuffer);
    console.log('Saved favicon.ico (multi-resolution 16/32/48)');
    
    // ==========================================
    // 3. GENERATE logo-share.png (WhatsApp Sharing Preview)
    // ==========================================
    console.log('Generating logo-share.png...');
    // Create a transparent gold logo with original gold gradient preserved
    const goldLogoBuffer = Buffer.alloc(cropWidth * cropHeight * 4);
    for (let cy = 0; cy < cropHeight; cy++) {
      const y = cropTop + cy;
      for (let cx = 0; cx < cropWidth; cx++) {
        const x = cropLeft + cx;
        
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * cropWidth + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        
        const d = 255 - Math.min(r, Math.min(g, b));
        
        let alpha = 0;
        if (d < 15) {
          alpha = 0;
        } else if (d > 80) {
          alpha = 255;
        } else {
          alpha = Math.round((d - 15) / 65 * 255);
        }
        
        goldLogoBuffer[outIdx] = r;         // Keep original R (metallic gold)
        goldLogoBuffer[outIdx + 1] = g;     // Keep original G
        goldLogoBuffer[outIdx + 2] = b;     // Keep original B
        goldLogoBuffer[outIdx + 3] = alpha; // A
      }
    }
    
    // Resize the transparent gold logo to fit nicely in 1200x1200px (e.g. max width 750px)
    const transparentGoldLogoPng = await sharp(goldLogoBuffer, {
      raw: { width: cropWidth, height: cropHeight, channels: 4 }
    })
    .resize({ width: 750, height: Math.round(750 * cropHeight / cropWidth), fit: 'contain' })
    .png()
    .toBuffer();
    
    // Create dark background canvas (#1A1816 / RGB: 26, 24, 22) and composite the logo on top
    await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 3,
        background: { r: 26, g: 24, b: 22 }
      }
    })
    .composite([{
      input: transparentGoldLogoPng,
      blend: 'over'
    }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(workspacePath, 'images', 'logo-share.png'));
    console.log('Saved images/logo-share.png (1200x1200px, gold logo on dark background)');
    
    console.log('\nAll assets generated successfully!');
  } catch (err) {
    console.error('Error generating assets:', err);
  }
}

run();
