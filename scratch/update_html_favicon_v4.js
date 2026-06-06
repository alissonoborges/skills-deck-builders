const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';

function processHtml(content, filename) {
  let updatedContent = content;

  // Update favicon link cache buster to ?v=4 to force reload
  const faviconRegex = /href="favicon\.ico\?v=3"/;
  if (faviconRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(faviconRegex, 'href="favicon.ico?v=4"');
  } else {
    // Try without query param or other versions
    const faviconRegex2 = /href="favicon\.ico(?:\?v=\d+)?"/;
    if (faviconRegex2.test(updatedContent)) {
      updatedContent = updatedContent.replace(faviconRegex2, 'href="favicon.ico?v=4"');
    } else {
      console.warn(`[Warning] No favicon.ico link found in: ${filename}`);
    }
  }

  return updatedContent;
}

function main() {
  const files = fs.readdirSync(workspacePath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  console.log(`Found ${htmlFiles.length} HTML files to update.`);

  for (const file of htmlFiles) {
    const filePath = path.join(workspacePath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = processHtml(content, file);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated favicon cache-buster to v=4 in: ${file}`);
  }
  console.log('HTML files successfully updated!');
}

main();
