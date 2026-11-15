import React, { useState, useEffect, useMemo } from 'react';
import { Artifact, SupportedLanguage, SubtitleCue } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import { ttsService } from '../../shared/services/tts';
import { resolveAssetUrl, getArtifactFallbackImage } from '../../shared/utils/assetHelper';
import { AlertModal } from '../../shared/components/AlertModal';
import {
  Music,
  Upload,
  Play,
  Pause,
  Subtitles,
  FileAudio,
  Bot,
  Trash2,
  FileText,
  Plus,
  X,
  Check,
  Search,
  Sparkles,
  Loader2
} from 'lucide-react';
import { AutoTranslateModal, AutoTranslateResult } from '../components/AutoTranslateModal';

const MAX_AUDIO_BYTES = 30 * 1024 * 1024;

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
  { code: 'zh', label: 'ZH' },
  { code: 'ko', label: 'KO' },
  { code: 'ja', label: 'JA' },
];

type LangStatus = 'file' | 'tts' | 'empty';

/** Trạng thái thuyết minh của 1 ngôn ngữ: có file ghi âm / chỉ giọng đọc AI / trống */
const getLangStatus = (art: Artifact, lang: SupportedLanguage): LangStatus => {
  if (art.audio?.[lang]) return 'file';
  if ((art.subtitles?.[lang]?.length ?? 0) > 0 || art.description?.[lang]) return 'tts';
  return 'empty';
};

const STATUS_DOT: Record<LangStatus, string> = {
  file: 'bg-emerald-400',
  tts: 'bg-zinc-200',
  empty: 'bg-slate-600',
};

const STATUS_LABEL: Record<LangStatus, string> = {
  file: 'Có file ghi âm',
  tts: 'Giọng đọc AI',
  empty: 'Chưa có nội dung',
};

/** Luôn sắp xếp mốc phụ đề theo thời gian bắt đầu */
const sortCues = (cues: SubtitleCue[]) => [...cues].sort((a, b) => a.start - b.start);

/** Rút gọn tên file hiển thị từ URL (bỏ qua data URL) */
const getAudioLabel = (url: string) => {
  if (url.startsWith('data:')) return 'Tệp vừa tải lên';
  try {
    return decodeURIComponent(url.split('/').pop() || url);
  } catch {
    return url.split('/').pop() || url;
  }
};

