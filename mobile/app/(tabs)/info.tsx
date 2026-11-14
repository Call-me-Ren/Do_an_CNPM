import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useMuseumData } from '../../src/shared/context/MuseumDataContext';
import { useLangStore } from '../../src/shared/stores/langStore';
import { usePlayerStore } from '../../src/shared/stores/playerStore';
import { resolveBundledAsset } from '../../src/shared/assetMap';
import { COLORS } from '../../src/shared/theme';

export default function MuseumInfoScreen() {
  const { t } = useTranslation();
  const { data, dataSource, loading, refreshData } = useMuseumData();
  const { currentLang } = useLangStore();
  const { currentArtifact } = usePlayerStore();

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.amber} />
      </View>
    );
  }

  const info = data.museum;
  const bannerSrc = resolveBundledAsset(info.banner);
  const name = info.name?.[currentLang] || info.name?.vi;
  const address = info.address?.[currentLang] || info.address?.vi;
  const openHours = info.openHours?.[currentLang] || info.openHours?.vi;
  const description = info.description?.[currentLang] || info.description?.vi;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        currentArtifact ? { paddingBottom: 150 } : { paddingBottom: 28 },
      ]}
    >
      {bannerSrc && <Image source={bannerSrc} style={styles.banner} resizeMode="cover" />}

      <View style={styles.headerCard}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.sourceRow}>
          <Ionicons
            name={dataSource === 'server' ? 'cloud-done-outline' : 'phone-portrait-outline'}
            size={14}
            color={dataSource === 'server' ? COLORS.emerald : COLORS.amberLight}
          />
          <Text style={styles.sourceText}>
            {dataSource === 'server'
              ? 'Đã đồng bộ từ máy chủ'
              : dataSource === 'cache'
              ? 'Dữ liệu ngoại tuyến (Cache)'
              : 'Dữ liệu ngoại tuyến (APK)'}
          </Text>
          <TouchableOpacity onPress={refreshData} style={styles.syncBtn}>
            <Ionicons name="refresh" size={14} color={COLORS.amberLight} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color={COLORS.amberLight} />
          <View style={styles.rowBody}>
            <Text style={styles.label}>{t('address') || 'Địa chỉ'}</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="time-outline" size={18} color={COLORS.amberLight} />
          <View style={styles.rowBody}>
            <Text style={styles.label}>{t('openHours') || 'Giờ mở cửa'}</Text>
            <Text style={styles.value}>{openHours}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(`tel:${info.hotline.replace(/\s+/g, '')}`)}
        >
          <Ionicons name="call-outline" size={18} color={COLORS.emerald} />
          <View style={styles.rowBody}>
            <Text style={styles.label}>Hotline</Text>
            <Text style={[styles.value, { color: COLORS.emerald }]}>{info.hotline}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t('aboutMuseum') || 'Giới thiệu'}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  content: { padding: 14, gap: 12 },
  banner: { width: '100%', height: 190, borderRadius: 16, backgroundColor: COLORS.card },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  name: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceText: { color: COLORS.textMuted, fontSize: 12, flex: 1 },
  syncBtn: { padding: 4 },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowBody: { flex: 1, gap: 2 },
  label: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border },
  sectionTitle: { color: COLORS.amberLight, fontSize: 14, fontWeight: '700' },
  desc: { color: COLORS.text, fontSize: 14, lineHeight: 21 },
});
