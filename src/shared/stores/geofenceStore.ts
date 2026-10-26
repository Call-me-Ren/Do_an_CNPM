import { create } from 'zustand';
import { NearbyEntry } from '../utils/geofence';

/**
 * Trạng thái theo dõi vị trí (USC14).
 *  - idle: chưa bật theo dõi
 *  - searching: đã bật, đang chờ tín hiệu GPS đầu tiên
 *  - active: có vị trí đủ chính xác
 *  - low-accuracy: sai số lớn, không tự kích hoạt (E2)
 *  - denied: người dùng từ chối quyền / mất tín hiệu (E1)
 *  - unavailable: thiết bị không hỗ trợ định vị (E1)
 *  - nodata: không tải được dữ liệu khu trưng bày (E3)
 */
export type GpsStatus =
  | 'idle'
  | 'searching'
  | 'active'
  | 'low-accuracy'
  | 'denied'
  | 'unavailable'
  | 'nodata';

/** Gợi ý chờ người dùng xác nhận: chuyển bài đang nghe dở (switch) hoặc nghe lại (replay) - A3. */
export interface TrackingSuggestion {
  artifactId: string;
  kind: 'switch' | 'replay';
}

interface GeofenceState {
  userLocation: { latitude: number; longitude: number } | null;
  nearestArtifactId: string | null;
  isTracking: boolean;
  permissionGranted: boolean | null;

  /** Theo dõi vị trí GPS (mặc định bật khi mở web để tự động yêu cầu quyền) */
  trackingEnabled: boolean;
  /** Đã quét mã QR cổng hoặc hiện vật để kích hoạt tự động phát thuyết minh khi đến gần */
  hasScannedQr: boolean;
  /** Hiện vật làm điểm xuất phát / vị trí hiện tại ("Bạn đang ở đây") */
  anchorArtifactId: string | null;
  gpsStatus: GpsStatus;
  accuracy: number | null;
  /** Các hiện vật gần nhất theo GPS (đã sắp xếp) */
  nearby: NearbyEntry[];
  suggestion: TrackingSuggestion | null;
  /** Hiện vật đã nghe trong phiên này */
  heardIds: string[];

  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;
  setNearestArtifactId: (id: string | null) => void;
  setIsTracking: (isTracking: boolean) => void;
  setPermissionGranted: (granted: boolean) => void;
  setHasScannedQr: (hasScannedQr: boolean) => void;

  /** Bật theo dõi; nếu có anchorId thì đặt làm điểm xuất phát. */
  startTracking: (anchorId?: string | null) => void;
  /** Dừng theo dõi (A4). */
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
