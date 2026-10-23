import React, { useState } from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { useFavStore } from '../../shared/stores/favStore';
import { Search, Volume2, Radio, Sparkles, Heart, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const ExploreView: React.FC<Props> = ({ artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact, currentArtifact, isPlaying } = usePlayerStore();
  const { nearestArtifactId } = useGeofenceStore();
  const { isFavorite, toggleFavorite } = useFavStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<number | 'all'>('all');

  const filtered = artifacts.filter((a) => {
    const title = (a.title[currentLang] || a.title['vi']).toLowerCase();
    const code = a.code.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchSearch = title.includes(query) || code.includes(query);
    const matchFloor = selectedFloorFilter === 'all' || a.floorId === selectedFloorFilter;
    return matchSearch && matchFloor;
  });

  const nearestArtifact = artifacts.find((a) => a.id === nearestArtifactId);

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Web Hero & Search Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider w-fit">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('appName')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Khám Phá Di Sản & Cổ Vật Lịch Sử
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hệ thống thuyết minh tự động nhận diện hiện vật qua định vị GPS không gian và quét mã QR tương tác thông minh.
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-white placeholder-slate-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500/60 text-sm sm:text-base backdrop-blur-md"
            />
          </div>

          {/* Quick Filter Floor Pills */}
          <div className="flex items-center gap-2 mt-1 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Lọc theo:</span>
            <button
              onClick={() => setSelectedFloorFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                selectedFloorFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('allFloors')}
            </button>
            <button
              onClick={() => setSelectedFloorFilter(1)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                selectedFloorFilter === 1
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tầng 1
            </button>
            <button
              onClick={() => setSelectedFloorFilter(2)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                selectedFloorFilter === 2
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tầng 2
            </button>
          </div>
        </div>
      </div>

      {/* Auto-detect GPS Proximity Card */}
      {nearestArtifact && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce-subtle border border-amber-400/40">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('nearYou')}
              </div>
              <div className="font-bold text-base sm:text-lg">
                {nearestArtifact.title[currentLang] || nearestArtifact.title['vi']}
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectArtifact(nearestArtifact)}
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-amber-600 font-bold rounded-xl text-sm shadow-md hover:bg-amber-50 transition shrink-0 text-center"
          >
            {t('listenGuide')}
          </button>
        </div>
      )}

      {/* Exhibits Catalog Grid (Desktop 3-4 columns) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
            Danh Sách Hiện Vật Trưng Bày ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 bg-white rounded-3xl border border-slate-200 text-center text-slate-400 text-sm">
            {t('noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((artifact) => {
              const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;
              const fav = isFavorite(artifact.id);

              return (
                <div
                  key={artifact.id}
                  onClick={() => onSelectArtifact(artifact)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col group"
                >
                  {/* Top Image Showcase */}
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                    <img
                      src={artifact.images[0]}
                      alt={artifact.title[currentLang] || artifact.title['vi']}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Floating Code Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                      {artifact.code}
                    </div>

                    {/* Floating Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(artifact.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow transition ${
                        fav ? 'bg-red-500 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'
                      }`}
                      title={t('favorites')}
                    >
                      <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
                        Tầng {artifact.floorId}
                      </div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {artifact.title[currentLang] || artifact.title['vi']}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {artifact.description[currentLang] || artifact.description['vi']}
                      </p>
                    </div>

                    {/* Card Action Button */}
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
                      title={t('listenGuide')}
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
    </div>
  );
};
