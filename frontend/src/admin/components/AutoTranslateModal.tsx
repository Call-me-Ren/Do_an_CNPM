import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  FileAudio,
  Sparkles,
  Volume2,
  Square,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  FileCode,
  Globe
} from 'lucide-react';
import { SupportedLanguage } from '../../shared/types';
import {
  ALL_LANGUAGES,
  detectLanguage,
  translateToAllLanguages,
  parseFileContent,
  ParsedFileInput
} from '../../shared/services/translationService';
import { ttsService } from '../../shared/services/tts';

export interface AutoTranslateResult {
  titles: Record<SupportedLanguage, string>;
  descriptions: Record<SupportedLanguage, string>;
  audioDataUrl?: string;
  sourceLang: SupportedLanguage;
  subtitles?: import('../../shared/types').SubtitleCue[];
}

interface AutoTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: AutoTranslateResult) => void;
  defaultTitle?: string;
  defaultDescription?: string;
}

export const AutoTranslateModal: React.FC<AutoTranslateModalProps> = ({
  isOpen,
  onClose,
  onApply,
  defaultTitle = '',
  defaultDescription = '',
}) => {
  const [sourceLang, setSourceLang] = useState<SupportedLanguage | 'auto'>('auto');
  const [inputTitle, setInputTitle] = useState(defaultTitle);
  const [inputDescription, setInputDescription] = useState(defaultDescription);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFileInput | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Translation State & Progress
  const [isTranslating, setIsTranslating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [completedLangs, setCompletedLangs] = useState<SupportedLanguage[]>([]);

  // Results
  const [translatedTitles, setTranslatedTitles] = useState<Record<SupportedLanguage, string>>({
    vi: '', en: '', zh: '', ko: '', ja: ''
  });
  const [translatedDescriptions, setTranslatedDescriptions] = useState<Record<SupportedLanguage, string>>({
    vi: '', en: '', zh: '', ko: '', ja: ''
  });
  const [activePreviewTab, setActivePreviewTab] = useState<SupportedLanguage>('vi');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file: File) => {
    try {
      setSelectedFile(file);
      const parsed = await parseFileContent(file);
      setParsedFile(parsed);

      if (parsed.suggestedTitle && !inputTitle.trim()) {
        setInputTitle(parsed.suggestedTitle);
      }
      if (parsed.text) {
        setInputDescription(parsed.text);
      }
    } catch (err: any) {
      alert('Không thể đọc file: ' + (err?.message || 'Lỗi định dạng'));
    }
  };

  const handleStartTranslate = async () => {
    const textToTranslate = inputDescription.trim() || inputTitle.trim();
    if (!textToTranslate) {
      alert('Vui lòng nhập văn bản hoặc kéo thả tệp trước khi bắt đầu dịch!');
      return;
    }

    setIsTranslating(true);
    setProgressPercent(5);
    setProgressMessage('Đang khởi tạo tiến trình dịch thuật...');
    setCompletedLangs([]);

    try {
      // 1. Dịch phần mô tả / nội dung chính
      const descRes = await translateToAllLanguages(
        inputDescription.trim() || inputTitle.trim(),
        sourceLang,
        (p) => {
          setProgressPercent(p.percent);
          setProgressMessage(p.message);
          setCompletedLangs(p.completedLangs);
        }
      );

      // 2. Nếu có tiêu đề riêng, dịch tiếp tiêu đề
      let titleResTranslations = descRes.translations;
      if (inputTitle.trim() && inputTitle.trim() !== inputDescription.trim()) {
        const titleRes = await translateToAllLanguages(
          inputTitle.trim(),
          sourceLang
        );
        titleResTranslations = titleRes.translations;
      }

      setTranslatedTitles(titleResTranslations);
      setTranslatedDescriptions(descRes.translations);
      setActivePreviewTab(descRes.sourceLang);
      setProgressPercent(100);
      setProgressMessage('✅ Đã dịch thành công sang tất cả 5 ngôn ngữ!');
    } catch (error: any) {
      alert('Lỗi dịch thuật: ' + (error?.message || 'Vui lòng thử lại'));
    } finally {
      setIsTranslating(false);
    }
  };

  const handlePlayTTS = (lang: SupportedLanguage) => {
    const textToSpeak = translatedDescriptions[lang] || translatedTitles[lang];
    if (!textToSpeak) return;

    if (isPlayingTTS) {
      ttsService.stop();
      setIsPlayingTTS(false);
      return;
    }

    setIsPlayingTTS(true);
    ttsService.speak(textToSpeak, lang, 1.0, {
      onEnd: () => setIsPlayingTTS(false),
      onError: () => setIsPlayingTTS(false),
    });
  };

  const handleApply = () => {
    onApply({
      titles: translatedTitles,
      descriptions: translatedDescriptions,
      audioDataUrl: parsedFile?.audioDataUrl,
      subtitles: parsedFile?.subtitles,
      sourceLang: sourceLang === 'auto' ? detectLanguage(inputDescription || inputTitle) : sourceLang,
    });
    ttsService.stop();
    onClose();
  };

  const hasResults = Object.values(translatedDescriptions).some((v) => v.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-inner">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Trạm Dịch Thuật Đa Ngôn Ngữ Tự Động
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  5 Thứ Tiếng
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kéo thả tệp âm thanh/văn bản hoặc dán nội dung (bằng bất kỳ ngôn ngữ nào), hệ thống tự dịch sang các ngôn ngữ còn lại.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              ttsService.stop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Top Config: Source Language Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Ngôn ngữ nguồn đầu vào:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSourceLang('auto')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  sourceLang === 'auto'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ✨ Tự động nhận diện
              </button>
              {ALL_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSourceLang(l.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    sourceLang === l.code
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400'
                : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.srt,.vtt,.json,.mp3,.wav,.m4a,.ogg"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  {parsedFile?.type === 'audio' ? (
                    <FileAudio className="w-7 h-7" />
                  ) : parsedFile?.type === 'subtitles' ? (
                    <FileCode className="w-7 h-7" />
                  ) : (
                    <FileText className="w-7 h-7" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {selectedFile.name}
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                      Đã nạp tệp
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Bấm để chọn tệp khác hoặc chỉnh sửa văn bản bên dưới
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Kéo thả tệp âm thanh hoặc văn bản vào đây
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Hỗ trợ tệp <span className="text-amber-400 font-semibold">.txt, .srt, .vtt, .json</span> hoặc tệp âm thanh <span className="text-amber-400 font-semibold">.mp3, .wav, .m4a</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Text Input & Edit Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Tiêu đề nguồn (Tùy chọn)
              </label>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="VD: Máy bay tiêm kích MiG-21..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Nội dung / Lời thuyết minh nguồn
              </label>
              <textarea
                rows={3}
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                placeholder="Dán hoặc gõ đoạn văn bản bất kỳ ngôn ngữ nào vào đây để bắt đầu dịch..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Trigger Button */}
          <div className="flex justify-center">
            <button
              type="button"
              disabled={isTranslating || (!inputDescription.trim() && !inputTitle.trim())}
              onClick={handleStartTranslate}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg cursor-pointer ${
                isTranslating || (!inputDescription.trim() && !inputTitle.trim())
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý dịch 5 ngôn ngữ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 Bắt Đầu Tự Động Dịch 5 Ngôn Ngữ</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar & Language Status Badges */}
          {(isTranslating || progressPercent > 0) && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                  {progressMessage}
                </span>
                <span className="font-extrabold text-white text-sm">{progressPercent}%</span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 5 Language Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {ALL_LANGUAGES.map((l) => {
                  const isDone = completedLangs.includes(l.code);
                  return (
                    <div
                      key={l.code}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                          : isTranslating
                          ? 'bg-slate-800/60 border-slate-700 text-slate-400 animate-pulse'
                          : 'bg-slate-800/30 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{l.flag}</span>
                        <span className="truncate">{l.label.split(' ')[0]}</span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-500">Chờ</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Preview & Edit */}
          {hasResults && (
            <div className="flex flex-col gap-3 border border-slate-800 rounded-2xl p-4 bg-slate-950/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Xem Trước & Hiệu Chỉnh Bản Dịch
                </h3>
                <button
                  type="button"
                  onClick={() => handlePlayTTS(activePreviewTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isPlayingTTS
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                  }`}
                >
                  {isPlayingTTS ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Dừng Nghe</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe Thử Giọng Đọc AI ({activePreviewTab.toUpperCase()})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Language Tabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2.5">
                {ALL_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      if (isPlayingTTS) ttsService.stop();
                      setIsPlayingTTS(false);
                      setActivePreviewTab(l.code);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activePreviewTab === l.code
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800/70 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>

              {/* Editable Fields for Active Tab */}
              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                    Tiêu đề ({activePreviewTab.toUpperCase()}):
                  </label>
                  <input
                    type="text"
                    value={translatedTitles[activePreviewTab] || ''}
                    onChange={(e) =>
                      setTranslatedTitles({ ...translatedTitles, [activePreviewTab]: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                    Nội dung thuyết minh ({activePreviewTab.toUpperCase()}):
                  </label>
                  <textarea
                    rows={4}
                    value={translatedDescriptions[activePreviewTab] || ''}
                    onChange={(e) =>
                      setTranslatedDescriptions({ ...translatedDescriptions, [activePreviewTab]: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <button
            type="button"
            onClick={() => {
              ttsService.stop();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={!hasResults}
            onClick={handleApply}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
              hasResults
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Áp Dụng Bản Dịch Vào Hiện Vật</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
