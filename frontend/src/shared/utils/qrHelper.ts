import { Artifact } from '../types';

/**
 * Phân tích nội dung mã QR (USC02).
 * - Mã hiện vật: link dạng `...?artifact=<id>` hoặc chứa mã/ID hiện vật.
 * - Mã bảo tàng (cổng vào): link dạng `...?entry=gate`.
 */
export type QrPayload =
  | { type: 'artifact'; artifact: Artifact }
  | { type: 'museum' }
  | { type: 'unknown' };

export function parseQrPayload(decoded: string, artifacts: Artifact[]): QrPayload {
  const text = (decoded || '').trim();
  if (!text) return { type: 'unknown' };

  // 1. Link có tham số artifact / entry
  try {
    const url = new URL(text);
    const artifactParam = url.searchParams.get('artifact');
    if (artifactParam) {
      const byParam = artifacts.find((a) => a.id === artifactParam || a.code === artifactParam);
      if (byParam) return { type: 'artifact', artifact: byParam };
    }
    if (url.searchParams.get('entry') === 'gate') {
      return { type: 'museum' };
    }
  } catch {
    // Không phải URL, thử so khớp trực tiếp bên dưới
  }

  // 2. Nội dung thuần là ID/mã hiện vật, hoặc có chứa mã hiện vật
  const found = artifacts.find(
    (a) => a.id === text || a.code === text || text.includes(a.code) || text.includes(a.id)
  );
  if (found) return { type: 'artifact', artifact: found };

  return { type: 'unknown' };
}
