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

  if (!currentArtifact) return null;

  const rawAudio =
    currentArtifact.audio?.[currentLang] ||
    currentArtifact.audio?.['vi'] ||
    '/audio/guide_sample.wav';
  const isProduction = import.meta.env.PROD;
  const baseUrl = isProduction ? (import.meta.env.BASE_URL || '/').replace(/\/$/, '') : '';
  const cleanRaw = rawAudio.startsWith('/') ? rawAudio : `/${rawAudio}`;
  const audioSrc = cleanRaw.startsWith('http')
    ? cleanRaw
    : cleanRaw.startsWith(baseUrl)
    ? cleanRaw
    : `${baseUrl}${cleanRaw}`;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        try {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined && typeof playPromise.catch === 'function') {
            playPromise.catch((err) => {
              console.warn('Audio playback was interrupted or prevented by browser policy:', err);
            });
          }
        } catch (err) {
          console.warn('Audio play call failed:', err);
        }
      } else {
        try {
          audioRef.current.pause();
        } catch (err) {
          console.warn('Audio pause failed:', err);
        }
      }
    }
  }, [isPlaying, audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Find active subtitle cue
  const activeSubtitles = currentArtifact.subtitles?.[currentLang] || currentArtifact.subtitles?.['vi'] || [];
  const activeCue = activeSubtitles.find(cue => currentTime >= cue.start && currentTime <= cue.end);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
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
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-3 z-50 animate-fade-in">
        <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-700/80 flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
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
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
              <img
                src={currentArtifact.images?.[0] || 'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg'}
                alt={currentArtifact?.title?.[currentLang] || currentArtifact?.title?.['vi'] || ''}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
                }}
                className="w-10 h-10 rounded-xl object-cover shadow shrink-0"
              />
              <div className="truncate">
                <div className="font-bold text-xs md:text-sm text-slate-100 truncate">
                  {currentArtifact?.title?.[currentLang] || currentArtifact?.title?.['vi'] || currentArtifact?.code || ''}
                </div>
                <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  {currentArtifact.code}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Playback speed */}
              <button
                onClick={handleNextRate}
                className="text-xs font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                title={t('playbackSpeed')}
              >
                {playbackRate}x
              </button>

              {/* Subtitles Toggle */}
              <button
                onClick={toggleSubtitle}
                className={`p-2 rounded-full transition-colors ${
                  showSubtitle ? 'text-amber-400 bg-amber-400/20' : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={t('subtitles')}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Play/Pause */}
              {isPlaying ? (
                <button
                  onClick={pause}
                  className="p-2.5 rounded-full bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition"
                  title={t('pause')}
                >
                  <Pause className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="p-2.5 rounded-full bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition"
                  title={t('resume')}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              )}

              {/* Stop & Close */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  stop();
                }}
                className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
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
