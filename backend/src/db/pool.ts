import sql from 'mssql';
import { env } from '../config/env.js';

function buildConfig(database: string): sql.config {
  return {
    server: env.db.server,
    port: env.db.port,
    database,
    user: env.db.user,
    password: env.db.password,
    options: {
      instanceName: env.db.instance,
      encrypt: env.db.encrypt,
      trustServerCertificate: env.db.trustServerCertificate,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  };
}

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  pool = await new sql.ConnectionPool(buildConfig(env.db.database)).connect();
  return pool;
}

/** Kết nối vào database `master` (dùng để tạo database khi migrate). */
export async function getMasterPool(): Promise<sql.ConnectionPool> {
  return new sql.ConnectionPool(buildConfig('master')).connect();
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

export { sql };
