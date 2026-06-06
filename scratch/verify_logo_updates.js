const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const htmlFiles = fs.readdirSync(workspacePath).filter(f => f.endsWith('.html'));

const logoShareUrl = 'https://skills-deck-builders.vercel.app/images/logo-share.png';

let successCount = 0;
let failCount = 0;

console.log(`Auditing ${htmlFiles.length} HTML files...`);

// Helper check if a type represents a business or organization
function isTargetType(typeStr) {
  if (typeof typeStr !== 'string') return false;
  return typeStr === 'LocalBusiness' || 
         typeStr === 'Organization' || 
         typeStr === 'HomeAndConstructionBusiness' || 
         typeStr.includes('Business') || 
         typeStr.includes('Organization');
}

// Check if target type exists recursively
function hasBusinessSchema(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  if (Array.isArray(obj)) {
    return obj.some(hasBusinessSchema);
  }
  if (isTargetType(obj['@type'])) {
    return true;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (hasBusinessSchema(obj[key])) return true;
    }
  }
  return false;
}

// Verify logo exists recursively and has the correct URL
function verifyLogoUrl(obj) {
  if (typeof obj !== 'object' || obj === null) return true;
  if (Array.isArray(obj)) {
    return obj.every(verifyLogoUrl);
  }
  
  if (isTargetType(obj['@type'])) {
    if (obj.logo !== logoShareUrl) {
      return false;
    }
  }
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!verifyLogoUrl(obj[key])) return false;
    }
  }
  return true;
}

for (const file of htmlFiles) {
  const filePath = path.join(workspacePath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // 1. Verify nav logo image tag
  if (!content.includes('images/logo-white.webp') || !content.includes('class="nav-logo-img"')) {
    errors.push('Missing navigation logo image tag or class');
  }

  // 2. Verify footer logo image tag
  if (!content.includes('class="footer-logo-img"')) {
    errors.push('Missing footer logo image tag or class');
  }

  // 3. Verify Open Graph image
  if (!content.includes(`content="${logoShareUrl}"`)) {
    errors.push('Missing or incorrect og:image content URL');
  }
  if (!content.includes('property="og:image:secure_url"')) {
    errors.push('Missing og:image:secure_url tag');
  }
  if (!content.includes('property="og:image:width" content="1200"')) {
    errors.push('Missing og:image:width 1200 tag');
  }

  // 4. Verify JSON-LD Schema logo if a business schema is present
  const scriptRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let fileHasBusinessSchema = false;
  let fileHasCorrectLogo = true;

  scriptRegex.lastIndex = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    const scriptBody = match[1];
    try {
      const jsonObj = JSON.parse(scriptBody.trim());
      if (hasBusinessSchema(jsonObj)) {
        fileHasBusinessSchema = true;
        if (!verifyLogoUrl(jsonObj)) {
          fileHasCorrectLogo = false;
        }
      }
    } catch (e) {
      errors.push(`JSON-LD Parse Error: ${e.message}`);
    }
  }

  if (fileHasBusinessSchema && !fileHasCorrectLogo) {
    errors.push('Missing or incorrect "logo" parameter in JSON-LD business schema');
  }

  if (errors.length > 0) {
    console.error(`\n[FAIL] ${file} has errors:`);
    errors.forEach(err => console.error(`  - ${err}`));
    failCount++;
  } else {
    successCount++;
  }
}

console.log(`\nAudit Summary:`);
console.log(`- Files Checked: ${htmlFiles.length}`);
console.log(`- Files Passed: ${successCount}`);
console.log(`- Files Failed: ${failCount}`);

if (failCount === 0) {
  console.log('\n[SUCCESS] All HTML files verified successfully!');
} else {
  process.exit(1);
}
