import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultMuseumData from '../../data/museum_data.json';
import { MuseumData, SupportedLanguage } from '../types';

const CACHE_KEY = 'museum_cached_data_v1';
const SESSION_KEY = 'museum_mobile_session_id';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

let cachedSessionId: string | null = null;
const startedAt = Date.now();

export async function getOrCreateSessionId(): Promise<string> {
  if (cachedSessionId) return cachedSessionId;
  try {
    const existing = await AsyncStorage.getItem(SESSION_KEY);
    if (existing) {
      cachedSessionId = existing;
      return existing;
    }
    const created = `mob_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
    await AsyncStorage.setItem(SESSION_KEY, created);
    cachedSessionId = created;
    return created;
  } catch {
    cachedSessionId = `mob_${Date.now().toString(36)}`;
    return cachedSessionId;
  }
}

export const museumMobileApi = {
  /**
   * Ưu tiên đồng bộ dữ liệu mới từ backend nếu có EXPO_PUBLIC_API_URL và có mạng.
   * Khi offline hoặc lỗi mạng, tự động trả về bản cache mới nhất hoặc dữ liệu nhúng sẵn trong APK.
   */
  getMuseumData: async (): Promise<{ data: MuseumData; source: 'server' | 'cache' | 'bundled' }> => {
    if (API_URL) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/museum`, {}, 4000);
        if (res.ok) {
          const remote = (await res.json()) as MuseumData;
          if (remote?.artifacts?.length) {
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remote)).catch(() => {});
            return { data: remote, source: 'server' };
          }
        }
      } catch {
        // Im lặng rơi về cache / bundled khi không có mạng
      }
    }

    try {
      const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw) as MuseumData;
        if (parsed?.artifacts?.length) {
          return { data: parsed, source: 'cache' };
        }
      }
    } catch {
      // Bỏ qua lỗi đọc cache
    }

    return {
      data: JSON.parse(JSON.stringify(defaultMuseumData)) as MuseumData,
      source: 'bundled',
    };
  },

  sendHeartbeat: async (
    lang: SupportedLanguage,
    currentArtifactId: string | null = null,
    currentArtifactTitle: string | null = null
  ): Promise<void> => {
    if (!API_URL) return;
    try {
      const sessionId = await getOrCreateSessionId();
      await fetchWithTimeout(`${API_URL}/sessions/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          deviceType: 'Mobile',
          browser: 'Expo Android App',
          lang,
          currentArtifactId,
          currentArtifactTitle,
          startedAt,
        }),
      });
    } catch {
      // Im lặng khi offline
    }
  },

  trackListen: async (
    artifactId: string,
    artifactCode: string,
    artifactTitle: string,
    lang: SupportedLanguage
  ): Promise<void> => {
    if (!API_URL) return;
    try {
      const sessionId = await getOrCreateSessionId();
      const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await fetchWithTimeout(`${API_URL}/analytics/listen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          sessionId,
          artifactId,
          artifactCode,
          artifactTitle,
          lang,
          timestamp: Date.now(),
        }),
      });
    } catch {
      // Im lặng khi offline
    }
  },
};
