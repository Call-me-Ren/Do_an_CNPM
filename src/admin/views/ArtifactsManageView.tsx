import React, { useState, useEffect, useRef } from 'react';
import { Artifact, SupportedLanguage } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import { resolveAssetUrl, getArtifactFallbackImage } from '../../shared/utils/assetHelper';
import { AlertModal } from '../../shared/components/AlertModal';
import QRCode from 'qrcode';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FolderOpen,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const ArtifactsManageView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // QR Modal State
  const [selectedQrTarget, setSelectedQrTarget] = useState<Artifact | 'GATE' | null>(null);
  const [qrCopied, setQrCopied] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseUrl = window.location.origin + (import.meta.env.BASE_URL || '/');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<Artifact | null>(null);
  const [deletingArtifact, setDeletingArtifact] = useState<{ id: string; code: string; title: string } | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<SupportedLanguage>('vi');

  // Form Fields
  const [formCode, setFormCode] = useState('');
  const [formFloorId, setFormFloorId] = useState(1);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTitles, setFormTitles] = useState<Record<SupportedLanguage, string>>({
    vi: '',
    en: '',
    zh: '',
    ko: '',
    ja: ''
  });
  const [formDescriptions, setFormDescriptions] = useState<Record<SupportedLanguage, string>>({
    vi: '',
    en: '',
    zh: '',
    ko: '',
    ja: ''
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedQrTarget && qrCanvasRef.current) {
      const activeUrl =
        selectedQrTarget === 'GATE'
          ? baseUrl
          : `${baseUrl}?artifact=${selectedQrTarget.id}`;

      QRCode.toCanvas(
        qrCanvasRef.current,
        activeUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [selectedQrTarget]);

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current || !selectedQrTarget) return;
    const link = document.createElement('a');
    const name = selectedQrTarget === 'GATE' ? 'Cong_Bao_Tang' : selectedQrTarget.code;
    link.download = `QR_${name}.png`;
    link.href = qrCanvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyQrUrl = () => {
    if (!selectedQrTarget) return;
    const activeUrl =
      selectedQrTarget === 'GATE'
        ? baseUrl
        : `${baseUrl}?artifact=${selectedQrTarget.id}`;
    navigator.clipboard.writeText(activeUrl);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  const handlePrintQr = () => {
    window.print();
  };

  const langs: { code: SupportedLanguage; label: string }[] = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
  ];

  const handleOpenAdd = () => {
    setEditingArtifact(null);
    setFormCode(`HV-00${artifacts.length + 1}`);
    setFormFloorId(1);
    setFormImageUrl('https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80');
    setFormTitles({ vi: '', en: '', zh: '', ko: '', ja: '' });
    setFormDescriptions({ vi: '', en: '', zh: '', ko: '', ja: '' });
    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: Artifact) => {
    setEditingArtifact(art);
    setFormCode(art.code);
    setFormFloorId(art.floorId);
    setFormImageUrl(art.images[0] || '');
    setFormTitles({ ...art.title });
    setFormDescriptions({ ...art.description });
    setActiveLangTab('vi');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitles.vi.trim()) {
      setAlertMessage('Vui lòng nhập tên hiện vật bằng Tiếng Việt!');
      return;
    }

    if (editingArtifact) {
      // Update
      const updatedArtifacts = artifacts.map((a) =>
        a.id === editingArtifact.id
          ? {
              ...a,
              code: formCode.trim() || a.code,
              floorId: formFloorId,
              images: [formImageUrl.trim() || a.images[0]],
              title: { ...formTitles },
              description: { ...formDescriptions }
            }
          : a
      );
      setArtifacts(updatedArtifacts);
      museumApi.saveCustomArtifacts(updatedArtifacts);
    } else {
      // Create - Generate unique ID
      const nextId = `POI${String(Date.now()).slice(-6)}`;
      const newArtifact: Artifact = {
        id: nextId,
        code: formCode.trim() || `HV-${String(artifacts.length + 1).padStart(3, '0')}`,
        floorId: formFloorId,
        title: { ...formTitles },
        description: { ...formDescriptions },
        images: [formImageUrl.trim() || 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80'],
        mapCoordinates: { x: 300, y: 300 },
        audio: {}
      };
      const updatedArtifacts = [newArtifact, ...artifacts];
      setArtifacts(updatedArtifacts);
      museumApi.saveCustomArtifacts(updatedArtifacts);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Quản Lý Danh Mục Hiện Vật</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý thông tin đa ngôn ngữ, tệp âm thanh và mã QR của các hiện vật trưng bày.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSelectedQrTarget('GATE')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm"
            title="Xem và xuất mã QR cổng chính / trang chủ bảo tàng"
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Mã QR Cổng Bảo Tàng</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Hiện Vật Mới</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-8 text-center">Đang tải danh sách...</div>
      ) : (
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">Mã số</th>
                  <th className="py-3.5 px-4">Hiện vật</th>
                  <th className="py-3.5 px-4">Tầng / Tọa độ</th>
                  <th className="py-3.5 px-4">Trạng thái Audio (5 Ngôn ngữ)</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {artifacts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                      {item.code}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                      <img
                        src={resolveAssetUrl(item.images[0])}
                        alt={item.title['vi']}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getArtifactFallbackImage(item.code, item.title['vi'], item.floorId);
                        }}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <div>{item.title['vi']}</div>
                        <div className="text-xs text-slate-400 font-normal">{item.title['en']}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Tầng {item.floorId} ({item.mapCoordinates.x}, {item.mapCoordinates.y})
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {langs.map((l) => {
                          const hasAudio = Boolean(
                            item.audio?.[l.code] ||
                            (item.subtitles?.[l.code] && item.subtitles[l.code]!.length > 0) ||
                            item.description?.[l.code]
                          );
                          return (
                            <span
                              key={l.code}
                              className={`px-2 py-0.5 rounded text-xs uppercase font-bold flex items-center gap-1 ${
                                hasAudio
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-700 text-slate-500'
                              }`}
                              title={`${l.label}: ${hasAudio ? 'Sẵn sàng thuyết minh đa ngữ (AI TTS & Subtitles)' : 'Chưa có nội dung'}`}
                            >
                              {l.code}
                              {hasAudio ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQrTarget(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition"
                          title="Xem & Xuất mã QR trưng bày"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingArtifact({ id: item.id, code: item.code, title: item.title['vi'] || item.code })}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Popup */}
      {deletingArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-white text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Xác Nhận Xóa Hiện Vật</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa hiện vật <span className="text-amber-400 font-mono font-bold">[{deletingArtifact.code}]</span> - <span className="text-slate-200 font-semibold">{deletingArtifact.title}</span>? Hành động này sẽ loại bỏ hiện vật khỏi danh mục tham quan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                type="button"
                onClick={() => setDeletingArtifact(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedArtifacts = artifacts.filter((a) => a.id !== deletingArtifact.id);
                  setArtifacts(updatedArtifacts);
                  museumApi.saveCustomArtifacts(updatedArtifacts);
                  setDeletingArtifact(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition shadow-md shadow-red-500/20"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Exhibit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-lg text-white">
                {editingArtifact ? `Chỉnh Sửa Hiện Vật [${editingArtifact.code}]` : 'Thêm Hiện Vật Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Mã Định Danh Hiện Vật</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Khu Vực Trưng Bày / Tầng</label>
                  <select
                    value={formFloorId}
                    onChange={(e) => setFormFloorId(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value={1}>Sân Ngoài Trời - Vũ Khí Hạng Nặng & Chuồng Cọp</option>
                    <option value={2}>Tầng 1 - Chế Độ Lao Tù & Thế Giới Ủng Hộ</option>
                    <option value={3}>Tầng 2 - Tội Ác Chiến Tranh & Hậu Quả Da Cam</option>
                    <option value={4}>Tầng 3 - Hồi Niệm (Requiem) & Hòa Bình</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">URL Hình Ảnh Hiện Vật</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Đường dẫn hoặc link ảnh (/images/... hoặc https://...)"
                  />

                  {/* Hidden file input for uploading from computer */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Folder browse button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer"
                    title="Mở thư mục máy tính để chọn hình ảnh"
                  >
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span>Chọn tệp</span>
                  </button>
                </div>
              </div>

              {/* Multilingual Tabs */}
              <div className="border border-slate-700/80 rounded-2xl p-4 bg-slate-900/60 flex flex-col gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-700/60">
                  {langs.map((l) => (
                    <button
                      type="button"
                      key={l.code}
                      onClick={() => setActiveLangTab(l.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                        activeLangTab === l.code
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tên hiện vật ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formTitles[activeLangTab]}
                    onChange={(e) =>
                      setFormTitles({ ...formTitles, [activeLangTab]: e.target.value })
                    }
                    placeholder={`Tên hiện vật bằng ${activeLangTab}...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mô tả sơ lược ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={4}
                    value={formDescriptions[activeLangTab]}
                    onChange={(e) =>
                      setFormDescriptions({ ...formDescriptions, [activeLangTab]: e.target.value })
                    }
                    placeholder={`Bài viết giới thiệu bằng ${activeLangTab}...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md"
                >
                  {editingArtifact ? 'Lưu Thay Đổi' : 'Thêm Mới Hiện Vật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal Popup */}
      {selectedQrTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-500" />
                <span>
                  {selectedQrTarget === 'GATE'
                    ? 'Mã QR Cổng Chính Bảo Tàng'
                    : `Mã QR Hiện Vật [${selectedQrTarget.code}]`}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedQrTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 border-4 border-amber-500/40">
                <canvas ref={qrCanvasRef} className="rounded-lg"></canvas>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedQrTarget === 'GATE'
                      ? 'Bảo Tàng Lịch Sử'
                      : selectedQrTarget.title['vi']}
                  </div>
                  <div className="text-xs text-amber-600 font-mono font-semibold">
                    {selectedQrTarget === 'GATE'
                      ? 'CỔNG CHÍNH BẢO TÀNG'
                      : `MÃ: ${selectedQrTarget.code} • TẦNG ${selectedQrTarget.floorId}`}
                  </div>
                </div>
              </div>

              {/* URL input */}
              <div className="w-full flex flex-col gap-1.5">
                <span className="text-xs text-slate-400 font-semibold uppercase">Đường dẫn quét QR:</span>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    value={
                      selectedQrTarget === 'GATE'
                        ? baseUrl
                        : `${baseUrl}?artifact=${selectedQrTarget.id}`
                    }
                    readOnly
                    className="bg-transparent text-xs font-mono text-slate-300 flex-1 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyQrUrl}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                    title="Sao chép liên kết"
                  >
                    {qrCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 w-full justify-center pt-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-650 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition border border-slate-600"
                >
                  <Printer className="w-4 h-4" />
                  <span>In bản mã QR</span>
                </button>
                <a
                  href={
                    selectedQrTarget === 'GATE'
                      ? baseUrl
                      : `${baseUrl}?artifact=${selectedQrTarget.id}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-slate-700 hover:bg-slate-650 text-slate-300 hover:text-white rounded-xl transition border border-slate-600"
                  title="Mở thử nghiệm giao diện khách"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Alert Popup Modal */}
      <AlertModal
        isOpen={!!alertMessage}
        title="Thông Báo"
        message={alertMessage || ''}
        type="warning"
        onClose={() => setAlertMessage(null)}
      />
    </div>
  );
};
