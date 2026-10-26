import React from 'react';
import { useTranslation } from 'react-i18next';
import { Artifact } from '../../shared/types';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { Crosshair, AlertTriangle, Volume2, X, QrCode } from 'lucide-react';

interface Props {
  artifacts: Artifact[];
  onOpenScanner?: () => void;
}

/**
 * Thanh theo dõi vị trí (USC14):
 *  - Tự động kích hoạt quyền định vị khi mở web
 *  - Hiển thị trạng thái vị trí (Đang định vị / Tự động thuyết minh khi đến gần)
 *  - Thông báo lỗi E1 (mất tín hiệu/không có quyền), E2 (sai số lớn), E3 (thiếu dữ liệu)
 *  - Banner gợi ý khi đến gần hiện vật khác lúc đang nghe dở, hoặc hiện vật đã nghe (A3)
 */
export const TrackingPanel: React.FC<Props> = ({ artifacts, onOpenScanner }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact } = usePlayerStore();
  const {
    hasScannedQr,
    gpsStatus,
    suggestion,
    setSuggestion,
    setAnchor,
  } = useGeofenceStore();

  const suggestedArtifact = suggestion
    ? artifacts.find((a) => a.id === suggestion.artifactId) || null
    : null;
  const suggestedName = suggestedArtifact
    ? suggestedArtifact.title[currentLang] || suggestedArtifact.title['vi']
    : '';

  const errorKey =
    gpsStatus === 'denied'
      ? 'trackDenied'
      : gpsStatus === 'unavailable'
      ? 'trackUnavailable'
      : gpsStatus === 'low-accuracy'
      ? 'trackLowAccuracy'
      : gpsStatus === 'nodata'
      ? 'trackNoData'
      : null;

  const isGpsActive = gpsStatus === 'active' || gpsStatus === 'low-accuracy';

  return (
    <div className="flex flex-col gap-3 mb-5" data-testid="tracking-panel">
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 min-w-0">
          <Crosshair
            className={`w-4 h-4 shrink-0 ${
              isGpsActive ? 'text-emerald-500' : gpsStatus === 'searching' ? 'text-amber-500 animate-spin' : 'text-slate-400'
            }`}
          />
          <span className="truncate">
            {isGpsActive
              ? hasScannedQr
                ? t('trackAutoTourActive')
                : t('trackReadyNeedQr')
              : gpsStatus === 'searching'
              ? t('trackSearching')
              : t('trackSearching')}
          </span>
          {isGpsActive && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          )}
        </div>

        {/* Nút thao tác nhanh hoặc huy hiệu trạng thái tự động (không cần nút bật/dừng) */}
        {!hasScannedQr && onOpenScanner ? (
          <button
            type="button"
            onClick={onOpenScanner}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-xs cursor-pointer shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{t('scanQrNow')}</span>
          </button>
        ) : hasScannedQr ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Auto</span>
          </span>
        ) : null}
      </div>

      {errorKey && (
        <div
          role="alert"
          className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm rounded-2xl px-4 py-3"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{t(errorKey)}</span>
        </div>
      )}

      {suggestion && suggestedArtifact && (
        <div className="flex items-center justify-between gap-3 flex-wrap bg-amber-500/10 border border-amber-400/50 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 min-w-0">
            <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {suggestion.kind === 'switch'
                ? t('suggestSwitch', { name: suggestedName })
                : t('suggestReplay', { name: suggestedName })}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAnchor(suggestedArtifact.id);
                playArtifact(suggestedArtifact);
                setSuggestion(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer"
            >
              {suggestion.kind === 'switch' ? t('switchNow') : t('replayNow')}
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              aria-label={t('dismiss')}
              title={t('dismiss')}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200/70 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
