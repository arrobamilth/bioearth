import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Eye,
  Loader2,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import { api, clearToken, getToken, setToken } from './api.js';

const estados = ['Pendiente', 'En proceso', 'Agendada', 'Finalizada', 'Cancelada'];

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(`${value}Z`));
}

const SESSION_TIMEOUT_MS = 60 * 1000;
const SESSION_WARN_MS = 15 * 1000;

function useSessionTimeout(onTimeout) {
  const [warning, setWarning] = useState(false);
  const logoutTimer = useRef(null);
  const warnTimer = useRef(null);

  const reset = useCallback(() => {
    setWarning(false);
    clearTimeout(logoutTimer.current);
    clearTimeout(warnTimer.current);
    warnTimer.current = setTimeout(() => setWarning(true), SESSION_TIMEOUT_MS - SESSION_WARN_MS);
    logoutTimer.current = setTimeout(onTimeout, SESSION_TIMEOUT_MS);
  }, [onTimeout]);

  useEffect(() => {
    reset();
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(logoutTimer.current);
      clearTimeout(warnTimer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [reset]);

  return { warning, reset };
}

function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.login(form);
      setToken(response.token);
      onLogin(response.admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-bio-cloud px-5 py-10">
      <section className="m-auto grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lift lg:grid-cols-[0.85fr_1fr]">
        <div className="bg-blue-glow p-10 text-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-bio-green text-bio-navy">
            <ShieldCheck size={28} />
          </div>
          <h1 className="mt-8 text-4xl font-semibold leading-tight">Panel administrativo BioEarth</h1>
          <p className="mt-5 leading-8 text-white/76">
            Gestiona solicitudes de información, citas presenciales y reuniones virtuales recibidas desde el sitio web.
          </p>
        </div>
        <form onSubmit={submit} className="p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-bio-blue">Acceso seguro</p>
          <h2 className="mt-3 text-3xl font-semibold text-bio-ink">Inicia sesión</h2>
          <label className="mt-8 grid gap-2 text-sm font-semibold text-bio-ink">
            Correo
            <input
              type="email"
              value={form.correo}
              onChange={(event) => setForm((current) => ({ ...current, correo: event.target.value }))}
              className="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25"
              required
            />
          </label>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-bio-ink">
            Contraseña
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25"
              required
            />
          </label>
          {error ? <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <button
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bio-blue px-6 py-4 font-bold text-white transition hover:bg-bio-navy disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            Entrar al panel
          </button>
        </form>
      </section>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold text-bio-ink">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-bio-mint text-bio-blue">
          <Icon size={24} />
        </div>
      </div>
    </article>
  );
}

function SolicitudModal({ solicitud, onClose, onSave, onDelete, saving }) {
  const [estado, setEstado] = useState(solicitud.estado);
  const [observaciones, setObservaciones] = useState(solicitud.observaciones_admin || '');

  return (
    <div className="fixed inset-0 z-50 grid bg-bio-navy/60 p-4 backdrop-blur-sm">
      <section className="m-auto max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-bio-blue">Solicitud #{solicitud.id}</p>
            <h3 className="mt-1 text-2xl font-semibold text-bio-ink">{solicitud.nombre}</h3>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-bio-ink">
            <X size={20} />
          </button>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <Info label="Correo" value={solicitud.correo} />
          <Info label="Teléfono" value={solicitud.telefono} />
          <Info label="Tipo" value={solicitud.tipo_solicitud} />
          <Info label="Modalidad" value={solicitud.modalidad} />
          <Info label="Fecha" value={formatDate(solicitud.created_at)} />
          <label className="grid gap-2 text-sm font-semibold text-bio-ink">
            Estado
            <select value={estado} onChange={(event) => setEstado(event.target.value)} className="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25">
              {estados.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="lg:col-span-2">
            <Info label="Mensaje" value={solicitud.mensaje} />
          </div>
          <label className="grid gap-2 text-sm font-semibold text-bio-ink lg:col-span-2">
            Observaciones administrativas
            <textarea value={observaciones} onChange={(event) => setObservaciones(event.target.value)} rows="5" className="resize-none rounded-md border border-slate-200 px-4 py-3 font-normal outline-none focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25" />
          </label>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-between">
          <button onClick={() => onDelete(solicitud.id)} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50">
            <Trash2 size={18} /> Eliminar
          </button>
          <button disabled={saving} onClick={() => onSave(solicitud.id, { estado, observaciones_admin: observaciones })} className="inline-flex items-center justify-center gap-2 rounded-md bg-bio-blue px-5 py-3 font-bold text-white hover:bg-bio-navy disabled:opacity-70">
            {saving ? <Loader2 className="animate-spin" size={18} /> : null}
            Guardar cambios
          </button>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">{label}</p>
      <p className="mt-2 leading-7 text-bio-ink">{value || 'Sin información'}</p>
    </div>
  );
}

function AdminPanel({ admin, onLogout }) {
  const { warning, reset: resetTimeout } = useSessionTimeout(onLogout);
  const [stats, setStats] = useState({ total: 0, pendientes: 0, agendadas: 0, finalizadas: 0 });
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [estado, setEstado] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredLabel = useMemo(() => (estado ? `Filtrando: ${estado}` : 'Todas las solicitudes'), [estado]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, solicitudesData] = await Promise.all([
        api.dashboard(),
        api.solicitudes({ estado, search }),
      ]);
      setStats(dashboardData.stats);
      setSolicitudes(solicitudesData.solicitudes);
    } catch (err) {
      if (err.status === 401) {
        clearToken();
        onLogout();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [estado]);

  const submitSearch = (event) => {
    event.preventDefault();
    loadData();
  };

  const saveSolicitud = async (id, payload) => {
    setSaving(true);
    try {
      const response = await api.updateSolicitud(id, payload);
      setSelected(response.solicitud);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSolicitud = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    setSaving(true);
    try {
      await api.deleteSolicitud(id);
      setSelected(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bio-cloud text-bio-ink">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-bio-navy p-6 text-white transition lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-bio-mint">BioEarth</p>
            <h1 className="mt-1 text-2xl font-semibold">Admin</h1>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <nav className="mt-10 grid gap-3">
          <a className="rounded-md bg-white/10 px-4 py-3 font-semibold" href="#dashboard">Dashboard</a>
          <a className="rounded-md px-4 py-3 font-semibold text-white/70 hover:bg-white/10" href="#solicitudes">Solicitudes</a>
        </nav>
        <button onClick={onLogout} className="absolute bottom-6 left-6 right-6 inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 font-bold text-bio-blue">
          <LogOut size={18} /> Cerrar sesión
        </button>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-md bg-bio-blue text-white lg:hidden"><Menu /></button>
            <div>
              <p className="text-sm text-slate-500">Bienvenido</p>
              <h2 className="font-semibold">{admin?.nombre}</h2>
            </div>
            <a href="/" className="hidden rounded-md border border-slate-200 px-4 py-2 font-semibold text-bio-blue sm:inline-flex">Sitio público</a>
          </div>
        </header>

        <section id="dashboard" className="p-5 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-bio-blue">Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold">Resumen de solicitudes</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total" value={stats.total} icon={ClipboardList} />
            <StatCard label="Pendientes" value={stats.pendientes} icon={MessageSquareText} />
            <StatCard label="Agendadas" value={stats.agendadas} icon={CalendarCheck} />
            <StatCard label="Finalizadas" value={stats.finalizadas} icon={CheckCircle2} />
          </div>

          <section id="solicitudes" className="mt-10 rounded-lg border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm font-semibold text-bio-blue">{filteredLabel}</p>
                  <h3 className="mt-1 text-2xl font-semibold">Gestión de solicitudes</h3>
                </div>
                <form onSubmit={submitSearch} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <label className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nombre o correo" className="w-full rounded-md border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25" />
                  </label>
                  <select value={estado} onChange={(event) => setEstado(event.target.value)} className="rounded-md border border-slate-200 px-4 py-3 outline-none focus:border-bio-blue">
                    <option value="">Todos</option>
                    {estados.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <button className="rounded-md bg-bio-blue px-5 py-3 font-bold text-white">Buscar</button>
                </form>
              </div>
              {error ? <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-slate-50 text-sm uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Nombre</th>
                    <th className="px-5 py-4">Correo</th>
                    <th className="px-5 py-4">Modalidad</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Fecha</th>
                    <th className="px-5 py-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td className="px-5 py-8 text-center text-slate-500" colSpan="6"><Loader2 className="mx-auto mb-2 animate-spin" />Cargando solicitudes...</td></tr>
                  ) : solicitudes.length ? (
                    solicitudes.map((solicitud) => (
                      <tr key={solicitud.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold">{solicitud.nombre}</td>
                        <td className="px-5 py-4 text-slate-600">{solicitud.correo}</td>
                        <td className="px-5 py-4">{solicitud.modalidad}</td>
                        <td className="px-5 py-4"><span className="rounded-full bg-bio-mint px-3 py-1 text-sm font-bold text-bio-blue">{solicitud.estado}</span></td>
                        <td className="px-5 py-4 text-slate-600">{formatDate(solicitud.created_at)}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => setSelected(solicitud)} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 font-semibold text-bio-blue hover:bg-bio-cloud">
                            <Eye size={17} /> Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td className="px-5 py-8 text-center text-slate-500" colSpan="6">No hay solicitudes para mostrar.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>

      {selected ? (
        <SolicitudModal
          solicitud={selected}
          onClose={() => setSelected(null)}
          onSave={saveSolicitud}
          onDelete={removeSolicitud}
          saving={saving}
        />
      ) : null}

      {warning ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-4 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-lift">
          <div>
            <p className="font-semibold text-yellow-800">Sesión por expirar</p>
            <p className="mt-0.5 text-sm text-yellow-700">Tu sesión cerrará en 15 segundos por inactividad.</p>
          </div>
          <button onClick={resetTimeout} className="shrink-0 rounded-md bg-bio-blue px-4 py-2 text-sm font-bold text-white hover:bg-bio-navy">
            Continuar
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api.me()
      .then((response) => setAdmin(response.admin))
      .catch(() => clearToken())
      .finally(() => setChecking(false));
  }, []);

  const logout = () => {
    clearToken();
    setAdmin(null);
  };

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-bio-cloud text-bio-blue">
        <Loader2 className="animate-spin" size={34} />
      </main>
    );
  }

  if (!admin) return <AdminLogin onLogin={setAdmin} />;
  return <AdminPanel admin={admin} onLogout={logout} />;
}
