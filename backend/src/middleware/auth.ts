import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError, type ZodType, type ZodTypeDef } from 'zod';
import { env } from '../config/env.js';

export interface AuthPayload {
  sub: number;
  email: string;
  name: string;
  role: string;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function signToken(p: AuthPayload): string {
  return jwt.sign(p, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return next(new HttpError(401, 'Thiếu token xác thực'));
  try {
    const payload = jwt.verify(token, env.jwtSecret) as unknown as AuthPayload;
    if (payload.role !== 'ADMIN') return next(new HttpError(403, 'Không đủ quyền'));
    (req as Request & { user?: AuthPayload }).user = payload;
    next();
  } catch {
    next(new HttpError(401, 'Token không hợp lệ hoặc đã hết hạn'));
  }
}

export function validate<T>(schema: ZodType<T, ZodTypeDef, unknown>, data: unknown): T {
  return schema.parse(data);
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof ZodError) {
    res.status(400).json({ error: 'Dữ liệu không hợp lệ', details: err.issues });
  } else {
    console.error('[error]', err);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
}
