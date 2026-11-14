import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useGeofenceStore } from '../shared/stores/geofenceStore';
import { useLangStore } from '../shared/stores/langStore';
import { usePlayerStore } from '../shared/stores/playerStore';
import { Artifact } from '../shared/types';
import { COLORS } from '../shared/theme';

interface TrackingBannerProps {
  artifacts: Artifact[];
}

export const TrackingBanner: React.FC<TrackingBannerProps> = ({ artifacts }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentLang } = useLangStore();
  const { playArtifact } = usePlayerStore();
  const {
    gpsStatus,
    accuracy,
    hasScannedQr,
    trackingEnabled,
    suggestion,
    startTracking,
    stopTracking,
    setSuggestion,
  } = useGeofenceStore();

  const statusText = (() => {
    if (!trackingEnabled || gpsStatus === 'idle') return t('trackStart');
    if (gpsStatus === 'searching') return t('trackSearching');
    if (gpsStatus === 'denied') return t('trackDenied');
    if (gpsStatus === 'unavailable') return t('trackUnavailable');
    if (gpsStatus === 'low-accuracy') return t('trackLowAccuracy');
    if (gpsStatus === 'nodata') return t('trackNoData');
    return hasScannedQr ? t('trackAutoTourActive') : t('trackReadyNeedQr');
  })();

  const suggestedArtifact = suggestion
    ? artifacts.find((a) => a.id === suggestion.artifactId)
    : undefined;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.statusLeft}>
          <Ionicons
            name={gpsStatus === 'active' ? 'locate' : 'navigate-outline'}
            size={18}
            color={gpsStatus === 'active' ? COLORS.emerald : COLORS.amberLight}
          />
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusText} numberOfLines={2}>
              {statusText}
            </Text>
            {accuracy !== null && gpsStatus === 'active' && (
              <Text style={styles.accText}>GPS ±{accuracy}m</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {!hasScannedQr && (
            <TouchableOpacity
              style={styles.qrBtn}
              onPress={() => router.push('/scanner')}
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code-outline" size={14} color={COLORS.bg} />
              <Text style={styles.qrBtnText}>{t('scanQrNow')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => (trackingEnabled ? stopTracking() : startTracking())}
          >
            <Text style={styles.toggleText}>
              {trackingEnabled ? t('trackStop') : t('trackStart')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {suggestion && suggestedArtifact && (
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionText}>
            {suggestion.kind === 'switch'
              ? t('suggestSwitch', {
                  name: suggestedArtifact.title[currentLang] || suggestedArtifact.title.vi,
                })
              : t('suggestReplay', {
                  name: suggestedArtifact.title[currentLang] || suggestedArtifact.title.vi,
                })}
          </Text>
          <View style={styles.suggestionBtns}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => {
                playArtifact(suggestedArtifact);
                setSuggestion(null);
              }}
            >
              <Text style={styles.acceptText}>
                {suggestion.kind === 'switch' ? t('switchNow') : t('replay')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={() => setSuggestion(null)}
            >
              <Text style={styles.dismissText}>{t('dismiss')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTextWrap: {
    flex: 1,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  accText: {
    color: COLORS.emerald,
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.amber,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  qrBtnText: {
    color: COLORS.bg,
    fontSize: 11,
    fontWeight: '800',
  },
  toggleBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toggleText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  suggestionBox: {
    backgroundColor: COLORS.amberSoft,
    borderWidth: 1,
    borderColor: COLORS.amber,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  suggestionText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptBtn: {
    backgroundColor: COLORS.amber,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  acceptText: {
    color: COLORS.bg,
    fontSize: 12,
    fontWeight: '800',
  },
  dismissBtn: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dismissText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
