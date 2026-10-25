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

const STORAGE_CUSTOM_FLOORS = 'museum_custom_floors_v3';
const STORAGE_CUSTOM_ARTIFACTS = 'museum_custom_artifacts_v3';

export const museumApi = {
  getMuseumData: async (): Promise<MuseumData> => {
    // Clear legacy cached artifacts to prevent stale shared images and old uncalibrated subtitles
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('museum_custom_artifacts_v1');
        localStorage.removeItem('museum_custom_floors_v1');
        localStorage.removeItem('museum_custom_artifacts_v2');
        localStorage.removeItem('museum_custom_floors_v2');
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
          // only preserving custom mapCoordinates if edited on the floor map
          data.artifacts = data.artifacts.map((defaultArt) => {
            const saved = customArtifacts.find((c) => c.id === defaultArt.id);
            if (saved && saved.mapCoordinates) {
              return { ...defaultArt, mapCoordinates: saved.mapCoordinates };
            }
            return defaultArt;
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
