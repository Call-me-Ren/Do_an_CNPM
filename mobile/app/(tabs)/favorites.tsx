import React, { useMemo } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../../src/shared/context/MuseumDataContext';
import { useFavStore } from '../../src/shared/stores/favStore';
import { useLangStore } from '../../src/shared/stores/langStore';
import { usePlayerStore } from '../../src/shared/stores/playerStore';
import { resolveBundledAsset } from '../../src/shared/assetMap';
import { COLORS } from '../../src/shared/theme';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useMuseumData();
  const { favorites, toggleFavorite } = useFavStore();
  const { currentLang } = useLangStore();
  const { playArtifact, currentArtifact } = usePlayerStore();

  const favArtifacts = useMemo(() => {
    if (!data) return [];
    return data.artifacts.filter((a) => favorites.includes(a.id));
  }, [data, favorites]);

  return (
    <View style={styles.container}>
      <FlatList
        data={favArtifacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          currentArtifact ? { paddingBottom: 150 } : { paddingBottom: 24 },
        ]}
        renderItem={({ item }) => {
          const title = item.title?.[currentLang] || item.title?.vi || item.code;
          const imgSrc = resolveBundledAsset(item.images?.[0]);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/artifact/${encodeURIComponent(item.id)}`)}
            >
              {imgSrc ? (
                <Image source={imgSrc} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Ionicons name="image-outline" size={22} color={COLORS.textDim} />
                </View>
              )}

              <View style={styles.body}>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      playArtifact(item);
                    }}
                  >
                    <Ionicons name="play" size={14} color={COLORS.bg} />
                    <Text style={styles.playText}>{t('listenNow') || 'Nghe'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Ionicons name="heart" size={22} color={COLORS.rose} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={44} color={COLORS.textDim} />
            <Text style={styles.emptyText}>
              {t('noFavorites') || 'Chưa có hiện vật yêu thích nào.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  listContent: { padding: 14, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumb: { width: 96, height: 108, backgroundColor: COLORS.card },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, padding: 12, justifyContent: 'space-between' },
  code: { color: COLORS.amberLight, fontSize: 11, fontWeight: '800' },
  title: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.amber,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  playText: { color: COLORS.bg, fontSize: 12, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 80 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
});
