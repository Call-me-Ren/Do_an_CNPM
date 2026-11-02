import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, HttpError, requireAdmin, validate } from '../middleware/auth.js';
import * as repo from '../repositories/museumRepo.js';

const lang = z.object({ vi: z.string(), en: z.string(), zh: z.string(), ko: z.string(), ja: z.string() });
const cue = z.object({ start: z.number(), end: z.number(), text: z.string() });
const langKey = z.enum(['vi', 'en', 'zh', 'ko', 'ja']);

export const artifactSchema = z.object({
  id: z.string().min(1).max(50),
  code: z.string().min(1).max(50),
  floorId: z.number().int(),
  title: lang,
  description: lang,
  images: z.array(z.string().max(1000)).default([]),
  mapCoordinates: z.object({ x: z.number(), y: z.number() }),
  geoCoordinates: z.object({ latitude: z.number(), longitude: z.number() }).optional(),
  triggerRadius: z.number().positive().optional(),
  audio: z.record(langKey, z.string().max(1000)).default({}),
  subtitles: z.record(langKey, z.array(cue)).optional(),
  createdAt: z.number().optional(),
});

const floorSchema = z.object({
  mapImage: z.string().max(500).optional(),
  bounds: z.object({ width: z.number().positive(), height: z.number().positive() }).optional(),
});

export const museumRouter = Router();

museumRouter.get(
  '/museum',
  asyncHandler(async (_req, res) => {
    const [museum, floors, artifacts] = await Promise.all([repo.getMuseumInfo(), repo.getFloors(), repo.getArtifacts()]);
    res.json({ museum, floors, artifacts });
  })
);

museumRouter.get(
  '/artifacts/:id',
  asyncHandler(async (req, res) => {
    const [a] = await repo.getArtifacts(req.params.id);
    if (!a) throw new HttpError(404, 'Không tìm thấy hiện vật');
    res.json(a);
  })
);

museumRouter.post(
  '/artifacts',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const a = validate(artifactSchema, req.body) as repo.ArtifactDto;
    if ((await repo.getArtifacts(a.id)).length) throw new HttpError(409, 'Mã hiện vật đã tồn tại');
    a.createdAt ??= Date.now();
    await repo.saveArtifact(a, true);
    res.status(201).json((await repo.getArtifacts(a.id))[0]);
  })
);

museumRouter.put(
  '/artifacts/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const a = validate(artifactSchema, { ...req.body, id: req.params.id }) as repo.ArtifactDto;
    if (!(await repo.getArtifacts(a.id)).length) throw new HttpError(404, 'Không tìm thấy hiện vật');
    await repo.saveArtifact(a, false);
    res.json((await repo.getArtifacts(a.id))[0]);
  })
);

museumRouter.delete(
  '/artifacts/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!(await repo.deleteArtifact(req.params.id))) throw new HttpError(404, 'Không tìm thấy hiện vật');
    res.status(204).end();
  })
);

museumRouter.put(
  '/floors/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Id tầng không hợp lệ');
    const body = validate(floorSchema, req.body);
    if (!(await repo.updateFloor(id, body.mapImage, body.bounds))) throw new HttpError(404, 'Không tìm thấy tầng');
    res.json((await repo.getFloors()).find((f) => f.id === id));
  })
);
