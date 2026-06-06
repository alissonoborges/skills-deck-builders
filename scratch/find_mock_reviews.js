const fs = require('fs');
const path = require('path');

const workspacePath = 'C:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\Site';

function main() {
  const files = fs.readdirSync(workspacePath);
  const htmlFiles = files.filter(f => f.endsWith('.html'));

  console.log('Searching for files containing "Sarah M."...');
  for (const file of htmlFiles) {
    const filePath = path.join(workspacePath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Sarah M.')) {
      console.log(`Found in: ${file}`);
    }
  }
}

main();
