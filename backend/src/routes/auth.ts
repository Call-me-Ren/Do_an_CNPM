import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { asyncHandler, HttpError, requireAdmin, signToken, validate, type AuthPayload } from '../middleware/auth.js';
import { findAdminByEmail, recordLoginFailure, resetLoginFailures } from '../repositories/adminRepo.js';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;

const loginSchema = z.object({ email: z.string().min(1).max(200), password: z.string().min(1).max(200) });

export const authRouter = Router();

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = validate(loginSchema, req.body);
    const admin = await findAdminByEmail(email.trim());
    if (admin?.LockedUntil && new Date(admin.LockedUntil).getTime() > Date.now()) {
      const sec = Math.ceil((new Date(admin.LockedUntil).getTime() - Date.now()) / 1000);
      throw new HttpError(429, `Tài khoản bị khoá tạm thời, thử lại sau ${sec}s`);
    }
    const ok = admin ? await bcrypt.compare(password, admin.PasswordHash) : false;
    if (!admin || !ok) {
      if (admin) await recordLoginFailure(admin.Id, MAX_ATTEMPTS, LOCK_MS);
      throw new HttpError(401, 'Email hoặc mật khẩu không đúng');
    }
    await resetLoginFailures(admin.Id);
    const payload: AuthPayload = { sub: admin.Id, email: admin.Email, name: admin.DisplayName, role: admin.Role };
    res.json({ token: signToken(payload), username: admin.DisplayName, role: admin.Role });
  })
);

authRouter.get('/me', requireAdmin, (req, res) => {
  const u = (req as typeof req & { user?: AuthPayload }).user!;
  res.json({ email: u.email, username: u.name, role: u.role });
});
