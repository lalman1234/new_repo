const fs = require('fs');
const path = require('path');

function fixInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('\\${')) {
        content = content.replace(/\\\${/g, '${');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}
fixInDir('c:/Users/lalma/OneDrive/Desktop/Institute-Training/frontend/src/components');
