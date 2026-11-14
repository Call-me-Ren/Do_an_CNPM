import { parseQrPayload } from '../shared/utils/qrHelper';
import { Artifact } from '../shared/types';

const artifacts: Artifact[] = [
  {
    id: 'WRM001',
    code: 'AIR-F5A',
    floorId: 1,
    title: { vi: 'F-5A', en: 'F-5A', zh: 'F-5A', ko: 'F-5A', ja: 'F-5A' },
    description: { vi: '', en: '', zh: '', ko: '', ja: '' },
    images: [],
    mapCoordinates: { x: 10, y: 10 },
    audio: {},
  },
];

describe('qrHelper (mobile)', () => {
  it('parses ?artifact= URL by id or code', () => {
    const r1 = parseQrPayload('https://museum.vn/?artifact=WRM001', artifacts);
    expect(r1.type).toBe('artifact');
    const r2 = parseQrPayload('https://museum.vn/?artifact=AIR-F5A', artifacts);
    expect(r2.type).toBe('artifact');
  });

  it('parses ?entry=gate as museum gate', () => {
    expect(parseQrPayload('https://museum.vn/?entry=gate', artifacts).type).toBe('museum');
  });

  it('parses raw code and rejects unknown code', () => {
    expect(parseQrPayload('WRM001', artifacts).type).toBe('artifact');
    expect(parseQrPayload('INVALID-999', artifacts).type).toBe('unknown');
  });
});
