import { create } from 'zustand';

interface GeofenceState {
  userLocation: { latitude: number; longitude: number } | null;
  nearestArtifactId: string | null;
  isTracking: boolean;
  permissionGranted: boolean | null;
  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;
  setNearestArtifactId: (id: string | null) => void;
  setIsTracking: (isTracking: boolean) => void;
  setPermissionGranted: (granted: boolean) => void;
}

export const useGeofenceStore = create<GeofenceState>((set) => ({
  userLocation: null,
  nearestArtifactId: null,
  isTracking: false,
  permissionGranted: null,
  setUserLocation: (userLocation) => set({ userLocation }),
  setNearestArtifactId: (nearestArtifactId) => set({ nearestArtifactId }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setPermissionGranted: (permissionGranted) => set({ permissionGranted }),
}));
