import React, { useState } from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { useFavStore } from '../../shared/stores/favStore';
import { resolveAssetUrl, getArtifactFallbackImage } from '../../shared/utils/assetHelper';
import { getFloorName } from '../../shared/utils/floorHelper';
import { Search, Volume2, Square, Radio, Sparkles, Heart, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const ExploreView: React.FC<Props> = ({ artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact, stop, currentArtifact, isPlaying } = usePlayerStore();
  const { nearestArtifactId } = useGeofenceStore();
  const { isFavorite, toggleFavorite } = useFavStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const uniqueFloors = Array.from(new Set(artifacts.map((a) => a.floorId))).sort((a, b) => a - b);

  const filtered = artifacts.filter((a) => {
    const title = (a.title[currentLang] || a.title['vi'] || '').toLowerCase();
    const desc = (a.description[currentLang] || a.description['vi'] || '').toLowerCase();
    const code = a.code.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchSearch =
      !query || title.includes(query) || code.includes(query) || desc.includes(query);
    const matchFloor = selectedFloorFilter === 'all' || a.floorId === selectedFloorFilter;
    return matchSearch && matchFloor;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArtifacts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleFloorChange = (floor: number | 'all') => {
    setSelectedFloorFilter(floor);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const target = document.getElementById('exhibits-list-top');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const nearestArtifact = artifacts.find((a) => a.id === nearestArtifactId);

  return (
    <div className="flex flex-col gap-8 pb-32 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Web Hero & Search Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background Hero Image */}
        <img
          src={resolveAssetUrl('/images/museum/Bảo tàng Chứng tích Chiến tranh.jpg')}
          alt="Bảo tàng Chứng tích Chiến tranh"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveAssetUrl('/images/museum/Bảo tàng Chứng tích Chiến tranh thông tin.webp');
          }}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition duration-700 hover:scale-105"
        />
        {/* Balanced Gradient Overlay: subtle darkening on left for text readability, clear museum view on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent pointer-events-none" />

        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider w-fit backdrop-blur-md shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('appName')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            {t('heroTitle')}
          </h2>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed drop-shadow-sm font-medium">
            {t('heroSubtitle')}
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-white placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500/70 text-sm sm:text-base backdrop-blur-md"
            />
          </div>

          {/* Quick Filter Floor Pills */}
          <div className="flex items-center gap-2 mt-1 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-300 font-semibold shrink-0 drop-shadow">{t('filterBy')}</span>
            <button
              onClick={() => handleFloorChange('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 backdrop-blur-md ${
                selectedFloorFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900/70 border border-slate-700/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t('allFloors')}
            </button>
            {uniqueFloors.map((floorId) => (
              <button
                key={floorId}
                onClick={() => handleFloorChange(floorId)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 backdrop-blur-md ${
                  selectedFloorFilter === floorId
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/70 border border-slate-700/60 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {getFloorName(floorId, currentLang)}
              </button>
            ))}
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
                <span>{t('nearYou')} &bull; GPS</span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl leading-snug mt-0.5">
                {nearestArtifact.title[currentLang] || nearestArtifact.title['vi']}
              </h3>
              <p className="text-xs text-amber-100/90 line-clamp-1 mt-0.5">
                {nearestArtifact.description[currentLang] || nearestArtifact.description['vi']}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onSelectArtifact(nearestArtifact)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition backdrop-blur-md"
            >
              Chi tiết
            </button>
            <button
              onClick={() => playArtifact(nearestArtifact)}
              className="bg-white text-slate-950 hover:bg-amber-100 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>{t('listenGuide')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Artifacts Catalog Grid */}
      <div id="exhibits-list-top" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {t('exhibitsList')}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {t('showingItems')} {filtered.length === 0 ? 0 : startIndex + 1} -{' '}
              {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} {t('ofItems')}{' '}
              {filtered.length} {t('items')}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
            {t('noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArtifacts.map((artifact) => {
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
                        fav
                          ? 'bg-red-500 text-white'
                          : 'bg-white/85 text-slate-700 hover:bg-white'
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
                        {getFloorName(artifact.floorId, currentLang)}
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
                        if (isPlayingThis) {
                          stop();
                        } else {
                          playArtifact(artifact, 0, 0, false);
                        }
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                        isPlayingThis
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700'
                      }`}
                      title={isPlayingThis ? 'Dừng phát' : t('listenGuide')}
                    >
                      {isPlayingThis ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Dừng phát</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>{t('listenGuide')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 mt-4">
            <span className="text-xs text-slate-500 font-medium">
              {t('page')} {currentPage} / {totalPages}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('prevPage')}</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition shadow-xs ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <span>{t('nextPage')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
