const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');
const assetsDir = path.join(rootDir, 'assets');

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

// 1. Copy dist to docs
copyFolderSync(distDir, docsDir);
console.log('Copied dist/ -> docs/');

// 2. Copy dist/assets to assets/ in root
if (fs.existsSync(path.join(distDir, 'assets'))) {
  copyFolderSync(path.join(distDir, 'assets'), assetsDir);
  console.log('Copied dist/assets -> assets/');
}

// 3. Ensure 404.html is at root and docs
const fourOhFourSource = fs.existsSync(path.join(distDir, '404.html'))
  ? path.join(distDir, '404.html')
  : path.join(rootDir, 'public', '404.html');

fs.copyFileSync(fourOhFourSource, path.join(rootDir, '404.html'));
fs.copyFileSync(fourOhFourSource, path.join(docsDir, '404.html'));
console.log('Copied 404.html to root and docs/');

// 4. Create admin/index.html in root and docs for direct static resolution
const indexHtmlContent = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const adminDirs = [path.join(rootDir, 'admin'), path.join(docsDir, 'admin')];
adminDirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtmlContent, 'utf-8');
});
console.log('Created admin/index.html in root and docs/');

console.log('Deploy prep completed successfully!');
