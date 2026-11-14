import { create } from 'zustand';
import { NearbyEntry } from '../utils/geofence';

export type GpsStatus =
  | 'idle'
  | 'searching'
  | 'active'
  | 'low-accuracy'
  | 'denied'
  | 'unavailable'
  | 'nodata';

export interface TrackingSuggestion {
  artifactId: string;
  kind: 'switch' | 'replay';
}

interface GeofenceState {
  userLocation: { latitude: number; longitude: number } | null;
  nearestArtifactId: string | null;
  isTracking: boolean;
  permissionGranted: boolean | null;
  trackingEnabled: boolean;
  hasScannedQr: boolean;
  anchorArtifactId: string | null;
  gpsStatus: GpsStatus;
  accuracy: number | null;
  nearby: NearbyEntry[];
  suggestion: TrackingSuggestion | null;
  heardIds: string[];

  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;
  setNearestArtifactId: (id: string | null) => void;
  setIsTracking: (isTracking: boolean) => void;
  setPermissionGranted: (granted: boolean) => void;
  setHasScannedQr: (hasScannedQr: boolean) => void;
  startTracking: (anchorId?: string | null) => void;
  stopTracking: () => void;
  setAnchor: (id: string | null) => void;
  setGpsStatus: (status: GpsStatus) => void;
  setAccuracy: (accuracy: number | null) => void;
  setNearby: (nearby: NearbyEntry[]) => void;
  setSuggestion: (suggestion: TrackingSuggestion | null) => void;
  markHeard: (id: string) => void;
}

export const useGeofenceStore = create<GeofenceState>((set, get) => ({
  userLocation: null,
  nearestArtifactId: null,
  isTracking: false,
  permissionGranted: null,
  trackingEnabled: true,
  hasScannedQr: false,
  anchorArtifactId: null,
  gpsStatus: 'idle',
  accuracy: null,
  nearby: [],
  suggestion: null,
  heardIds: [],

  setUserLocation: (userLocation) => set({ userLocation }),
  setNearestArtifactId: (nearestArtifactId) => set({ nearestArtifactId }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setPermissionGranted: (permissionGranted) => set({ permissionGranted }),
  setHasScannedQr: (hasScannedQr) => set({ hasScannedQr }),

  startTracking: (anchorId) =>
    set((state) => ({
      trackingEnabled: true,
      hasScannedQr: true,
      anchorArtifactId: anchorId === undefined ? state.anchorArtifactId : anchorId,
      gpsStatus: state.gpsStatus === 'active' ? 'active' : 'searching',
    })),

  stopTracking: () =>
    set({
      trackingEnabled: false,
      isTracking: false,
      gpsStatus: 'idle',
      accuracy: null,
      nearby: [],
      nearestArtifactId: null,
      suggestion: null,
    }),

  setAnchor: (anchorArtifactId) => set({ anchorArtifactId }),
  setGpsStatus: (gpsStatus) => set({ gpsStatus }),
  setAccuracy: (accuracy) => set({ accuracy }),
  setNearby: (nearby) => set({ nearby }),
  setSuggestion: (suggestion) => set({ suggestion }),
  markHeard: (id) => {
    if (!get().heardIds.includes(id)) {
      set({ heardIds: [...get().heardIds, id] });
    }
  },
}));
