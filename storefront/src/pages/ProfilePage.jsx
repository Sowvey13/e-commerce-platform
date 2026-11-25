import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfilePage({
  user,
  authLoading,
  onLogout,
  onUpdateProfile,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page-shell">
        <div className="card-panel auth-card">
          <h1 className="page-title" style={{ fontSize: '22px' }}>
            Profil Sayfası
          </h1>
          <p className="page-subtitle" style={{ margin: '10px 0 18px' }}>
            Profil bilgilerini görüntülemek için giriş yapmalısın.
          </p>
          <Link to="/login">
            <button type="button">Giriş Yap</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdateProfile({
        name: name.trim(),
        email: email.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div className="page-shell">
      <div className="card-panel auth-card">
        <div className="page-header" style={{ marginBottom: '18px' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px' }}>
              Profilim
            </h1>
            <p className="page-subtitle">
              {user.name} • {user.email}
            </p>
          </div>

          <button
            type="button"
            className="btn-danger"
            disabled={authLoading}
            onClick={handleLogoutClick}
          >
            Çıkış Yap
          </button>
        </div>

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
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
}