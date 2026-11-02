import { createApp } from './app.js';
import { env } from './config/env.js';
import { closePool } from './db/pool.js';

const server = createApp().listen(env.port, () => {
  console.log(`[backend] listening on http://localhost:${env.port}`);
});

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    server.close(() => closePool().finally(() => process.exit(0)));
  });
}
