import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { signToken } from '../middleware/auth.js';

const app = createApp();

describe('API (không cần DB)', () => {
  it('404 cho endpoint không tồn tại', async () => {
    const res = await request(app).get('/api/khong-co');
    expect(res.status).toBe(404);
  });

  it('login thiếu dữ liệu -> 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('route admin không có token -> 401', async () => {
    const res = await request(app).get('/api/sessions/active');
    expect(res.status).toBe(401);
  });

  it('token sai -> 401', async () => {
    const res = await request(app).delete('/api/artifacts/X').set('Authorization', 'Bearer abc');
    expect(res.status).toBe(401);
  });

  it('token không phải ADMIN -> 403', async () => {
    const token = signToken({ sub: 1, email: 'a@b.c', name: 'x', role: 'USER' });
    const res = await request(app).get('/api/sessions/active').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('/auth/me với token admin hợp lệ -> 200', async () => {
    const token = signToken({ sub: 1, email: 'a@b.c', name: 'Admin', role: 'ADMIN' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Admin');
  });

  it('tạo hiện vật với body sai -> 400', async () => {
    const token = signToken({ sub: 1, email: 'a@b.c', name: 'Admin', role: 'ADMIN' });
    const res = await request(app).post('/api/artifacts').set('Authorization', `Bearer ${token}`).send({ id: 'X' });
    expect(res.status).toBe(400);
  });
});
