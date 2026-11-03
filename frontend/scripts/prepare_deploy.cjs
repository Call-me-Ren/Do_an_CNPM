const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/ directory does not exist. Run "vite build" first.');
  process.exit(1);
}

function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

// 1. Ensure dist has .nojekyll and 404.html
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
const public404 = path.join(rootDir, 'public', '404.html');
const dist404 = path.join(distDir, '404.html');
if (fs.existsSync(public404)) {
  fs.copyFileSync(public404, dist404);
}

// 2. Create dist/admin/index.html
const distIndex = path.join(distDir, 'index.html');
if (fs.existsSync(distIndex)) {
  const adminDir = path.join(distDir, 'admin');
  fs.mkdirSync(adminDir, { recursive: true });
  fs.copyFileSync(distIndex, path.join(adminDir, 'index.html'));
}

// 3. Dual-support for "Deploy from a branch (root)"
// Copy dist/assets to assets/ in root so GitHub Pages branch deployment loads immediately
if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyFolderSync(path.join(distDir, 'assets'), assetsDir);
  console.log('Synced dist/assets -> assets/ for root deployment compatibility');
}

// Ensure .nojekyll and 404.html in root
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
if (fs.existsSync(public404)) {
  fs.copyFileSync(public404, path.join(rootDir, '404.html'));
}

console.log('Deploy prep completed successfully for both GitHub Actions and branch deployment!');
