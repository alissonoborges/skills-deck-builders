const fs = require('fs');
const path = require('path');

const sitePath = 'C:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\Site';

const indexContent = fs.readFileSync(path.join(sitePath, 'index.html'), 'utf8');
console.log('index.html length:', indexContent.length);
console.log('index.html contains "testimonials-grid":', indexContent.includes('testimonials-grid'));
console.log('index.html contains "Sarah M.":', indexContent.includes('Sarah M.'));

const reviewsContent = fs.readFileSync(path.join(sitePath, 'reviews.html'), 'utf8');
console.log('reviews.html length:', reviewsContent.length);
console.log('reviews.html contains "reviews-grid":', reviewsContent.includes('reviews-grid'));
console.log('reviews.html contains "Sarah M.":', reviewsContent.includes('Sarah M.'));
