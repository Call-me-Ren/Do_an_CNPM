import axios from 'axios';
import { MuseumData, Floor, Artifact } from '../types';
import defaultMuseumData from '../../data/museum_data.json';
import { http, apiEnabled } from './http';

const rawBase = import.meta.env.BASE_URL || '/';
const basePath =
  rawBase.endsWith('/') && rawBase !== '/'
    ? rawBase.slice(0, -1)
    : rawBase === '/'
    ? ''
    : rawBase;

const STORAGE_CUSTOM_FLOORS = 'museum_custom_floors_v5';
const STORAGE_CUSTOM_ARTIFACTS = 'museum_custom_artifacts_v3';

// Snapshot dữ liệu lần cuối lấy từ back-end (null = đang ở chế độ demo/offline).
let serverArtifacts: Artifact[] | null = null;
let serverFloors: Floor[] | null = null;
let syncQueue: Promise<void> = Promise.resolve();

/** Nếu url là data: URL (file admin chọn từ máy) thì upload lên back-end và trả về URL do server cấp. */
async function ensureUploaded(url: string, kind: 'audio' | 'image'): Promise<string> {
  if (!url.startsWith('data:')) return url;
  const blob = await (await fetch(url)).blob();
  const form = new FormData();
  form.append('file', blob, `upload.${blob.type.split('/')[1]?.split(';')[0] || 'bin'}`);
  const res = await http.post<{ url: string }>(`/uploads/${kind}`, form, { timeout: 60000 });
  return res.data.url;
}

async function prepareArtifact(a: Artifact): Promise<Artifact> {
  const images = await Promise.all(a.images.map((u) => ensureUploaded(u, 'image')));
  const audio: Artifact['audio'] = {};
  for (const [lang, url] of Object.entries(a.audio ?? {})) {
    if (url) audio[lang as keyof Artifact['audio']] = await ensureUploaded(url, 'audio');
  }
  return { ...a, images, audio };
}

async function syncArtifactsToServer(next: Artifact[]): Promise<void> {
  const prev = serverArtifacts ?? [];
  const prevMap = new Map(prev.map((a) => [a.id, a]));
  const nextIds = new Set(next.map((a) => a.id));
  for (const art of next) {
    const old = prevMap.get(art.id);
    if (old && JSON.stringify(old) === JSON.stringify(art)) continue;
    const body = await prepareArtifact(art);
    if (old) await http.put(`/artifacts/${encodeURIComponent(art.id)}`, body);
    else await http.post('/artifacts', body);
  }
  for (const old of prev) {
    if (!nextIds.has(old.id)) await http.delete(`/artifacts/${encodeURIComponent(old.id)}`);
  }
  serverArtifacts = (await http.get<MuseumData>('/museum')).data.artifacts;
}

async function syncFloorsToServer(next: Floor[]): Promise<void> {
  const prevMap = new Map((serverFloors ?? []).map((f) => [f.id, f]));
  for (const floor of next) {
    const old = prevMap.get(floor.id);
    if (old && old.mapImage === floor.mapImage && JSON.stringify(old.bounds) === JSON.stringify(floor.bounds)) continue;
    await http.put(`/floors/${floor.id}`, {
      mapImage: await ensureUploaded(floor.mapImage, 'image'),
      bounds: floor.bounds,
    });
  }
  serverFloors = (await http.get<MuseumData>('/museum')).data.floors;
}

function enqueueSync(task: () => Promise<void>): void {
  syncQueue = syncQueue.then(task).catch((e) => {
    console.error('[api] Đồng bộ lên back-end thất bại:', e);
  });
}

