import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { seedAdmin } from './db/seed.js';
import { adminRouter } from './routes/adminRoutes.js';
import { publicRouter } from './routes/publicRoutes.js';

const app = express();
const distDir = path.join(config.rootDir, 'dist');

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'bioearth-admin-api' });
});

app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Ocurrió un error interno.' });
});

await seedAdmin();

app.listen(config.port, () => {
  console.log(`BioEarth API running on http://localhost:${config.port}`);
  console.log(`Admin seed account: ${config.adminSeed.correo}`);
});
