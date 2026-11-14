import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../../src/shared/context/MuseumDataContext';
import { useLangStore } from '../../src/shared/stores/langStore';
import { usePlayerStore } from '../../src/shared/stores/playerStore';
import { useFavStore } from '../../src/shared/stores/favStore';
import { useGeofenceStore } from '../../src/shared/stores/geofenceStore';
import { resolveBundledAsset } from '../../src/shared/assetMap';
import { TrackingBanner } from '../../src/components/TrackingBanner';
import { COLORS } from '../../src/shared/theme';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, loading } = useMuseumData();
  const { currentLang } = useLangStore();
  const { playArtifact, currentArtifact, isPlaying, pause, resume } = usePlayerStore();
  const { favorites, toggleFavorite } = useFavStore();
  const { nearby } = useGeofenceStore();

  const [query, setQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');

  const nearbyMap = useMemo(() => {
    const m = new Map<string, number>();
    nearby.forEach((n) => m.set(n.artifactId, Math.round(n.distance)));
    return m;
  }, [nearby]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.artifacts.filter((a) => {
      if (selectedFloor !== 'all' && a.floorId !== selectedFloor) return false;
      if (!q) return true;
      const title = (a.title?.[currentLang] || a.title?.vi || '').toLowerCase();
      const desc = (a.description?.[currentLang] || a.description?.vi || '').toLowerCase();
      return title.includes(q) || a.code.toLowerCase().includes(q) || desc.includes(q);
    });
  }, [data, query, selectedFloor, currentLang]);

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.amber} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          currentArtifact ? { paddingBottom: 150 } : { paddingBottom: 24 },
        ]}
        ListHeaderComponent={
          <View>
            <TrackingBanner artifacts={data.artifacts} />

            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder={t('searchPlaceholder') || 'Tìm hiện vật theo tên, mã...'}
                placeholderTextColor={COLORS.textDim}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.floorRow}
            >
              <TouchableOpacity
                style={[styles.floorChip, selectedFloor === 'all' && styles.floorChipActive]}
                onPress={() => setSelectedFloor('all')}
              >
                <Text
                  style={[
                    styles.floorChipText,
                    selectedFloor === 'all' && styles.floorChipTextActive,
                  ]}
                >
                  {t('allFloors') || 'Tất cả'}
                </Text>
              </TouchableOpacity>
              {data.floors.map((f) => {
                const active = selectedFloor === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.floorChip, active && styles.floorChipActive]}
                    onPress={() => setSelectedFloor(f.id)}
                  >
                    <Text style={[styles.floorChipText, active && styles.floorChipTextActive]}>
                      {f.name?.[currentLang] || f.name?.vi}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => {
          const title = item.title?.[currentLang] || item.title?.vi || item.code;
          const desc = item.description?.[currentLang] || item.description?.vi || '';
          const imgSrc = resolveBundledAsset(item.images?.[0]);
          const isFav = favorites.includes(item.id);
          const isCurrent = currentArtifact?.id === item.id;
          const dist = nearbyMap.get(item.id);

          return (
            <TouchableOpacity
              style={[styles.card, isCurrent && styles.cardActive]}
              onPress={() => router.push(`/artifact/${encodeURIComponent(item.id)}`)}
              activeOpacity={0.85}
            >
              {imgSrc ? (
                <Image source={imgSrc} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Ionicons name="image-outline" size={24} color={COLORS.textDim} />
                </View>
              )}

              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.codeBadge}>{item.code}</Text>
                  {dist !== undefined && (
                    <Text style={styles.distBadge}>~{dist}m</Text>
                  )}
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {title}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {desc}
                </Text>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.playSmall, isCurrent && isPlaying && styles.playSmallActive]}
                    onPress={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        if (isPlaying) pause();
                        else resume();
                      } else {
                        playArtifact(item);
                      }
                    }}
                  >
                    <Ionicons
                      name={isCurrent && isPlaying ? 'pause' : 'play'}
                      size={14}
                      color={COLORS.bg}
                    />
                    <Text style={styles.playSmallText}>
                      {isCurrent && isPlaying
                        ? t('pause') || 'Tạm dừng'
                        : t('listenNow') || 'Nghe thuyết minh'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Ionicons
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={20}
                      color={isFav ? COLORS.rose : COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={36} color={COLORS.textDim} />
            <Text style={styles.emptyText}>
              {t('noResults') || 'Không tìm thấy hiện vật phù hợp.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  listContent: { padding: 14 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    padding: 0,
  },
  floorRow: {
    gap: 8,
    paddingBottom: 12,
  },
  floorChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  floorChipActive: {
    backgroundColor: COLORS.amber,
    borderColor: COLORS.amber,
  },
  floorChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  floorChipTextActive: {
    color: COLORS.bg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardActive: {
    borderColor: COLORS.amber,
  },
  thumb: {
    width: 108,
    height: 132,
    backgroundColor: COLORS.card,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeBadge: {
    color: COLORS.amberLight,
    fontSize: 11,
    fontWeight: '800',
  },
  distBadge: {
    color: COLORS.emerald,
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  cardDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  playSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.amber,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  playSmallActive: {
    backgroundColor: COLORS.amberLight,
  },
  playSmallText: {
    color: COLORS.bg,
    fontSize: 12,
    fontWeight: '800',
  },
  favBtn: {
    padding: 6,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
