import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../../src/shared/context/MuseumDataContext';
import { useLangStore } from '../../src/shared/stores/langStore';
import { usePlayerStore } from '../../src/shared/stores/playerStore';
import { useFavStore } from '../../src/shared/stores/favStore';
import { resolveBundledAsset } from '../../src/shared/assetMap';
import { findActiveCueIndex, formatDuration } from '../../src/shared/utils/subtitles';
import { COLORS } from '../../src/shared/theme';

export default function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { data } = useMuseumData();
  const { currentLang } = useLangStore();
  const {
    currentArtifact,
    isPlaying,
    currentTime,
    playArtifact,
    pause,
    resume,
    seekToTime,
  } = usePlayerStore();
  const { favorites, toggleFavorite } = useFavStore();

  const artifact = useMemo(() => {
    if (!data || !id) return undefined;
    const decodedId = decodeURIComponent(id);
    return data.artifacts.find((a) => a.id === decodedId || a.code === decodedId);
  }, [data, id]);

  if (!artifact) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Không tìm thấy hiện vật.</Text>
      </View>
    );
  }

  const isCurrent = currentArtifact?.id === artifact.id;
  const isFav = favorites.includes(artifact.id);
  const title = artifact.title?.[currentLang] || artifact.title?.vi || artifact.code;
  const desc = artifact.description?.[currentLang] || artifact.description?.vi || '';
  const cues = artifact.subtitles?.[currentLang] || artifact.subtitles?.vi || [];
  const activeCueIdx = isCurrent ? findActiveCueIndex(cues, currentTime) : -1;
  const floorName =
    data?.floors.find((f) => f.id === artifact.floorId)?.name?.[currentLang] || '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        currentArtifact ? { paddingBottom: 150 } : { paddingBottom: 30 },
      ]}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.gallery}
      >
        {artifact.images.map((img, i) => {
          const src = resolveBundledAsset(img);
          if (!src) return null;
          return <Image key={i} source={src} style={styles.heroImg} resizeMode="cover" />;
        })}
      </ScrollView>

      <View style={styles.header}>
        <View style={styles.badges}>
          <Text style={styles.codeBadge}>{artifact.code}</Text>
          {!!floorName && <Text style={styles.floorBadge}>{floorName}</Text>}
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(artifact.id)} style={styles.favBtn}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={24}
              color={isFav ? COLORS.rose : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            if (isCurrent) {
              if (isPlaying) pause();
              else resume();
            } else {
              playArtifact(artifact);
            }
          }}
        >
          <Ionicons
            name={isCurrent && isPlaying ? 'pause' : 'play'}
            size={20}
            color={COLORS.bg}
          />
          <Text style={styles.playButtonText}>
            {isCurrent && isPlaying
              ? t('pause') || 'Tạm dừng thuyết minh'
              : t('listenNow') || 'Nghe thuyết minh'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('description') || 'Giới thiệu hiện vật'}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>

      {cues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('subtitles') || 'Phụ đề đồng bộ'}</Text>
          {cues.map((cue, idx) => {
            const active = idx === activeCueIdx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.cueRow, active && styles.cueRowActive]}
                onPress={() => {
                  if (!isCurrent) {
                    playArtifact(artifact, cue.start, true);
                  } else {
                    seekToTime(cue.start);
                  }
                }}
              >
                <Text style={styles.cueTime}>{formatDuration(cue.start)}</Text>
                <Text style={[styles.cueText, active && styles.cueTextActive]}>
                  {cue.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  emptyText: { color: COLORS.textMuted, fontSize: 15 },
  content: { gap: 14 },
  gallery: { height: 240, backgroundColor: COLORS.card },
  heroImg: { width: 380, height: 240 },
  header: { paddingHorizontal: 16, gap: 10 },
  badges: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  codeBadge: {
    color: COLORS.amberLight,
    backgroundColor: COLORS.amberSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '800',
  },
  floorBadge: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { flex: 1, color: COLORS.text, fontSize: 20, fontWeight: '800' },
  favBtn: { padding: 4 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.amber,
    paddingVertical: 13,
    borderRadius: 14,
  },
  playButtonText: { color: COLORS.bg, fontSize: 15, fontWeight: '800' },
  section: {
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  sectionTitle: { color: COLORS.amberLight, fontSize: 14, fontWeight: '700' },
  desc: { color: COLORS.text, fontSize: 14, lineHeight: 22 },
  cueRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.card,
  },
  cueRowActive: {
    backgroundColor: COLORS.amberSoft,
    borderWidth: 1,
    borderColor: COLORS.amber,
  },
  cueTime: { color: COLORS.amberLight, fontSize: 12, fontWeight: '700', width: 40 },
  cueText: { flex: 1, color: COLORS.textMuted, fontSize: 13, lineHeight: 19 },
  cueTextActive: { color: COLORS.text, fontWeight: '700' },
});
