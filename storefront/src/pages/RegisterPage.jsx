import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage({ onRegister, authLoading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onRegister({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: passwordConfirmation || password,
    });
    if (ok) {
      navigate('/');
    }
  };

  return (
    <div className="page-shell">
      <div className="card-panel auth-card">
        <h1 className="page-title" style={{ fontSize: '24px' }}>
          Kayıt Ol
        </h1>
        <p className="page-subtitle" style={{ marginBottom: '20px' }}>
          Yeni bir müşteri hesabı oluştur.
        </p>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <input
            type="password"
            placeholder="Şifre Tekrar"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button type="submit" disabled={authLoading}>
            {authLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="page-subtitle" style={{ marginTop: '16px' }}>
          Zaten hesabın var mı? <Link to="/login" style={{ color: '#60a5fa' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}