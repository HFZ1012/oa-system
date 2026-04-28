const fs = require('fs');
const path = require('path');

const baseContent = fs.readFileSync(path.join(__dirname, 'src/views/vab/table.vue'), 'utf-8');

const modules = [
  { dir: 'meeting', files: ['register', 'apply', 'arrange'] },
  { dir: 'vehicle', files: ['apply', 'arrange', 'reserve'] },
  { dir: 'supplies', files: ['receive', 'apply', 'list'] },
  { dir: 'travel', files: ['apply', 'list', 'approve'] },
  { dir: 'seal', files: ['apply', 'list', 'summary'] },
  { dir: 'work', files: ['leader', 'department', 'topic'] },
  { dir: 'info', files: ['add', 'list', 'audit'] },
  { dir: 'property', files: ['repair', 'list', 'evaluate'] }
];

modules.forEach(mod => {
  const dirPath = path.join(__dirname, 'src/views', mod.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  mod.files.forEach(file => {
    const filePath = path.join(dirPath, file + '.vue');
    // Replace name="Table" with appropriate name if needed, but not strictly required
    const content = baseContent.replace(/name: "Table"/g, `name: "${file.charAt(0).toUpperCase() + file.slice(1)}"`);
    fs.writeFileSync(filePath, content);
  });
});

console.log('Done creating skeleton pages.');
