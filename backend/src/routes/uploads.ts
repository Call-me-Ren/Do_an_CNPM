import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { HttpError, requireAdmin } from '../middleware/auth.js';

export const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');

function makeUploader(sub: 'audio' | 'images', mimePrefix: string, maxMb: number) {
  const dir = path.join(UPLOAD_ROOT, sub);
  mkdirSync(dir, { recursive: true });
  return multer({
    storage: multer.diskStorage({
      destination: dir,
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
        cb(null, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`);
      },
    }),
    limits: { fileSize: maxMb * 1024 * 1024 },
    fileFilter: (_req, file, cb) =>
      file.mimetype.startsWith(mimePrefix) ? cb(null, true) : cb(new HttpError(400, `Chỉ chấp nhận file ${mimePrefix}*`)),
  });
}

const audio = makeUploader('audio', 'audio/', 30);
const images = makeUploader('images', 'image/', 10);

export const uploadRouter = Router();

uploadRouter.post('/uploads/audio', requireAdmin, audio.single('file'), (req, res) => {
  if (!req.file) throw new HttpError(400, 'Thiếu file');
  res.status(201).json({ url: `/uploads/audio/${req.file.filename}` });
});

uploadRouter.post('/uploads/image', requireAdmin, images.single('file'), (req, res) => {
  if (!req.file) throw new HttpError(400, 'Thiếu file');
  res.status(201).json({ url: `/uploads/images/${req.file.filename}` });
});
