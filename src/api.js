const API_BASE = '/api';
const TOKEN_KEY = 'bioearth_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'No se pudo completar la solicitud.');
    error.details = data.errors;
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  createSolicitud: (payload) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: () => request('/admin/me'),
  dashboard: () => request('/admin/dashboard'),
  solicitudes: (params = {}) => {
    const search = new URLSearchParams();
    if (params.estado) search.set('estado', params.estado);
    if (params.search) search.set('search', params.search);
    const query = search.toString();
    return request(`/admin/solicitudes${query ? `?${query}` : ''}`);
  },
  updateSolicitud: (id, payload) =>
    request(`/admin/solicitudes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  deleteSolicitud: (id) =>
    request(`/admin/solicitudes/${id}`, {
      method: 'DELETE',
    }),
};
