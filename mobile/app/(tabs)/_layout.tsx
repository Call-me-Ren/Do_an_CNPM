import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageSwitcher } from '../../src/components/LanguageSwitcher';
import { COLORS } from '../../src/shared/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  const tabBarHeight = 58 + bottomPad;

  const headerRight = () => (
    <View style={styles.headerRight}>
      <LanguageSwitcher />
      <TouchableOpacity
        style={styles.qrButton}
        onPress={() => router.push('/scanner')}
        activeOpacity={0.8}
      >
        <Ionicons name="qr-code-outline" size={18} color={COLORS.bg} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        headerRight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.borderSubtle,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: bottomPad,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.amberLight,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('explore'),
          headerTitle: t('appName'),
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('map'),
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites'),
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: t('museumInfo'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  qrButton: {
    backgroundColor: COLORS.amber,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
