import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { env, LANGS } from '../config/env.js';
import { closePool, getPool, sql } from './pool.js';
import { migrate } from './migrate.js';
import { upsertAdmin } from '../repositories/adminRepo.js';
import { saveArtifact, type ArtifactDto } from '../repositories/museumRepo.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(here, '../../../frontend/public/mock/museum_data.json');

async function seed(): Promise<void> {
  await migrate();
  const data = JSON.parse(readFileSync(dataFile, 'utf8'));
  const pool = await getPool();

  await pool
    .request()
    .input('h', sql.NVarChar(50), data.museum.hotline ?? '')
    .input('b', sql.NVarChar(500), data.museum.banner ?? '')
    .query(`IF EXISTS (SELECT 1 FROM dbo.Museum) UPDATE dbo.Museum SET Hotline=@h, Banner=@b WHERE Id=1
            ELSE INSERT INTO dbo.Museum (Id, Hotline, Banner) VALUES (1, @h, @b)`);
  for (const l of LANGS) {
    await pool
      .request()
      .input('l', sql.Char(2), l)
      .input('n', sql.NVarChar(300), data.museum.name?.[l] ?? '')
      .input('a', sql.NVarChar(500), data.museum.address?.[l] ?? '')
      .input('o', sql.NVarChar(300), data.museum.openHours?.[l] ?? '')
      .input('d', sql.NVarChar(sql.MAX), data.museum.description?.[l] ?? '')
      .query(`MERGE dbo.MuseumTranslation AS t USING (SELECT @l AS Lang) s ON t.Lang = s.Lang
        WHEN MATCHED THEN UPDATE SET Name=@n, Address=@a, OpenHours=@o, Description=@d
        WHEN NOT MATCHED THEN INSERT (Lang, Name, Address, OpenHours, Description) VALUES (@l, @n, @a, @o, @d);`);
  }

  for (const f of data.floors) {
    await pool
      .request()
      .input('id', sql.Int, f.id)
      .input('img', sql.NVarChar(500), f.mapImage ?? '')
      .input('w', sql.Float, f.bounds.width)
      .input('h', sql.Float, f.bounds.height)
      .query(`IF EXISTS (SELECT 1 FROM dbo.Floor WHERE Id=@id) UPDATE dbo.Floor SET MapImage=@img, Width=@w, Height=@h WHERE Id=@id
              ELSE INSERT INTO dbo.Floor (Id, MapImage, Width, Height) VALUES (@id, @img, @w, @h)`);
    for (const l of LANGS) {
      await pool
        .request()
        .input('id', sql.Int, f.id)
        .input('l', sql.Char(2), l)
        .input('n', sql.NVarChar(200), f.name?.[l] ?? '')
        .query(`MERGE dbo.FloorTranslation AS t USING (SELECT @id AS FloorId, @l AS Lang) s ON t.FloorId=s.FloorId AND t.Lang=s.Lang
          WHEN MATCHED THEN UPDATE SET Name=@n WHEN NOT MATCHED THEN INSERT (FloorId, Lang, Name) VALUES (@id, @l, @n);`);
    }
  }

  let order = 0;
  for (const a of data.artifacts as ArtifactDto[]) {
    const exists = (await pool.request().input('id', sql.NVarChar(50), a.id).query('SELECT 1 FROM dbo.Artifact WHERE Id=@id')).recordset.length > 0;
    await saveArtifact(a, !exists);
    await pool.request().input('id', sql.NVarChar(50), a.id).input('o', sql.Int, order++).query('UPDATE dbo.Artifact SET SortOrder=@o WHERE Id=@id');
  }

  await upsertAdmin(env.adminEmail, await bcrypt.hash(env.adminPassword, 10), 'Quản Trị Viên');
  console.log(`[seed] OK - ${data.floors.length} tầng, ${data.artifacts.length} hiện vật, admin ${env.adminEmail}`);
}

seed()
  .catch((e) => {
    console.error('[seed] FAILED:', e.message);
    process.exitCode = 1;
  })
  .finally(closePool);
