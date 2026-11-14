import { findActiveCueIndex, formatDuration } from '../shared/utils/subtitles';
import { SubtitleCue } from '../shared/types';

const cues: SubtitleCue[] = [
  { start: 0, end: 4.5, text: 'Câu 1' },
  { start: 4.6, end: 9.0, text: 'Câu 2' },
];

describe('subtitles (mobile)', () => {
  it('finds matching cue index at timestamp', () => {
    expect(findActiveCueIndex(cues, 2)).toBe(0);
    expect(findActiveCueIndex(cues, 6)).toBe(1);
    expect(findActiveCueIndex(cues, 12)).toBe(-1);
  });

  it('formats seconds as mm:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(-5)).toBe('0:00');
  });
});
