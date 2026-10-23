/**
 * Asset Helper for resolving Vite public URLs (especially on GitHub Pages /Test_CNPM/)
 * and generating exhibit-specific fallback artwork.
 */

export function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${cleanBase}${cleanUrl}`;
}

export function getArtifactFallbackImage(
  code?: string,
  title?: string,
  floorId: number = 1
): string {
  const safeCode = code || 'WRM';
  const safeTitle = (title || 'Hiện Vật Bảo Tàng').replace(/"/g, '&quot;');
  
  const palette = [
    { bg1: '#1c281e', bg2: '#0d150e', accent: '#4ade80' },
    { bg1: '#1a2332', bg2: '#0b111c', accent: '#38bdf8' },
    { bg1: '#262218', bg2: '#120f09', accent: '#f59e0b' },
    { bg1: '#311d1d', bg2: '#170b0b', accent: '#f87171' },
    { bg1: '#172554', bg2: '#0b1120', accent: '#60a5fa' }
  ];
  const theme = palette[Math.abs(floorId) % palette.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="100%" stop-color="${theme.bg2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#grad)"/>
    <circle cx="400" cy="260" r="110" fill="${theme.accent}" fill-opacity="0.1" stroke="${theme.accent}" stroke-width="4"/>
    <text x="400" y="275" fill="${theme.accent}" font-family="monospace" font-weight="900" font-size="34" text-anchor="middle">${safeCode}</text>
    <rect x="80" y="460" width="640" height="85" rx="16" fill="#0f172a" fill-opacity="0.95" stroke="#334155" stroke-width="2"/>
    <text x="400" y="510" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="bold" font-size="20" text-anchor="middle">${safeTitle}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
