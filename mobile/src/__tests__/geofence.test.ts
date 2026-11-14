import {
  DEFAULT_TRIGGER_RADIUS,
  distanceMeters,
  findNearbyByGps,
  findNearbyByMap,
  findTriggered,
  getTriggerRadius,
} from '../shared/utils/geofence';
import { Artifact } from '../shared/types';

const makeArtifact = (id: string, overrides: Partial<Artifact> = {}): Artifact => ({
  id,
  code: id,
  floorId: 1,
  title: { vi: id, en: id, zh: id, ko: id, ja: id },
  description: { vi: '', en: '', zh: '', ko: '', ja: '' },
  images: [],
  mapCoordinates: { x: 0, y: 0 },
  audio: {},
  ...overrides,
});

describe('geofence (mobile)', () => {
  it('distanceMeters returns ~0 for same point and ~111km per 1 deg latitude', () => {
    const p = { latitude: 10.7795, longitude: 106.692 };
    expect(distanceMeters(p, p)).toBe(0);
    const d = distanceMeters(p, { latitude: 11.7795, longitude: 106.692 });
    expect(d).toBeGreaterThan(110000);
    expect(d).toBeLessThan(112000);
  });

  it('getTriggerRadius defaults to 15m', () => {
    expect(getTriggerRadius(makeArtifact('A1'))).toBe(DEFAULT_TRIGGER_RADIUS);
    expect(getTriggerRadius(makeArtifact('A2', { triggerRadius: 25 }))).toBe(25);
  });

  it('findTriggered selects closest artifact within triggerRadius', () => {
    const user = { latitude: 10.7795, longitude: 106.692 };
    const a1 = makeArtifact('A1', { geoCoordinates: { latitude: 10.77955, longitude: 106.692 } }); // ~5.5m
    const a2 = makeArtifact('A2', { geoCoordinates: { latitude: 10.77951, longitude: 106.692 } }); // ~1.1m
    const nearby = findNearbyByGps([a1, a2], user);
    expect(nearby[0].artifactId).toBe('A2');
    expect(findTriggered([a1, a2], nearby)?.artifactId).toBe('A2');
  });

  it('findNearbyByMap sorts same-floor artifacts by map pixel distance', () => {
    const anchor = makeArtifact('A0', { floorId: 1, mapCoordinates: { x: 100, y: 100 } });
    const near = makeArtifact('A1', { floorId: 1, mapCoordinates: { x: 110, y: 100 } });
    const far = makeArtifact('A2', { floorId: 1, mapCoordinates: { x: 200, y: 100 } });
    const otherFloor = makeArtifact('A3', { floorId: 2, mapCoordinates: { x: 101, y: 100 } });
    const list = findNearbyByMap([anchor, near, far, otherFloor], anchor);
    expect(list.map((x) => x.artifactId)).toEqual(['A1', 'A2']);
  });
});
