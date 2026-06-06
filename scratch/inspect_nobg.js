const sharp = require('c:\\Users\\aliss\\Desktop\\Sites\\Skills\\node_modules\\sharp' ? 'sharp' : 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\node_modules\\sharp');
const fs = require('fs');
const path = require('path');

const inputPath = 'c:\\Users\\aliss\\Desktop\\Sites\\Skills Deck Builders\\images\\logo-nobg.png';

async function run() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  
  // Segment 2 is Y: 1647..1688
  const startY = 1647;
  const endY = 1688;
  
  // Let's count active pixels in each column of Segment 2
  const colCount = new Array(width).fill(0);
  for (let x = 0; x < width; x++) {
    for (let y = startY; y <= endY; y++) {
      const idx = (y * width + x) * 3;
      if (data[idx] < 240 || data[idx+1] < 240 || data[idx+2] < 240) {
        colCount[x]++;
      }
    }
  }
  
  // Output column counts to find gaps
  console.log('Column density for Segment 2 (DECK BUILDERS):');
  let output = '';
  for (let x = 0; x < width; x++) {
    if (colCount[x] > 0) {
      output += `${x}:${colCount[x]} `;
    } else {
      if (output.endsWith(' ')) continue;
      output += '. ';
    }
  }
  console.log(output);
}

run();
