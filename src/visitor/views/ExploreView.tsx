import React, { useState } from 'react';
import { Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { Search, Volume2, Radio, Sparkles } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = artifacts.filter((a) => {
    const title = (a.title[currentLang] || a.title['vi']).toLowerCase();
    const code = a.code.toLowerCase();
    const query = searchTerm.toLowerCase();
    return title.includes(query) || code.includes(query);
  });

  const nearestArtifact = artifacts.find((a) => a.id === nearestArtifactId);

  return (
    <div className="flex flex-col gap-5 pb-28">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm md:text-base text-slate-800"
        />
      </div>

      {/* Auto-detect GPS Proximity Card */}
      {nearestArtifact && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-4 text-white shadow-lg flex items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {t('nearYou')}
              </div>
              <div className="font-bold text-base md:text-lg">
                {nearestArtifact.title[currentLang] || nearestArtifact.title['vi']}
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelectArtifact(nearestArtifact)}
            className="px-4 py-2 bg-white text-amber-600 font-semibold rounded-xl text-sm shadow hover:bg-amber-50 transition shrink-0"
          >
            {t('listenGuide')}
          </button>
        </div>
      )}

      {/* List / Grid of Artifacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm">
            {t('noResults')}
          </div>
        ) : (
          filtered.map((artifact) => {
            const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;
            return (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact(artifact)}
                className="bg-white rounded-3xl p-3.5 border border-slate-200/70 shadow-sm hover:shadow-md transition cursor-pointer flex gap-3.5 items-center group relative overflow-hidden"
              >
                <img
                  src={artifact.images[0]}
                  alt={artifact.title[currentLang]}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold text-amber-600 mb-0.5">
                    {artifact.code}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug truncate">
                    {artifact.title[currentLang] || artifact.title['vi']}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {artifact.description[currentLang] || artifact.description['vi']}
                  </p>
                </div>

                {/* Quick Play Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playArtifact(artifact);
                  }}
                  className={`p-2.5 rounded-2xl shadow transition shrink-0 ${
                    isPlayingThis
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                  }`}
                  title={t('listenGuide')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
