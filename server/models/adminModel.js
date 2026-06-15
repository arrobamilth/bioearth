import { getDb, queryOne } from '../db/database.js';

export async function findAdminByEmail(correo) {
  const database = await getDb();
  return queryOne(
    database,
    'SELECT id, nombre, correo, password, rol, created_at FROM admins WHERE correo = $correo',
    { $correo: correo.toLowerCase() },
  );
}

export async function findAdminById(id) {
  const database = await getDb();
  return queryOne(database, 'SELECT id, nombre, correo, rol, created_at FROM admins WHERE id = $id', {
    $id: Number(id),
  });
}
