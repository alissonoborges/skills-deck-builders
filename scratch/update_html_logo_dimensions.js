const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';

function processHtml(content, filename) {
  let updatedContent = content;

  // Replace navigation logo image dimensions to match 300x306 aspect ratio
  const navLogoRegex = /class="nav-logo-img"\s+width="\d+"\s+height="\d+"/;
  if (navLogoRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(navLogoRegex, 'class="nav-logo-img" width="300" height="306"');
  } else {
    // Try other attribute order
    const navLogoRegex2 = /width="\d+"\s+height="\d+"\s+class="nav-logo-img"/;
    if (navLogoRegex2.test(updatedContent)) {
      updatedContent = updatedContent.replace(navLogoRegex2, 'width="300" height="306" class="nav-logo-img"');
    } else {
      console.warn(`[Warning] No class="nav-logo-img" with width/height attributes found in: ${filename}`);
    }
  }

  // Replace footer logo image dimensions
  const footerLogoRegex = /class="footer-logo-img"\s+width="\d+"\s+height="\d+"/;
  if (footerLogoRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(footerLogoRegex, 'class="footer-logo-img" width="300" height="306"');
  } else {
    const footerLogoRegex2 = /width="\d+"\s+height="\d+"\s+class="footer-logo-img"/;
    if (footerLogoRegex2.test(updatedContent)) {
      updatedContent = updatedContent.replace(footerLogoRegex2, 'width="300" height="306" class="footer-logo-img"');
    } else {
      console.warn(`[Warning] No class="footer-logo-img" with width/height attributes found in: ${filename}`);
    }
  }

  // Update favicon link cache buster to ?v=3 to force reload
  const faviconRegex = /href="favicon\.ico(?:\?v=\d+)?"/;
  if (faviconRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(faviconRegex, 'href="favicon.ico?v=3"');
  } else {
    console.warn(`[Warning] No favicon.ico link found in: ${filename}`);
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
    console.log(`Updated HTML logo sizes and favicon cache-buster in: ${file}`);
  }
  console.log('HTML files successfully updated!');
}

main();
