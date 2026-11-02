import React from 'react';
import { useTranslation } from 'react-i18next';
import { Artifact } from '../../shared/types';
import { useGeofenceStore } from '../../shared/stores/geofenceStore';
import { usePlayerStore } from '../../shared/stores/playerStore';
import { useLangStore } from '../../shared/stores/langStore';
import { Volume2, X } from 'lucide-react';

interface Props {
  artifacts: Artifact[];
  onOpenScanner?: () => void;
}

/**
 * Thanh đề xuất chuyển/nghe lại hiện vật khi đến gần (USC14 A3):
 *  - Tự động ẩn hoàn toàn khi không có đề xuất, giữ giao diện sạch đẹp
 *  - Khi người dùng đang nghe dở hoặc đã nghe mà đến gần hiện vật mới, hiển thị thẻ tương tác
 */
export const TrackingPanel: React.FC<Props> = ({ artifacts }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();
  const { playArtifact } = usePlayerStore();
  const { suggestion, setSuggestion, setAnchor } = useGeofenceStore();

  if (!suggestion) return null;

  const suggestedArtifact = artifacts.find((a) => a.id === suggestion.artifactId) || null;
  if (!suggestedArtifact) return null;

  const suggestedName = suggestedArtifact.title[currentLang] || suggestedArtifact.title['vi'];

  return (
    <div className="mb-5" data-testid="tracking-panel">
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
    </div>
  );
};
