const fs = require('fs');
const path = require('path');

const sitePath = 'C:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\Site';

const oldGoogleLink = 'https://share.google/aK3haDsa1MVDlQ4Aw';
const newGoogleLink = 'https://share.google/029lxAeXUFAfLYXJa';

// 1. Define the real reviews data
const realReviews = [
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
  }
];

function updateIndexHtml() {
  const filePath = path.join(sitePath, 'index.html');
  let content = fs.readFileSync(filePath, 'utf8');

  // Normalize newlines to LF for consistent matching
  content = content.replace(/\r\n/g, '\n');

  // Replace testimonials grid in index.html
  const startStr = '<div class="testimonials-grid">';
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf('</div>\n\n        <div class="section-cta">', startIdx);
  
  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find testimonials grid in index.html. start:', startIdx, 'end:', endIdx);
    return;
  }

  const newTestimonialsHtml = `<div class="testimonials-grid">

          <article class="testimonial-card">
            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote class="testimonial-quote">
              <p>${realReviews[0].text}</p>
            </blockquote>
            <div class="testimonial-author">
              <span class="testimonial-name">${realReviews[0].author}</span>
              <span class="testimonial-location">${realReviews[0].location}</span>
              <span class="testimonial-project">${realReviews[0].project}</span>
            </div>
          </article>

          <article class="testimonial-card">
            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote class="testimonial-quote">
              <p>${realReviews[1].text}</p>
            </blockquote>
            <div class="testimonial-author">
              <span class="testimonial-name">${realReviews[1].author}</span>
              <span class="testimonial-location">${realReviews[1].location}</span>
              <span class="testimonial-project">${realReviews[1].project}</span>
            </div>
          </article>

          <article class="testimonial-card">
            <div class="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote class="testimonial-quote">
              <p>${realReviews[2].text}</p>
            </blockquote>
            <div class="testimonial-author">
              <span class="testimonial-name">${realReviews[2].author}</span>
              <span class="testimonial-location">${realReviews[2].location}</span>
              <span class="testimonial-project">${realReviews[2].project}</span>
            </div>
          </article>`;

  content = content.substring(0, startIdx) + newTestimonialsHtml + content.substring(endIdx);
  
  // Replace Google Review link
  content = content.split(oldGoogleLink).join(newGoogleLink);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated index.html reviews');
}

function updateReviewsHtml() {
  const filePath = path.join(sitePath, 'reviews.html');
  let content = fs.readFileSync(filePath, 'utf8');

  // Normalize newlines to LF
  content = content.replace(/\r\n/g, '\n');

  // 1. Update JSON-LD schema
  const scriptStart = content.indexOf('<script type="application/ld+json">');
  const scriptEnd = content.indexOf('</script>', scriptStart);
  
  if (scriptStart !== -1 && scriptEnd !== -1) {
    const jsonLdBody = content.substring(scriptStart + 35, scriptEnd).trim();
    try {
      const schema = JSON.parse(jsonLdBody);
      schema.review = realReviews.map(r => ({
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
      
      const formattedJson = JSON.stringify(schema, null, 2);
      const lines = formattedJson.split('\n');
      const paddedLines = lines.map((line, idx) => idx === 0 ? '  ' + line : '    ' + line);
      
      const newScript = `<script type="application/ld+json">\n${paddedLines.join('\n')}\n  </script>`;
      content = content.substring(0, scriptStart) + newScript + content.substring(scriptEnd + 9);
    } catch (err) {
      console.error('Error parsing JSON-LD in reviews.html:', err.message);
    }
  }

  // 2. Update reviews grid HTML in reviews.html
  const gridStart = content.indexOf('<div class="reviews-grid">');
  const gridEnd = content.indexOf('</div>\n      </div>\n    </section>', gridStart);
  
  if (gridStart === -1 || gridEnd === -1) {
    console.error('Could not find reviews-grid in reviews.html. start:', gridStart, 'end:', gridEnd);
    return;
  }

  let newGridHtml = `<div class="reviews-grid">\n`;
  realReviews.forEach((r, idx) => {
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
  
  // Replace Google Review link
  content = content.split(oldGoogleLink).join(newGoogleLink);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated reviews.html reviews & JSON-LD');
}

function updateAllGoogleLinks() {
  const files = fs.readdirSync(sitePath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    const filePath = path.join(sitePath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldGoogleLink)) {
      content = content.split(oldGoogleLink).join(newGoogleLink);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated Google Business link in: ${file}`);
    }
  });
}

updateIndexHtml();
updateReviewsHtml();
updateAllGoogleLinks();
