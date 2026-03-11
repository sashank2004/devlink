import { useState } from 'react';
import { getStats } from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!code) return setError('Enter a short code');
    setError('');
    setLoading(true);
    try {
      const res = await getStats(code);
      setStats(res.data);
    } catch {
      setError('Code not found.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats ? buildChartData(stats.clicks) : [];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Analytics Dashboard</h2>
        <p style={styles.subtitle}>Enter your short code to see click data</p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="e.g. aB3kR9x"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFetch()}
          />
          <button style={styles.button} onClick={handleFetch} disabled={loading}>
            {loading ? 'Loading...' : 'View Stats'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {stats && (
          <>
            <div style={styles.statBox}>
              <p style={styles.statLabel}>Total Clicks</p>
              <p style={styles.statNumber}>{stats.totalClicks}</p>
            </div>

            {chartData.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <p style={styles.chartLabel}>Clicks over time</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function buildChartData(clicks) {
  const counts = {};
  clicks.forEach(click => {
    const date = new Date(click.timestamp).toLocaleDateString();
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, clicks]) => ({ date, clicks }));
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#1e293b', borderRadius: '16px', padding: '48px', maxWidth: '680px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' },
  title: { fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
  subtitle: { color: '#94a3b8', marginBottom: '32px' },
  inputRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '14px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: '700', cursor: 'pointer' },
  error: { color: '#f87171', fontSize: '0.875rem' },
  statBox: { marginTop: '24px', padding: '24px', background: '#0f172a', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' },
  statLabel: { color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' },
  statNumber: { fontSize: '3rem', fontWeight: '800', color: '#818cf8' },
  chartLabel: { color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }
};