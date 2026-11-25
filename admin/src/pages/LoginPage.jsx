import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin, authLoading }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onLogin({ email: email.trim(), password });
    if (ok) {
      navigate('/users');
    }
  };

  return (
    <div className="page-shell">
      <section
        className="card-panel"
        style={{ maxWidth: '440px', margin: '24px auto 0' }}
      >
        <h1 className="page-title" style={{ fontSize: '24px' }}>
          Admin Girişi
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '20px' }}>
          Korumalı admin işlemlerine ve kullanıcı listesine erişmek için giriş yap.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
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
            justifyContent: 'flex-end',
            fontSize: '0.88rem',
          }}
        >
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
      </section>
    </div>
  );
}