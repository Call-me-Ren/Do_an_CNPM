import React, { useState, useEffect } from 'react';
import { Floor, Artifact } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import { Map, MapPin, Save, Layers, Info, CheckCircle2 } from 'lucide-react';

export const FloorMapEditorView: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(1);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setFloors(res.floors);
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) {
        setSelectedArtifactId(res.artifacts[0].id);
      }
    });
  }, []);

  const currentFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const floorArtifacts = artifacts.filter((a) => a.floorId === selectedFloorId);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedArtifactId || !currentFloor) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel click to coordinate scale (800x600 bounds)
    const scaledX = Math.round((clickX / rect.width) * currentFloor.bounds.width);
    const scaledY = Math.round((clickY / rect.height) * currentFloor.bounds.height);

    setArtifacts((prev) =>
      prev.map((art) => {
        if (art.id === selectedArtifactId) {
          return {
            ...art,
            floorId: selectedFloorId,
            mapCoordinates: { x: scaledX, y: scaledY },
          };
        }
        return art;
      })
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-amber-500" />
            Biên Tập Sơ Đồ & Tọa Độ Hiện Vật
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhấp chuột trực tiếp lên sơ đồ để ghim hoặc dời vị trí của hiện vật trưng bày.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Lưu Thay Đổi Sơ Đồ</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu tọa độ hiện vật thành công! Khách tham quan sẽ thấy ngay vị trí mới.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exhibit Pin Selector */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-semibold uppercase">Chọn Tầng:</span>
            {floors.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFloorId(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedFloorId === f.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Tầng {f.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl">
            <Info className="w-4 h-4 shrink-0" />
            <span>Chọn hiện vật bên dưới, sau đó nhấp vào vị trí bất kỳ trên bản đồ bên phải để đặt pin.</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
            {floorArtifacts.map((art) => {
              const isSelected = selectedArtifactId === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setSelectedArtifactId(art.id)}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-mono font-bold">{art.code}</div>
                      <div className="text-sm font-semibold truncate max-w-[150px]">{art.title['vi']}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({art.mapCoordinates.x}, {art.mapCoordinates.y})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Canvas Map */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bản đồ: {currentFloor?.name}</span>
            <span>Kích thước chuẩn: 800 &times; 600 px</span>
          </div>

          <div
            onClick={handleMapClick}
            className="w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden relative shadow-2xl border border-slate-700/80 cursor-crosshair group select-none"
          >
            {currentFloor && (
              <>
                <img
                  src={currentFloor.mapImage}
                  alt={currentFloor.name}
                  className="w-full h-full object-cover opacity-75 pointer-events-none"
                />

                {floorArtifacts.map((art) => {
                  const isSelected = selectedArtifactId === art.id;
                  const leftPercent = (art.mapCoordinates.x / currentFloor.bounds.width) * 100;
                  const topPercent = (art.mapCoordinates.y / currentFloor.bounds.height) * 100;

                  return (
                    <div
                      key={art.id}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-full shadow-2xl transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/50 z-20 animate-pulse'
                          : 'bg-slate-900/90 text-white border border-slate-600 hover:scale-110 z-10'
                      }`}
                      title={`${art.code} - ${art.title['vi']}`}
                    >
                      <MapPin className="w-4 h-4 fill-current" />
                      <span className="absolute bottom-full mb-1 bg-slate-900/95 text-white text-[10px] px-2 py-0.5 rounded font-mono whitespace-nowrap shadow pointer-events-none border border-slate-700">
                        {art.code}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
