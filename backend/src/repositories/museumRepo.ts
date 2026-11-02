import { getPool, sql } from '../db/pool.js';
import { LANGS, type Lang } from '../config/env.js';

type LangRec = Record<Lang, string>;
const emptyLang = (): LangRec => ({ vi: '', en: '', zh: '', ko: '', ja: '' });

export interface ArtifactDto {
  id: string;
  code: string;
  floorId: number;
  title: LangRec;
  description: LangRec;
  images: string[];
  mapCoordinates: { x: number; y: number };
  geoCoordinates?: { latitude: number; longitude: number };
  triggerRadius?: number;
  audio: Partial<Record<Lang, string>>;
  subtitles?: Partial<Record<Lang, { start: number; end: number; text: string }[]>>;
  createdAt?: number;
}

export interface FloorDto {
  id: number;
  name: LangRec;
  mapImage: string;
  bounds: { width: number; height: number };
}

export interface MuseumDto {
  name: LangRec;
  address: LangRec;
  openHours: LangRec;
  description: LangRec;
  hotline: string;
  banner: string;
}

export async function getMuseumInfo(): Promise<MuseumDto> {
  const pool = await getPool();
  const info = await pool.request().query('SELECT Hotline, Banner FROM dbo.Museum WHERE Id = 1');
  const tr = await pool.request().query('SELECT Lang, Name, Address, OpenHours, Description FROM dbo.MuseumTranslation');
  const dto: MuseumDto = {
    name: emptyLang(),
    address: emptyLang(),
    openHours: emptyLang(),
    description: emptyLang(),
    hotline: info.recordset[0]?.Hotline ?? '',
    banner: info.recordset[0]?.Banner ?? '',
  };
  for (const r of tr.recordset) {
    const l = r.Lang as Lang;
    dto.name[l] = r.Name;
    dto.address[l] = r.Address;
    dto.openHours[l] = r.OpenHours;
    dto.description[l] = r.Description;
  }
  return dto;
}

export async function getFloors(): Promise<FloorDto[]> {
  const pool = await getPool();
  const floors = await pool.request().query('SELECT Id, MapImage, Width, Height FROM dbo.Floor ORDER BY Id');
  const tr = await pool.request().query('SELECT FloorId, Lang, Name FROM dbo.FloorTranslation');
  return floors.recordset.map((f) => {
    const name = emptyLang();
    for (const t of tr.recordset) if (t.FloorId === f.Id) name[t.Lang as Lang] = t.Name;
    return { id: f.Id, name, mapImage: f.MapImage, bounds: { width: f.Width, height: f.Height } };
  });
}

export async function updateFloor(id: number, mapImage?: string, bounds?: { width: number; height: number }): Promise<boolean> {
  const pool = await getPool();
  const r = await pool
    .request()
    .input('id', sql.Int, id)
    .input('mapImage', sql.NVarChar(500), mapImage ?? null)
    .input('w', sql.Float, bounds?.width ?? null)
    .input('h', sql.Float, bounds?.height ?? null)
    .query(`UPDATE dbo.Floor SET MapImage = COALESCE(@mapImage, MapImage), Width = COALESCE(@w, Width), Height = COALESCE(@h, Height) WHERE Id = @id`);
  return (r.rowsAffected[0] ?? 0) > 0;
}

export async function getArtifacts(id?: string): Promise<ArtifactDto[]> {
  const pool = await getPool();
  const where = id ? 'WHERE a.Id = @id' : '';
  const bind = (rq: sql.Request) => (id ? rq.input('id', sql.NVarChar(50), id) : rq);
  const arts = await bind(pool.request()).query(
    `SELECT a.* FROM dbo.Artifact a ${where} ORDER BY a.SortOrder, a.CreatedAt DESC, a.Id`
  );
  if (arts.recordset.length === 0) return [];
  const sub = id ? 'WHERE ArtifactId = @id' : '';
  const [tr, im, au, su] = await Promise.all([
    bind(pool.request()).query(`SELECT ArtifactId, Lang, Title, Description FROM dbo.ArtifactTranslation ${sub}`),
    bind(pool.request()).query(`SELECT ArtifactId, Url FROM dbo.ArtifactImage ${sub} ORDER BY ArtifactId, SortOrder`),
    bind(pool.request()).query(`SELECT ArtifactId, Lang, Url FROM dbo.ArtifactAudio ${sub}`),
    bind(pool.request()).query(`SELECT ArtifactId, Lang, StartSec, EndSec, Text FROM dbo.SubtitleCue ${sub} ORDER BY ArtifactId, Lang, SortOrder`),
  ]);

  const map = new Map<string, ArtifactDto>();
  for (const a of arts.recordset) {
    const dto: ArtifactDto = {
      id: a.Id,
      code: a.Code,
      floorId: a.FloorId,
      title: emptyLang(),
      description: emptyLang(),
      images: [],
      mapCoordinates: { x: a.MapX, y: a.MapY },
      audio: {},
    };
    if (a.Latitude !== null && a.Longitude !== null) dto.geoCoordinates = { latitude: a.Latitude, longitude: a.Longitude };
    if (a.TriggerRadius !== null) dto.triggerRadius = a.TriggerRadius;
    if (a.CreatedAt !== null) dto.createdAt = Number(a.CreatedAt);
    map.set(a.Id, dto);
  }
  for (const t of tr.recordset) {
    const d = map.get(t.ArtifactId);
    if (d) {
      d.title[t.Lang as Lang] = t.Title;
      d.description[t.Lang as Lang] = t.Description;
    }
  }
  for (const i of im.recordset) map.get(i.ArtifactId)?.images.push(i.Url);
  for (const x of au.recordset) {
    const d = map.get(x.ArtifactId);
    if (d) d.audio[x.Lang as Lang] = x.Url;
  }
  for (const s of su.recordset) {
    const d = map.get(s.ArtifactId);
    if (!d) continue;
    d.subtitles ??= {};
    (d.subtitles[s.Lang as Lang] ??= []).push({ start: s.StartSec, end: s.EndSec, text: s.Text });
  }
  return [...map.values()];
}

