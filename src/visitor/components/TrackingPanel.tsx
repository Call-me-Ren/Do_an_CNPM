import React from 'react';
import { useTranslation } from 'react-i18next';
import { Artifact } from '../../shared/types';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { Crosshair, AlertTriangle, Volume2, X } from 'lucide-react';

interface Props {
  artifacts: Artifact[];
}

/**
 * Thanh theo dõi vị trí (USC14):
 *  - Hiển thị trạng thái GPS, nút Bật / Dừng theo dõi (A4)
 *  - Thông báo lỗi E1 (mất tín hiệu/không có quyền), E2 (sai số lớn), E3 (thiếu dữ liệu)
 *  - Banner gợi ý khi đến gần hiện vật khác lúc đang nghe dở, hoặc hiện vật đã nghe (A3)
 */
export const TrackingPanel: React.FC<Props> = ({ artifacts }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact } = usePlayerStore();
  const { trackingEnabled, gpsStatus, suggestion, startTracking, stopTracking, setSuggestion, setAnchor } =
    useGeofenceStore();

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

  const statusLabel =
    gpsStatus === 'searching'
      ? t('trackSearching')
      : gpsStatus === 'active' || gpsStatus === 'low-accuracy'
      ? t('trackActive')
      : null;

  const handleConfirmSuggestion = () => {
    if (!suggestedArtifact) return;
    setAnchor(suggestedArtifact.id);
    playArtifact(suggestedArtifact);
    setSuggestion(null);
  };

  return (
    <div className="flex flex-col gap-3 mb-5" data-testid="tracking-panel">
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 min-w-0">
          <Crosshair
            className={`w-4 h-4 shrink-0 ${trackingEnabled ? 'text-emerald-500' : 'text-slate-400'}`}
          />
          <span className="truncate">{statusLabel || t('trackStart')}</span>
          {trackingEnabled && (
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          )}
        </div>
        {trackingEnabled ? (
          <button
            type="button"
            onClick={stopTracking}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
          >
            {t('trackStop')}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => startTracking()}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm cursor-pointer"
          >
            {t('trackStart')}
          </button>
        )}
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
              onClick={handleConfirmSuggestion}
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
