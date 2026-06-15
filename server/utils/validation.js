export const ESTADOS_SOLICITUD = ['Pendiente', 'En proceso', 'Agendada', 'Finalizada', 'Cancelada'];
export const TIPOS_SOLICITUD = ['Información', 'Cita presencial', 'Reunión virtual'];
export const MODALIDADES = ['Presencial', 'Virtual', 'Por definir'];

export function sanitizeText(value, maxLength = 500) {
  return String(value ?? '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateSolicitudPayload(payload) {
  const data = {
    nombre: sanitizeText(payload.nombre, 120),
    correo: sanitizeText(payload.correo, 160).toLowerCase(),
    telefono: sanitizeText(payload.telefono, 40),
    tipo_solicitud: sanitizeText(payload.tipo_solicitud, 40),
    modalidad: sanitizeText(payload.modalidad, 40),
    mensaje: sanitizeText(payload.mensaje, 1200),
  };

  const errors = {};
  if (data.nombre.length < 2) errors.nombre = 'Ingresa un nombre válido.';
  if (!isEmail(data.correo)) errors.correo = 'Ingresa un correo válido.';
  if (data.telefono.length < 7) errors.telefono = 'Ingresa un teléfono válido.';
  if (!TIPOS_SOLICITUD.includes(data.tipo_solicitud)) errors.tipo_solicitud = 'Selecciona un tipo de solicitud válido.';
  if (!MODALIDADES.includes(data.modalidad)) errors.modalidad = 'Selecciona una modalidad válida.';
  if (data.mensaje.length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';

  return { valid: Object.keys(errors).length === 0, data, errors };
}

export function validateSolicitudUpdate(payload) {
  const data = {};
  const errors = {};

  if (payload.estado !== undefined) {
    data.estado = sanitizeText(payload.estado, 40);
    if (!ESTADOS_SOLICITUD.includes(data.estado)) errors.estado = 'Estado inválido.';
  }

  if (payload.observaciones_admin !== undefined) {
    data.observaciones_admin = sanitizeText(payload.observaciones_admin, 1200);
  }

  return { valid: Object.keys(errors).length === 0, data, errors };
}

export function validateLoginPayload(payload) {
  const data = {
    correo: sanitizeText(payload.correo, 160).toLowerCase(),
    password: String(payload.password ?? ''),
  };
  const errors = {};

  if (!isEmail(data.correo)) errors.correo = 'Ingresa un correo válido.';
  if (data.password.length < 8) errors.password = 'Ingresa tu contraseña.';

  return { valid: Object.keys(errors).length === 0, data, errors };
}