/** Ghi (insert hoặc thay thế) toàn bộ dữ liệu một hiện vật trong một transaction. */
export async function saveArtifact(a: ArtifactDto, isNew: boolean): Promise<void> {
  const pool = await getPool();
  const tx = new sql.Transaction(pool);
  await tx.begin();
  try {
    const rq = () => new sql.Request(tx);
    const params = (r: sql.Request) =>
      r
        .input('id', sql.NVarChar(50), a.id)
        .input('code', sql.NVarChar(50), a.code)
        .input('floorId', sql.Int, a.floorId)
        .input('x', sql.Float, a.mapCoordinates.x)
        .input('y', sql.Float, a.mapCoordinates.y)
        .input('lat', sql.Float, a.geoCoordinates?.latitude ?? null)
        .input('lng', sql.Float, a.geoCoordinates?.longitude ?? null)
        .input('radius', sql.Float, a.triggerRadius ?? null)
        .input('createdAt', sql.BigInt, a.createdAt ?? null);

    if (isNew) {
      await params(rq()).query(
        `INSERT INTO dbo.Artifact (Id, Code, FloorId, MapX, MapY, Latitude, Longitude, TriggerRadius, CreatedAt, SortOrder)
         VALUES (@id, @code, @floorId, @x, @y, @lat, @lng, @radius, @createdAt, 1000)`
      );
    } else {
      await params(rq()).query(
        `UPDATE dbo.Artifact SET Code=@code, FloorId=@floorId, MapX=@x, MapY=@y, Latitude=@lat, Longitude=@lng, TriggerRadius=@radius WHERE Id=@id`
      );
      for (const t of ['ArtifactTranslation', 'ArtifactImage', 'ArtifactAudio', 'SubtitleCue']) {
        await rq().input('id', sql.NVarChar(50), a.id).query(`DELETE FROM dbo.${t} WHERE ArtifactId = @id`);
      }
    }

    for (const l of LANGS) {
      await rq()
        .input('id', sql.NVarChar(50), a.id)
        .input('lang', sql.Char(2), l)
        .input('title', sql.NVarChar(500), a.title[l] ?? '')
        .input('desc', sql.NVarChar(sql.MAX), a.description[l] ?? '')
        .query('INSERT INTO dbo.ArtifactTranslation (ArtifactId, Lang, Title, Description) VALUES (@id, @lang, @title, @desc)');
      const audio = a.audio[l];
      if (audio) {
        await rq()
          .input('id', sql.NVarChar(50), a.id)
          .input('lang', sql.Char(2), l)
          .input('url', sql.NVarChar(1000), audio)
          .query('INSERT INTO dbo.ArtifactAudio (ArtifactId, Lang, Url) VALUES (@id, @lang, @url)');
      }
      const cues = a.subtitles?.[l] ?? [];
      for (let i = 0; i < cues.length; i++) {
        await rq()
          .input('id', sql.NVarChar(50), a.id)
          .input('lang', sql.Char(2), l)
          .input('o', sql.Int, i)
          .input('s', sql.Float, cues[i].start)
          .input('e', sql.Float, cues[i].end)
          .input('t', sql.NVarChar(sql.MAX), cues[i].text)
          .query('INSERT INTO dbo.SubtitleCue (ArtifactId, Lang, SortOrder, StartSec, EndSec, Text) VALUES (@id, @lang, @o, @s, @e, @t)');
      }
    }
    for (let i = 0; i < a.images.length; i++) {
      await rq()
        .input('id', sql.NVarChar(50), a.id)
        .input('o', sql.Int, i)
        .input('url', sql.NVarChar(1000), a.images[i])
        .query('INSERT INTO dbo.ArtifactImage (ArtifactId, SortOrder, Url) VALUES (@id, @o, @url)');
    }
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

export async function deleteArtifact(id: string): Promise<boolean> {
  const pool = await getPool();
  const r = await pool.request().input('id', sql.NVarChar(50), id).query('DELETE FROM dbo.Artifact WHERE Id = @id');
  return (r.rowsAffected[0] ?? 0) > 0;
}
