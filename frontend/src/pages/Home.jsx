import { useState } from 'react';
import { shortenUrl } from '../api';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!longUrl) return setError('Please enter a URL');
    setError('');
    setLoading(true);
    try {
      const res = await shortenUrl(longUrl);
      setResult(res.data);
      setLongUrl('');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>DevLink</h1>
        <p style={styles.subtitle}>Shorten URLs. Track clicks. Instantly.</p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={e => setLongUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button style={styles.button} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {result && (
          <div style={styles.result}>
            <p style={styles.resultLabel}>Your short link:</p>
            <div style={styles.resultRow}>
              <a href={result.shortUrl} target="_blank" rel="noreferrer" style={styles.link}>
                {result.shortUrl}
              </a>
              <button style={styles.copyBtn} onClick={handleCopy}>
                {copied ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>
            <p style={styles.resultSub}>
              Code: <strong>{result.shortCode}</strong> — save this to view analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#1e293b', borderRadius: '16px', padding: '48px', maxWidth: '600px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' },
  title: { fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
  subtitle: { color: '#94a3b8', marginBottom: '36px', fontSize: '1rem' },
  inputRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
  input: { flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '14px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  error: { color: '#f87171', fontSize: '0.875rem', marginBottom: '12px' },
  result: { marginTop: '24px', padding: '20px', background: '#0f172a', borderRadius: '10px', border: '1px solid #334155' },
  resultLabel: { color: '#94a3b8', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  resultRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  link: { color: '#818cf8', fontSize: '1rem', fontWeight: '600', textDecoration: 'none' },
  copyBtn: { padding: '6px 14px', borderRadius: '6px', border: '1px solid #6366f1', background: 'transparent', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem' },
  resultSub: { color: '#64748b', fontSize: '0.8rem' }
};