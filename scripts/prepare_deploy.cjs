const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/ directory does not exist. Run "vite build" first.');
  process.exit(1);
}

// 1. Ensure .nojekyll exists in dist/ to disable Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Created dist/.nojekyll');

// 2. Ensure 404.html exists in dist/ for SPA fallback
const dist404 = path.join(distDir, '404.html');
const public404 = path.join(rootDir, 'public', '404.html');
if (!fs.existsSync(dist404) && fs.existsSync(public404)) {
  fs.copyFileSync(public404, dist404);
  console.log('Copied public/404.html -> dist/404.html');
}

// 3. Create dist/admin/index.html from dist/index.html for direct static URL resolution
const distIndex = path.join(distDir, 'index.html');
if (fs.existsSync(distIndex)) {
  const adminDir = path.join(distDir, 'admin');
  fs.mkdirSync(adminDir, { recursive: true });
  fs.copyFileSync(distIndex, path.join(adminDir, 'index.html'));
  console.log('Created dist/admin/index.html for direct static routing');
}

console.log('Deploy prep completed successfully for dist/ artifact!');
