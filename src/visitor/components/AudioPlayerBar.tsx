import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { ttsService } from '../../shared/services/tts';
import { LiveTranscriptCard } from './LiveTranscriptCard';
import { Play, Pause, Subtitles, Volume2, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AudioPlayerBar: React.FC = () => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const intervalRef = useRef<any>(null);

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

  const title = currentArtifact?.title?.[currentLang] || currentArtifact?.title?.['vi'] || '';
  const description =
    currentArtifact?.description?.[currentLang] || currentArtifact?.description?.['vi'] || '';

  // Extract multi-sentence subtitles or fallback
  const rawSubtitles =
    currentArtifact?.subtitles?.[currentLang] || currentArtifact?.subtitles?.['vi'] || [];
  const activeSubtitles =
    rawSubtitles.length > 0
      ? rawSubtitles
      : description
      ? [
          {
            start: 0,
            end: 15,
            text: description
          }
        ]
      : [];

  const narrationScript =
    activeSubtitles.length > 0
      ? activeSubtitles.map((cue) => cue.text).join(' ')
      : title
      ? `${title}. ${description}`
      : '';

  const totalDuration =
    activeSubtitles.length > 0 && activeSubtitles[activeSubtitles.length - 1].end > 0
      ? activeSubtitles[activeSubtitles.length - 1].end
      : Math.max(10, Math.round(narrationScript.length / (13 * playbackRate)));

  // AI Voice Speech Synthesis Hook
  useEffect(() => {
    if (!currentArtifact || !narrationScript) {
      ttsService.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (isPlaying) {
      setDuration(totalDuration);

      if (ttsService.isSupported()) {
        ttsService.speak(narrationScript, currentLang, playbackRate, {
          onEnd: () => {
            stop();
          },
          onError: () => {
            stop();
          }
        });
      }

      // Progress Tracker Interval
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        usePlayerStore.setState((prev) => {
          if (!prev.isPlaying) return prev;
          const nextTime = Number((prev.currentTime + 0.25).toFixed(2));
          if (nextTime >= totalDuration) {
            return { currentTime: totalDuration };
          }
          return { currentTime: nextTime };
        });
      }, 250);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      if (ttsService.isSupported()) {
        ttsService.pause();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying, currentArtifact?.id, currentLang, playbackRate, narrationScript, totalDuration]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Return null AFTER all hooks are called
  if (!currentArtifact) return null;

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

  const handleSeek = (val: number) => {
    setCurrentTime(val);
    if (isPlaying && activeSubtitles.length > 0) {
      const remainingCues = activeSubtitles.filter((c) => c.start >= val);
      const textToSpeak =
        remainingCues.length > 0
          ? remainingCues.map((c) => c.text).join(' ')
          : narrationScript;

      if (ttsService.isSupported()) {
        ttsService.speak(textToSpeak, currentLang, playbackRate, {
          onEnd: () => stop(),
          onError: () => stop()
        });
      }
    }
  };

  const handleStopAndClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    ttsService.stop();
    stop();
  };

  return (
    <>
      {/* Floating Subtitle Transcript Card matching reference */}
      {showSubtitle && activeSubtitles.length > 0 && (
        <div className="fixed bottom-40 md:bottom-28 left-4 right-4 z-40 flex justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-3 pointer-events-auto animate-fade-in">
            <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
              <span className="inline-flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('subtitles')} (AI Voice - {currentLang.toUpperCase()})</span>
              </span>
              <button
                onClick={toggleSubtitle}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <LiveTranscriptCard
              subtitles={activeSubtitles}
              currentTime={currentTime}
              onSeekCue={handleSeek}
              className="border-0 shadow-none p-0"
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Audio Player Bar */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-4 z-50 animate-fade-in">
        <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-slate-700/80 flex flex-col gap-2.5">
          {/* Progress Bar */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || totalDuration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration || totalDuration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
              <img
                src={
                  currentArtifact.images?.[0] ||
                  'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg'
                }
                alt={currentArtifact?.title?.[currentLang] || currentArtifact?.title?.['vi'] || ''}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow shrink-0"
              />
              <div className="truncate">
                <div className="font-bold text-xs sm:text-base text-slate-100 truncate">
                  {currentArtifact?.title?.[currentLang] ||
                    currentArtifact?.title?.['vi'] ||
                    currentArtifact?.code ||
                    ''}
                </div>
                <div className="text-[11px] sm:text-xs text-amber-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>{currentArtifact.code}</span>
                  <span className="hidden sm:inline text-slate-500">&bull;</span>
                  <span className="hidden sm:inline text-slate-400">
                    {t('floorPrefix')} {currentArtifact.floorId}
                  </span>
                  <span className="hidden sm:inline text-emerald-400 text-[10px] bg-emerald-500/15 px-2 py-0.5 rounded-full font-bold">
                    AI Voice ({currentLang.toUpperCase()})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Playback speed */}
              <button
                onClick={handleNextRate}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                title={t('playbackSpeed')}
              >
                {playbackRate}x
              </button>

              {/* Subtitles Toggle */}
              <button
                onClick={toggleSubtitle}
                className={`p-2.5 rounded-xl transition-colors ${
                  showSubtitle
                    ? 'text-amber-400 bg-amber-400/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={t('subtitles')}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Play/Pause */}
              {isPlaying ? (
                <button
                  onClick={pause}
                  className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition"
                  title={t('pause')}
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-md hover:bg-amber-400 transition"
                  title={t('resume')}
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              )}

              {/* Stop & Close (X) */}
              <button
                onClick={handleStopAndClose}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
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
