import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../shared/stores/playerStore';
import { useLangStore } from '../shared/stores/langStore';
import { resolveBundledAsset } from '../shared/assetMap';
import { findActiveCueIndex, formatDuration } from '../shared/utils/subtitles';
import { COLORS } from '../shared/theme';

const RATES = [1.0, 1.25, 1.5, 2.0];

export const AudioPlayerBar: React.FC = () => {
  const router = useRouter();
  const { currentLang } = useLangStore();
  const {
    currentArtifact,
    isPlaying,
    playbackRate,
    showSubtitle,
    seekTarget,
    pause,
    resume,
    stop,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    toggleSubtitle,
    seekToTime,
  } = usePlayerStore();

  const audioPath = currentArtifact
    ? currentArtifact.audio?.[currentLang] || currentArtifact.audio?.vi
    : undefined;

  const source = useMemo(() => resolveBundledAsset(audioPath), [audioPath]);
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    }).catch(() => {});
  }, []);

  // Cập nhật thời gian và trạng thái phát từ expo-audio
  useEffect(() => {
    if (!currentArtifact) return;
    setCurrentTime(status.currentTime || 0);
    if (status.duration && status.duration > 0) {
      setDuration(status.duration);
    }
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }, [
    currentArtifact,
    status.currentTime,
    status.duration,
    status.didJustFinish,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  ]);

  // Đồng bộ play / pause
  useEffect(() => {
    if (!currentArtifact || !source) return;
    try {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    } catch {
      // Bỏ qua nếu player chưa sẵn sàng
    }
  }, [currentArtifact, source, isPlaying, player]);

  // Đồng bộ tốc độ phát
  useEffect(() => {
    try {
      player.setPlaybackRate(playbackRate);
    } catch {
      // Bỏ qua nếu thiết bị chưa hỗ trợ
    }
  }, [playbackRate, player]);

  // Xử lý tua thời gian
  useEffect(() => {
    if (!seekTarget) return;
    try {
      player.seekTo(seekTarget.time);
    } catch {
      // ignore
    }
  }, [seekTarget, player]);

  if (!currentArtifact) return null;

  const cues =
    currentArtifact.subtitles?.[currentLang] || currentArtifact.subtitles?.vi || [];
  const currentTime = status.currentTime || 0;
  const totalDuration = status.duration || (cues.length ? cues[cues.length - 1].end : 0);
  const activeCueIdx = findActiveCueIndex(cues, currentTime);
  const activeCueText = activeCueIdx >= 0 ? cues[activeCueIdx].text : '';
  const progress = totalDuration > 0 ? Math.min(1, currentTime / totalDuration) : 0;

  const title =
    currentArtifact.title?.[currentLang] ||
    currentArtifact.title?.vi ||
    currentArtifact.code;

  const cycleRate = () => {
    const idx = RATES.indexOf(playbackRate);
    const next = RATES[(idx + 1) % RATES.length];
    setPlaybackRate(next);
  };

  return (
    <View style={styles.container}>
      {showSubtitle && !!activeCueText && (
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitleText} numberOfLines={3}>
            {activeCueText}
          </Text>
        </View>
      )}

      <View style={styles.bar}>
        <Pressable
          style={styles.progressTrack}
          onPress={(e) => {
            if (totalDuration <= 0) return;
            const x = e.nativeEvent.locationX;
            const ratio = Math.max(0, Math.min(1, x / 320));
            seekToTime(ratio * totalDuration);
          }}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </Pressable>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.infoWrap}
            onPress={() => router.push(`/artifact/${encodeURIComponent(currentArtifact.id)}`)}
            activeOpacity={0.8}
          >
            <View style={styles.badge}>
              <Ionicons name="headset" size={16} color={COLORS.bg} />
            </View>
            <View style={styles.titleWrap}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.time}>
                {formatDuration(currentTime)} / {formatDuration(totalDuration)}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.chip} onPress={cycleRate}>
              <Text style={styles.chipText}>{playbackRate}x</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.chip, showSubtitle && styles.chipActive]}
              onPress={toggleSubtitle}
            >
              <Ionicons
                name="text"
                size={14}
                color={showSubtitle ? COLORS.bg : COLORS.textMuted}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => (isPlaying ? pause() : resume())}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color={COLORS.bg} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={stop}>
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 66,
    gap: 6,
  },
  subtitleBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: COLORS.amber,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  subtitleText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  bar: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.card,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.amber,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  infoWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },
  time: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  chipActive: {
    backgroundColor: COLORS.amberLight,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
});
