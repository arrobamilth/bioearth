import { getDb, persistDb, queryAll, queryOne, runStatement } from '../db/database.js';

const publicFields = `
  id,
  nombre,
  correo,
  telefono,
  tipo_solicitud,
  modalidad,
  mensaje,
  estado,
  COALESCE(observaciones_admin, '') AS observaciones_admin,
  created_at
`;

export async function createSolicitud(data) {
  const database = await getDb();
  database.run(
    `
      INSERT INTO solicitudes (
        nombre,
        correo,
        telefono,
        tipo_solicitud,
        modalidad,
        mensaje,
        estado
      )
      VALUES (
        $nombre,
        $correo,
        $telefono,
        $tipo_solicitud,
        $modalidad,
        $mensaje,
        'Pendiente'
      )
    `,
    {
      $nombre: data.nombre,
      $correo: data.correo,
      $telefono: data.telefono,
      $tipo_solicitud: data.tipo_solicitud,
      $modalidad: data.modalidad,
      $mensaje: data.mensaje,
    },
  );
  persistDb();
  return queryOne(database, `SELECT ${publicFields} FROM solicitudes ORDER BY id DESC LIMIT 1`);
}

export async function listSolicitudes(filters = {}) {
  const database = await getDb();
  const params = {};
  const where = [];

  if (filters.estado) {
    where.push('estado = $estado');
    params.$estado = filters.estado;
  }

  if (filters.search) {
    where.push('(LOWER(nombre) LIKE $search OR LOWER(correo) LIKE $search)');
    params.$search = `%${filters.search.toLowerCase()}%`;
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return queryAll(
    database,
    `
      SELECT ${publicFields}
      FROM solicitudes
      ${whereSql}
      ORDER BY datetime(created_at) DESC, id DESC
    `,
    params,
  );
}

export async function getSolicitudById(id) {
  const database = await getDb();
  return queryOne(database, `SELECT ${publicFields} FROM solicitudes WHERE id = $id`, { $id: Number(id) });
}

export async function updateSolicitud(id, data, adminId) {
  const current = await getSolicitudById(id);
  if (!current) return null;

  const next = {
    estado: data.estado ?? current.estado,
    observaciones_admin: data.observaciones_admin ?? current.observaciones_admin,
  };

  const database = await getDb();
  runStatement(
    database,
    `
      UPDATE solicitudes
      SET estado = $estado,
          observaciones_admin = $observaciones_admin,
          updated_by_admin_id = $adminId
      WHERE id = $id
    `,
    {
      $estado: next.estado,
      $observaciones_admin: next.observaciones_admin,
      $adminId: adminId,
      $id: Number(id),
    },
  );

  return getSolicitudById(id);
}

export async function deleteSolicitud(id) {
  const existing = await getSolicitudById(id);
  if (!existing) return false;

  const database = await getDb();
  runStatement(database, 'DELETE FROM solicitudes WHERE id = $id', { $id: Number(id) });
  return true;
}

export async function getSolicitudStats() {
  const database = await getDb();
  const rows = queryAll(database, 'SELECT estado, COUNT(*) AS total FROM solicitudes GROUP BY estado');
  const stats = {
    total: 0,
    pendientes: 0,
    agendadas: 0,
    finalizadas: 0,
  };

  for (const row of rows) {
    stats.total += Number(row.total);
    if (row.estado === 'Pendiente') stats.pendientes = Number(row.total);
    if (row.estado === 'Agendada') stats.agendadas = Number(row.total);
    if (row.estado === 'Finalizada') stats.finalizadas = Number(row.total);
  }

  return stats;
}
