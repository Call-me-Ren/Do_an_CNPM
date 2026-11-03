import { describe, it, expect } from 'vitest';
import {
  distanceMeters,
  findNearbyByGps,
  findTriggered,
  findNearbyByMap,
  getTriggerRadius,
  DEFAULT_TRIGGER_RADIUS,
} from '../shared/utils/geofence';
import { useGeofenceStore } from '../shared/stores/geofenceStore';
import { Artifact } from '../shared/types';

const mockArtifacts: Artifact[] = [
  {
    id: 'ART1',
    code: 'A-01',
    floorId: 1,
    title: { vi: 'Hiện vật 1', en: 'Art 1', zh: '', ko: '', ja: '' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 100, y: 100 },
    geoCoordinates: { latitude: 10.7795, longitude: 106.6921 },
    triggerRadius: 10,
    audio: {},
  },
  {
    id: 'ART2',
    code: 'A-02',
    floorId: 1,
    title: { vi: 'Hiện vật 2', en: 'Art 2', zh: '', ko: '', ja: '' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 300, y: 100 },
    geoCoordinates: { latitude: 10.7798, longitude: 106.6921 },
    triggerRadius: 20,
    audio: {},
  },
  {
    id: 'ART3',
    code: 'A-03',
    floorId: 2,
    title: { vi: 'Hiện vật 3 (tầng 2)', en: 'Art 3', zh: '', ko: '', ja: '' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 100, y: 100 },
    audio: {},
  },
];

describe('Geofence Distance and Triggering Logic (USC14)', () => {
  it('calculates 0 meters for identical coordinates', () => {
    const dist = distanceMeters(
      { latitude: 10.7795, longitude: 106.6921 },
      { latitude: 10.7795, longitude: 106.6921 }
    );
    expect(dist).toBe(0);
  });

  it('calculates reasonable metric distance', () => {
    // 0.0001 deg lat difference is roughly 11.1 meters
    const dist = distanceMeters(
      { latitude: 10.7795, longitude: 106.6921 },
      { latitude: 10.7796, longitude: 106.6921 }
    );
    expect(dist).toBeGreaterThan(10);
    expect(dist).toBeLessThan(12);
  });

  it('sorts nearby artifacts by distance correctly', () => {
    const userLoc = { latitude: 10.77951, longitude: 106.6921 };
    const nearby = findNearbyByGps(mockArtifacts, userLoc);
    expect(nearby.length).toBe(2);
    expect(nearby[0].artifactId).toBe('ART1');
    expect(nearby[1].artifactId).toBe('ART2');
    expect(nearby[0].distance).toBeLessThan(nearby[1].distance);
  });

  it('selects nearest triggered artifact (A2 priority)', () => {
    const userLoc = { latitude: 10.77951, longitude: 106.6921 }; // ~1m from ART1
    const nearby = findNearbyByGps(mockArtifacts, userLoc);
    const hit = findTriggered(mockArtifacts, nearby);
    expect(hit).not.toBeNull();
    expect(hit?.artifactId).toBe('ART1');
  });

  it('returns null when user is outside trigger radius of all artifacts', () => {
    const farLoc = { latitude: 10.7900, longitude: 106.7000 };
    const nearby = findNearbyByGps(mockArtifacts, farLoc);
    const hit = findTriggered(mockArtifacts, nearby);
    expect(hit).toBeNull();
  });

  it('finds nearby artifacts on the same floor map based on pixel distance', () => {
    const mapNearby = findNearbyByMap(mockArtifacts, mockArtifacts[0]);
    expect(mapNearby.length).toBe(1);
    expect(mapNearby[0].artifactId).toBe('ART2');
    // dx = 200px * 0.15 = 30m
    expect(mapNearby[0].distance).toBeCloseTo(30, 1);
  });

  it('uses default trigger radius when not specified', () => {
    expect(getTriggerRadius(mockArtifacts[2])).toBe(DEFAULT_TRIGGER_RADIUS);
  });

  it('enables automatic location tracking by default and requires QR scan for tour trigger', () => {
    const store = useGeofenceStore.getState();
    expect(store.trackingEnabled).toBe(true);
    expect(store.hasScannedQr).toBe(false);

    // After scanning gate or exhibit QR
    store.startTracking('ART1');
    const updated = useGeofenceStore.getState();
    expect(updated.hasScannedQr).toBe(true);
    expect(updated.anchorArtifactId).toBe('ART1');
  });
});
