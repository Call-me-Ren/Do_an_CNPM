import React, { useState } from 'react';
import { Floor, Artifact } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { Layers, MapPin, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  floors: Floor[];
  artifacts: Artifact[];
  onSelectArtifact: (artifact: Artifact) => void;
}

export const FloorMapView: React.FC<Props> = ({ floors, artifacts, onSelectArtifact }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact, currentArtifact, isPlaying } = usePlayerStore();
  const [selectedFloorId, setSelectedFloorId] = useState<number>(floors[0]?.id || 1);

  const currentFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const floorArtifacts = artifacts.filter((a) => a.floorId === selectedFloorId);

  return (
    <div className="flex flex-col gap-4 pb-28">
      {/* Floor Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Layers className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => setSelectedFloorId(floor.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition shrink-0 ${
              selectedFloorId === floor.id
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {floor.name[currentLang] || floor.name['vi']}
          </button>
        ))}
      </div>

      {/* Interactive Floor Map Canvas Area */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 relative w-full aspect-[4/3] flex items-center justify-center">
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

              return (
                <button
                  key={artifact.id}
                  onClick={() => onSelectArtifact(artifact)}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-2 bg-amber-500 text-white rounded-full shadow-xl hover:scale-125 transition-transform group focus:outline-none ring-4 ring-amber-400/30"
                  title={artifact.title[currentLang]}
                >
                  <MapPin className="w-4 h-4" />
                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-20">
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

      {/* List of artifacts in this floor */}
      <div>
        <h3 className="font-bold text-slate-800 text-sm md:text-base mb-2 px-1">
          {t('artifactsInFloor')} {currentFloor ? (currentFloor.name[currentLang] || currentFloor.name['vi']) : ''} ({floorArtifacts.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {floorArtifacts.map((artifact) => {
            const isPlayingThis = currentArtifact?.id === artifact.id && isPlaying;
            return (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact(artifact)}
                className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm hover:shadow transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={artifact.images[0]}
                    alt={artifact.title[currentLang]}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.metmuseum.org/CRDImages/mi/web-large/DP331225.jpg';
                    }}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-mono font-medium text-amber-600">
                      {artifact.code}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {artifact.title[currentLang] || artifact.title['vi']}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playArtifact(artifact);
                  }}
                  className={`p-2 rounded-xl transition ${
                    isPlayingThis
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  }`}
                  title={t('listenGuide')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
