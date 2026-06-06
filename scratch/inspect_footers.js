const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

let footerBrandColumns = {};
for (const file of files) {
  const filePath = path.join(siteDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const match = html.match(/<div class="footer-col footer-col-brand">([\s\S]*?)<\/div>\s*<div class="footer-col">/);
  if (match) {
    const brandCol = match[1].trim().replace(/\r\n/g, '\n');
    if (!footerBrandColumns[brandCol]) {
      footerBrandColumns[brandCol] = [];
    }
    footerBrandColumns[brandCol].push(file);
  } else {
    console.log(`No brand column matched in ${file}`);
  }
}

for (const [col, fileList] of Object.entries(footerBrandColumns)) {
  console.log(`\n--- Brand Column (${fileList.length} files: ${fileList.slice(0, 5).join(', ')}) ---`);
  console.log(col);
}
