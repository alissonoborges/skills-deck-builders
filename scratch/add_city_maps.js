const fs = require('fs');
const path = require('path');

const workspacePath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders';

// List of city files and their corresponding city name mapping
const cityMapping = {
  'deck-builder-wellesley-ma.html': 'Wellesley',
  'deck-builder-weston-ma.html': 'Weston',
  'deck-builder-chestnut-hill-ma.html': 'Chestnut Hill',
  'deck-builder-brookline-ma.html': 'Brookline',
  'deck-builder-newton-ma.html': 'Newton',
  'deck-builder-sudbury-ma.html': 'Sudbury',
  'deck-builder-dover-ma.html': 'Dover',
  'deck-builder-lincoln-ma.html': 'Lincoln',
  'deck-builder-concord-ma.html': 'Concord',
  'deck-builder-lexington-ma.html': 'Lexington',
  'deck-builder-needham-ma.html': 'Needham',
  'deck-builder-wayland-ma.html': 'Wayland',
  'deck-builder-winchester-ma.html': 'Winchester'
};

function main() {
  const files = Object.keys(cityMapping);
  
  console.log(`Processing ${files.length} city landing pages...`);
  
  for (const file of files) {
    const filePath = path.join(workspacePath, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[Warning] File not found: ${file}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const cityName = cityMapping[file];
    
    // Check if the map placeholder is already present
    if (content.includes('class="map-placeholder"')) {
      console.log(`[Skipping] ${file} already contains a map placeholder.`);
      continue;
    }
    
    // Define the map placeholder HTML block
    const mapHtml = `
        <div class="map-placeholder" style="margin-top: 3rem; height: 350px; margin-bottom: 0;">
          <iframe 
            src="https://maps.google.com/maps?q=${encodeURIComponent(cityName + ', MA')}&t=&z=13&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            title="Skills Deck Builders ${cityName} Service Area Map">
          </iframe>
        </div>`;
    
    // We want to insert this block right before the closing tag of the container or section.
    // In these files, the structure is:
    // <div class="community-tags">
    //   ...
    // </div>
    // </div>
    // </section>
    
    // Let's locate the community-tags div closing tag
    const targetRegex = /([\s\S]*?<div class="community-tags">[\s\S]*?<\/div>)([\s\S]*?)/;
    
    if (targetRegex.test(content)) {
      content = content.replace(targetRegex, (match, before, after) => {
        return before + mapHtml + after;
      });
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[Map Added] ${file} (${cityName})`);
    } else {
      console.error(`[Error] Could not find community-tags div in: ${file}`);
    }
  }
  
  console.log('City map integration complete!');
}

main();
