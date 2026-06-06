const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

// Custom CSS additions for split CTA and hero trust tag
const customStyles = `
/* ==========================================================================
   SALES MACHINE & CRO UPGRADES (SPLIT MOBILE CTA & TRUST BADGES)
   ========================================================================== */
.hero-trust-tag {
  margin-top: 1.5rem;
  font-family: var(--font-secondary);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  animation: fadeIn 1s ease-out 0.5s both;
}
.hero-trust-tag .badge {
  background: var(--accent);
  color: var(--color-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  display: inline-block;
}
.hero-trust-tag a {
  color: var(--accent-light);
  text-decoration: underline;
}
.hero-trust-tag a:hover {
  color: var(--accent);
}

/* Split Mobile CTA styling override */
@media (max-width: 768px) {
  .sticky-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(18, 18, 18, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex !important;
    gap: 10px;
    padding: 12px 16px;
    z-index: 10000;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
  }
  .sticky-cta .btn-primary,
  .sticky-cta .btn-secondary {
    flex: 1;
    text-align: center;
    padding: 12px 8px;
    font-size: 0.85rem;
    font-weight: 700;
    border-radius: 6px;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
    height: auto !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .sticky-cta .btn-primary {
    background: var(--accent);
    color: var(--color-bg);
    border: none;
  }
  .sticky-cta .btn-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
  body {
    padding-bottom: 74px !important; /* avoid overlapping content */
  }
}
`;

// Append CSS to styles.css (only if not already appended)
const cssPath = path.join(siteDir, 'css', 'styles.css');
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('SALES MACHINE & CRO UPGRADES')) {
    fs.writeFileSync(cssPath, css + '\n' + customStyles, 'utf8');
    console.log('Successfully appended custom CRO styles to styles.css');
  }
}

// 6 general reviews from the parent brand (Skills Renovation) to inject
const parentBrandReviews = [
  {
    author: 'Sarah L.',
    location: 'Needham, MA',
    project: 'Bathroom Remodeling',
    date: '2024-09-02',
    text: 'We recently completed a master bathroom remodel with Skills Renovation. The project was handled with absolute professionalism, and Lucas and John were fantastic partners throughout. They were incredibly supportive and proactive, always ensuring our vision was met.',
    image: 'images/covered-outdoor-living.webp', // fallback placeholder
    alt: 'Master bathroom remodeling project'
  },
  {
    author: 'Rebecca T.',
    location: 'Newton, MA',
    project: 'Basement Finishing',
    date: '2024-08-28',
    text: 'Working with the skills team was a pleasure. They came to renovate my basement and I just fell in love with the accent wall that Lucas suggested. Lucas is very responsive and walked extra steps to make sure every step was perfect.',
    image: 'images/about-craftsmanship.webp',
    alt: 'Basement finishing project'
  },
  {
    author: 'Donald P.',
    location: 'Maynard, MA',
    project: 'Home Additions',
    date: '2024-07-15',
    text: 'Skills Renovation was an absolute pleasure to work with. They were, by far, the best contractor I\\\'ve ever used. Their craftsmanship is excellent; they take their timelines very seriously and communicate well. John and the entire team sincerely appreciate the recognition.',
    image: 'images/portfolio-weston.webp',
    alt: 'Home addition construction'
  },
  {
    author: 'Caroline S.',
    location: 'Acton, MA',
    project: 'Guest Bathroom',
    date: '2024-06-20',
    text: 'Skills Renovation recently redid our small guest bathroom and we cannot recommend them enough! We had a small, hard space to work with on top of non-functional shower and vent. Skills Renovation came in and did the work professionally.',
    image: 'images/outdoor-kitchen.webp',
    alt: 'Guest bathroom layout'
  },
  {
    author: 'Kevin H.',
    location: 'Wellesley, MA',
    project: 'Kitchen Remodeling',
    date: '2024-05-12',
    text: 'Lucas and his team did a fantastic job on my kitchen. Just tell Lucas what you need, he will make it happen! Highly recommend for anyone looking for reliability and quality.',
    image: 'images/portfolio-wellesley.webp',
    alt: 'Kitchen renovation project'
  },
  {
    author: 'Emily R.',
    location: 'Weston, MA',
    project: 'Carport & Outdoor Structure',
    date: '2024-04-05',
    text: 'We hired Skills Renovation to build a custom two-car carport. Lucas is very responsive and on top of everything. The structure is excellent and the carpentry details are well done.',
    image: 'images/custom-deck.webp',
    alt: 'Carport and outdoor structure construction'
  }
];

