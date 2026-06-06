const fs = require('fs');
const path = require('path');

const sitePath = path.join(__dirname, '..');
const files = fs.readdirSync(sitePath).filter(f => f.endsWith('.html'));

let totalLinksChecked = 0;
let deadLinksFound = 0;
let totalImagesChecked = 0;
let missingImagesFound = 0;

files.forEach((file) => {
  const filePath = path.join(sitePath, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Check Link hrefs
  const hrefRegex = /href="([^"]+)"/g;
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    
    // Ignore external URLs, hashes, tel, mailto
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      continue;
    }

    totalLinksChecked++;
    
    // Split hash and query parameters (e.g., "favicon.ico?v=4")
    const cleanHref = href.split('#')[0].split('?')[0];
    if (cleanHref === '') continue;

    const targetPath = path.join(sitePath, cleanHref);
    
    if (!fs.existsSync(targetPath)) {
      console.error(`Dead Link Found in [${file}]: "${href}" (File does not exist: ${cleanHref})`);
      deadLinksFound++;
    }
  }

  // 2. Check <img> src attributes
  const imgRegex = /<img\b[^>]*\bsrc="([^"]+)"/gi;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1].split('?')[0];

    if (src.startsWith('http') || src === '') {
      continue;
    }

    totalImagesChecked++;

    const targetPath = path.join(sitePath, src);
    if (!fs.existsSync(targetPath)) {
      console.error(`Missing Image Found in [${file}]: "${src}" (File does not exist at: ${targetPath})`);
      missingImagesFound++;
    }
  }

  // 3. Check inline style background-images
  const bgRegex = /url\(['"]?(images\/[^'")\s]+)['"]?\)/gi;
  while ((match = bgRegex.exec(content)) !== null) {
    const src = match[1].split('?')[0];
    totalImagesChecked++;

    const targetPath = path.join(sitePath, src);
    if (!fs.existsSync(targetPath)) {
      console.error(`Missing Background Image Found in [${file}]: "${src}" (File does not exist at: ${targetPath})`);
      missingImagesFound++;
    }
  }
});

console.log(`\n--- Verification Summary ---`);
console.log(`Total HTML files checked: ${files.length}`);
console.log(`Total internal links verified: ${totalLinksChecked}`);
console.log(`Total image assets verified: ${totalImagesChecked}`);

if (deadLinksFound === 0 && missingImagesFound === 0) {
  console.log(`\n[SUCCESS] 0 dead links and 0 missing image assets found! The site is fully verified.`);
} else {
  console.log(`\n[FAILURE] Found ${deadLinksFound} dead link(s) and ${missingImagesFound} missing image(s).`);
  process.exit(1);
}
