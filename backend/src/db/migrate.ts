import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { env } from '../config/env.js';
import { getMasterPool, getPool, closePool } from './pool.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export async function migrate(): Promise<void> {
  const name = env.db.database.replace(/]/g, ']]');
  const master = await getMasterPool();
  await master.request().query(`IF DB_ID(N'${env.db.database.replace(/'/g, "''")}') IS NULL CREATE DATABASE [${name}]`);
  await master.close();

  const pool = await getPool();
  const script = readFileSync(path.join(here, 'schema.sql'), 'utf8');
  const batches = script.split(/^\s*GO\s*$/gim).map((b) => b.trim()).filter(Boolean);
  for (const batch of batches) {
    await pool.request().batch(batch);
  }
  console.log(`[migrate] OK - ${batches.length} batch(es) on database ${env.db.database}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  migrate()
    .catch((e) => {
      console.error('[migrate] FAILED:', e.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
