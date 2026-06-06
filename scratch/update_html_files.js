const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';
const logoWebpPath = 'images/logo-white.webp';
const logoShareUrl = 'https://skills-deck-builders.vercel.app/images/logo-share.png';

// 1. Navigation Logo Replacement Regex and Content
const navLogoRegex = /<a\s+href="index\.html"\s+class="nav-logo">([\s\S]*?)<\/a>/;
const navLogoReplacement = `<a href="index.html" class="nav-logo">
      <img src="${logoWebpPath}" alt="Skills Deck Builders Logo" class="nav-logo-img" width="400" height="351">
    </a>`;

// 2. Footer Logo Replacement Regex and Content
const footerLogoRegex = /<div\s+class="footer-logo">([\s\S]*?)<\/div>/;
const footerLogoReplacement = `<div class="footer-logo">
            <img src="${logoWebpPath}" alt="Skills Deck Builders Logo" class="footer-logo-img" width="400" height="351">
          </div>`;

// 3. Open Graph Image Tag Replacement
const ogImageRegex = /<meta\s+property="og:image"\s+content="[^"]+">/;
const ogImageReplacement = `<meta property="og:image" content="${logoShareUrl}">
  <meta property="og:image:secure_url" content="${logoShareUrl}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="1200">
  <meta property="og:image:alt" content="Skills Deck Builders Logo">`;

// Helper check if a type represents a business or organization
function isTargetType(typeStr) {
  if (typeof typeStr !== 'string') return false;
  return typeStr === 'LocalBusiness' || 
         typeStr === 'Organization' || 
         typeStr === 'HomeAndConstructionBusiness' || 
         typeStr.includes('Business') || 
         typeStr.includes('Organization');
}

// Recursive function to add logo to any target business/organization object
function addLogoToBusiness(obj) {
  if (typeof obj !== 'object' || obj === null) return;
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      addLogoToBusiness(item);
    }
  } else {
    if (isTargetType(obj['@type'])) {
      obj.logo = logoShareUrl;
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        addLogoToBusiness(obj[key]);
      }
    }
  }
}

// Function to process a single HTML file's content
function processHtml(content, filename) {
  let updatedContent = content;

  // Replace navigation logo
  if (navLogoRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(navLogoRegex, navLogoReplacement);
  } else {
    console.warn(`[Warning] No nav-logo found in: ${filename}`);
  }

  // Replace footer logo
  if (footerLogoRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(footerLogoRegex, footerLogoReplacement);
  } else {
    console.warn(`[Warning] No footer-logo found in: ${filename}`);
  }

  // Replace Open Graph image tags
  if (ogImageRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(ogImageRegex, ogImageReplacement);
  } else {
    console.warn(`[Warning] No og:image meta tag found in: ${filename}`);
  }

  // Parse and update JSON-LD schema blocks
  const scriptRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let replacements = [];

  // Reset regex index
  scriptRegex.lastIndex = 0;

  while ((match = scriptRegex.exec(updatedContent)) !== null) {
    const fullMatch = match[0];
    const scriptBody = match[1];
    try {
      const jsonObj = JSON.parse(scriptBody.trim());
      
      let hasTargetType = false;
      
      // Check if target type exists recursively
      function checkTarget(obj) {
        if (typeof obj !== 'object' || obj === null) return;
        if (Array.isArray(obj)) {
          obj.forEach(checkTarget);
        } else {
          if (isTargetType(obj['@type'])) {
            hasTargetType = true;
            return;
          }
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) checkTarget(obj[key]);
          }
        }
      }
      checkTarget(jsonObj);
      
      if (hasTargetType) {
        // Recursively insert logo
        addLogoToBusiness(jsonObj);
        
        // Re-serialize with clean indentation
        const formattedJson = JSON.stringify(jsonObj, null, 2);
        
        // Pad the serialized JSON to match standard file indentation
        const lines = formattedJson.split('\n');
        const paddedLines = lines.map((line, idx) => {
          if (idx === 0) return '  ' + line;
          return '    ' + line;
        });
        const finalScript = `<script type="application/ld+json">\n${paddedLines.join('\n')}\n  </script>`;
        
        replacements.push({ target: fullMatch, replacement: finalScript });
      }
    } catch (e) {
      console.error(`[Error] Failed to parse JSON-LD in ${filename}:`, e.message);
    }
  }

  // Apply JSON-LD replacements
  for (const rep of replacements) {
    updatedContent = updatedContent.replace(rep.target, rep.replacement);
  }

  return updatedContent;
}

// Main function to run the process
function main() {
  const isTest = process.argv.includes('--test');
  const files = fs.readdirSync(workspacePath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  console.log(`Found ${htmlFiles.length} HTML files to update.`);

  if (isTest) {
    const testFile = 'deck-builder-brookline-ma.html';
    console.log(`Running in TEST mode on ${testFile}...`);
    const filePath = path.join(workspacePath, testFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = processHtml(content, testFile);
    
    const testOutputPath = path.join(workspacePath, 'scratch', 'brookline_test.html');
    fs.writeFileSync(testOutputPath, updated, 'utf8');
    console.log(`Test completed. Output written to scratch/brookline_test.html`);
  } else {
    console.log('Running in WRITE mode. Overwriting files...');
    for (const file of htmlFiles) {
      const filePath = path.join(workspacePath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const updated = processHtml(content, file);
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`Updated: ${file}`);
    }
    console.log('Global HTML updates completed successfully!');
  }
}

main();
