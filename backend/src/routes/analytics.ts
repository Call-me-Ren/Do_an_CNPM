import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, requireAdmin, validate } from '../middleware/auth.js';
import * as repo from '../repositories/analyticsRepo.js';

const heartbeatSchema = z.object({
  sessionId: z.string().min(1).max(100),
  deviceType: z.enum(['Mobile', 'Desktop', 'Tablet']).default('Desktop'),
  browser: z.string().max(50).default('Web Browser'),
  lang: z.string().max(10).default('vi'),
  currentArtifactId: z.string().max(50).nullable().default(null),
  currentArtifactTitle: z.string().max(500).nullable().default(null),
  startedAt: z.number().default(() => Date.now()),
});

const listenSchema = z.object({
  id: z.string().min(1).max(100),
  sessionId: z.string().min(1).max(100),
  artifactId: z.string().min(1).max(50),
  artifactCode: z.string().max(50).default(''),
  artifactTitle: z.string().max(500).default(''),
  lang: z.string().max(10).default('vi'),
  timestamp: z.number().default(() => Date.now()),
});

export const analyticsRouter = Router();

analyticsRouter.post(
  '/sessions/heartbeat',
  asyncHandler(async (req, res) => {
    await repo.upsertSession(validate(heartbeatSchema, req.body));
    res.status(204).end();
  })
);

analyticsRouter.post(
  '/sessions/leave',
  asyncHandler(async (req, res) => {
    const { sessionId } = validate(z.object({ sessionId: z.string().min(1).max(100) }), req.body);
    await repo.removeSession(sessionId);
    res.status(204).end();
  })
);

analyticsRouter.get(
  '/sessions/active',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await repo.getActiveSessions());
  })
);

analyticsRouter.post(
  '/analytics/listen',
  asyncHandler(async (req, res) => {
    await repo.addListenEvent(validate(listenSchema, req.body));
    res.status(201).end();
  })
);

analyticsRouter.get(
  '/analytics/events',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    res.json(await repo.getListenEvents());
  })
);

analyticsRouter.delete(
  '/analytics/events',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    await repo.clearListenEvents();
    res.status(204).end();
  })
);

analyticsRouter.get(
  '/analytics/summary',
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const events = await repo.getListenEvents();
    const byArtifact: Record<string, { title: string; count: number }> = {};
    const byLang: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    for (const e of events) {
      (byArtifact[e.artifactId] ??= { title: e.artifactTitle, count: 0 }).count++;
      byLang[e.lang] = (byLang[e.lang] ?? 0) + 1;
      const day = new Date(e.timestamp).toISOString().slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
    }
    res.json({ total: events.length, byArtifact, byLang, byDay });
  })
);
