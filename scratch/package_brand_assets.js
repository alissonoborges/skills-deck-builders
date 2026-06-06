const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const brandAssetsPath = path.join(workspacePath, 'brand-assets');
const fullLogoInputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.jpg';
const faviconInputPath = 'C:\\Users\\aliss\\.gemini\\antigravity\\brain\\69b675b3-5961-4da4-9a11-ef6a1ef42b98\\media__1780714937504.png';

async function run() {
  try {
    // 1. Create brand-assets directory if it doesn't exist
    if (!fs.existsSync(brandAssetsPath)) {
      fs.mkdirSync(brandAssetsPath);
      console.log('Created directory brand-assets/');
    }

    // 2. Copy favicon and logo files
    const filesToCopy = [
      { src: 'favicon.ico', dest: 'favicon.ico' },
      { src: 'favicon.png', dest: 'favicon.png' },
      { src: 'apple-touch-icon.png', dest: 'apple-touch-icon.png' },
      { src: 'images/logo-white.webp', dest: 'logo-white.webp' },
      { src: 'images/logo-share.png', dest: 'logo-share.png' }
    ];

    filesToCopy.forEach(f => {
      const srcPath = path.join(workspacePath, f.src);
      const destPath = path.join(brandAssetsPath, f.dest);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${f.src} to brand-assets/${f.dest}`);
      } else {
        console.warn(`[Warning] Could not find source: ${srcPath}`);
      }
    });

    // 3. Generate brand-assets/profile-icon.png (WhatsApp/Instagram Profile - Icon Only in Gold on Dark)
    console.log('Generating brand-assets/profile-icon.png...');
    const originalFavImg = sharp(faviconInputPath);
    const metaFav = await originalFavImg.metadata();
    const { data: rgbDataFav } = await originalFavImg.raw().toBuffer({ resolveWithObject: true });
    
    // House bounding box (minX: 170, maxX: 853, minY: 94, maxY: 748) padded to 684x684 square
    const favLeft = 170;
    const favTop = 94 - 14;
    const favSize = 684;
    
    const favBuffer = Buffer.alloc(favSize * favSize * 4);
    for (let cy = 0; cy < favSize; cy++) {
      const y = favTop + cy;
      for (let cx = 0; cx < favSize; cx++) {
        const x = favLeft + cx;
        const outIdx = (cy * favSize + cx) * 4;
        
        if (y < 0 || y >= metaFav.height || x < 0 || x >= metaFav.width) {
          favBuffer[outIdx + 3] = 0;
          continue;
        }
        
        const inIdx = (y * metaFav.width + x) * metaFav.channels;
        const r = rgbDataFav[inIdx];
        const g = rgbDataFav[inIdx + 1];
        const b = rgbDataFav[inIdx + 2];
        
        const minVal = Math.min(r, Math.min(g, b));
        const alpha = minVal < 175 ? 0 : (minVal > 220 ? 255 : Math.round((minVal - 175) / 45 * 255));
        
        // Brand gold color #B8956A
        favBuffer[outIdx] = 184;
        favBuffer[outIdx + 1] = 149;
        favBuffer[outIdx + 2] = 106;
        favBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Resize the icon to 650x650 and overlay on a 1000x1000px solid dark background
    const favResized = await sharp(favBuffer, {
      raw: { width: favSize, height: favSize, channels: 4 }
    })
    .resize(650, 650)
    .png()
    .toBuffer();
    
    await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 3,
        background: { r: 26, g: 24, b: 22 }
      }
    })
    .composite([{
      input: favResized,
      blend: 'over'
    }])
    .png()
    .toFile(path.join(brandAssetsPath, 'profile-icon.png'));
    console.log('Saved brand-assets/profile-icon.png (1000x1000px)');

    // 4. Generate brand-assets/profile-full.png (WhatsApp/Instagram Profile - Full Gold Logo on Dark)
    console.log('Generating brand-assets/profile-full.png...');
    const originalFullImg = sharp(fullLogoInputPath);
    const metaFull = await originalFullImg.metadata();
    const { data: rgbDataFull } = await originalFullImg.raw().toBuffer({ resolveWithObject: true });
    
    const cropLeft = 104;
    const cropTop = 85;
    const cropWidth = 827;
    const cropHeight = 847;
    
    const fullGoldBuffer = Buffer.alloc(cropWidth * cropHeight * 4);
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
        
        fullGoldBuffer[outIdx] = 184;
        fullGoldBuffer[outIdx + 1] = 149;
        fullGoldBuffer[outIdx + 2] = 106;
        fullGoldBuffer[outIdx + 3] = alpha;
      }
    }
    
    // Resize the full logo to fit inside 1000x1000px (e.g. width = 600px, height ~614px)
    const fullLogoWidth = 600;
    const fullLogoHeight = Math.round(fullLogoWidth * cropHeight / cropWidth);
    
    const fullLogoResized = await sharp(fullGoldBuffer, {
      raw: { width: cropWidth, height: cropHeight, channels: 4 }
    })
    .resize(fullLogoWidth, fullLogoHeight)
    .png()
    .toBuffer();
    
    await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 3,
        background: { r: 26, g: 24, b: 22 }
      }
    })
    .composite([{
      input: fullLogoResized,
      blend: 'over'
    }])
    .png()
    .toFile(path.join(brandAssetsPath, 'profile-full.png'));
    console.log('Saved brand-assets/profile-full.png (1000x1000px)');
    
    console.log('\nBrand asset packaging completed successfully!');
  } catch (err) {
    console.error('Error packaging brand assets:', err);
  }
}

run();
