import React from 'react';
import { Artifact } from '../../shared/types';
import { useFavStore as useFavorites } from '../../shared/stores/favStore';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { Heart, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const FavoritesView: React.FC<Props> = ({ artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { favorites, toggleFavorite } = useFavorites();
  const { playArtifact, currentArtifact, isPlaying } = usePlayerStore();

  const favArtifacts = artifacts.filter((a) => favorites.includes(a.id));

  return (
    <div className="flex flex-col gap-6 pb-32">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            <span>{t('favorites')}</span>
            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200/60">
              {favArtifacts.length}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('favoritesSubtitle')}
          </p>
        </div>
      </div>

      {favArtifacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs flex flex-col items-center gap-4 max-w-lg mx-auto w-full my-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-400">
            <Heart className="w-8 h-8" />
          </div>
          <div className="text-slate-800 font-bold text-base">{t('noFavorites')}</div>
          <p className="text-slate-400 text-xs sm:text-sm">
            {t('favoritesEmptyHint')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favArtifacts.map((artifact) => {
            const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;
            return (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact(artifact)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col group"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={artifact.images[0]}
                    alt={artifact.title[currentLang] || artifact.title['vi']}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {artifact.code}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(artifact.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white shadow transition hover:scale-110"
                    title={t('removeFromFavorites')}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                      {t('floorPrefix')} {artifact.floorId}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {artifact.title[currentLang] || artifact.title['vi']}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {artifact.description[currentLang] || artifact.description['vi']}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playArtifact(artifact);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                      isPlayingThis
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingThis ? t('playing') : t('listenGuide')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
