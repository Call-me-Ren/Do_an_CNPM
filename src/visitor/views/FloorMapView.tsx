import React, { useState } from 'react';
import { Floor, Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { Layers, MapPin, Volume2, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  floors: Floor[];
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const FloorMapView: React.FC<Props> = ({ floors, artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact, stop, currentArtifact, isPlaying } = usePlayerStore();
  const [selectedFloorId, setSelectedFloorId] = useState<number>(floors[0]?.id || 1);

  const currentFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const floorArtifacts = artifacts.filter((a) => a.floorId === selectedFloorId);

  return (
    <div className="flex flex-col gap-6 pb-32 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Top Header & Floor Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-600" />
            <span>{t('floorMapTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('floorMapSubtitle')}
          </p>
        </div>

        {/* Floor Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {floors.map((floor) => (
            <button
              key={floor.id}
              onClick={() => setSelectedFloorId(floor.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                selectedFloorId === floor.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {floor.name[currentLang] || floor.name['vi']}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Responsive Web Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Interactive Map Canvas (2 Columns on Desktop) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 relative w-full aspect-[4/3] flex items-center justify-center">
          {currentFloor ? (
            <div className="relative w-full h-full">
              <img
                src={currentFloor.mapImage}
                alt={currentFloor.name[currentLang] || currentFloor.name['vi']}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Pins on the Map */}
              {floorArtifacts.map((artifact) => {
                const leftPercent = (artifact.mapCoordinates.x / currentFloor.bounds.width) * 100;
                const topPercent = (artifact.mapCoordinates.y / currentFloor.bounds.height) * 100;
                const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;

                return (
                  <button
                    key={artifact.id}
                    onClick={() => onSelectArtifact(artifact)}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full shadow-2xl transition-transform hover:scale-125 focus:outline-none ring-4 ${
                      isPlayingThis
                        ? 'bg-amber-400 text-slate-950 ring-amber-400/50 animate-pulse scale-110 z-20'
                        : 'bg-amber-500 text-white ring-amber-400/30 group z-10'
                    }`}
                    title={artifact.title[currentLang] || artifact.title['vi']}
                  >
                    <MapPin className="w-5 h-5" />
                    <div className="hidden sm:group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-2xl pointer-events-none z-30 border border-slate-700">
                      {artifact.title[currentLang] || artifact.title['vi']}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">{t('noMapData')}</div>
          )}
        </div>

        {/* Right: Artifacts in this floor list (1 Column on Desktop) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">
              {t('artifactsInFloor')}{' '}
              <span className="text-amber-600">
                {currentFloor ? currentFloor.name[currentLang] || currentFloor.name['vi'] : ''}
              </span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {floorArtifacts.length}
            </span>
          </div>

          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {floorArtifacts.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                {t('noArtifactsInFloor')}
              </div>
            ) : (
              floorArtifacts.map((artifact) => {
                const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;
                return (
                  <div
                    key={artifact.id}
                    onClick={() => onSelectArtifact(artifact)}
                    className="p-3 rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group bg-slate-50/50 hover:bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={artifact.images[0]}
                        alt={artifact.title[currentLang] || artifact.title['vi']}
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono font-bold text-amber-600">
                          {artifact.code}
                        </div>
                        <div className="text-sm font-bold text-slate-800 truncate group-hover:text-amber-600 transition-colors">
                          {artifact.title[currentLang] || artifact.title['vi']}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingThis) {
                          stop();
                        } else {
                          playArtifact(artifact);
                        }
                      }}
                      className={`p-2.5 rounded-xl shrink-0 transition cursor-pointer ${
                        isPlayingThis
                          ? 'bg-amber-600 text-white animate-pulse shadow-md shadow-amber-600/30'
                          : 'bg-amber-100/70 text-amber-700 hover:bg-amber-500 hover:text-white'
                      }`}
                      title={isPlayingThis ? 'Dừng phát' : t('listenGuide')}
                    >
                      {isPlayingThis ? (
                        <Square className="w-4 h-4 fill-current" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
