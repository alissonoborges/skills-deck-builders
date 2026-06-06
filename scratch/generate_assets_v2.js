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
    
    // Get raw RGB buffer
    const { data: rgbData } = await originalImage.raw().toBuffer({ resolveWithObject: true });
    
    // ==========================================
    // 1. GENERATE CRISP FAVICON (Dilation to Thicken Lines)
    // ==========================================
    console.log('Generating crisp favicon (house icon only)...');
    
    // Crop coordinates for the house icon (Segment 0)
    const favLeft = 184;
    const favTop = 253;
    const favWidth = 1649;
    const favHeight = 1186;
    
    // 1a. Extract Segment 0 into a temporary binary mask (1 = gold/logo, 0 = background)
    const mask = new Uint8Array(favWidth * favHeight);
    for (let cy = 0; cy < favHeight; cy++) {
      const y = favTop + cy;
      for (let cx = 0; cx < favWidth; cx++) {
        const x = favLeft + cx;
        const inIdx = (y * width + x) * 3;
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        mask[cy * favWidth + cx] = d > 40 ? 1 : 0;
      }
    }
    
    // 1b. Apply Dilation to make the thin house strokes much thicker
    // This prevents the house icon from turning into a blur at 16x16 / 32x32.
    const dilatedMask = new Uint8Array(favWidth * favHeight);
    const radius = 12; // Dilation radius in pixels
    
    console.log(`Applying dilation filter with radius ${radius}px...`);
    for (let cy = 0; cy < favHeight; cy++) {
      for (let cx = 0; cx < favWidth; cx++) {
        let active = false;
        // Scan a square bounding box around the pixel
        const minValY = Math.max(0, cy - radius);
        const maxValY = Math.min(favHeight - 1, cy + radius);
        const minValX = Math.max(0, cx - radius);
        const maxValX = Math.min(favWidth - 1, cx + radius);
        
        for (let ny = minValY; ny <= maxValY; ny++) {
          for (let nx = minValX; nx <= maxValX; nx++) {
            if (mask[ny * favWidth + nx] === 1) {
              active = true;
              break;
            }
          }
          if (active) break;
        }
        
        dilatedMask[cy * favWidth + cx] = active ? 1 : 0;
      }
    }
    
    // 1c. Create the gold favicon buffer using the dilated mask
    const faviconBuffer = Buffer.alloc(favWidth * favHeight * 4);
    for (let i = 0; i < favWidth * favHeight; i++) {
      const outIdx = i * 4;
      const isActive = dilatedMask[i];
      
      // Brand gold color #B8956A
      faviconBuffer[outIdx] = 184;     // R
      faviconBuffer[outIdx + 1] = 149; // G
      faviconBuffer[outIdx + 2] = 106; // B
      faviconBuffer[outIdx + 3] = isActive ? 255 : 0; // A
    }
    
    // 1d. Resize dilated house icon and pad to 512x512 square
    const favBase = await sharp(faviconBuffer, {
      raw: { width: favWidth, height: favHeight, channels: 4 }
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
    
    // ==========================================
    // 2. GENERATE logo-white.webp (Text Wordmark Only)
    // ==========================================
    console.log('Generating text-only logo-white.webp...');
    
    // Extract Segment 1: "SKILLS"
    const s1Left = 184;
    const s1Top = 1494;
    const s1Width = 1647; // 1830 - 184 + 1
    const s1Height = 84;
    
    const skillsBuffer = Buffer.alloc(s1Width * s1Height * 4);
    for (let cy = 0; cy < s1Height; cy++) {
      const y = s1Top + cy;
      for (let cx = 0; cx < s1Width; cx++) {
        const x = s1Left + cx;
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * s1Width + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        const alpha = d < 15 ? 0 : (d > 80 ? 255 : Math.round((d - 15) / 65 * 255));
        
        skillsBuffer[outIdx] = 255;
        skillsBuffer[outIdx + 1] = 255;
        skillsBuffer[outIdx + 2] = 255;
        skillsBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Extract Segment 2: "DECK BUILDERS" (without side dashes)
    // Dashes end at X = 253, and right dash starts at X = 1806
    // Text is at X = 270..1798
    const s2Left = 270;
    const s2Top = 1647;
    const s2Width = 1529; // 1798 - 270 + 1
    const s2Height = 42;
    
    const deckBuildersBuffer = Buffer.alloc(s2Width * s2Height * 4);
    for (let cy = 0; cy < s2Height; cy++) {
      const y = s2Top + cy;
      for (let cx = 0; cx < s2Width; cx++) {
        const x = s2Left + cx;
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * s2Width + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        const alpha = d < 15 ? 0 : (d > 80 ? 255 : Math.round((d - 15) / 65 * 255));
        
        deckBuildersBuffer[outIdx] = 255;
        deckBuildersBuffer[outIdx + 1] = 255;
        deckBuildersBuffer[outIdx + 2] = 255;
        deckBuildersBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Resize "DECK BUILDERS" horizontally to match "SKILLS" width (1647px)
    // We keep height at 42px (so aspect ratio stretches horizontally to occupy same width)
    const resizedDeckBuilders = await sharp(deckBuildersBuffer, {
      raw: { width: s2Width, height: s2Height, channels: 4 }
    })
    .resize(1647, 42, { fit: 'fill' })
    .png()
    .toBuffer();
    
    // Combine them on a single canvas
    // Width: 1647px
    // Height: 84px (SKILLS) + 40px (gap) + 42px (DECK BUILDERS) = 166px
    const gap = 36;
    const totalHeight = 84 + gap + 42;
    
    const logoBuffer = Buffer.alloc(1647 * totalHeight * 4);
    
    // 2a. Copy SKILLS to the top of the canvas
    const skillsPng = await sharp(skillsBuffer, {
      raw: { width: s1Width, height: s1Height, channels: 4 }
    })
    .png()
    .toBuffer();
    
    // 2b. Composite the images using Sharp
    const combinedLogoPng = await sharp({
      create: {
        width: 1647,
        height: totalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([
      { input: skillsPng, top: 0, left: 0 },
      { input: resizedDeckBuilders, top: 84 + gap, left: 0 }
    ])
    .png()
    .toBuffer();
    
    // Save logo-white.webp (600px wide, keeping aspect ratio)
    await sharp(combinedLogoPng)
    .resize(600, Math.round(600 * totalHeight / 1647))
    .webp({ quality: 90 })
    .toFile(path.join(workspacePath, 'images', 'logo-white.webp'));
    
    console.log(`Saved images/logo-white.webp (600x${Math.round(600 * totalHeight / 1647)})`);
    
    // ==========================================
    // 3. GENERATE logo-share.png (WhatsApp Sharing Preview - Gold text only)
    // ==========================================
    console.log('Generating gold-text-only logo-share.png...');
    
    // Extract "SKILLS" in gold
    const skillsGoldBuffer = Buffer.alloc(s1Width * s1Height * 4);
    for (let cy = 0; cy < s1Height; cy++) {
      const y = s1Top + cy;
      for (let cx = 0; cx < s1Width; cx++) {
        const x = s1Left + cx;
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * s1Width + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        const alpha = d < 15 ? 0 : (d > 80 ? 255 : Math.round((d - 15) / 65 * 255));
        
        skillsGoldBuffer[outIdx] = r;
        skillsGoldBuffer[outIdx + 1] = g;
        skillsGoldBuffer[outIdx + 2] = b;
        skillsGoldBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Extract "DECK BUILDERS" in gold (no dashes)
    const dbGoldBuffer = Buffer.alloc(s2Width * s2Height * 4);
    for (let cy = 0; cy < s2Height; cy++) {
      const y = s2Top + cy;
      for (let cx = 0; cx < s2Width; cx++) {
        const x = s2Left + cx;
        const inIdx = (y * width + x) * 3;
        const outIdx = (cy * s2Width + cx) * 4;
        
        const r = rgbData[inIdx];
        const g = rgbData[inIdx + 1];
        const b = rgbData[inIdx + 2];
        const d = 255 - Math.min(r, Math.min(g, b));
        
        const alpha = d < 15 ? 0 : (d > 80 ? 255 : Math.round((d - 15) / 65 * 255));
        
        dbGoldBuffer[outIdx] = r;
        dbGoldBuffer[outIdx + 1] = g;
        dbGoldBuffer[outIdx + 2] = b;
        dbGoldBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Resize "DECK BUILDERS" in gold
    const resizedGoldDB = await sharp(dbGoldBuffer, {
      raw: { width: s2Width, height: s2Height, channels: 4 }
    })
    .resize(1647, 42, { fit: 'fill' })
    .png()
    .toBuffer();
    
    const skillsGoldPng = await sharp(skillsGoldBuffer, {
      raw: { width: s1Width, height: s1Height, channels: 4 }
    })
    .png()
    .toBuffer();
    
    const combinedGoldLogoPng = await sharp({
      create: {
        width: 1647,
        height: totalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([
      { input: skillsGoldPng, top: 0, left: 0 },
      { input: resizedGoldDB, top: 84 + gap, left: 0 }
    ])
    .png()
    .toBuffer();
    
    // Resize the gold logo to width 800px
    const goldLogoResized = await sharp(combinedGoldLogoPng)
    .resize({ width: 800, height: Math.round(800 * totalHeight / 1647), fit: 'contain' })
    .png()
    .toBuffer();
    
    // Create dark background canvas and overlay the gold logo
    await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 3,
        background: { r: 26, g: 24, b: 22 } // #1A1816
      }
    })
    .composite([{
      input: goldLogoResized,
      blend: 'over'
    }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(workspacePath, 'images', 'logo-share.png'));
    
    console.log('Saved images/logo-share.png (1200x1200px, gold text logo on dark background)');
    console.log('\nAsset generation version 2 complete!');
  } catch (err) {
    console.error('Error generating assets:', err);
  }
}

run();
