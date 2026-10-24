import React, { useEffect } from 'react';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { ttsService } from '../../shared/services/tts';
import { resolveAssetUrl, getArtifactFallbackImage } from '../../shared/utils/assetHelper';
import { LiveTranscriptCard } from './LiveTranscriptCard';
import { Play, Pause, Subtitles, Volume2, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  isDetailSheetOpen?: boolean;
}

export const AudioPlayerBar: React.FC<Props> = ({ isDetailSheetOpen = false }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const prevArtifactIdRef = React.useRef<string | null>(null);
  const prevStartCueIndexRef = React.useRef<number>(-1);
  const prevLangRef = React.useRef<string>(currentLang);

  const {
    currentArtifact,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    showSubtitle,
    startCueIndex,
    pause,
    resume,
    stop,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    toggleSubtitle,
    setShowSubtitle,
    seekToCue,
    seekToTime
  } = usePlayerStore();

  const description =
    currentArtifact?.description?.[currentLang] || currentArtifact?.description?.['vi'] || '';

  // Extract multi-sentence subtitles or generate fallback
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

  const totalDuration =
    activeSubtitles.length > 0 && activeSubtitles[activeSubtitles.length - 1].end > 0
      ? activeSubtitles[activeSubtitles.length - 1].end
      : 30;

  // Cue-based Speech Playback Engine Hook
  useEffect(() => {
    if (!currentArtifact || activeSubtitles.length === 0) {
      ttsService.stop();
      return;
    }

    setDuration(totalDuration);

    ttsService.setCueCallbacks({
      onCueChange: (_idx, cue) => {
        setCurrentTime(cue.start);
      },
      onCueProgress: (_idx, curTime) => {
        setCurrentTime(curTime);
      },
      onFinish: () => {
        pause();
      },
      onError: (err) => {
        console.warn('TTS playback issue:', err);
      }
    });

    const artifactChanged = prevArtifactIdRef.current !== currentArtifact.id;
    const cueChanged = prevStartCueIndexRef.current !== startCueIndex;
    const langChanged = prevLangRef.current !== currentLang;

    prevArtifactIdRef.current = currentArtifact.id;
    prevStartCueIndexRef.current = startCueIndex;
    prevLangRef.current = currentLang;

    if (isPlaying) {
      if (artifactChanged || cueChanged || langChanged || !ttsService.getIsCuePlaying()) {
        const audioUrl = currentArtifact?.audio?.[currentLang] || currentArtifact?.audio?.['vi'];
        ttsService.playCues(
          activeSubtitles,
          startCueIndex,
          currentLang,
          playbackRate,
          undefined,
          audioUrl
        );
      } else if (ttsService.getIsPaused()) {
        ttsService.resume();
      }
    } else {
      ttsService.pause();
    }
  }, [isPlaying, currentArtifact?.id, currentLang, startCueIndex]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
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
    seekToTime(val);
  };

  const handleStopAndClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
    setShowSubtitle(false);
  };

  return (
    <>
      {/* Floating Subtitle Transcript Card matching reference (only shown when modal detail is closed) */}
      {showSubtitle && !isDetailSheetOpen && activeSubtitles.length > 0 && (
        <div className="fixed bottom-[calc(10rem+env(safe-area-inset-bottom,0px))] md:bottom-28 left-4 right-4 z-40 flex justify-center pointer-events-none">
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
              onSeekCue={(sec, index) =>
                seekToCue(index, sec, currentArtifact, activeSubtitles, currentLang, playbackRate)
              }
              className="border-0 shadow-none p-0"
            />
          </div>
        </div>
      )}

      {/* Sticky Bottom Audio Player Bar */}
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-0 right-0 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-4 z-50 animate-fade-in">
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
                src={resolveAssetUrl(currentArtifact.images?.[0])}
                alt={currentArtifact?.title?.[currentLang] || currentArtifact?.title?.['vi'] || ''}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getArtifactFallbackImage(
                    currentArtifact.code,
                    currentArtifact.title[currentLang] || currentArtifact.title['vi'],
                    currentArtifact.floorId
                  );
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

              {/* Subtitles Toggle (CC) */}
              <button
                onClick={toggleSubtitle}
                className={`p-2 sm:px-2.5 sm:py-2 rounded-xl transition-colors flex items-center gap-1 ${
                  showSubtitle
                    ? 'text-amber-400 bg-amber-400/20 ring-1 ring-amber-400/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="CC (Phụ đề)"
              >
                <Subtitles className="w-4 h-4" />
                <span className="text-[10px] font-extrabold tracking-tight">CC</span>
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
