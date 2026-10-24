import React, { useState, useEffect } from 'react';
import { Artifact, SupportedLanguage, SubtitleCue } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import { ttsService } from '../../shared/services/tts';
import { AlertModal } from '../../shared/components/AlertModal';
import {
  Music,
  Upload,
  Play,
  Pause,
  Subtitles,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Trash2,
  FileText
} from 'lucide-react';

export const AudioManageView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('vi');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [deletingCueIndex, setDeletingCueIndex] = useState<number | null>(null);
  const [modalAlert, setModalAlert] = useState<{
    title?: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) {
        setSelectedArtifact(res.artifacts[0]);
      }
    });

    return () => {
      ttsService.stop();
    };
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
      setModalAlert({
        title: 'Giới Hạn Dung Lượng',
        message: 'Tệp âm thanh vượt quá dung lượng tối đa 50MB!',
        type: 'warning'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setModalAlert({
            title: 'Tải Lên Thành Công',
            message: `Đã tải lên tệp âm thanh [${file.name}] cho ngôn ngữ [${selectedLang.toUpperCase()}] thành công!`,
            type: 'success'
          });
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  const handleSubtitleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedArtifact) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let newCues: SubtitleCue[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) newCues = parsed;
        } else {
          // Parse lines or SRT/VTT formatted text
          const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l !== '' && !l.startsWith('WEBVTT') && !/^\d+$/.test(l) && !l.includes('-->'));

          let curTime = 0;
          lines.forEach((line) => {
            newCues.push({
              start: curTime,
              end: curTime + 6,
              text: line
            });
            curTime += 6;
          });
        }

        if (newCues.length > 0) {
          const updatedSubtitles = {
            ...(selectedArtifact.subtitles || {}),
            [selectedLang]: newCues
          };
          const updatedArt = { ...selectedArtifact, subtitles: updatedSubtitles };
          setSelectedArtifact(updatedArt);
          const updatedArtifacts = artifacts.map((a) => (a.id === updatedArt.id ? updatedArt : a));
          setArtifacts(updatedArtifacts);
          museumApi.saveCustomArtifacts(updatedArtifacts);
          setModalAlert({
            title: 'Nhập Phụ Đề Thành Công',
            message: `Đã nhập thành công ${newCues.length} mốc phụ đề từ tệp [${file.name}]!`,
            type: 'success'
          });
        }
      } catch (err: any) {
        setModalAlert({
          title: 'Lỗi Đọc Tệp',
          message: 'Không thể đọc file phụ đề: ' + (err?.message || 'Định dạng không hợp lệ'),
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
  };

  const currentSubtitles: SubtitleCue[] = selectedArtifact?.subtitles?.[selectedLang] || [];
  const currentDesc = selectedArtifact?.description?.[selectedLang] || selectedArtifact?.description?.['vi'] || '';

  const handleTogglePreview = () => {
    if (previewPlaying) {
      ttsService.stop();
      setPreviewPlaying(false);
    } else {
      const audioUrl = selectedArtifact?.audio?.[selectedLang] || selectedArtifact?.audio?.['vi'];
      if (currentSubtitles.length > 0) {
        setPreviewPlaying(true);
        ttsService.playCues(
          currentSubtitles,
          0,
          selectedLang,
          1.0,
          {
            onFinish: () => setPreviewPlaying(false),
            onError: () => setPreviewPlaying(false)
          },
          audioUrl
        );
      } else if (currentDesc) {
        setPreviewPlaying(true);
        ttsService.speak(
          currentDesc,
          selectedLang,
          1.0,
          {
            onEnd: () => setPreviewPlaying(false),
            onError: () => setPreviewPlaying(false)
          }
        );
      }
    }
  };

  const confirmDeleteCue = () => {
    if (deletingCueIndex === null || !selectedArtifact) return;
    const currentList = selectedArtifact.subtitles?.[selectedLang] || [];
    const nextList = currentList.filter((_, idx) => idx !== deletingCueIndex);
    const updatedSubtitles = {
      ...(selectedArtifact.subtitles || {}),
      [selectedLang]: nextList
    };
    const updatedArt = { ...selectedArtifact, subtitles: updatedSubtitles };
    setSelectedArtifact(updatedArt);
    const updatedArtifacts = artifacts.map((a) => (a.id === updatedArt.id ? updatedArt : a));
    setArtifacts(updatedArtifacts);
    museumApi.saveCustomArtifacts(updatedArtifacts);
    setDeletingCueIndex(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-amber-500" />
          Quản Lý Tệp Âm Thanh & Phụ Đề Đồng Bộ
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Hệ thống Thuyết minh tự động đa ngôn ngữ &bull; Nghe thử phát âm AI thực tế theo từng ngôn ngữ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Artifact Selection */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm">Chọn Hiện Vật Cần Cập Nhật</h3>
          <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
            {artifacts.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  ttsService.stop();
                  setPreviewPlaying(false);
                  setSelectedArtifact(art);
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
              <div className="flex items-center gap-2 border-b border-slate-700/80 pb-3 overflow-x-auto">
                <span className="text-xs text-slate-400 font-semibold uppercase mr-2 shrink-0">Ngôn ngữ:</span>
                {languages.map((l) => {
                  const hasAudio = Boolean(
                    selectedArtifact.audio?.[l.code] ||
                    (selectedArtifact.subtitles?.[l.code] && selectedArtifact.subtitles[l.code]!.length > 0) ||
                    selectedArtifact.description?.[l.code]
                  );

                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        ttsService.stop();
                        setPreviewPlaying(false);
                        setSelectedLang(l.code);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Nguồn âm thanh phát:</span>
                    <div className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                      <FileAudio className="w-4 h-4 text-amber-400" />
                      <span>
                        AI Voice Thuyết Minh Đa Ngữ ({selectedLang.toUpperCase()}) &bull;{' '}
                        {currentSubtitles.length > 0 ? `${currentSubtitles.length} câu phụ đề` : 'Mô tả tóm tắt'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleTogglePreview}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
                        previewPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      }`}
                    >
                      {previewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      <span>{previewPlaying ? 'Dừng phát' : `Nghe thử giọng đọc (${selectedLang.toUpperCase()})`}</span>
                    </button>
                  </div>
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
                    Kéo thả hoặc nhấp để chọn tệp âm thanh ghi âm riêng (MP3, WAV, AAC &le; 50MB)
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
                    <span>Phụ Đề Đồng Bộ Thời Gian ({currentSubtitles.length} mốc)</span>
                  </h4>

                  {/* Upload file phụ đề tự động đồng bộ */}
                  <label className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl transition">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Nhập file phụ đề (.srt, .vtt, .txt, .json)</span>
                    <input
                      type="file"
                      accept=".srt,.vtt,.txt,.json"
                      onChange={handleSubtitleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {currentSubtitles.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-6 bg-slate-900 rounded-xl text-center border border-slate-800">
                    Chưa có phụ đề cho ngôn ngữ này. Hãy tải lên tệp .srt, .vtt hoặc .json để hệ thống tự tạo mốc đồng bộ.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {currentSubtitles.map((cue, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-semibold shrink-0">
                            {cue.start}s - {cue.end}s
                          </span>
                          <span className="text-slate-200 truncate">{cue.text}</span>
                        </div>
                        <button
                          onClick={() => setDeletingCueIndex(idx)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition shrink-0"
                          title="Xóa mốc phụ đề này"
                        >
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

      {/* Delete Confirmation Modal for Subtitle Cue */}
      {deletingCueIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-white text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Xóa Mốc Phụ Đề</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa mốc phụ đề thứ <span className="text-amber-400 font-bold">{deletingCueIndex + 1}</span> ({currentSubtitles[deletingCueIndex]?.start}s - {currentSubtitles[deletingCueIndex]?.end}s)?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setDeletingCueIndex(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteCue}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition shadow-md shadow-red-500/20"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Alert Popup Modal */}
      <AlertModal
        isOpen={!!modalAlert}
        title={modalAlert?.title}
        message={modalAlert?.message || ''}
        type={modalAlert?.type || 'info'}
        onClose={() => setModalAlert(null)}
      />
    </div>
  );
};
