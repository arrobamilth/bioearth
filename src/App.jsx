import Admin from './Admin.jsx';
import Site from './Site.jsx';

function isAdminRoute() {
  return window.location.pathname.replace(/\/+$/, '').endsWith('/admin');
}

export default function App() {
  return isAdminRoute() ? <Admin /> : <Site />;
}
