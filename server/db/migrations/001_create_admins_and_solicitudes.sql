CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_solicitud TEXT NOT NULL,
  modalidad TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  observaciones_admin TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by_admin_id INTEGER,
  FOREIGN KEY (updated_by_admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  CHECK (tipo_solicitud IN ('Información', 'Cita presencial', 'Reunión virtual')),
  CHECK (modalidad IN ('Presencial', 'Virtual', 'Por definir')),
  CHECK (estado IN ('Pendiente', 'En proceso', 'Agendada', 'Finalizada', 'Cancelada'))
);

CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_created_at ON solicitudes(created_at);
