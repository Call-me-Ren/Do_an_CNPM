import React, { useEffect } from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useFavStore } from '../../shared/stores/favStore';
import { resolveAssetUrl, getArtifactFallbackImage } from '../../shared/utils/assetHelper';
import { LiveTranscriptCard } from './LiveTranscriptCard';
import { X, Volume2, Square, Heart, MapPin, Layers, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifact: Artifact | null;
  onClose: () => void;
}

export const ArtifactDetailSheet: React.FC<Props> = ({ artifact, onClose }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const {
    playArtifact,
    currentArtifact,
    isPlaying,
    currentTime,
    playbackRate,
    showSubtitle,
    setShowSubtitle,
    seekToCue,
    stop
  } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavStore();

  // Subtitle is automatically enabled when opening artifact details
  useEffect(() => {
    if (artifact) {
      setShowSubtitle(true);
    }
  }, [artifact?.id]);

  if (!artifact) return null;

  const isCurrentPlaying = currentArtifact?.id === artifact.id && isPlaying;
  const fav = isFavorite(artifact.id);

  const handleClose = () => {
    setShowSubtitle(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={handleClose} />

      <div className="bg-white w-full max-w-lg md:max-w-4xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative border border-slate-200">
        {/* Left Column: Image Showcase (Top on mobile, Left on desktop) */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto bg-slate-950 overflow-hidden relative shrink-0 flex items-center justify-center">
          <img
            src={resolveAssetUrl(artifact.images[0])}
            alt={artifact.title[currentLang] || artifact.title['vi']}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getArtifactFallbackImage(
                artifact.code,
                artifact.title[currentLang] || artifact.title['vi'],
                artifact.floorId
              );
            }}
            className="w-full h-full object-cover md:object-contain"
          />

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md text-amber-400 font-mono text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 border border-slate-800">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('codeLabel')}: {artifact.code}</span>
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('floorPrefix')} {artifact.floorId}</span>
          </div>
        </div>

        {/* Right Column: Info & Narration Controller */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 bg-white">
          {/* Top Actions: Favorite, Close */}
          <div className="flex items-center justify-end gap-2 pb-4 border-b border-slate-100">
            <button
              onClick={() => toggleFavorite(artifact.id)}
              className={`p-2.5 rounded-xl transition ${
                fav
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={t('favorites')}
            >
              <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Body */}
          <div className="py-5 flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 block mb-1">
                {t('museumArtifactTag')} &bull; {artifact.code}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {artifact.title[currentLang] || artifact.title['vi']}
              </h2>
              <div className="h-0.5 w-12 bg-amber-500 rounded-full my-2" />
            </div>

            {/* Brief Overview Section */}
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t('briefOverview')}
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {artifact.description[currentLang] || artifact.description['vi']}
              </p>
            </div>

            {/* Detailed Narration & Subtitle Transcript Timeline */}
            {showSubtitle && artifact.subtitles?.[currentLang] && artifact.subtitles[currentLang]!.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('detailedNarration')}</span>
                  </span>
                </div>

                <LiveTranscriptCard
                  subtitles={artifact.subtitles[currentLang]!}
                  currentTime={currentArtifact?.id === artifact.id && isPlaying ? currentTime : -1}
                  onSeekCue={(sec, index) => {
                    const cues =
                      artifact.subtitles?.[currentLang] ||
                      artifact.subtitles?.['vi'] ||
                      [];
                    if (currentArtifact?.id !== artifact.id || !isPlaying) {
                      playArtifact(artifact, index, sec);
                    } else {
                      seekToCue(index, sec, artifact, cues, currentLang, playbackRate);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Bottom Sticky Action: Play Audio */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => {
                if (isCurrentPlaying) {
                  stop();
                } else {
                  playArtifact(artifact, 0, 0, showSubtitle);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all ${
                isCurrentPlaying
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
              }`}
            >
              {isCurrentPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Dừng thuyết minh</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>{t('listenGuide')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
