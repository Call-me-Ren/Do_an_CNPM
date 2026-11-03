import React, { useEffect, useRef } from 'react';
import { SubtitleCue } from '../../shared/types';
import { Headphones } from 'lucide-react';

interface Props {
  subtitles: SubtitleCue[];
  currentTime: number;
  onSeekCue?: (startSeconds: number, index: number) => void;
  className?: string;
  title?: string;
}

export const LiveTranscriptCard: React.FC<Props> = ({
  subtitles,
  currentTime,
  onSeekCue,
  className = '',
  title
}) => {
  const activeCueRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find index of active cue
  const activeIndex = subtitles.findIndex((cue, i) => {
    const nextCue = subtitles[i + 1];
    const endTime = nextCue ? nextCue.start : cue.end + 2;
    return currentTime >= cue.start && currentTime < endTime;
  });

  // Smooth auto-scroll active cue into view
  useEffect(() => {
    if (activeCueRef.current && typeof activeCueRef.current.scrollIntoView === 'function') {
      activeCueRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  if (!subtitles || subtitles.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 flex flex-col gap-2 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
          <Headphones className="w-3.5 h-3.5 text-amber-600" />
          <span>{title}</span>
        </div>
      )}

      <div className="flex flex-col gap-1 max-h-56 sm:max-h-64 overflow-y-auto pr-1 select-none">
        {subtitles.map((cue, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={idx}
              ref={isActive ? activeCueRef : null}
              onClick={() => onSeekCue?.(cue.start, idx)}
              className={`flex items-start gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-xs ring-1 ring-slate-300/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`font-mono text-xs shrink-0 pt-0.5 ${
                  isActive ? 'text-amber-600 font-bold' : 'text-slate-400'
                }`}
              >
                {formatTimestamp(cue.start)}
              </span>
              <span className="leading-relaxed flex-1">{cue.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
