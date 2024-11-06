const fs = require('fs');
const path = require('path');

const iconsFolder = '.'; // Set the path to your icons folder

const champions = [];

fs.readdirSync(iconsFolder).forEach(file => {
  if (path.extname(file) === '.png') {
    const champName = path.basename(file, '.png'); // Get the file name without the extension
    champions.push({ name: champName, iconPath: `${iconsFolder}/${file}` });
  }
});

console.log(JSON.stringify(champions, null, 2));