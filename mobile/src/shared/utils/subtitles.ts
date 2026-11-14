import { SubtitleCue } from '../types';

/**
 * Tìm câu phụ đề đang khớp với mốc thời gian hiện tại (giây).
 */
export function findActiveCueIndex(cues: SubtitleCue[] | undefined, currentTime: number): number {
  if (!cues || cues.length === 0) return -1;
  return cues.findIndex((c) => currentTime >= c.start && currentTime <= c.end);
}

/**
 * Định dạng số giây thành mm:ss.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
