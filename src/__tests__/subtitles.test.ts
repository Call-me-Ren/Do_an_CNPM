import { describe, it, expect } from 'vitest';
import { SubtitleCue } from '../shared/types';

function getActiveSubtitle(subtitles: SubtitleCue[], currentTime: number): SubtitleCue | undefined {
  return subtitles.find((cue) => currentTime >= cue.start && currentTime <= cue.end);
}

describe('Synchronized Subtitle Cue Matcher', () => {
  const mockCues: SubtitleCue[] = [
    { start: 0, end: 4, text: 'Chào mừng bạn đến với khu trưng bày.' },
    { start: 4.1, end: 9, text: 'Đây là kiệt tác nghệ thuật đúc đồng.' },
    { start: 9.1, end: 15, text: 'Hoa văn hình sao trung tâm biểu tượng cho mặt trời.' },
  ];

  it('should return correct subtitle at 2 seconds', () => {
    const cue = getActiveSubtitle(mockCues, 2);
    expect(cue?.text).toBe('Chào mừng bạn đến với khu trưng bày.');
  });

  it('should return correct subtitle at 6 seconds', () => {
    const cue = getActiveSubtitle(mockCues, 6);
    expect(cue?.text).toBe('Đây là kiệt tác nghệ thuật đúc đồng.');
  });

  it('should return undefined when current time has no cue', () => {
    const cue = getActiveSubtitle(mockCues, 20);
    expect(cue).toBeUndefined();
  });
});
