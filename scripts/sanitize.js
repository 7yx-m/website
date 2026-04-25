const fs = require('fs');
const path = require('path');

const TARGET_DIRS = ['public', 'content'];
const IGNORED_FILES = ['.DS_Store', 'Thumbs.db', '__pycache__', '.temp', '.log'];

function sanitize(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (IGNORED_FILES.includes(file)) {
        console.log(`Removing directory: ${filePath}`);
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        sanitize(filePath);
      }
    } else {
      if (IGNORED_FILES.some(pattern => file.includes(pattern)) || file.endsWith('.tmp')) {
        console.log(`Removing file: ${filePath}`);
        fs.unlinkSync(filePath);
      }
    }
  });
}

console.log('🚀 Starting build sanitization...');
TARGET_DIRS.forEach(dir => sanitize(path.join(process.cwd(), dir)));
console.log('✅ Sanitization complete.');
