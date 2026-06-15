import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { getDb, persistDb, queryOne } from './database.js';
import { runMigrations } from './migrate.js';

export async function seedAdmin() {
  await runMigrations();
  const database = await getDb();
  const existing = queryOne(database, 'SELECT id FROM admins WHERE correo = $correo', {
    $correo: config.adminSeed.correo.toLowerCase(),
  });

  if (existing) {
    console.log(`Admin already exists: ${config.adminSeed.correo}`);
    return;
  }

  const hash = await bcrypt.hash(config.adminSeed.password, 12);
  database.run(
    `
      INSERT INTO admins (nombre, correo, password, rol)
      VALUES ($nombre, $correo, $password, $rol)
    `,
    {
      $nombre: config.adminSeed.nombre,
      $correo: config.adminSeed.correo.toLowerCase(),
      $password: hash,
      $rol: config.adminSeed.rol,
    },
  );
  persistDb();
  console.log(`Admin seeded: ${config.adminSeed.correo}`);
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  seedAdmin().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
