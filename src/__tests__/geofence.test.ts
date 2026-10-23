import { describe, it, expect } from 'vitest';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * 111000;
  const dLon = (lon2 - lon1) * 111000 * Math.cos(lat1 * (Math.PI / 180));
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

describe('Geofence Distance Logic', () => {
  it('should return 0 when at identical coordinates', () => {
    const dist = calculateDistance(10.7876, 106.7051, 10.7876, 106.7051);
    expect(dist).toBe(0);
  });

  it('should trigger geofence when user is within 30 meters', () => {
    // 0.0001 deg lat is approximately 11.1 meters
    const userLat = 10.7876 + 0.0001;
    const userLon = 106.7051;
    const dist = calculateDistance(userLat, userLon, 10.7876, 106.7051);

    expect(dist).toBeLessThanOrEqual(30);
  });

  it('should NOT trigger geofence when user is further than 30 meters', () => {
    // 0.0005 deg lat is approximately 55.5 meters
    const userLat = 10.7876 + 0.0005;
    const userLon = 106.7051;
    const dist = calculateDistance(userLat, userLon, 10.7876, 106.7051);

    expect(dist).toBeGreaterThan(30);
  });
});
