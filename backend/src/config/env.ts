import 'dotenv/config';

const num = (v: string | undefined, d: number) => (v && !Number.isNaN(Number(v)) ? Number(v) : d);
const bool = (v: string | undefined, d: boolean) => (v === undefined || v === '' ? d : v === 'true');

export const env = {
  port: num(process.env.PORT, 4000),
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map((s) => s.trim()),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@museum.vn',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'admin123',
  db: {
    server: process.env.DB_SERVER ?? 'localhost',
    instance: process.env.DB_INSTANCE || undefined,
    port: process.env.DB_INSTANCE ? undefined : num(process.env.DB_PORT, 1433),
    database: process.env.DB_NAME ?? 'MuseumGuide',
    user: process.env.DB_USER ?? 'sa',
    password: process.env.DB_PASSWORD ?? '',
    encrypt: bool(process.env.DB_ENCRYPT, false),
    trustServerCertificate: bool(process.env.DB_TRUST_CERT, true),
  },
};

export const LANGS = ['vi', 'en', 'zh', 'ko', 'ja'] as const;
export type Lang = (typeof LANGS)[number];
