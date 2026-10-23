import React, { useState, useEffect, useRef } from 'react';
import { Artifact } from '../../shared/types';
import { museumApi } from '../../shared/services/api';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, Copy, Check, ExternalLink } from 'lucide-react';

export const QRManageView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseUrl = window.location.origin + (import.meta.env.BASE_URL || '/');

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      if (res.artifacts.length > 0) {
        setSelectedArtifact(res.artifacts[0]);
      }
    });
  }, []);

  const activeUrl = customUrl
    ? customUrl
    : selectedArtifact
    ? `${baseUrl}?artifact=${selectedArtifact.id}`
    : `${baseUrl}`;

  useEffect(() => {
    if (canvasRef.current && activeUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        activeUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [activeUrl, selectedArtifact]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR_${selectedArtifact?.code || 'Museum'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-amber-500" />
          Quản Lý & Xuất Mã QR Trưng Bày
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tạo và in mã QR gắn tại cổng bảo tàng và từng tủ trưng bày hiện vật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Artifact Selection List */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Danh Sách Mã QR Hiện Vật</h3>
            <span className="text-xs text-slate-400 font-mono">{artifacts.length} mã</span>
          </div>

          {/* Quick Select Cổng Bảo Tàng */}
          <button
            onClick={() => {
              setSelectedArtifact(null);
              setCustomUrl(`${baseUrl}`);
            }}
            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
              !selectedArtifact
                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <div>
              <div className="font-semibold text-sm">Cổng Bảo Tàng (Mở Web Chính)</div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">{baseUrl}</div>
            </div>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>

          {/* Exhibits List */}
          <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
            {artifacts.map((art) => (
              <button
                key={art.id}
                onClick={() => {
                  setSelectedArtifact(art);
                  setCustomUrl('');
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

        {/* Right: QR Code Live Preview & Action Card */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-6">
          <div className="bg-white p-5 rounded-3xl shadow-2xl flex flex-col items-center gap-3 border-4 border-amber-500/40">
            <canvas ref={canvasRef} className="rounded-xl"></canvas>
            <div className="text-center">
              <div className="font-bold text-slate-900 text-base">
                {selectedArtifact ? selectedArtifact.title['vi'] : 'Bảo Tàng Lịch Sử'}
              </div>
              <div className="text-xs text-amber-600 font-mono font-semibold">
                {selectedArtifact ? `MÃ: ${selectedArtifact.code}` : 'CỔNG CHÍNH BẢO TÀNG'}
              </div>
            </div>
          </div>

          {/* URL Display */}
          <div className="w-full max-w-md flex flex-col gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Đường dẫn gắn vào QR:</span>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
              <input
                type="text"
                value={activeUrl}
                readOnly
                className="bg-transparent text-xs font-mono text-slate-300 flex-1 outline-none"
              />
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title="Sao chép URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh QR (PNG)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>In Bản Mã QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
