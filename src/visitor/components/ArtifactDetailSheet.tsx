import React from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useFavStore } from '../../shared/stores/favStore';
import { X, Volume2, Heart, MapPin, ArrowLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header Action Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          {/* Nút lùi về (Back) */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition pointer-events-auto flex items-center gap-1.5 text-xs font-bold"
            title={t('back')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back')}</span>
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => toggleFavorite(artifact.id)}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition-colors ${
                fav ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
              }`}
              title={t('favorites')}
            >
              <Heart className={`w-5 h-5 ${fav ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white shadow-md transition-colors"
              title={t('close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Showcase */}
        <div className="w-full h-64 sm:h-72 bg-slate-100 overflow-hidden relative shrink-0">
          <img
            src={artifact.images[0]}
            alt={artifact.title[currentLang]}
            onError={(e) => {
              e.currentTarget.src = 'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-xs px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('codeLabel')}: {artifact.code}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {artifact.title[currentLang] || artifact.title['vi']}
            </h2>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {artifact.description[currentLang] || artifact.description['vi']}
          </p>
        </div>

        {/* Sticky Play Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          <button
            onClick={() => playArtifact(artifact)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold shadow-md transition-all ${
              isCurrentPlaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>{isCurrentPlaying ? t('playing') : t('listenGuide')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
