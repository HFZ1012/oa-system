const fs = require('fs');

let content = fs.readFileSync('src/router/index.js', 'utf-8');

// Find start of /vab
let startVab = content.indexOf('  {\n    path: "/vab",');
if (startVab === -1) {
  startVab = content.indexOf('  {\r\n    path: "/vab",');
}

// Since we know the exact lines (roughly), let's just parse it using braces
let count = 0;
let endVab = -1;
for (let i = startVab; i < content.length; i++) {
  if (content[i] === '{') count++;
  else if (content[i] === '}') count--;

  if (count === 0 && content[i] === '}') {
    endVab = i + 1;
    if (content[endVab] === ',') endVab++;
    break;
  }
}

const vabBlock = content.substring(startVab, endVab);
content = content.substring(0, startVab) + content.substring(endVab);

// Now find the end right before pathMatch
const pathMatchIdx = content.indexOf('  {\n    path: "/:pathMatch(.*)*",');
content = content.substring(0, pathMatchIdx) + vabBlock + '\n' + content.substring(pathMatchIdx);

fs.writeFileSync('src/router/index.js', content);
console.log('Moved Vab to bottom.');
