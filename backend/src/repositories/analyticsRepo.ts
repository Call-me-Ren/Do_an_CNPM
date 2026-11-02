import { getPool, sql } from '../db/pool.js';

export interface SessionDto {
  sessionId: string;
  deviceType: string;
  browser: string;
  lang: string;
  currentArtifactId: string | null;
  currentArtifactTitle: string | null;
  lastActive: number;
  startedAt: number;
}

export const SESSION_TIMEOUT_MS = 35_000;

export async function upsertSession(s: Omit<SessionDto, 'lastActive'>): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('id', sql.NVarChar(100), s.sessionId)
    .input('device', sql.NVarChar(20), s.deviceType)
    .input('browser', sql.NVarChar(50), s.browser)
    .input('lang', sql.NVarChar(10), s.lang)
    .input('artId', sql.NVarChar(50), s.currentArtifactId)
    .input('artTitle', sql.NVarChar(500), s.currentArtifactTitle)
    .input('started', sql.BigInt, s.startedAt)
    .input('now', sql.BigInt, Date.now())
    .query(`MERGE dbo.VisitorSession AS t USING (SELECT @id AS SessionId) AS src ON t.SessionId = src.SessionId
      WHEN MATCHED THEN UPDATE SET DeviceType=@device, Browser=@browser, Lang=@lang,
        CurrentArtifactId = COALESCE(@artId, t.CurrentArtifactId),
        CurrentArtifactTitle = COALESCE(@artTitle, t.CurrentArtifactTitle), LastActive=@now
      WHEN NOT MATCHED THEN INSERT (SessionId, DeviceType, Browser, Lang, CurrentArtifactId, CurrentArtifactTitle, StartedAt, LastActive)
        VALUES (@id, @device, @browser, @lang, @artId, @artTitle, @started, @now);`);
}

export async function removeSession(id: string): Promise<void> {
  const pool = await getPool();
  await pool.request().input('id', sql.NVarChar(100), id).query('DELETE FROM dbo.VisitorSession WHERE SessionId = @id');
}

export async function getActiveSessions(): Promise<SessionDto[]> {
  const pool = await getPool();
  const cutoff = Date.now() - SESSION_TIMEOUT_MS;
  await pool.request().input('c', sql.BigInt, cutoff).query('DELETE FROM dbo.VisitorSession WHERE LastActive < @c');
  const r = await pool.request().query('SELECT * FROM dbo.VisitorSession ORDER BY StartedAt DESC');
  return r.recordset.map((x) => ({
    sessionId: x.SessionId,
    deviceType: x.DeviceType,
    browser: x.Browser,
    lang: x.Lang,
    currentArtifactId: x.CurrentArtifactId,
    currentArtifactTitle: x.CurrentArtifactTitle,
    lastActive: Number(x.LastActive),
    startedAt: Number(x.StartedAt),
  }));
}

export interface ListenEventDto {
  id: string;
  sessionId: string;
  artifactId: string;
  artifactCode: string;
  artifactTitle: string;
  lang: string;
  timestamp: number;
}

export async function addListenEvent(e: ListenEventDto): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('id', sql.NVarChar(100), e.id)
    .input('sid', sql.NVarChar(100), e.sessionId)
    .input('aid', sql.NVarChar(50), e.artifactId)
    .input('code', sql.NVarChar(50), e.artifactCode)
    .input('title', sql.NVarChar(500), e.artifactTitle)
    .input('lang', sql.NVarChar(10), e.lang)
    .input('ts', sql.BigInt, e.timestamp)
    .query(`IF NOT EXISTS (SELECT 1 FROM dbo.ListenEvent WHERE Id = @id)
      INSERT INTO dbo.ListenEvent (Id, SessionId, ArtifactId, ArtifactCode, ArtifactTitle, Lang, Timestamp)
      VALUES (@id, @sid, @aid, @code, @title, @lang, @ts)`);
}

export async function getListenEvents(limit = 2000): Promise<ListenEventDto[]> {
  const pool = await getPool();
  const r = await pool.request().input('n', sql.Int, limit).query('SELECT TOP (@n) * FROM dbo.ListenEvent ORDER BY Timestamp DESC');
  return r.recordset
    .map((x) => ({
      id: x.Id,
      sessionId: x.SessionId,
      artifactId: x.ArtifactId,
      artifactCode: x.ArtifactCode,
      artifactTitle: x.ArtifactTitle,
      lang: x.Lang,
      timestamp: Number(x.Timestamp),
    }))
    .reverse();
}

export async function clearListenEvents(): Promise<void> {
  const pool = await getPool();
  await pool.request().query('DELETE FROM dbo.ListenEvent');
}
