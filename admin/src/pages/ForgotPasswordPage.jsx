import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestInfo, setRequestInfo] = useState('');
  const [requestError, setRequestError] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState('');
  const [resetError, setResetError] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setRequestInfo('');
    setRequestError('');

    try {
      setRequestLoading(true);
      const res = await forgotPassword(email.trim());
      setResetEmail(email.trim());
      setRequestInfo(
        res?.message || 'Şifre sıfırlama bilgisi gönderildi.'
      );
    } catch (err) {
      setRequestError(err.message || 'İşlem başarısız.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetInfo('');
    setResetError('');

    try {
      setResetLoading(true);
      const res = await resetPassword({
        email: (resetEmail || email).trim(),
        token: token.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      setResetInfo(
        res?.message || 'Şifren başarıyla güncellendi. Admin girişi yapabilirsin.'
      );
      setToken('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      setResetError(err.message || 'Şifre sıfırlanamadı.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Şifremi Unuttum</h1>
          <p className="page-subtitle">
            Şifre sıfırlama talebi oluştur veya sıfırlama token'ı ile yeni şifre belirle.
          </p>
        </div>
        <Link to="/login" className="nav-link active">
          Admin Girişine Dön
        </Link>
      </div>

      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <section className="card-panel">
          <h2 className="section-title">1. Sıfırlama Talebi Gönder</h2>
          <form onSubmit={handleRequestCode} className="form-grid">
            <input
              type="email"
              placeholder="Admin e-posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={requestLoading}>
              {requestLoading ? 'Gönderiliyor...' : 'Sıfırlama Kodu / Bağlantısı İste'}
            </button>
          </form>

          {requestInfo && (
            <div className="notice-banner" style={{ marginTop: '14px', marginBottom: 0 }}>
              {requestInfo}
            </div>
          )}
          {requestError && (
            <div className="error-banner" style={{ marginTop: '14px', marginBottom: 0 }}>
              {requestError}
            </div>
          )}
        </section>

        <section className="card-panel">
          <h2 className="section-title">2. Yeni Şifre Belirle</h2>
          <form onSubmit={handleResetSubmit} className="form-grid">
            <input
              type="email"
              placeholder="E-posta adresi"
              value={resetEmail || email}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Sıfırlama token / kodu"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Yeni şifre (tekrar)"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <button type="submit" disabled={resetLoading}>
              {resetLoading ? 'Güncelleniyor...' : 'Şifreyi Sıfırla'}
            </button>
          </form>

          {resetInfo && (
            <div className="notice-banner" style={{ marginTop: '14px', marginBottom: 0 }}>
              {resetInfo}{' '}
              <Link to="/login" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                Giriş Yap
              </Link>
            </div>
          )}
          {resetError && (
            <div className="error-banner" style={{ marginTop: '14px', marginBottom: 0 }}>
              {resetError}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}