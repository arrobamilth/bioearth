import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Database,
  Dna,
  Droplets,
  Facebook,
  FlaskConical,
  Globe2,
  Handshake,
  Instagram,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Satellite,
  Send,
  ShieldCheck,
  Twitter,
  Users,
  X,
} from 'lucide-react';
import { api } from './api.js';

const navItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Quiénes somos', href: '#quienes-somos' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Investigación', href: '#investigacion' },
  { label: 'Equipo', href: '#equipo' },
  { label: 'Contacto', href: '#contacto' },
];

const projects = [
  {
    title: 'Investigación y Desarrollo (I+D)',
    category: 'Investigación Aplicada',
    status: 'Servicio activo',
    description: 'Formulación y ejecución de proyectos de ciencia, tecnología e innovación. Vigilancia tecnológica, estudios de factibilidad y gestión del conocimiento para la toma de decisiones.',
    image: 'https://www.santanderopenacademy.com/content/dam/becasmicrosites/01-soa-blog/investigacion-y-desarrollo-1.jpg',
  },
  {
    title: 'Plataformas y Sistemas Digitales',
    category: 'Desarrollo Tecnológico',
    status: 'Servicio activo',
    description: 'Desarrollo de software especializado, plataformas web, dashboards analíticos y sistemas de monitoreo ambiental para organizaciones y procesos productivos.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Gestión Ambiental y Cambio Climático',
    category: 'Consultoría Especializada',
    status: 'Servicio activo',
    description: 'Estudios de impacto ambiental, evaluación de ciclo de vida (ACV), economía circular, gestión integral de residuos, auditorías ambientales y planificación territorial.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Innovación Agroindustrial',
    category: 'Agroindustria Sostenible',
    status: 'Servicio activo',
    description: 'Agricultura de precisión, sistemas de riego inteligente, biotecnología aplicada, modelos agrosostenibles y gestión tecnológica rural para aumentar productividad con bajo impacto ambiental.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Tecnologías Geoespaciales',
    category: 'Monitoreo Territorial',
    status: 'Servicio activo',
    description: 'Procesamiento de imágenes satelitales, cartografía temática, sistemas de monitoreo territorial y plataformas interactivas de visualización para la gestión de recursos naturales.',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Capacitación y Transferencia',
    category: 'Formación Especializada',
    status: 'Servicio activo',
    description: 'Diplomados, talleres técnicos, formación especializada y programas de transferencia tecnológica para instituciones, empresas y comunidades con enfoque en apropiación social del conocimiento.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=85',
  },
];

const researchAreas = [
  { title: 'Investigación Aplicada', icon: Microscope, text: 'Estudios ambientales, calidad del agua, investigación marina y costera, evaluación de impactos y gestión del conocimiento científico.' },
  { title: 'Desarrollo Tecnológico', icon: BrainCircuit, text: 'Plataformas web, sistemas de información geográfica, IA aplicada, monitoreo ambiental, trazabilidad productiva y automatización de datos.' },
  { title: 'Gestión Ambiental', icon: Leaf, text: 'Estudios de impacto ambiental, economía circular, gestión de residuos, auditorías ambientales y planificación territorial.' },
  { title: 'Innovación Agroindustrial', icon: Dna, text: 'Agricultura de precisión, biotecnología aplicada, sistemas de riego inteligente, modelos agrosostenibles y adaptación al cambio climático.' },
  { title: 'Tecnologías Geoespaciales', icon: Satellite, text: 'Procesamiento de imágenes satelitales, cartografía temática, análisis geoespacial y plataformas interactivas de visualización territorial.' },
  { title: 'Consultoría y Transferencia', icon: BarChart3, text: 'Asesoría especializada, gestión social, estudios socioeconómicos, formación, diplomados y transferencia tecnológica a entidades y comunidades.' },
];

