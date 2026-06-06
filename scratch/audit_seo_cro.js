const fs = require('fs');
const path = require('path');

const siteDir = path.join(__dirname, '..', 'Site');
const files = fs.readdirSync(siteDir).filter(f => f.endsWith('.html'));

const report = [];

report.push('# Detailed SEO & CRO Audit Report');
report.push(`*Generated on: ${new Date().toISOString()}*`);
report.push(`*Total HTML Pages Scanned: ${files.length}*\n`);

let totalWarnings = 0;

for (const file of files) {
  const filePath = path.join(siteDir, file);
  const html = fs.readFileSync(filePath, 'utf8');
  
  const fileWarnings = [];

  // 1. Check <title>
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    fileWarnings.push('**Missing `<title>` tag.**');
  } else {
    const title = titleMatch[1].trim();
    if (title.length < 30 || title.length > 70) {
      fileWarnings.push(`Title length warning: "${title}" is ${title.length} characters (ideal: 30-65 chars).`);
    }
  }

  // 2. Check meta description
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
  if (!descMatch) {
    fileWarnings.push('**Missing `<meta name="description">` tag.**');
  } else {
    const desc = descMatch[1].trim();
    if (desc.length < 100 || desc.length > 170) {
      fileWarnings.push(`Meta description length warning: ${desc.length} characters (ideal: 120-160 chars).`);
    }
  }

  // 3. Check H1
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (!h1Matches) {
    fileWarnings.push('**Missing `<h1>` tag.**');
  } else if (h1Matches.length > 1) {
    fileWarnings.push(`**Multiple `<h1>` tags found (${h1Matches.length}):** ${h1Matches.map(h => `"${h.replace(/<[^>]+>/g, '').trim()}"`).join(', ')}`);
  }

  // 4. Check images without alt
  const imgRegex = /<img\b([^>]*)/gi;
  let imgMatch;
  let imagesWithoutAlt = 0;
  let totalImages = 0;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const attributes = imgMatch[1];
    totalImages++;
    if (!attributes.includes('alt=')) {
      imagesWithoutAlt++;
    } else {
      const altContentMatch = attributes.match(/alt="([^"]*)"/i);
      if (altContentMatch && altContentMatch[1].trim() === '') {
        imagesWithoutAlt++;
      }
    }
  }
  if (imagesWithoutAlt > 0) {
    fileWarnings.push(`${imagesWithoutAlt} out of ${totalImages} images are missing descriptive ` + '`alt` attributes.');
  }

  // 5. Check Canonical link
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/i);
  if (!canonicalMatch) {
    fileWarnings.push('**Missing `<link rel="canonical">` tag.**');
  }

  // 6. Check Open Graph tags
  const ogTitle = html.match(/<meta property="og:title"/i);
  const ogDesc = html.match(/<meta property="og:description"/i);
  const ogImage = html.match(/<meta property="og:image"/i);
  const ogUrl = html.match(/<meta property="og:url"/i);

  if (!ogTitle || !ogDesc || !ogImage || !ogUrl) {
    const missingOg = [];
    if (!ogTitle) missingOg.push('og:title');
    if (!ogDesc) missingOg.push('og:description');
    if (!ogImage) missingOg.push('og:image');
    if (!ogUrl) missingOg.push('og:url');
    fileWarnings.push(`Missing Open Graph tag(s): ${missingOg.join(', ')}`);
  }

  // 7. Check JSON-LD Schema
  const schemaMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (!schemaMatches) {
    fileWarnings.push('**Missing JSON-LD structured data schema.**');
  } else {
    for (const schema of schemaMatches) {
      const jsonContent = schema.replace(/<script type="application\/ld\+json">/i, '').replace(/<\/script>/i, '').trim();
      try {
        JSON.parse(jsonContent);
      } catch (e) {
        fileWarnings.push(`**JSON-LD Schema syntax error:** ${e.message}`);
      }
    }
  }

  // 8. Local Town pages check (must have CSL/HIC licenses, specific town names, building departments details)
  if (file.startsWith('deck-builder-')) {
    const town = file.replace('deck-builder-', '').replace('-ma.html', '');
    const capitalizedTown = town.charAt(0).toUpperCase() + town.slice(1).replace('-', ' ');
    
    // Check if town name is in body
    const bodyText = html.replace(/<head>[\s\S]*<\/head>/i, '').replace(/<[^>]+>/g, ' ');
    if (!bodyText.toLowerCase().includes(town.replace('-', ' '))) {
      fileWarnings.push(`Town name "${capitalizedTown}" not found in page body.`);
    }

    // Check for CSL / HIC licenses
    if (!bodyText.includes('CS-119782') || !bodyText.includes('207906')) {
      fileWarnings.push('Missing license details (CSL CS-119782 or HIC 207906) in page content.');
    }
  }

  if (fileWarnings.length > 0) {
    report.push(`## [${file}](file:///${filePath.replace(/\\/g, '/')})`);
    for (const w of fileWarnings) {
      report.push(`- [ ] ${w}`);
      totalWarnings++;
    }
    report.push('');
  }
}

report.push(`### Total SEO/CRO/Technical Warnings Found: ${totalWarnings}`);

const reportPath = path.join(__dirname, '..', 'scratch', 'audit_report.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');
console.log(`Saved audit report to ${reportPath} with ${totalWarnings} warnings.`);
