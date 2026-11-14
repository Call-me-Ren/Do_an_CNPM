import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../../src/shared/context/MuseumDataContext';
import { useLangStore } from '../../src/shared/stores/langStore';
import { useGeofenceStore } from '../../src/shared/stores/geofenceStore';
import { usePlayerStore } from '../../src/shared/stores/playerStore';
import { resolveBundledAsset } from '../../src/shared/assetMap';
import { COLORS } from '../../src/shared/theme';

export default function FloorMapScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, loading } = useMuseumData();
  const { currentLang } = useLangStore();
  const { anchorArtifactId, nearestArtifactId } = useGeofenceStore();
  const { currentArtifact } = usePlayerStore();

  const [selectedFloorId, setSelectedFloorId] = useState<number>(1);

  const floor = useMemo(() => {
    if (!data?.floors?.length) return undefined;
    return data.floors.find((f) => f.id === selectedFloorId) ?? data.floors[0];
  }, [data, selectedFloorId]);

  const floorArtifacts = useMemo(() => {
    if (!data || !floor) return [];
    return data.artifacts.filter((a) => a.floorId === floor.id);
  }, [data, floor]);

  if (loading || !data || !floor) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.amber} />
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - 28;
  const ratio = floor.bounds.height / (floor.bounds.width || 1);
  const mapWidth = screenWidth;
  const mapHeight = Math.round(screenWidth * ratio);

  const activeUserArtifactId = anchorArtifactId || nearestArtifactId;
  const mapSource = resolveBundledAsset(floor.mapImage);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        currentArtifact ? { paddingBottom: 150 } : { paddingBottom: 24 },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.floorTabs}
      >
        {data.floors.map((f) => {
          const active = f.id === floor.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.floorTab, active && styles.floorTabActive]}
              onPress={() => setSelectedFloorId(f.id)}
            >
              <Text style={[styles.floorTabText, active && styles.floorTabTextActive]}>
                {f.name?.[currentLang] || f.name?.vi}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.mapWrap, { width: mapWidth, height: mapHeight }]}>
        {mapSource && (
          <Image
            source={mapSource}
            style={{ width: mapWidth, height: mapHeight }}
            resizeMode="contain"
          />
        )}

        <Svg
          width={mapWidth}
          height={mapHeight}
          viewBox={`0 0 ${floor.bounds.width} ${floor.bounds.height}`}
          style={StyleSheet.absoluteFill}
        >
          {floorArtifacts.map((art, index) => {
            const isHere = art.id === activeUserArtifactId;
            const isPlayingArt = art.id === currentArtifact?.id;
            const cx = art.mapCoordinates.x;
            const cy = art.mapCoordinates.y;

            return (
              <React.Fragment key={art.id}>
                {isHere && (
                  <Circle
                    cx={cx}
                    cy={cy}
                    r={28}
                    fill="rgba(56, 189, 248, 0.25)"
                    stroke={COLORS.sky}
                    strokeWidth={3}
                  />
                )}
                <Circle
                  cx={cx}
                  cy={cy}
                  r={16}
                  fill={isPlayingArt ? COLORS.amber : isHere ? COLORS.sky : COLORS.surface}
                  stroke={COLORS.amberLight}
                  strokeWidth={3}
                  onPress={() => router.push(`/artifact/${encodeURIComponent(art.id)}`)}
                />
                <SvgText
                  x={cx}
                  y={cy + 5}
                  fontSize={13}
                  fontWeight="bold"
                  fill={isPlayingArt || isHere ? COLORS.bg : COLORS.text}
                  textAnchor="middle"
                  onPress={() => router.push(`/artifact/${encodeURIComponent(art.id)}`)}
                >
                  {index + 1}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.sky }]} />
          <Text style={styles.legendText}>{t('youAreHere') || 'Bạn đang ở đây'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS.amber }]} />
          <Text style={styles.legendText}>{t('listening') || 'Đang phát'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {floor.name?.[currentLang] || floor.name?.vi} ({floorArtifacts.length})
      </Text>

      {floorArtifacts.map((art, idx) => (
        <TouchableOpacity
          key={art.id}
          style={styles.pinRow}
          onPress={() => router.push(`/artifact/${encodeURIComponent(art.id)}`)}
        >
          <View style={styles.pinNum}>
            <Text style={styles.pinNumText}>{idx + 1}</Text>
          </View>
          <View style={styles.pinInfo}>
            <Text style={styles.pinTitle}>
              {art.title?.[currentLang] || art.title?.vi}
            </Text>
            <Text style={styles.pinCode}>{art.code}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  content: { padding: 14, gap: 12 },
  floorTabs: { gap: 8 },
  floorTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  floorTabActive: {
    backgroundColor: COLORS.amber,
    borderColor: COLORS.amber,
  },
  floorTabText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  floorTabTextActive: { color: COLORS.bg },
  mapWrap: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: COLORS.textMuted, fontSize: 12 },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  pinNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.amberSoft,
    borderWidth: 1,
    borderColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinNumText: { color: COLORS.amberLight, fontSize: 12, fontWeight: '800' },
  pinInfo: { flex: 1 },
  pinTitle: { color: COLORS.text, fontSize: 13, fontWeight: '700' },
  pinCode: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
});
