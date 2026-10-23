import axios from 'axios';
import { MuseumData, Floor, Artifact } from '../types';
import defaultMuseumData from '../../data/museum_data.json';

const rawBase = import.meta.env.BASE_URL || '/';
const basePath =
  rawBase.endsWith('/') && rawBase !== '/'
    ? rawBase.slice(0, -1)
    : rawBase === '/'
    ? ''
    : rawBase;

const STORAGE_CUSTOM_FLOORS = 'museum_custom_floors_v2';
const STORAGE_CUSTOM_ARTIFACTS = 'museum_custom_artifacts_v2';

export const museumApi = {
  getMuseumData: async (): Promise<MuseumData> => {
    // Clear legacy v1 cached artifacts to prevent stale shared images
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('museum_custom_artifacts_v1');
        localStorage.removeItem('museum_custom_floors_v1');
      } catch {
        // ignore
      }
    }

    let data: MuseumData;
    try {
      const res = await axios.get<MuseumData>(`${basePath}/mock/museum_data.json`);
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
            return found ? { ...f, ...found } : f;
          });
        }

        const customArtifactsRaw = localStorage.getItem(STORAGE_CUSTOM_ARTIFACTS);
        if (customArtifactsRaw) {
          const customArtifacts: Artifact[] = JSON.parse(customArtifactsRaw);
          data.artifacts = data.artifacts.map((a) => {
            const found = customArtifacts.find((ca) => ca.id === a.id);
            return found ? { ...a, ...found } : a;
          });
        }
      } catch {
        // Fall back to json
      }
    }

    return data;
  },

  saveCustomFloors: (floors: Floor[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOM_FLOORS, JSON.stringify(floors));
    }
  },

  saveCustomArtifacts: (artifacts: Artifact[]): void => {
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
