import React from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useFavStore } from '../../shared/stores/favStore';
import { X, Volume2, Heart, MapPin, ArrowLeft, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifact: Artifact | null;
  onClose: () => void;
}

export const ArtifactDetailSheet: React.FC<Props> = ({ artifact, onClose }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact, currentArtifact, isPlaying } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavStore();

  if (!artifact) return null;

  const isCurrentPlaying = currentArtifact?.id === artifact.id && isPlaying;
  const fav = isFavorite(artifact.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full max-w-lg md:max-w-4xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative border border-slate-200">
        {/* Left Column: Image Showcase (Top on mobile, Left on desktop) */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-auto bg-slate-950 overflow-hidden relative shrink-0 flex items-center justify-center">
          <img
            src={artifact.images[0]}
            alt={artifact.title[currentLang] || artifact.title['vi']}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
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
          {/* Top Actions: Back, Favorite, Close */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
              title={t('back')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </button>

            <div className="flex items-center gap-2">
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
                onClick={onClose}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title={t('close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Body */}
          <div className="py-5 flex flex-col gap-3 flex-1 overflow-y-auto">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600">
              {t('museumArtifactTag')} &bull; {artifact.code}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {artifact.title[currentLang] || artifact.title['vi']}
            </h2>
            <div className="h-0.5 w-12 bg-amber-500 rounded-full my-1" />
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mt-1">
              {artifact.description[currentLang] || artifact.description['vi']}
            </p>
          </div>

          {/* Bottom Sticky Action: Play Audio */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => playArtifact(artifact)}
              className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all ${
                isCurrentPlaying
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              <span>{isCurrentPlaying ? t('playing') : t('listenGuide')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