export const AudioManageView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('vi');
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [isAutoTranslateOpen, setIsAutoTranslateOpen] = useState(false);

  // Dòng thêm mốc phụ đề nhanh (thay cho modal)
  const [isAddingCue, setIsAddingCue] = useState(false);
  const [newCueStart, setNewCueStart] = useState(0);
  const [newCueEnd, setNewCueEnd] = useState(5);
  const [newCueText, setNewCueText] = useState('');

  // Xác nhận xóa tại chỗ (bấm 2 lần)
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const [modalAlert, setModalAlert] = useState<{
    title?: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  } | null>(null);

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) setSelectedId(res.artifacts[0].id);
    });
    return () => {
      ttsService.stop();
    };
  }, []);

  // Tự hủy trạng thái "Xóa?" sau 3 giây nếu không bấm lần 2
  useEffect(() => {
    if (confirmDeleteIdx === null) return;
    const timer = setTimeout(() => setConfirmDeleteIdx(null), 3000);
    return () => clearTimeout(timer);
  }, [confirmDeleteIdx]);

  const selectedArtifact = artifacts.find((a) => a.id === selectedId) || null;
  const currentSubtitles = useMemo(
    () => sortCues(selectedArtifact?.subtitles?.[selectedLang] || []),
    [selectedArtifact, selectedLang]
  );
  const currentAudio = selectedArtifact?.audio?.[selectedLang];
  const currentDesc = selectedArtifact?.description?.[selectedLang] || selectedArtifact?.description?.['vi'] || '';

  const filteredArtifacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return artifacts;
    return artifacts.filter(
      (a) => a.code.toLowerCase().includes(q) || (a.title['vi'] || '').toLowerCase().includes(q)
    );
  }, [artifacts, search]);

  const stopPreview = () => {
    ttsService.stop();
    setPreviewPlaying(false);
  };

  const resetEditing = () => {
    setIsAddingCue(false);
    setConfirmDeleteIdx(null);
  };

  /** Lưu hiện vật đã chỉnh sửa (dùng chung cho mọi thao tác) */
  const commitArtifact = (updated: Artifact) => {
    const next = artifacts.map((a) => (a.id === updated.id ? updated : a));
    setArtifacts(next);
    museumApi.saveCustomArtifacts(next);
  };

  const commitSubtitles = (cues: SubtitleCue[]) => {
    if (!selectedArtifact) return;
    commitArtifact({
      ...selectedArtifact,
      subtitles: { ...(selectedArtifact.subtitles || {}), [selectedLang]: sortCues(cues) },
    });
  };

  // ===== Âm thanh =====
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !selectedArtifact) return;

    if (file.size > MAX_AUDIO_BYTES) {
      setModalAlert({
        title: 'Giới Hạn Dung Lượng',
        message: 'Tệp âm thanh vượt quá dung lượng tối đa 30MB!',
        type: 'warning',
      });
      return;
    }

    stopPreview();
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setIsUploading(false);
      if (!dataUrl) return;
      commitArtifact({
        ...selectedArtifact,
        audio: { ...(selectedArtifact.audio || {}), [selectedLang]: dataUrl },
      });
      setModalAlert({
        title: 'Tải Lên Thành Công',
        message: `Đã tải tệp [${file.name}] cho ngôn ngữ ${selectedLang.toUpperCase()}.`,
        type: 'success',
      });
    };
    reader.onerror = () => {
      setIsUploading(false);
      setModalAlert({ title: 'Lỗi Đọc Tệp', message: 'Không thể đọc tệp âm thanh.', type: 'error' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAudio = () => {
    if (!selectedArtifact || !currentAudio) return;
    stopPreview();
    const nextAudio = { ...(selectedArtifact.audio || {}) };
    delete nextAudio[selectedLang];
    commitArtifact({ ...selectedArtifact, audio: nextAudio });
  };

  const handleTogglePreview = () => {
    if (previewPlaying) {
      stopPreview();
      return;
    }
    const callbacks = {
      onFinish: () => setPreviewPlaying(false),
      onEnd: () => setPreviewPlaying(false),
      onError: () => setPreviewPlaying(false),
    };
    if (currentSubtitles.length > 0) {
      setPreviewPlaying(true);
      ttsService.playCues(currentSubtitles, 0, selectedLang, 1.0, callbacks, currentAudio);
    } else if (currentDesc) {
      setPreviewPlaying(true);
      ttsService.speak(currentDesc, selectedLang, 1.0, callbacks);
    }
  };

  // ===== Phụ đề =====
  const handleSubtitleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !selectedArtifact) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let imported: SubtitleCue[] = [];

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) imported = parsed;
        } else {
          const lines = text
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l !== '' && !l.startsWith('WEBVTT') && !/^\d+$/.test(l) && !l.includes('-->'));
          // Nối tiếp sau mốc cuối cùng hiện có, mỗi câu 6 giây
          let curTime = currentSubtitles.length > 0 ? currentSubtitles[currentSubtitles.length - 1].end : 0;
          imported = lines.map((line) => {
            const cue = { start: curTime, end: curTime + 6, text: line };
            curTime += 6;
            return cue;
          });
        }

        if (imported.length === 0) {
          setModalAlert({ title: 'Tệp Trống', message: 'Không tìm thấy câu phụ đề nào trong tệp.', type: 'warning' });
          return;
        }

        // Gộp thêm vào danh sách hiện có
        commitSubtitles([...currentSubtitles, ...imported]);
        setModalAlert({
          title: 'Nhập Phụ Đề Thành Công',
          message: `Đã thêm ${imported.length} mốc phụ đề từ [${file.name}].`,
          type: 'success',
        });
      } catch (err: any) {
        setModalAlert({
          title: 'Lỗi Đọc Tệp',
          message: 'Không thể đọc file phụ đề: ' + (err?.message || 'Định dạng không hợp lệ'),
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  const openAddCue = () => {
    const lastEnd = currentSubtitles.length > 0 ? currentSubtitles[currentSubtitles.length - 1].end : 0;
    setNewCueStart(lastEnd);
    setNewCueEnd(lastEnd + 5);
    setNewCueText('');
    setConfirmDeleteIdx(null);
    setIsAddingCue(true);
  };

  const handleAddCue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCueText.trim()) return;
    if (newCueEnd <= newCueStart) {
      setModalAlert({ title: 'Thời Gian Không Hợp Lệ', message: 'Thời điểm kết thúc phải lớn hơn bắt đầu.', type: 'warning' });
      return;
    }
    commitSubtitles([...currentSubtitles, { start: newCueStart, end: newCueEnd, text: newCueText.trim() }]);
    setIsAddingCue(false);
  };

  const handleDeleteCue = (idx: number) => {
    if (confirmDeleteIdx !== idx) {
      setConfirmDeleteIdx(idx);
      return;
    }
    commitSubtitles(currentSubtitles.filter((_, i) => i !== idx));
    setConfirmDeleteIdx(null);
  };

  // ===== Dịch tự động 5 ngôn ngữ (giữ nguyên logic) =====
  const handleApplyAutoTranslate = (res: AutoTranslateResult) => {
    if (!selectedArtifact) return;

    const allLangs: SupportedLanguage[] = ['vi', 'en', 'zh', 'ko', 'ja'];
    const updatedTitle = { ...(selectedArtifact.title || {}), ...res.titles };
    const updatedDesc = { ...(selectedArtifact.description || {}), ...res.descriptions };
    const updatedAudio = { ...(selectedArtifact.audio || {}) };

    if (res.audioDataUrl) {
      updatedAudio[res.sourceLang || selectedLang] = res.audioDataUrl;
    } else {
      // Văn bản mới không kèm file mp3: xóa mp3 cũ để phát bằng giọng đọc AI (TTS)
      for (const l of allLangs) {
        if (res.descriptions[l]) delete updatedAudio[l];
      }
    }

    const updatedSubtitles = { ...(selectedArtifact.subtitles || {}) };
    for (const l of allLangs) {
      if (l === res.sourceLang && res.subtitles && res.subtitles.length > 0) {
        updatedSubtitles[l] = res.subtitles;
      } else {
        const descText = res.descriptions[l];
        if (descText) {
          const sentences = descText
            .split(/(?<=[.?!])\s+|\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
          let curTime = 0;
          updatedSubtitles[l] = sentences.map((sentence) => {
            const duration = Math.max(3, Math.min(8, Math.round(sentence.length / 15)));
            const cue: SubtitleCue = { start: curTime, end: curTime + duration, text: sentence };
            curTime += duration;
            return cue;
          });
        }
      }
    }

    stopPreview();
    resetEditing();
    commitArtifact({
      ...selectedArtifact,
      title: updatedTitle as any,
      description: updatedDesc as any,
      audio: updatedAudio,
      subtitles: updatedSubtitles,
    });
    setSelectedLang(res.sourceLang || selectedLang);

    setModalAlert({
      title: 'Đồng Bộ Thành Công',
      message: `Đã cập nhật phụ đề và giọng đọc cho 5 ngôn ngữ của hiện vật [${selectedArtifact.code}].`,
      type: 'success',
    });
  };

  const currentStatus = selectedArtifact ? getLangStatus(selectedArtifact, selectedLang) : 'empty';
  const canPreview = currentSubtitles.length > 0 || Boolean(currentDesc);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Music className="w-5 h-5 text-white" />
        Quản lý âm thanh &amp; phụ đề
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ===== Cột trái: danh sách hiện vật ===== */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hoặc tên..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ca8a04]"
            />
          </div>

          <div className="flex flex-col gap-1.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredArtifacts.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-6">Không tìm thấy hiện vật.</div>
            )}
            {filteredArtifacts.map((art) => {
              const active = selectedId === art.id;
              return (
                <button
                  key={art.id}
                  onClick={() => {
                    stopPreview();
                    resetEditing();
                    setSelectedId(art.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-3 ${
                    active
                      ? 'bg-[#ca8a04]/10 border-[#ca8a04]/60'
                      : 'bg-slate-900 border-transparent hover:border-slate-700'
                  }`}
                >
                  <img
                    src={resolveAssetUrl(art.images[0])}
                    alt={art.title['vi']}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getArtifactFallbackImage(art.code, art.title['vi'], art.floorId);
                    }}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-mono font-bold ${active ? 'text-white' : 'text-zinc-300'}`}>
                        {art.code}
                      </span>
                      <span className="flex items-center gap-1" aria-label="Trạng thái 5 ngôn ngữ">
                        {LANGUAGES.map((l) => (
                          <span
                            key={l.code}
                            title={`${l.label}: ${STATUS_LABEL[getLangStatus(art, l.code)]}`}
                            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[getLangStatus(art, l.code)]}`}
                          />
                        ))}
                      </span>
                    </div>
                    <div className="text-sm text-slate-200 truncate">{art.title['vi']}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-2 border-t border-slate-700/60">
            {(['file', 'tts', 'empty'] as LangStatus[]).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
                {STATUS_LABEL[s]}
              </span>
            ))}
          </div>
        </div>

        {/* ===== Cột phải: chi tiết ===== */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-5">
          {!selectedArtifact ? (
            <div className="text-slate-400 text-sm text-center py-12">Chọn một hiện vật ở danh sách bên trái.</div>
          ) : (
            <>
              {/* Header: tên + ngôn ngữ + dịch tự động */}
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white">{selectedArtifact.code}</div>
                    <div className="text-base font-bold text-white truncate">{selectedArtifact.title['vi']}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAutoTranslateOpen(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 text-zinc-200 hover:bg-[#ca8a04]/10 text-xs font-semibold transition"
                    title="Nhập văn bản hoặc tệp để tự động dịch sang 5 ngôn ngữ"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Dịch tự động
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {LANGUAGES.map((l) => {
                    const status = getLangStatus(selectedArtifact, l.code);
                    const active = selectedLang === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          stopPreview();
                          resetEditing();
                          setSelectedLang(l.code);
                        }}
                        title={STATUS_LABEL[status]}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          active ? 'bg-[#ca8a04] text-stone-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Âm thanh */}
              <section className="flex flex-col gap-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Âm thanh</h4>
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {currentStatus === 'file' ? (
                      <FileAudio className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Bot className="w-5 h-5 text-white shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        {currentStatus === 'file' ? 'File ghi âm' : currentStatus === 'tts' ? 'Giọng đọc AI (TTS)' : 'Chưa có nội dung'}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {currentAudio
                          ? getAudioLabel(currentAudio)
                          : currentStatus === 'tts'
                            ? 'Máy đọc tự động từ phụ đề / mô tả'
                            : 'Tải tệp âm thanh hoặc thêm phụ đề'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleTogglePreview}
                      disabled={!canPreview}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed ${
                        previewPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#ca8a04] hover:bg-[#a16207] text-stone-950'
                      }`}
                    >
                      {previewPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      {previewPlaying ? 'Dừng' : 'Nghe thử'}
                    </button>

                    <label
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 text-slate-200 hover:bg-slate-800 transition cursor-pointer ${
                        isUploading ? 'opacity-60 pointer-events-none' : ''
                      }`}
                      title="MP3, WAV, AAC ≤ 30MB"
                    >
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      {isUploading ? 'Đang xử lý...' : 'Tải tệp'}
                      <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    </label>

                    {currentAudio && (
                      <button
                        onClick={handleRemoveAudio}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                        title="Xóa tệp ghi âm, quay lại giọng đọc AI"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Phụ đề */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Subtitles className="w-3.5 h-3.5" />
                    Phụ đề ({currentSubtitles.length} mốc)
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openAddCue}
                      disabled={isAddingCue}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-700 transition disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm mốc
                    </button>
                    <label
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                      title=".srt, .vtt, .txt, .json — gộp thêm vào danh sách hiện có"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Nhập tệp
                      <input type="file" accept=".srt,.vtt,.txt,.json" onChange={handleSubtitleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {isAddingCue && (
                  <form
                    onSubmit={handleAddCue}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 bg-slate-900 border border-white/30 rounded-xl"
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newCueStart}
                      onChange={(e) => setNewCueStart(parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ca8a04]"
                      aria-label="Bắt đầu (giây)"
                      title="Bắt đầu (giây)"
                    />
                    <span className="text-slate-500 text-xs">–</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={newCueEnd}
                      onChange={(e) => setNewCueEnd(parseFloat(e.target.value) || 0)}
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#ca8a04]"
                      aria-label="Kết thúc (giây)"
                      title="Kết thúc (giây)"
                    />
                    <input
                      autoFocus
                      value={newCueText}
                      onChange={(e) => setNewCueText(e.target.value)}
                      placeholder="Nội dung câu phụ đề..."
                      className="flex-1 min-w-[160px] bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ca8a04]"
                      required
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-[#ca8a04] hover:bg-[#a16207] text-stone-950 transition"
                      title="Lưu"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingCue(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Hủy"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {currentSubtitles.length === 0 ? (
                  !isAddingCue && (
                    <div className="text-xs text-slate-500 text-center py-6 bg-slate-900/60 rounded-xl">
                      Chưa có phụ đề cho ngôn ngữ này.
                    </div>
                  )
                ) : (
                  <div className="flex flex-col divide-y divide-slate-700/50 bg-slate-900 border border-slate-700/60 rounded-xl max-h-80 overflow-y-auto">
                    {currentSubtitles.map((cue, idx) => {
                      const confirming = confirmDeleteIdx === idx;
                      return (
                        <div key={`${cue.start}-${idx}`} className="flex items-start gap-3 px-3 py-2 text-xs group">
                          <span className="font-mono text-zinc-200 shrink-0 w-20 pt-0.5">
                            {cue.start}s–{cue.end}s
                          </span>
                          <span className="text-slate-200 flex-1 line-clamp-2">{cue.text}</span>
                          <button
                            onClick={() => handleDeleteCue(idx)}
                            className={`shrink-0 rounded-md transition flex items-center gap-1 ${
                              confirming
                                ? 'px-2 py-0.5 bg-red-500 text-white font-bold'
                                : 'p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 opacity-60 group-hover:opacity-100'
                            }`}
                            title={confirming ? 'Bấm lần nữa để xóa' : 'Xóa mốc này'}
                          >
                            {confirming ? 'Xóa?' : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <AutoTranslateModal
        isOpen={isAutoTranslateOpen}
        onClose={() => setIsAutoTranslateOpen(false)}
        onApply={handleApplyAutoTranslate}
        defaultTitle={selectedArtifact?.title?.[selectedLang] || ''}
        defaultDescription={selectedArtifact?.description?.[selectedLang] || ''}
      />

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