const allReviewsList = [
  // Existing deck builder reviews
  {
    author: 'Ashley K.',
    location: 'Wellesley, MA',
    project: 'Composite Deck',
    date: '2024-08-15',
    text: 'We love our new deck! The composite materials and white railings look beautiful. Lucas handled all town permits and inspections without any issues.',
    image: 'images/portfolio-wellesley.webp',
    alt: 'Custom deck with integrated lighting project in Wellesley, MA'
  },
  {
    author: 'Arthur G.',
    location: 'Weston, MA',
    project: 'Custom Deck Build',
    date: '2024-07-22',
    text: 'Outstanding craftsmanship. The stairs and built-in lighting make the deck look amazing at night. Great value for the investment.',
    image: 'images/outdoor-kitchen.webp',
    alt: 'Outdoor kitchen and deck project in Weston, MA'
  },
  {
    author: 'Ryan M.',
    location: 'Newton, MA',
    project: 'Deck Construction',
    date: '2024-06-10',
    text: 'Fast, professional, and the finish was top-notch. Lucas Terra is by far the best contractor we\'ve hired in MetroWest.',
    image: 'images/custom-deck.webp',
    alt: 'Deck replacement project in Newton, MA'
  },
  {
    author: 'Juliana F.',
    location: 'Concord, MA',
    project: 'Home Renovation & Decks',
    date: '2024-05-18',
    text: 'Responsive, detailed, and completely professional. Lucas and the team at Skills are absolute experts.',
    image: 'images/covered-outdoor-living.webp',
    alt: 'Covered porch with fireplace project in Concord, MA'
  },
  {
    author: 'Matthew B.',
    location: 'Brookline, MA',
    project: 'Composite Deck & Stairs',
    date: '2024-04-30',
    text: 'Strong framing, clean lines, and sturdy railings. Built to code and passed inspection easily. Will hire again.',
    image: 'images/poolside-deck.webp',
    alt: 'Poolside deck transformation in Brookline, MA'
  },
  {
    author: 'David H.',
    location: 'Sudbury, MA',
    project: 'Deck Construction & Details',
    date: '2024-03-12',
    text: 'By far the best contractor I have ever used. Reliable, communicative, and the quality of craftsmanship is exceptional.',
    image: 'images/portfolio-chestnuthill.webp',
    alt: 'Custom multi-level deck project in Sudbury, MA'
  },
  // New parent brand reviews
  ...parentBrandReviews.map(r => ({
    ...r,
    text: r.text.replace(/\\'/g, "'") // unescape quote
  }))
];

// Helper to update the reviews page
function updateReviewsPage() {
  const filePath = path.join(siteDir, 'reviews.html');
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');

  // 1. Update JSON-LD
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;
  const match = content.match(schemaRegex);
  if (match) {
    try {
      const schema = JSON.parse(match[1].trim());
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": allReviewsList.length.toString(),
        "reviewCount": allReviewsList.length.toString()
      };
      schema.review = allReviewsList.map(r => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": r.author
        },
        "datePublished": r.date,
        "reviewBody": r.text,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }));

      const newJson = JSON.stringify(schema, null, 2);
      const paddedJson = newJson.split('\n').map((line, idx) => idx === 0 ? '  ' + line : '    ' + line).join('\n');
      content = content.replace(schemaRegex, `<script type="application/ld+json">\n${paddedJson}\n  </script>`);
    } catch (e) {
      console.error('Error updating JSON-LD schema on reviews.html:', e.message);
    }
  }

  // 2. Update reviews-grid in reviews.html
  const gridStartStr = '<div class="reviews-grid">';
  const gridStart = content.indexOf(gridStartStr);
  const gridEnd = content.indexOf('</div>\n      </div>\n    </section>\n\n\n    <!-- ============================================');
  
  if (gridStart !== -1 && gridEnd !== -1) {
    let newGridHtml = `<div class="reviews-grid">\n`;
    allReviewsList.forEach((r, idx) => {
      newGridHtml += `
          <!-- Review ${idx + 1} -->
          <article class="review-card reveal">
            <figure class="review-card-image">
              <img src="${r.image}" alt="${r.alt}" loading="lazy" width="1024" height="1024">
            </figure>
            <div class="review-card-content">
              <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote class="testimonial-quote">
                <p>${r.text}</p>
              </blockquote>
              <div class="testimonial-author">
                <span class="testimonial-name">${r.author}</span>
                <span class="testimonial-location">${r.location}</span>
                <span class="testimonial-project">Project: ${r.project}</span>
              </div>
            </div>
          </article>\n`;
    });
    content = content.substring(0, gridStart) + newGridHtml + content.substring(gridEnd);
  }

  // 3. Add parent brand trust banner to reviews.html
  if (!content.includes('division-trust-banner')) {
    const parentTrustSection = `
    <!-- ============================================
         PARENT BRAND TRUST SIGNAL
    ============================================= -->
    <section class="section division-trust-banner" style="background: var(--color-bg); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div class="container reveal" style="max-width: 900px; text-align: center;">
        <span class="subtitle" style="display: block; margin-bottom: 1rem;">SHARED REP &amp; LICENSING</span>
        <h2 style="font-family: var(--font-primary); font-size: 2.2rem; color: #fff; margin-bottom: 1rem;">A Division of Skills Renovation</h2>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 1.5rem;">Skills Deck Builders operates as the specialty carpentry and outdoor living division of <strong>Skills Renovation</strong>. We share the same licensed building crews, rigorous engineering standards, and 5-star reputation of over 67+ verified local reviews.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <span style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">CSL CS-119782</span>
          <span style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">HIC 207906</span>
        </div>
        <a href="https://skillsrenovation.com" target="_blank" rel="noopener noreferrer" class="btn-secondary">Visit Skills Renovation</a>
      </div>
    </section>
`;
    // Insert after rating-summary section
    const ratingSummaryEnd = content.indexOf('</section>\n\n\n    <!-- ============================================', content.indexOf('id="rating-summary"'));
    if (ratingSummaryEnd !== -1) {
      content = content.substring(0, ratingSummaryEnd + 12) + parentTrustSection + content.substring(ratingSummaryEnd + 12);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated reviews.html with 6 extra reviews and trust banner.');
}

// Update reviews.html first
updateReviewsPage();

// 3. Process all HTML pages to:
//   a) Insert split mobile CTA
//   b) Insert hero trust tags (for index.html and town pages)
//   c) Update footer text with Division info
files.forEach(file => {
  const filePath = path.join(siteDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  let originalContent = content;

  // a) Update footer brand paragraph to add the "A Division of..." link
  const footerTextSearch = '<p class="footer-text">Premium outdoor living design and construction for Massachusetts\' finest homes.</p>';
  const footerTextReplace = '<p class="footer-text">A Division of <a href="https://skillsrenovation.com" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">Skills Renovation</a>. Premium outdoor living design and construction for Massachusetts\' finest homes.</p>';
  if (content.includes(footerTextSearch)) {
    content = content.split(footerTextSearch).join(footerTextReplace);
  }

  // b) Insert Hero trust tag on index.html and town pages
  if (file === 'index.html') {
    const homeCtas = `<div class="hero-ctas">
        <a href="contact.html" class="btn-primary btn-lg">Schedule Your Design Consultation</a>
        <a href="portfolio.html" class="btn-secondary btn-lg">View Our Portfolio</a>
      </div>`;
    const homeCtasReplace = homeCtas + `\n      <p class="hero-trust-tag"><span class="badge">A Division of <a href="https://skillsrenovation.com" target="_blank" rel="noopener noreferrer" style="color: var(--accent-light);">Skills Renovation</a></span> • Licensed CSL CS-119782 &amp; HIC 207906 • 5.0 Star Rated Contractor</p>`;
    if (content.includes(homeCtas) && !content.includes('hero-trust-tag')) {
      content = content.split(homeCtas).join(homeCtasReplace);
    }
  } else if (file.startsWith('deck-builder-')) {
    const town = file.replace('deck-builder-', '').replace('-ma.html', '');
    const capitalizedTown = town.charAt(0).toUpperCase() + town.slice(1).replace('-', ' ');
    
    const townSubtitleSearch = `<span class="hero-subtitle">PREMIUM DECK BUILDER IN ${town.toUpperCase().replace('-', ' ')}, MA</span>`;
    const townSubtitleReplace = `<span class="hero-subtitle">PREMIUM DECK BUILDER IN ${town.toUpperCase().replace('-', ' ')}, MA</span>`;
    
    const townHeroEnd = `<p>Architectural deck construction and covered outdoor living spaces designed for your estate.</p>`;
    const townHeroEndReplace = townHeroEnd + `\n      <p class="hero-trust-tag"><span class="badge">A Division of <a href="https://skillsrenovation.com" target="_blank" rel="noopener noreferrer" style="color: var(--accent-light);">Skills Renovation</a></span> • Wellesley, Newton &amp; Weston Custom Deck Specialists</p>`;
    if (content.includes(townHeroEnd) && !content.includes('hero-trust-tag')) {
      content = content.split(townHeroEnd).join(townHeroEndReplace);
    }
  }

  // c) Replace sticky mobile CTA with the new split layout
  const newStickyCta = `  <!-- ============================================
       STICKY MOBILE CTA
  ============================================= -->
  <div class="sticky-cta" id="sticky-cta">
    <a href="tel:+16174750928" class="btn-secondary sticky-cta-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      Call Now
    </a>
    <a href="contact.html" class="btn-primary sticky-cta-btn">Consultation</a>
  </div>`;

  // Find if sticky-cta already exists in the file, replace it. Otherwise insert right before </body>
  const stickyCtaRegex = /<!-- ============================================[\s]*STICKY MOBILE CTA[\s\S]*?<\/div>/i;
  if (stickyCtaRegex.test(content)) {
    content = content.replace(stickyCtaRegex, newStickyCta);
  } else {
    // Insert before </body>
    const bodyEndIdx = content.indexOf('</body>');
    if (bodyEndIdx !== -1) {
      content = content.substring(0, bodyEndIdx) + '\n' + newStickyCta + '\n' + content.substring(bodyEndIdx);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated sales machine CTAs and footer brand link in: ${file}`);
  }
});

console.log('Site-wide Sales Machine and CRO upgrades completed.');
