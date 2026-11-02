import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/auth.js';
import { getPool } from './db/pool.js';
import { authRouter } from './routes/auth.js';
import { museumRouter } from './routes/museum.js';
import { analyticsRouter } from './routes/analytics.js';
import { uploadRouter, UPLOAD_ROOT } from './routes/uploads.js';

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(UPLOAD_ROOT));

  app.get('/api/health', async (_req, res) => {
    try {
      await (await getPool()).request().query('SELECT 1 AS ok');
      res.json({ status: 'ok', db: 'connected' });
    } catch (e) {
      res.status(503).json({ status: 'degraded', db: 'unreachable', error: (e as Error).message });
    }
  });

  app.use('/api/auth', rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }), authRouter);
  app.use('/api', museumRouter);
  app.use('/api', analyticsRouter);
  app.use('/api', uploadRouter);
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Không tìm thấy endpoint' });
  });
  app.use(errorHandler);
  return app;
}
