const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');

const cityPages = [
  { file: 'deck-builder-wellesley-ma.html', town: 'Wellesley' },
  { file: 'deck-builder-weston-ma.html', town: 'Weston' },
  { file: 'deck-builder-chestnut-hill-ma.html', town: 'Chestnut Hill' },
  { file: 'deck-builder-brookline-ma.html', town: 'Brookline' },
  { file: 'deck-builder-newton-ma.html', town: 'Newton' },
  { file: 'deck-builder-sudbury-ma.html', town: 'Sudbury' },
  { file: 'deck-builder-dover-ma.html', town: 'Dover' },
  { file: 'deck-builder-lincoln-ma.html', town: 'Lincoln' },
  { file: 'deck-builder-concord-ma.html', town: 'Concord' },
  { file: 'deck-builder-lexington-ma.html', town: 'Lexington' },
  { file: 'deck-builder-needham-ma.html', town: 'Needham' },
  { file: 'deck-builder-wayland-ma.html', town: 'Wayland' },
  { file: 'deck-builder-winchester-ma.html', town: 'Winchester' }
];

cityPages.forEach(p => {
  const filePath = path.join(siteDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${p.file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  const originalContent = content;

  // 1. Update Title Tag to be 100% complete
  const oldTitleRegex = /<title>([\s\S]*?)<\/title>/i;
  const newTitle = `${p.town} Deck Builder | Custom Composite Decks | Skills Deck Builders`;
  content = content.replace(oldTitleRegex, `<title>${newTitle}</title>`);

  // 2. Update og:title
  const ogTitleRegex = /<meta property="og:title" content="([^"]*)"/i;
  content = content.replace(ogTitleRegex, `<meta property="og:title" content="${newTitle}"`);

  // 3. Make sure local decking materials (Trex, TimberTech, AZEK) are prominently highlighted
  const materialsParagraph = `<p>We specialize in premium materials, including Trex composite decking, TimberTech AZEK PVC polymer boards, and custom metal railings. These materials are built to withstand New England weather, maintaining their color and structural integrity without splintering, rotting, or fading.</p>`;
  
  // Let's insert this materials paragraph right after the second paragraph of the introduction if it's not already there
  const introSearchStr = 'rotting, or fading.</p>';
  if (!content.includes('Trex composite decking') && !content.includes('TimberTech AZEK')) {
    const splitTextEnd = content.indexOf('</p>', content.indexOf('<div class="split-text">'));
    if (splitTextEnd !== -1) {
      const nextParagraphStart = content.indexOf('<p>', splitTextEnd);
      if (nextParagraphStart !== -1) {
        content = content.substring(0, nextParagraphStart) + materialsParagraph + '\n            ' + content.substring(nextParagraphStart);
        console.log(`Added materials paragraph to ${p.file}`);
      }
    }
  }

  // 4. Update Schema.org address details to make sure it includes telephone and rating
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;
  const schemaMatch = content.match(schemaRegex);
  if (schemaMatch) {
    try {
      const schema = JSON.parse(schemaMatch[1].trim());
      // Enrich schema
      schema.name = "Skills Deck Builders";
      schema.telephone = "(617) 475-0928";
      schema.priceRange = "$$$$";
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "12",
        "reviewCount": "12"
      };
      
      const newJson = JSON.stringify(schema, null, 2);
      const paddedJson = newJson.split('\n').map((line, idx) => idx === 0 ? '  ' + line : '    ' + line).join('\n');
      content = content.replace(schemaRegex, `<script type="application/ld+json">\n${paddedJson}\n  </script>`);
    } catch (e) {
      console.error(`Error parsing schema on ${p.file}:`, e.message);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Optimized title, SEO keywords, and schema in ${p.file}`);
  }
});

console.log('Regional SEO and keywords updates completed.');
