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

console.log('Deploy prep completed successfully!');
