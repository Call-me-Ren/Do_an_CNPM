import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultMuseumData from '../../data/museum_data.json';
import { MuseumData, SupportedLanguage } from '../types';

const CACHE_KEY = 'museum_cached_data_v1';
const SESSION_KEY = 'museum_mobile_session_id';
const API_URL_OVERRIDE_KEY = 'museum_api_url_override_v1';
const PENDING_LISTENS_KEY = 'museum_pending_listen_events_v1';
const MAX_PENDING_LISTENS = 200;

export const DEFAULT_API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');

interface ListenEventPayload {
  id: string;
  sessionId: string;
  artifactId: string;
  artifactCode: string;
  artifactTitle: string;
  lang: SupportedLanguage;
  timestamp: number;
}

let cachedApiUrl: string | null = null;
let cachedSessionId: string | null = null;
let isFlushingListens = false;
const startedAt = Date.now();

export function normalizeApiUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, '').replace(/\/health$/i, '');
}

/** Trả về origin (scheme + host + port) của Backend đang cấu hình để tải media /uploads nếu cần. */
export function getApiOrigin(): string {
  const active = cachedApiUrl ?? DEFAULT_API_URL;
  if (!active) return '';
  const match = active.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : '';
}

export async function getApiUrl(): Promise<string> {
  if (cachedApiUrl !== null) return cachedApiUrl;
  try {
    const override = await AsyncStorage.getItem(API_URL_OVERRIDE_KEY);
    if (override !== null) {
      const resolved = normalizeApiUrl(override);
      cachedApiUrl = resolved;
      return resolved;
    }
  } catch {
    // Bỏ qua lỗi đọc AsyncStorage
  }
  cachedApiUrl = DEFAULT_API_URL;
  return DEFAULT_API_URL;
}

export async function setApiUrl(rawUrl: string): Promise<string> {
  const normalized = normalizeApiUrl(rawUrl);
  cachedApiUrl = normalized;
  try {
    if (normalized) {
      await AsyncStorage.setItem(API_URL_OVERRIDE_KEY, normalized);
      return normalized;
    }
    await AsyncStorage.removeItem(API_URL_OVERRIDE_KEY);
    cachedApiUrl = DEFAULT_API_URL;
    return DEFAULT_API_URL;
  } catch {
    // Bỏ qua lỗi lưu AsyncStorage
    return cachedApiUrl ?? DEFAULT_API_URL;
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

async function readPendingListens(): Promise<ListenEventPayload[]> {
  try {
    const raw = await AsyncStorage.getItem(PENDING_LISTENS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ListenEventPayload[]) : [];
  } catch {
    return [];
  }
}

async function writePendingListens(items: ListenEventPayload[]): Promise<void> {
  try {
    if (items.length === 0) {
      await AsyncStorage.removeItem(PENDING_LISTENS_KEY);
    } else {
      await AsyncStorage.setItem(
        PENDING_LISTENS_KEY,
        JSON.stringify(items.slice(-MAX_PENDING_LISTENS))
      );
    }
  } catch {
    // Bỏ qua lỗi ghi AsyncStorage
  }
}

async function enqueuePendingListen(event: ListenEventPayload): Promise<void> {
  const current = await readPendingListens();
  current.push(event);
  await writePendingListens(current);
}

export const museumMobileApi = {
  getApiUrl,
  setApiUrl,
  getApiOrigin,

  getPendingListenCount: async (): Promise<number> => {
    const items = await readPendingListens();
    return items.length;
  },

  /** Đẩy các lượt nghe được ghi nhận lúc offline lên Backend khi có mạng trở lại. */
  flushPendingListens: async (): Promise<number> => {
    if (isFlushingListens) return 0;
    const apiUrl = await getApiUrl();
    if (!apiUrl) return 0;

    isFlushingListens = true;
    try {
      const queue = await readPendingListens();
      if (queue.length === 0) return 0;

      let sentCount = 0;
      const remaining: ListenEventPayload[] = [];
      let networkFailed = false;

      for (const evt of queue) {
        if (networkFailed) {
          remaining.push(evt);
          continue;
        }
        try {
          const res = await fetchWithTimeout(`${apiUrl}/analytics/listen`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evt),
          });
          if (res.ok) {
            sentCount += 1;
          } else {
            remaining.push(evt);
          }
        } catch {
          networkFailed = true;
          remaining.push(evt);
        }
      }

      if (sentCount > 0) {
        await writePendingListens(remaining);
      }
      return sentCount;
    } finally {
      isFlushingListens = false;
    }
  },

  testConnection: async (
    urlOverride?: string
  ): Promise<{ ok: boolean; status?: number; latencyMs: number; message: string }> => {
    const apiUrl = urlOverride !== undefined ? normalizeApiUrl(urlOverride) : await getApiUrl();
    if (!apiUrl) {
      return { ok: false, latencyMs: 0, message: 'Chưa cấu hình URL Backend' };
    }
    const start = Date.now();
    try {
      const res = await fetchWithTimeout(`${apiUrl}/health`, {}, 4000);
      const latencyMs = Date.now() - start;
      if (res.ok) {
        return { ok: true, status: res.status, latencyMs, message: `Kết nối thành công (${latencyMs} ms)` };
      }
      return { ok: false, status: res.status, latencyMs, message: `Máy chủ trả về HTTP ${res.status}` };
    } catch (err) {
      const latencyMs = Date.now() - start;
      const detail = err instanceof Error ? err.message : 'Không thể kết nối';
      return { ok: false, latencyMs, message: `Lỗi mạng: ${detail}` };
    }
  },

  /**
   * Ưu tiên đồng bộ dữ liệu mới từ backend nếu có URL và có mạng.
   * Khi offline hoặc lỗi mạng, tự động trả về bản cache mới nhất hoặc dữ liệu nhúng sẵn trong APK.
   */
  getMuseumData: async (): Promise<{ data: MuseumData; source: 'server' | 'cache' | 'bundled' }> => {
    const apiUrl = await getApiUrl();
    if (apiUrl) {
      try {
        const res = await fetchWithTimeout(`${apiUrl}/museum`, {}, 4000);
        if (res.ok) {
          const remote = (await res.json()) as MuseumData;
          if (remote?.artifacts?.length) {
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remote)).catch(() => {});
            void museumMobileApi.flushPendingListens();
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
    const apiUrl = await getApiUrl();
    if (!apiUrl) return;
    try {
      const sessionId = await getOrCreateSessionId();
      const res = await fetchWithTimeout(`${apiUrl}/sessions/heartbeat`, {
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
      if (res.ok) {
        void museumMobileApi.flushPendingListens();
      }
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
    const sessionId = await getOrCreateSessionId();
    const payload: ListenEventPayload = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sessionId,
      artifactId,
      artifactCode,
      artifactTitle,
      lang,
      timestamp: Date.now(),
    };

    const apiUrl = await getApiUrl();
    if (!apiUrl) {
      await enqueuePendingListen(payload);
      return;
    }

    try {
      const res = await fetchWithTimeout(`${apiUrl}/analytics/listen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        await enqueuePendingListen(payload);
      }
    } catch {
      await enqueuePendingListen(payload);
    }
  },
};
