import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Girişi</h1>
          <p className="page-subtitle">
            Korumalı admin işlemlerine ve kullanıcı listesine erişmek için giriş yap.
          </p>
        </div>
      </div>

      <section className="card-panel" style={{ maxWidth: '440px', margin: '0 auto' }}>
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
      </section>
    </div>
  );
}