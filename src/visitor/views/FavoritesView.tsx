import React from 'react';
import { Artifact } from '../../shared/types';
import { useFavStore as useFavorites } from '../../shared/stores/favStore';
import { useLangStore } from '../../shared/stores/langStore';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const FavoritesView: React.FC<Props> = ({ artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { favorites, toggleFavorite } = useFavorites();

  const favArtifacts = artifacts.filter((a) => favorites.includes(a.id));

  return (
    <div className="flex flex-col gap-4 pb-28">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <span>{t('favorites')}</span>
          <span className="text-sm font-normal text-slate-400">({favArtifacts.length})</span>
        </h2>
      </div>

      {favArtifacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/60 shadow-sm flex flex-col items-center gap-3">
          <Heart className="w-12 h-12 text-slate-200" />
          <p className="text-slate-500 text-sm font-medium">{t('noFavorites')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {favArtifacts.map((artifact) => (
            <div
              key={artifact.id}
              onClick={() => onSelectArtifact(artifact)}
              className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow transition cursor-pointer flex gap-3.5 items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={artifact.images[0]}
                  alt={artifact.title[currentLang]}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-xs font-mono font-semibold text-amber-600">
                    {artifact.code}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">
                    {artifact.title[currentLang] || artifact.title['vi']}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(artifact.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  title="Xóa khỏi yêu thích"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
