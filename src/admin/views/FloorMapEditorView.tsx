import React, { useState, useEffect } from 'react';
import { Floor, Artifact } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import {
  Map,
  MapPin,
  Save,
  Layers,
  Info,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  RotateCcw
} from 'lucide-react';

export const FloorMapEditorView: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<number>(1);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setFloors(res.floors);
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) {
        const topArtifact = res.artifacts[0];
        setSelectedArtifactId(topArtifact.id);
        if (topArtifact.floorId) {
          setSelectedFloorId(topArtifact.floorId);
        }
      }
    });
  }, []);

  const currentFloor = floors.find((f) => f.id === selectedFloorId) || floors[0];
  const floorArtifacts = artifacts.filter((a) => a.floorId === selectedFloorId);

  // Handle Map Pin Placing
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedArtifactId || !currentFloor) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert pixel click to scaled bounds coordinate (800x600)
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

  // Change Background Image URL for the current floor
  const handleBackgroundChange = (newUrl: string) => {
    setFloors((prev) =>
      prev.map((f) => {
        if (f.id === selectedFloorId) {
          return { ...f, mapImage: newUrl };
        }
        return f;
      })
    );
  };

  // Handle Local File Upload for Background Map
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleBackgroundChange(reader.result);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Save changes to localStorage via museumApi
  const handleSave = () => {
    museumApi.saveCustomFloors(floors);
    museumApi.saveCustomArtifacts(artifacts);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Reset to original mock data
  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại sơ đồ và tọa độ ban đầu?')) {
      museumApi.resetDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-amber-500" />
            Biên Tập Sơ Đồ Khu Vực & Tọa Độ Hiện Vật
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tùy chỉnh ảnh nền sơ đồ bảo tàng và nhấp chuột trực tiếp để ghim vị trí hiện vật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition"
            title="Khôi phục ảnh nền sơ đồ mặc định"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi Phục Mặc Định</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi Sơ Đồ</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã lưu ảnh nền sơ đồ và tọa độ hiện vật thành công! Giao diện khách tham quan đã được cập nhật ngay lập tức.</span>
        </div>
      )}

      {/* Floor Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold uppercase shrink-0 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-500" /> Chọn Khu Vực:
        </span>
        {floors.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFloorId(f.id);
              const floorArts = artifacts.filter((a) => a.floorId === f.id);
              if (floorArts.length > 0) {
                setSelectedArtifactId(floorArts[0].id);
              } else {
                setSelectedArtifactId(null);
              }
            }}
            className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
              selectedFloorId === f.id
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/80'
            }`}
          >
            {f.name.vi}
          </button>
        ))}
      </div>

      {/* Background Map Image Editor Panel */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Ảnh Nền Sơ Đồ ({currentFloor?.name.vi})
            </div>
            <p className="text-xs text-slate-400">
              Nhập liên kết ảnh bản đồ trực tiếp hoặc chọn tệp tải lên từ thiết bị.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 max-w-xl">
          <input
            type="text"
            value={currentFloor?.mapImage || ''}
            onChange={(e) => handleBackgroundChange(e.target.value)}
            placeholder="Nhập đường dẫn ảnh sơ đồ (URL)..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-650 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition border border-slate-600">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{isUploading ? 'Đang tải...' : 'Tải ảnh lên'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exhibit Pin Selector List */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <Info className="w-4 h-4 shrink-0" />
            <span>Chọn hiện vật bên dưới, sau đó nhấp vào sơ đồ bên phải để đặt lại vị trí.</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {floorArtifacts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Chưa có hiện vật nào thuộc khu vực này.
              </div>
            ) : (
              floorArtifacts.map((art) => {
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
                      <MapPin
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-400/90">
                            {art.code}
                          </span>
                          {(art.createdAt || (!art.id.startsWith('WRM') && artifacts[0]?.id === art.id)) && (
                            <span className="text-[9px] font-sans font-bold bg-amber-500 text-slate-950 px-1 py-0.2 rounded shadow-sm">
                              MỚI
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold truncate max-w-[150px] text-slate-200">
                          {art.title['vi']}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      ({art.mapCoordinates.x}, {art.mapCoordinates.y})
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Interactive Canvas Map with Background */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              Sơ đồ hiển thị: {currentFloor?.name.vi}
            </span>
            <span className="font-mono text-[11px] text-amber-400">
              {floorArtifacts.length} hiện vật trên sơ đồ
            </span>
          </div>

          <div
            onClick={handleMapClick}
            className="w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden relative shadow-2xl border border-slate-700/80 cursor-crosshair group select-none"
          >
            {currentFloor && (
              <>
                <img
                  src={currentFloor.mapImage}
                  alt={currentFloor.name.vi}
                  className="w-full h-full object-cover opacity-80 pointer-events-none transition-opacity"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {floorArtifacts.map((art) => {
                  const isSelected = selectedArtifactId === art.id;
                  const isNewest = artifacts[0]?.id === art.id;
                  const leftPercent = (art.mapCoordinates.x / currentFloor.bounds.width) * 100;
                  const topPercent = (art.mapCoordinates.y / currentFloor.bounds.height) * 100;

                  return (
                    <div
                      key={art.id}
                      style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-full shadow-2xl transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/50 z-30 animate-pulse'
                          : isNewest
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/80 hover:scale-110 z-20 shadow-amber-500/30'
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
