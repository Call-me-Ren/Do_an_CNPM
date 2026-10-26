import { Artifact } from '../types';

/**
 * Tiện ích định vị (USC14): tính khoảng cách, tìm hiện vật gần người dùng.
 * Tách thành hàm thuần (pure function) để dễ kiểm thử và dùng lại.
 */

/** Bán kính kích hoạt mặc định (mét) khi hiện vật không khai báo triggerRadius. */
export const DEFAULT_TRIGGER_RADIUS = 15;

/** Sai số GPS tối đa chấp nhận (mét). Vượt ngưỡng này hệ thống không tự kích hoạt (E2). */
export const MAX_ACCEPTABLE_ACCURACY = 50;

/** Quy đổi pixel trên sơ đồ sang mét (dùng cho gợi ý "Gần bạn" khi chỉ có điểm QR). */
export const MAP_METERS_PER_PIXEL = 0.15;

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface NearbyEntry {
  artifactId: string;
  /** Khoảng cách tính bằng mét */
  distance: number;
}

/** Khoảng cách giữa hai tọa độ GPS (công thức Haversine), đơn vị mét. */
export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Bán kính kích hoạt hiệu lực của một hiện vật. */
export function getTriggerRadius(artifact: Artifact): number {
  return artifact.triggerRadius && artifact.triggerRadius > 0
    ? artifact.triggerRadius
    : DEFAULT_TRIGGER_RADIUS;
}

/** Danh sách hiện vật có tọa độ GPS, sắp xếp từ gần đến xa so với vị trí người dùng. */
export function findNearbyByGps(artifacts: Artifact[], location: GeoPoint): NearbyEntry[] {
  return artifacts
    .filter((a) => a.geoCoordinates)
    .map((a) => ({
      artifactId: a.id,
      distance: distanceMeters(location, a.geoCoordinates as GeoPoint),
    }))
    .sort((x, y) => x.distance - y.distance);
}

/**
 * Hiện vật đang nằm trong vùng kích hoạt (nếu có nhiều hiện vật, chọn hiện vật gần nhất - A2).
 * `nearby` phải được sắp xếp tăng dần theo khoảng cách (kết quả của findNearbyByGps).
 */
export function findTriggered(artifacts: Artifact[], nearby: NearbyEntry[]): NearbyEntry | null {
  for (const entry of nearby) {
    const art = artifacts.find((a) => a.id === entry.artifactId);
    if (art && entry.distance <= getTriggerRadius(art)) {
      return entry;
    }
  }
  return null;
}

/**
 * Gợi ý "Gần bạn" khi chưa có GPS: các hiện vật cùng khu vực với điểm QR vừa quét,
 * xếp theo khoảng cách trên sơ đồ (đã quy đổi ra mét).
 */
export function findNearbyByMap(artifacts: Artifact[], anchor: Artifact): NearbyEntry[] {
  return artifacts
    .filter((a) => a.id !== anchor.id && a.floorId === anchor.floorId)
    .map((a) => {
      const dx = a.mapCoordinates.x - anchor.mapCoordinates.x;
      const dy = a.mapCoordinates.y - anchor.mapCoordinates.y;
      return {
        artifactId: a.id,
        distance: Math.sqrt(dx * dx + dy * dy) * MAP_METERS_PER_PIXEL,
      };
    })
    .sort((x, y) => x.distance - y.distance);
}
