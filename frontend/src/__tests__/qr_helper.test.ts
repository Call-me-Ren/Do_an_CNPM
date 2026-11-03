import { describe, it, expect } from 'vitest';
import { parseQrPayload } from '../shared/utils/qrHelper';
import { Artifact } from '../shared/types';

const mockArtifacts: Artifact[] = [
  {
    id: 'WRM001',
    code: 'TANK-M48',
    floorId: 1,
    title: { vi: 'Xe tăng M48', en: 'M48 Tank', zh: '', ko: '', ja: '' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 180, y: 240 },
    audio: {},
  },
  {
    id: 'WRM002',
    code: 'AIR-F5A',
    floorId: 1,
    title: { vi: 'Máy bay F-5A', en: 'F-5A Fighter', zh: '', ko: '', ja: '' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 340, y: 200 },
    audio: {},
  },
];

describe('QR Payload Parsing (USC02)', () => {
  it('parses URL with artifact query parameter', () => {
    const payload = parseQrPayload(
      'https://call-me-ren.github.io/Do_an_CNPM/?artifact=WRM001',
      mockArtifacts
    );
    expect(payload.type).toBe('artifact');
    if (payload.type === 'artifact') {
      expect(payload.artifact.id).toBe('WRM001');
    }
  });

  it('parses URL with artifact code query parameter', () => {
    const payload = parseQrPayload(
      'https://call-me-ren.github.io/Do_an_CNPM/?artifact=AIR-F5A',
      mockArtifacts
    );
    expect(payload.type).toBe('artifact');
    if (payload.type === 'artifact') {
      expect(payload.artifact.id).toBe('WRM002');
    }
  });

  it('parses museum entrance gate QR link', () => {
    const payload = parseQrPayload(
      'https://call-me-ren.github.io/Do_an_CNPM/?entry=gate',
      mockArtifacts
    );
    expect(payload.type).toBe('museum');
  });

  it('matches plain artifact ID or code string', () => {
    expect(parseQrPayload('WRM001', mockArtifacts).type).toBe('artifact');
    expect(parseQrPayload('AIR-F5A', mockArtifacts).type).toBe('artifact');
  });

  it('returns unknown for unrecognized QR strings', () => {
    const payload = parseQrPayload('https://random-link.com/hello', mockArtifacts);
    expect(payload.type).toBe('unknown');
  });
});
