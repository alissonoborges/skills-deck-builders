const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

const newFooterHtml = `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">

        <div class="footer-col footer-col-brand">
          <div class="footer-logo">
            <img src="images/logo-white.webp" alt="Skills Deck Builders Logo" class="footer-logo-img" width="300" height="306">
          </div>
          <p class="footer-text">Premium outdoor living design and construction for Massachusetts' finest homes.</p>
          <div class="footer-contact">
            <a href="tel:+16174750928" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>(617) 475-0928</span>
            </a>
            <a href="mailto:skillsdecks@gmail.com" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>skillsdecks@gmail.com</span>
            </a>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="contact-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Wellesley, MA</span>
            </div>
          </div>
        </div>

        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="portfolio.html">Portfolio</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="areas-we-serve.html">Areas Served</a></li>
            <li><a href="process.html">Process</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="reviews.html">Reviews</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul class="footer-links">
            <li><a href="custom-decks.html">Custom Decks</a></li>
            <li><a href="covered-porches.html">Covered Porches</a></li>
            <li><a href="outdoor-kitchens.html">Outdoor Kitchens</a></li>
            <li><a href="poolside-decks.html">Poolside Decks</a></li>
            <li><a href="railings-lighting.html">Railings &amp; Lighting</a></li>
            <li><a href="deck-replacement.html">Deck Replacement</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Areas We Serve</h4>
          <ul class="footer-areas">
            <li><a href="deck-builder-wellesley-ma.html">Wellesley</a></li>
            <li><a href="deck-builder-weston-ma.html">Weston</a></li>
            <li><a href="deck-builder-chestnut-hill-ma.html">Chestnut Hill</a></li>
            <li><a href="deck-builder-brookline-ma.html">Brookline</a></li>
            <li><a href="deck-builder-newton-ma.html">Newton</a></li>
            <li><a href="deck-builder-sudbury-ma.html">Sudbury</a></li>
            <li><a href="deck-builder-dover-ma.html">Dover</a></li>
            <li><a href="deck-builder-lincoln-ma.html">Lincoln</a></li>
            <li><a href="deck-builder-concord-ma.html">Concord</a></li>
            <li><a href="deck-builder-lexington-ma.html">Lexington</a></li>
            <li><a href="deck-builder-needham-ma.html">Needham</a></li>
            <li><a href="deck-builder-wayland-ma.html">Wayland</a></li>
            <li><a href="deck-builder-winchester-ma.html">Winchester</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Skills Deck Builders. All rights reserved.</p>
        <p class="footer-licenses">CSL CS-119782 &bull; HIC 207906 &bull; Wellesley, MA</p>
      </div>
    </div>
  </footer>`;

for (const file of files) {
  const filePath = path.join(siteDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Replace the entire <footer ...> ... </footer> block
  const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/;
  if (footerRegex.test(html)) {
    html = html.replace(footerRegex, newFooterHtml);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Updated footer in ${file}`);
  } else {
    console.log(`Warning: No footer tag found in ${file}`);
  }
}

console.log('All files updated successfully.');
