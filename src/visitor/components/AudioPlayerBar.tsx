import React, { useRef, useEffect } from 'react';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { Play, Pause, Subtitles, Volume2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AudioPlayerBar: React.FC = () => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentLang } = useLangStore();
  const {
    currentArtifact,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    showSubtitle,
    pause,
    resume,
    stop,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    toggleSubtitle
  } = usePlayerStore();

  const audioSrc = currentArtifact?.audio[currentLang] || currentArtifact?.audio['vi'];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Autoplay prevented:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  if (!currentArtifact) return null;

  // Find active subtitle cue
  const activeSubtitles = currentArtifact.subtitles?.[currentLang] || currentArtifact.subtitles?.['vi'] || [];
  const activeCue = activeSubtitles.find(cue => currentTime >= cue.start && currentTime <= cue.end);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const rates = [1.0, 1.25, 1.5, 2.0];

  const handleNextRate = () => {
    const idx = rates.indexOf(playbackRate);
    const nextIdx = (idx + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => stop()}
      />

      {/* Synchronized Floating Subtitle Box */}
      {showSubtitle && activeCue && (
        <div className="fixed bottom-28 left-4 right-4 z-40 flex justify-center pointer-events-none">
          <div className="bg-slate-900/90 text-white text-sm md:text-base px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl border border-slate-700/50 max-w-lg text-center animate-fade-in pointer-events-auto">
            {activeCue.text}
          </div>
        </div>
      )}

      {/* Sticky Bottom Audio Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 z-50 shadow-lg">
        <div className="max-w-xl mx-auto flex flex-col gap-1.5">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCurrentTime(val);
                if (audioRef.current) {
                  audioRef.current.currentTime = val;
                }
              }}
              className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={currentArtifact.images[0]}
                alt={currentArtifact.title[currentLang]}
                className="w-10 h-10 rounded-lg object-cover shadow"
              />
              <div className="truncate">
                <div className="font-semibold text-sm text-slate-800 truncate">
                  {currentArtifact.title[currentLang]}
                </div>
                <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  {currentArtifact.code}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Playback speed */}
              <button
                onClick={handleNextRate}
                className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Tốc độ phát"
              >
                {playbackRate}x
              </button>

              {/* Subtitles Toggle */}
              <button
                onClick={toggleSubtitle}
                className={`p-2 rounded-full transition-colors ${
                  showSubtitle ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'
                }`}
                title={t('subtitles')}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Play/Pause */}
              {isPlaying ? (
                <button
                  onClick={pause}
                  className="p-2.5 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="p-2.5 rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
              )}

              {/* Stop & Close */}
              <button
                onClick={stop}
                className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                title={t('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
