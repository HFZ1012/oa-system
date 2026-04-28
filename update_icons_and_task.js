const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Move /task route
  const taskPathRegex = /\{\s*path:\s*['"]\/task['"]/;
  const taskMatch = content.match(taskPathRegex);

  if (taskMatch) {
    const startIndex = taskMatch.index;
    let braceCount = 0;
    let endIndex = startIndex;
    let inBrace = false;

    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{') {
        braceCount++;
        inBrace = true;
      } else if (content[i] === '}') {
        braceCount--;
      }

      if (inBrace && braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }

    let taskRoute = content.substring(startIndex, endIndex);

    // Check if there is a trailing comma and remove it from original location
    let afterEnd = endIndex;
    while (content[afterEnd] === ' ' || content[afterEnd] === '\n' || content[afterEnd] === '\r') {
      afterEnd++;
    }
    if (content[afterEnd] === ',') {
      afterEnd++;
    }

    content = content.substring(0, startIndex) + content.substring(afterEnd);

    // Now insert taskRoute right before /dashboard
    const dashboardRegex = /\{\s*path:\s*['"]\/dashboard['"]/;
    const dashboardMatch = content.match(dashboardRegex);
    if (dashboardMatch) {
      content = content.substring(0, dashboardMatch.index) + taskRoute + ',\n  ' + content.substring(dashboardMatch.index);
    }
  }

  // Update icons
  content = content.replace(/icon:\s*['"]tasks['"]/g, 'icon: "list-ul"');
  content = content.replace(/icon:\s*['"]car['"]/g, 'icon: "route"');
  content = content.replace(/icon:\s*['"]box['"]/g, 'icon: "box-open"');
  content = content.replace(/icon:\s*['"]plane['"]/g, 'icon: "coffee"');
  content = content.replace(/icon:\s*['"]stamp['"]/g, 'icon: "check-circle"');
  content = content.replace(/icon:\s*['"]clipboard-list['"]/g, 'icon: "form"');
  content = content.replace(/icon:\s*['"]bullhorn['"]/g, 'icon: "bell"');
  content = content.replace(/icon:\s*['"]building['"]/g, 'icon: "home"');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

updateFile('src/router/index.js');
updateFile('mock/controller/router.js');
