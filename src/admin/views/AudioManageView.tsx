import React, { useState, useEffect } from 'react';
import { Artifact, SupportedLanguage } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import { Music, Upload, Play, Pause, Subtitles, CheckCircle2, AlertCircle, FileAudio, Trash2 } from 'lucide-react';

export const AudioManageView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('vi');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewPlaying, setPreviewPlaying] = useState(false);

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) {
        setSelectedArtifact(res.artifacts[0]);
      }
    });
  }, []);

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Tệp âm thanh vượt quá dung lượng tối đa 50MB!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert(`Đã tải lên tệp ${file.name} cho ngôn ngữ [${selectedLang.toUpperCase()}] thành công!`);
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const currentAudioSrc = selectedArtifact?.audio[selectedLang];
  const currentSubtitles = selectedArtifact?.subtitles?.[selectedLang] || [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-500" />
          Quản Lý Tệp Âm Thanh & Phụ Đề
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tải lên bài thuyết minh audio và file phụ đề đồng bộ mốc thời gian theo từng ngôn ngữ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Artifact Selection */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm">Chọn Hiện Vật Cần Cập Nhật</h3>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
            {artifacts.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  setSelectedArtifact(art);
                  setPreviewPlaying(false);
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                  selectedArtifact?.id === art.id
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <img
                  src={art.images[0]}
                  alt={art.title['vi']}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono font-bold text-amber-500">{art.code}</div>
                  <div className="font-medium text-sm text-slate-200 truncate">
                    {art.title['vi']}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Audio Details & Subtitles */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-6 flex flex-col gap-5">
          {selectedArtifact ? (
            <>
              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-700/80 pb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase mr-2">Ngôn ngữ:</span>
                {languages.map((l) => {
                  const hasAudio = !!selectedArtifact.audio[l.code];
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLang(l.code);
                        setPreviewPlaying(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        selectedLang === l.code
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{l.label}</span>
                      {hasAudio ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Audio Status & Upload Area */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Tệp âm thanh hiện tại:</span>
                    <div className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-amber-400" />
                      {currentAudioSrc ? (
                        <span>Audio_{selectedArtifact.code}_{selectedLang.toUpperCase()}.mp3</span>
                      ) : (
                        <span className="text-slate-500 italic">Chưa có tệp âm thanh</span>
                      )}
                    </div>
                  </div>

                  {currentAudioSrc && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewPlaying(!previewPlaying)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                      >
                        {previewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{previewPlaying ? 'Tạm dừng' : 'Nghe thử'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Action */}
                <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 transition bg-slate-950/40 relative cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleSimulateUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400" />
                  <div className="text-sm text-slate-300 font-medium">
                    Kéo thả hoặc nhấp để chọn tệp âm thanh mới (MP3, WAV, AAC &le; 50MB)
                  </div>
                  <div className="text-xs text-slate-500">
                    Sẽ lưu cho ngôn ngữ: <span className="text-amber-400 font-bold uppercase">{selectedLang}</span>
                  </div>
                </div>

                {isUploading && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Đang tải tệp lên máy chủ...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitles Cue List */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Subtitles className="w-4 h-4 text-amber-500" />
                    Phụ Đề Đồng Bộ Thời Gian ({currentSubtitles.length} mốc)
                  </h4>
                  <button
                    onClick={() => alert('Mở trình soạn thảo phụ đề VTT trực quan')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    + Thêm mốc phụ đề
                  </button>
                </div>

                {currentSubtitles.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-4 bg-slate-900 rounded-xl text-center">
                    Chưa có phụ đề cho ngôn ngữ này.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {currentSubtitles.map((cue, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-semibold">
                            {cue.start}s - {cue.end}s
                          </span>
                          <span className="text-slate-200">{cue.text}</span>
                        </div>
                        <button className="text-slate-500 hover:text-red-400 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-sm text-center py-12">
              Vui lòng chọn hiện vật từ danh sách bên trái.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