export const museumApi = {
  getMuseumData: async (): Promise<MuseumData> => {
    // Ưu tiên back-end (SQL Server). Lỗi kết nối -> rơi về chế độ demo bên dưới.
    if (apiEnabled) {
      try {
        const res = await http.get<MuseumData>('/museum');
        serverArtifacts = res.data.artifacts;
        serverFloors = res.data.floors;
        return JSON.parse(JSON.stringify(res.data)) as MuseumData;
      } catch (e) {
        console.warn('[api] Không kết nối được back-end, dùng dữ liệu demo.', e);
        serverArtifacts = null;
        serverFloors = null;
      }
    }

    // Clear legacy cached artifacts to prevent stale shared images and old uncalibrated subtitles
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('museum_custom_artifacts_v1');
        localStorage.removeItem('museum_custom_floors_v1');
        localStorage.removeItem('museum_custom_artifacts_v2');
        localStorage.removeItem('museum_custom_floors_v2');
        localStorage.removeItem('museum_custom_floors_v3');
        localStorage.removeItem('museum_custom_floors_v4');
      } catch {
        // ignore
      }
    }

    let data: MuseumData;
    try {
      const res = await axios.get<MuseumData>(`${basePath}/mock/museum_data.json?t=${Date.now()}`);
      data = res.data;
    } catch {
      // Fallback to embedded data if network fetch is blocked, offline, or returns error
      data = JSON.parse(JSON.stringify(defaultMuseumData)) as MuseumData;
    }

    // Apply any custom floors or map background saved by Admin
    if (typeof window !== 'undefined') {
      try {
        const customFloorsRaw = localStorage.getItem(STORAGE_CUSTOM_FLOORS);
        if (customFloorsRaw) {
          const customFloors: Floor[] = JSON.parse(customFloorsRaw);
          data.floors = data.floors.map((f) => {
            const found = customFloors.find((cf) => cf.id === f.id);
            return found ? { ...f, mapImage: found.mapImage || f.mapImage, bounds: found.bounds || f.bounds } : f;
          });
        }

        const customArtifactsRaw = localStorage.getItem(STORAGE_CUSTOM_ARTIFACTS);
        if (customArtifactsRaw) {
          const customArtifacts: Artifact[] = JSON.parse(customArtifactsRaw);
          const defaultIds = new Set([
            'WRM001', 'WRM002', 'WRM003', 'WRM004', 'WRM005',
            'WRM006', 'WRM007', 'WRM008', 'WRM009', 'WRM010',
            'WRM011', 'WRM012', 'WRM013', 'WRM014', 'WRM015'
          ]);

          const userAdded: Artifact[] = [];
          customArtifacts.forEach((art) => {
            if (!defaultIds.has(art.id) || art.createdAt || art.code?.startsWith('HV-')) {
              userAdded.push(art);
            }
          });

          // Sort user-added by createdAt descending if present
          userAdded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          // Default artifacts ALWAYS retain fresh audio and calibrated subtitles from json,
          // only preserving custom mapCoordinates / GPS position / trigger radius if edited by Admin
          data.artifacts = data.artifacts.map((defaultArt) => {
            const saved = customArtifacts.find((c) => c.id === defaultArt.id);
            if (!saved) return defaultArt;
            return {
              ...defaultArt,
              mapCoordinates: saved.mapCoordinates || defaultArt.mapCoordinates,
              geoCoordinates: saved.geoCoordinates || defaultArt.geoCoordinates,
              triggerRadius: saved.triggerRadius || defaultArt.triggerRadius,
            };
          });

          // Newly added artifacts are kept at the top
          data.artifacts = [...userAdded, ...data.artifacts];
        }
      } catch {
        // Fall back to json
      }
    }

    return data;
  },

  saveCustomFloors: (floors: Floor[]): void => {
    if (serverFloors) {
      enqueueSync(() => syncFloorsToServer(floors));
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOM_FLOORS, JSON.stringify(floors));
    }
  },

  saveCustomArtifacts: (artifacts: Artifact[]): void => {
    if (serverArtifacts) {
      enqueueSync(() => syncArtifactsToServer(artifacts));
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOM_ARTIFACTS, JSON.stringify(artifacts));
    }
  },

  resetDefaults: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_CUSTOM_FLOORS);
      localStorage.removeItem(STORAGE_CUSTOM_ARTIFACTS);
    }
  }
};
