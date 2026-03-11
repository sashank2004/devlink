import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}>DevLink</Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Shorten</Link>
          <Link to="/dashboard" style={styles.navLink}>Analytics</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#1e293b', borderBottom: '1px solid #334155' },
  brand: { fontSize: '1.25rem', fontWeight: '800', color: '#818cf8', textDecoration: 'none' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }
};