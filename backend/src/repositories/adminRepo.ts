import { getPool, sql } from '../db/pool.js';

export interface AdminRow {
  Id: number;
  Email: string;
  PasswordHash: string;
  DisplayName: string;
  Role: string;
  FailedAttempts: number;
  LockedUntil: Date | null;
}

export async function findAdminByEmail(email: string): Promise<AdminRow | undefined> {
  const pool = await getPool();
  const r = await pool.request().input('e', sql.NVarChar(200), email).query('SELECT * FROM dbo.AdminUser WHERE Email = @e');
  return r.recordset[0];
}

export async function recordLoginFailure(id: number, maxAttempts: number, lockMs: number): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('id', sql.Int, id)
    .input('max', sql.Int, maxAttempts)
    .input('until', sql.DateTime2, new Date(Date.now() + lockMs))
    .query(`UPDATE dbo.AdminUser SET FailedAttempts = FailedAttempts + 1,
      LockedUntil = CASE WHEN FailedAttempts + 1 >= @max THEN @until ELSE LockedUntil END,
      FailedAttempts = CASE WHEN FailedAttempts + 1 >= @max THEN 0 ELSE FailedAttempts + 1 END
      WHERE Id = @id`);
}

export async function resetLoginFailures(id: number): Promise<void> {
  const pool = await getPool();
  await pool.request().input('id', sql.Int, id).query('UPDATE dbo.AdminUser SET FailedAttempts = 0, LockedUntil = NULL WHERE Id = @id');
}

export async function upsertAdmin(email: string, hash: string, displayName: string): Promise<void> {
  const pool = await getPool();
  await pool
    .request()
    .input('e', sql.NVarChar(200), email)
    .input('h', sql.NVarChar(200), hash)
    .input('n', sql.NVarChar(200), displayName)
    .query(`IF EXISTS (SELECT 1 FROM dbo.AdminUser WHERE Email = @e) UPDATE dbo.AdminUser SET PasswordHash=@h, DisplayName=@n WHERE Email=@e
      ELSE INSERT INTO dbo.AdminUser (Email, PasswordHash, DisplayName, Role) VALUES (@e, @h, @n, 'ADMIN')`);
}
