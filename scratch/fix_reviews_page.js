const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'reviews.html');
if (!fs.existsSync(filePath)) {
  console.error(`reviews.html not found at: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Remove the duplicate grid section
const gridIndex = content.lastIndexOf('<section class="section section-dark" id="testimonials">');
if (gridIndex !== -1) {
  const sectionEnd = content.indexOf('</section>', gridIndex);
  if (sectionEnd !== -1) {
    const startOfSection = content.lastIndexOf('<!-- ============================================', gridIndex);
    if (startOfSection !== -1 && startOfSection > 330) {
      console.log('Removing duplicate testimonials section...');
      content = content.substring(0, startOfSection) + content.substring(sectionEnd + 10);
    }
  }
}

// 2. Remove "reveal" class from `<article class="review-card reveal">` inside the remaining grid
content = content.split('<article class="review-card reveal">').join('<article class="review-card">');

// 3. Make division-trust-banner dark
content = content.split('class="section division-trust-banner"').join('class="section section-dark division-trust-banner"');
content = content.split('style="background: var(--color-bg); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);"').join('style="border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);"');

// 4. Update the Google Reviews rating-badge in the rating summary block to be a link
const oldBadgeRegex = /<div class="rating-badge">[\s\S]*?<\/div>/i;
const newBadge = `<a href="https://share.google/029lxAeXUFAfLYXJa" target="_blank" rel="noopener noreferrer" class="rating-badge" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <span>View Google Reviews</span>
          </a>`;

content = content.replace(oldBadgeRegex, newBadge);
console.log('Successfully made Google Reviews badge clickable.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('reviews.html fix completed.');
