const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';

function main() {
  const files = fs.readdirSync(workspacePath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  console.log(`Found ${htmlFiles.length} HTML files to update.`);

  for (const file of htmlFiles) {
    const filePath = path.join(workspacePath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update logo image dimensions (width="400" height="351" -> width="300" height="30")
    // Let's use regex to match the image tag for logo-white.webp in both nav and footer
    const logoRegex = /<img\s+src="images\/logo-white\.webp"\s+alt="Skills\s+Deck\s+Builders\s+Logo"\s+class="(nav-logo-img|footer-logo-img)"\s+width="400"\s+height="351">/g;
    
    if (logoRegex.test(content)) {
      content = content.replace(logoRegex, (match, className) => {
        return `<img src="images/logo-white.webp" alt="Skills Deck Builders Logo" class="${className}" width="300" height="30">`;
      });
      console.log(`[Logo Dimensions Updated] ${file}`);
    }

    // 2. Add version query to favicon.ico to force browser refresh (cache-buster)
    // href="favicon.ico" -> href="favicon.ico?v=2"
    // Also support checking if it already has a query
    const faviconRegex = /href="favicon\.ico(\?v=\d+)?"/g;
    if (faviconRegex.test(content)) {
      content = content.replace(faviconRegex, 'href="favicon.ico?v=2"');
      console.log(`[Favicon Cache-Buster Added] ${file}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
  }

  console.log('HTML files updated successfully!');
}

main();
