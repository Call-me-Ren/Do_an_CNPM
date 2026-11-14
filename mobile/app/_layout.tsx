import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/locales/i18n';
import { MuseumDataProvider } from '../src/shared/context/MuseumDataContext';
import { AudioPlayerBar } from '../src/components/AudioPlayerBar';
import { COLORS } from '../src/shared/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MuseumDataProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.text,
            contentStyle: { backgroundColor: COLORS.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="scanner"
            options={{
              presentation: 'modal',
              title: 'Quét mã QR',
            }}
          />
          <Stack.Screen
            name="artifact/[id]"
            options={{
              title: 'Chi tiết hiện vật',
            }}
          />
        </Stack>
        <AudioPlayerBar />
      </MuseumDataProvider>
    </SafeAreaProvider>
  );
}