const impactStats = [
  { label: 'Proyectos realizados', value: 48, icon: FlaskConical },
  { label: 'Investigadores', value: 32, icon: Users },
  { label: 'Publicaciones', value: 76, icon: BookOpen },
  { label: 'Aliados estratégicos', value: 21, icon: Handshake },
];


const contactDetails = {
  address: 'Calle 117 Carrera 42 189 Conjunto RE, Barranquilla, Atlántico',
  email: 'bioearthsas@gmail.com',
  phone: '+57 302 260 1495',
};

function LogoMark() {
  return <img src="/logo-sinfondo.png" alt="BioEarth" className="h-32 w-auto" />;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/94 shadow-soft backdrop-blur-xl' : 'bg-transparent'}`}>
      <nav className="section-shell flex h-20 items-center justify-between">
        <a href="#inicio" className="focus:outline-none focus:ring-2 focus:ring-bio-green focus:ring-offset-4">
          <LogoMark />
        </a>
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={`text-sm font-medium transition-colors ${scrolled ? 'text-slate-700 hover:text-bio-blue' : 'text-white/86 hover:text-white'}`}>
              {item.label}
            </a>
          ))}
        </div>
        <a href="/admin" className={`hidden rounded-md px-5 py-3 text-sm font-semibold transition-all lg:inline-flex ${scrolled ? 'bg-bio-blue text-white shadow-soft hover:bg-bio-navy' : 'bg-white text-bio-blue hover:bg-bio-mint'}`}>
          Panel admin
        </a>
        <button type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen((value) => !value)} className={`inline-flex h-11 w-11 items-center justify-center rounded-md border lg:hidden ${scrolled ? 'border-slate-200 bg-white text-bio-ink' : 'border-white/25 bg-white/10 text-white'}`}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open ? (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="section-shell grid gap-1 py-4">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-bio-cloud hover:text-bio-blue">
                {item.label}
              </a>
            ))}
            <a href="/admin" className="rounded-md px-3 py-3 text-sm font-semibold text-bio-blue hover:bg-bio-cloud">Panel admin</a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-[88vh] overflow-hidden bg-bio-navy pt-20 text-white">
      <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1900&q=90" alt="Investigación científica con tecnología aplicada" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-bio-navy via-bio-blue/82 to-bio-cyan/35" />
      <div className="section-shell relative grid min-h-[calc(88vh-5rem)] items-center py-16 sm:py-20">
        <div className="max-w-4xl animate-fadeUp">
          <div className="mb-7 inline-flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <Activity size={17} className="text-bio-mint" />
            Centro de Investigación y Desarrollo Tecnológico
          </div>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">BioEarth</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-white/86 sm:text-2xl">
            Transformamos conocimiento científico en soluciones tecnológicas para el desarrollo sostenible.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#proyectos" className="inline-flex items-center justify-center gap-2 rounded-md bg-bio-green px-6 py-4 text-sm font-bold text-bio-navy shadow-lift transition hover:-translate-y-0.5 hover:bg-bio-mint">
              Conocer proyectos <ArrowRight size={18} />
            </a>
            <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white hover:text-bio-blue">
              Contáctanos <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScienceSystemPanel() {
  const steps = [
    { title: 'Investigación', text: 'Estudios aplicados, diagnósticos científicos y análisis de contexto territorial.', icon: Microscope },
    { title: 'Tecnología', text: 'Plataformas digitales, IA aplicada y sistemas de monitoreo ambiental.', icon: BrainCircuit },
    { title: 'Consultoría', text: 'Asesoría especializada, gestión ambiental y formulación de proyectos.', icon: ShieldCheck },
    { title: 'Transferencia', text: 'Apropiación social del conocimiento, formación técnica y entrega de resultados.', icon: FlaskConical },
  ];

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-bio-navy p-7 text-white shadow-soft sm:p-8">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-bio-cyan/35" />
      <div className="absolute -bottom-14 -left-12 h-40 w-40 rounded-full bg-bio-green/28" />
      <div className="relative">
        <span className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-bio-mint">
          <Satellite size={15} /> Ecosistema BioEarth
        </span>
        <h3 className="max-w-md text-3xl font-semibold leading-tight">Del conocimiento científico a soluciones tecnológicas aplicadas.</h3>
        <p className="mt-4 max-w-lg leading-8 text-white/72">
          Articulamos investigación aplicada, tecnologías actualizadas y enfoque interdisciplinario para generar soluciones con impacto territorial medible.
        </p>
      </div>
      <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-md border border-white/12 bg-white/10 p-4 backdrop-blur-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-bio-green text-bio-navy">
                <Icon size={20} />
              </div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm leading-6 text-white/70">{step.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function About() {
  const pillars = [
    { title: 'Misión', text: 'Generar conocimiento aplicado e innovación para atender problemáticas científicas, tecnológicas, ambientales, productivas y sociales del territorio, trabajando con entidades públicas y privadas, empresas y comunidades.', icon: Microscope },
    { title: 'Visión', text: 'Para 2029, ser referente nacional en investigación aplicada y desarrollo tecnológico en gestión ambiental, agroindustria sostenible, biotecnología y desarrollo socioambiental, con presencia regional, nacional e internacional.', icon: Globe2 },
    { title: 'Valores', text: 'Rigor científico, responsabilidad social y ambiental, innovación, interdisciplinariedad y compromiso con el territorio y el talento humano como activo estratégico.', icon: ShieldCheck },
  ];

  return (
    <section id="quienes-somos" className="bg-white py-24 sm:py-28">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div>
            <span className="section-kicker"><Leaf size={16} /> Quiénes somos</span>
            <h2 className="section-title">Investigación y desarrollo tecnológico para soluciones sostenibles con impacto real.</h2>
            <p className="section-copy mt-6">
              BIOEARTH es un Centro de Investigación y Desarrollo Tecnológico especializado en la formulación, ejecución y transferencia de soluciones científicas, tecnológicas e innovadoras orientadas a la sostenibilidad ambiental, el desarrollo agroindustrial, la gestión territorial y la transformación digital.
            </p>
            <p className="section-copy mt-5">
              Desde Barranquilla, Colombia, articulamos capacidades en investigación aplicada, inteligencia artificial, análisis ambiental, tecnologías geoespaciales e innovación agropecuaria, contribuyendo al fortalecimiento de entidades públicas, privadas, académicas y comunitarias.
            </p>
          </div>
          <ScienceSystemPanel />
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-md bg-bio-mint text-bio-blue"><Icon size={24} /></div>
                <h3 className="text-xl font-semibold text-bio-ink">{pillar.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="proyectos" className="bg-section-wash py-24 sm:py-28">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker"><BarChart3 size={16} /> Portafolio de servicios</span>
            <h2 className="section-title">Soluciones científicas, tecnológicas y de consultoría para organizaciones y territorios.</h2>
          </div>
          <p className="max-w-xl leading-8 text-slate-600">Ofrecemos servicios especializados que combinan investigación aplicada, desarrollo tecnológico, consultoría y formación para entidades públicas, privadas y comunidades.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-md bg-white/92 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-bio-blue">{project.category}</span>
              </div>
              <div className="p-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-bio-green"><span className="h-2 w-2 rounded-full bg-bio-green" />{project.status}</span>
                <h3 className="mt-4 text-xl font-semibold leading-snug text-bio-ink">{project.title}</h3>
                <p className="mt-3 min-h-24 leading-7 text-slate-600">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchAreas() {
  return (
    <section id="investigacion" className="bg-white py-24 sm:py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-kicker justify-center"><FlaskConical size={16} /> Líneas estratégicas</span>
          <h2 className="section-title mx-auto">Capacidades integradas en ciencia, tecnología y gestión del territorio.</h2>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {researchAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-bio-aqua hover:shadow-lift">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-bio-blue to-bio-cyan p-3 text-white"><Icon size={26} /></div>
                <h3 className="text-xl font-semibold text-bio-ink">{area.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{area.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function useCountUp(target, enabled) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    const start = performance.now();
    const tick = (time) => {
      const progress = Math.min((time - start) / 1400, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target]);
  return value;
}

function ImpactStat({ stat, enabled }) {
  const Icon = stat.icon;
  const value = useCountUp(stat.value, enabled);
  return (
    <article className="rounded-lg border border-white/16 bg-white/10 p-6 text-white backdrop-blur-md">
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-md bg-bio-green text-bio-navy"><Icon size={24} /></div>
      <div className="text-4xl font-semibold">{value}+</div>
      <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-white/72">{stat.label}</p>
    </article>
  );
}

function Impact() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section ref={ref} className="relative overflow-hidden bg-blue-glow py-24 sm:py-28">
      <div className="section-shell relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-bio-mint"><Satellite size={16} /> Impacto</span>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">Resultados medibles para instituciones, comunidades y ecosistemas.</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">BioEarth estructura cada iniciativa con indicadores, trazabilidad de datos y reportes ejecutivos.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">{impactStats.map((stat) => <ImpactStat key={stat.label} stat={stat} enabled={visible} />)}</div>
      </div>
    </section>
  );
}

const teamSpecialties = [
  { label: 'Ciencias ambientales', icon: Leaf },
  { label: 'Ingeniería', icon: Activity },
  { label: 'Ciencias agropecuarias', icon: Dna },
  { label: 'Tecnologías de información', icon: Database },
  { label: 'Gestión social', icon: Users },
  { label: 'Economía y finanzas', icon: BarChart3 },
  { label: 'Analítica de datos', icon: BrainCircuit },
  { label: 'Innovación y desarrollo tecnológico', icon: FlaskConical },
];

function Team() {
  return (
    <section id="equipo" className="bg-white py-24 sm:py-28">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-kicker"><Users size={16} /> Equipo</span>
            <h2 className="section-title">Un equipo multidisciplinario para proyectos de alta exigencia.</h2>
          </div>
          <p className="max-w-xl leading-8 text-slate-600">Investigadores, profesionales, tecnólogos y consultores con experiencia en la articulación de ciencia aplicada y tecnologías actualizadas para el desarrollo sostenible.</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-5">
            <p className="leading-8 text-slate-600">
              BIOEARTH cuenta con un equipo multidisciplinario conformado por investigadores, profesionales, tecnólogos y consultores especializados, con experiencia en la articulación de ciencia aplicada, tecnologías actualizadas y metodologías rigurosas orientadas al desarrollo sostenible y la innovación territorial.
            </p>
            <p className="leading-8 text-slate-600">
              Trabajamos de forma interdisciplinaria, combinando conocimiento científico con herramientas digitales y analítica de datos para diseñar soluciones adaptadas a las necesidades de instituciones públicas, empresas, universidades y comunidades. Nuestro equipo ha participado en proyectos financiados por entidades nacionales de ciencia, tecnología e innovación.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-bio-cloud p-7">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-bio-blue">Áreas de especialización</p>
            <div className="grid gap-3">
              {teamSpecialties.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-soft">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bio-mint text-bio-blue">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-semibold text-bio-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const initialContact = {
  nombre: '',
  correo: '',
  telefono: '',
  tipo_solicitud: 'Información',
  mensaje: '',
};

function derivarModalidad(tipo) {
  if (tipo === 'Cita presencial') return 'Presencial';
  if (tipo === 'Reunión virtual') return 'Virtual';
  return 'Por definir';
}

function Contact() {
  const [form, setForm] = useState(initialContact);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await api.createSolicitud({ ...form, modalidad: derivarModalidad(form.tipo_solicitud) });
      setStatus({ type: 'success', message: response.message });
      setForm(initialContact);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="bg-bio-cloud py-24 sm:py-28">
      <div className="section-shell">
        <div className="mb-12 max-w-3xl">
          <span className="section-kicker"><Droplets size={16} /> Ubicación y contacto</span>
          <h2 className="section-title">Conversemos sobre investigación, alianzas y nuevos proyectos.</h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
            <iframe title="Ubicación BioEarth" src="https://www.google.com/maps?q=Calle%20117%20Carrera%2042%20189%20Barranquilla%20Atlantico%20Colombia&output=embed" className="h-80 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="space-y-4 p-6">
              {[
                { icon: MapPin, label: contactDetails.address },
                { icon: Mail, label: contactDetails.email },
                { icon: Phone, label: contactDetails.phone },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex gap-4 text-slate-700">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bio-mint text-bio-blue"><Icon size={20} /></div>
                    <p className="leading-7">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <form onSubmit={submitForm} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Nombre" name="nombre" value={form.nombre} onChange={updateField} placeholder="Tu nombre" required />
              <Input label="Correo" name="correo" type="email" value={form.correo} onChange={updateField} placeholder="nombre@empresa.com" required />
              <Input label="Teléfono" name="telefono" value={form.telefono} onChange={updateField} placeholder="+57 300 000 0000" required />
              <Select label="Tipo de solicitud" name="tipo_solicitud" value={form.tipo_solicitud} onChange={updateField} options={['Información', 'Cita presencial', 'Reunión virtual']} />
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-bio-ink">
              Mensaje
              <textarea name="mensaje" value={form.mensaje} onChange={updateField} rows="6" required minLength={10} placeholder="Cuéntanos qué necesitas o qué reunión deseas agendar" className="resize-none rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700 outline-none transition focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25" />
            </label>
            {status.message ? (
              <p className={`mt-5 rounded-md px-4 py-3 text-sm font-semibold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {status.message}
              </p>
            ) : null}
            <button disabled={submitting} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-bio-blue px-6 py-4 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-bio-navy disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
              {submitting ? 'Enviando...' : 'Enviar solicitud'} <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-bio-ink">
      {label}
      <input {...props} className="rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700 outline-none transition focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25" />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-bio-ink">
      {label}
      <select {...props} className="rounded-md border border-slate-200 px-4 py-3 font-normal text-slate-700 outline-none transition focus:border-bio-blue focus:ring-4 focus:ring-bio-aqua/25">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Footer() {
  return (
    <footer className="bg-bio-navy py-14 text-white">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <LogoMark />
            <p className="mt-5 max-w-md leading-8 text-white/70">Centro de Investigación y Desarrollo Tecnológico especializado en investigación aplicada, desarrollo tecnológico, consultoría ambiental, innovación agroindustrial y gestión territorial.</p>
            <div className="mt-6 flex gap-3">{[Linkedin, Twitter, Instagram, Facebook].map((Icon, index) => <a key={index} href="#inicio" aria-label="Red social BioEarth" className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white/75 transition hover:border-bio-green hover:bg-bio-green hover:text-bio-navy"><Icon size={18} /></a>)}</div>
          </div>
          <div>
            <h3 className="font-semibold">Navegación rápida</h3>
            <div className="mt-5 grid gap-3">{navItems.slice(1).map((item) => <a key={item.href} href={item.href} className="text-white/68 transition hover:text-bio-green">{item.label}</a>)}</div>
          </div>
          <div>
            <h3 className="font-semibold">Información institucional</h3>
            <div className="mt-5 grid gap-3 text-white/68">
              <p>Centro de Investigación y Desarrollo Tecnológico BIOEARTH S.A.S.</p>
              <p>NIT 901.851.875-7</p>
              <p>{contactDetails.email}</p>
              <p>Barranquilla, Atlántico</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/12 pt-6 text-sm text-white/58">© 2026 BioEarth. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}

export default function Site() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <ResearchAreas />
        <Impact />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
