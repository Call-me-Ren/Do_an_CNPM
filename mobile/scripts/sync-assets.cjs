const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const mobileRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(mobileRoot, '..');
const frontendPublic = path.join(repoRoot, 'frontend', 'public');
const frontendData = path.join(repoRoot, 'frontend', 'src', 'data', 'museum_data.json');

const targetData = path.join(mobileRoot, 'src', 'data', 'museum_data.json');
const targetAssetsDir = path.join(mobileRoot, 'assets', 'museum');
const targetMapFile = path.join(mobileRoot, 'src', 'shared', 'assetMap.ts');

// Xóa thư mục assets/museum cũ để tránh rác
if (fs.existsSync(targetAssetsDir)) {
  fs.rmSync(targetAssetsDir, { recursive: true, force: true });
}
fs.mkdirSync(targetAssetsDir, { recursive: true });
fs.mkdirSync(path.dirname(targetData), { recursive: true });
fs.mkdirSync(path.dirname(targetMapFile), { recursive: true });

// Copy museum_data.json
fs.copyFileSync(frontendData, targetData);

function toAsciiSafeName(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  const base = path
    .basename(relPath, path.extname(relPath))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
  const hash = crypto.createHash('md5').update(relPath).digest('hex').slice(0, 6);
  const folderPrefix = relPath.split('/')[0] || 'file';
  return `${folderPrefix}_${base.slice(0, 40)}_${hash}${ext}`;
}

const entries = [];

function walk(dir, relBase) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    const rel = relBase ? `${relBase}/${item.name}` : item.name;
    if (item.isDirectory()) {
      walk(full, rel);
    } else {
      const safeName = toAsciiSafeName(rel);
      fs.copyFileSync(full, path.join(targetAssetsDir, safeName));
      entries.push({ webPath: `/${rel}`, safeName });
    }
  }
}

walk(path.join(frontendPublic, 'audio'), 'audio');
walk(path.join(frontendPublic, 'images'), 'images');
walk(path.join(frontendPublic, 'maps'), 'maps');

entries.sort((a, b) => a.webPath.localeCompare(b.webPath));

const lines = [
  '/* eslint-disable @typescript-eslint/no-require-imports */',
  '// Tệp được tạo tự động bởi scripts/sync-assets.cjs để bundle toàn bộ media offline vào APK.',
  '',
  'export const LOCAL_ASSET_MAP: Record<string, number> = {',
];

for (const { webPath, safeName } of entries) {
  const escapedKey = JSON.stringify(webPath);
  lines.push(`  ${escapedKey}: require('../../assets/museum/${safeName}'),`);
}

lines.push('};', '');
lines.push('export function resolveBundledAsset(url?: string | null): number | { uri: string } | null {');
lines.push('  if (!url) return null;');
lines.push('  const normalized = url.startsWith(\'/\') ? url : `/${url}`;');
lines.push('  if (LOCAL_ASSET_MAP[normalized]) return LOCAL_ASSET_MAP[normalized];');
lines.push('  if (/^https?:\\/\\//i.test(url)) return { uri: url };');
lines.push('  return null;');
lines.push('}', '');

fs.writeFileSync(targetMapFile, lines.join('\n'), 'utf8');
console.log(`Synced ${entries.length} media assets -> mobile/assets/museum/ and generated assetMap.ts`);
