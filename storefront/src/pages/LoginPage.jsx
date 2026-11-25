import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin, authLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onLogin({ email: email.trim(), password });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <div className="page-shell">
      <div className="card-panel auth-card">
        <h1 className="page-title" style={{ fontSize: '24px' }}>
          Giriş Yap
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '20px' }}>
          Hesabına giriş yaparak sepetini senkronize et.
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            type="email"
            placeholder="E-posta adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(148, 163, 184, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            fontSize: '0.88rem',
          }}
        >
          <span className="item-meta" style={{ margin: 0 }}>
            Hesabın yok mu?{' '}
            <Link
              to="/register"
              style={{
                color: '#3b82f6',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Kayıt Ol
            </Link>
          </span>

          <Link
            to="/forgot-password"
            className="item-meta"
            style={{
              margin: 0,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Şifremi unuttum
          </Link>
        </div>
      </div>
    </div>
  );
}