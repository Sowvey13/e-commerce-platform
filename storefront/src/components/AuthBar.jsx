import { useEffect, useState } from 'react';

export default function AuthBar({
  user,
  authLoading,
  onLogin,
  onRegister,
  onLogout,
  onUpdateProfile,
}) {
  const [mode, setMode] = useState('login'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  // Profil güncelleme state'leri
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name ?? '');
      setProfileEmail(user.email ?? '');
    } else {
      setEditingProfile(false);
    }
  }, [user]);

  if (user) {
    const handleProfileSubmit = async (e) => {
      e.preventDefault();
      try {
        setProfileSaving(true);
        await onUpdateProfile({
          name: profileName.trim(),
          email: profileEmail.trim(),
        });
        setEditingProfile(false);
      } finally {
        setProfileSaving(false);
      }
    };

    return (
      <section
        style={{
          marginBottom: '24px',
          padding: '14px 18px',
          borderRadius: '12px',
          border: '1px solid #374151',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <strong>Giriş yapıldı:</strong> {user.name} ({user.email})
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setEditingProfile((prev) => !prev)}
              style={{ width: 'auto', padding: '8px 14px' }}
            >
              {editingProfile ? 'Vazgeç' : 'Profili Düzenle'}
            </button>
            <button
              type="button"
              disabled={authLoading}
              onClick={onLogout}
              style={{ width: 'auto', padding: '8px 14px' }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {editingProfile && (
          <form
            onSubmit={handleProfileSubmit}
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '14px',
              paddingTop: '14px',
              borderTop: '1px solid #374151',
            }}
          >
            <input
              type="text"
              placeholder="Ad Soyad"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
              style={{
                flex: '1 1 180px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #4b5563',
                backgroundColor: '#1f2937',
                color: '#ffffff',
              }}
            />

            <input
              type="email"
              placeholder="E-posta"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
              style={{
                flex: '1 1 200px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #4b5563',
                backgroundColor: '#1f2937',
                color: '#ffffff',
              }}
            />

            <button
              type="submit"
              disabled={profileSaving}
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              {profileSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        )}
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await onLogin({ email: email.trim(), password });
    } else {
      await onRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation || password,
      });
    }
  };

  return (
    <section
      style={{
        marginBottom: '24px',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #374151',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <h3 style={{ margin: 0 }}>
          {mode === 'login' ? 'Hesabına Giriş Yap' : 'Yeni Hesap Oluştur'}
        </h3>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              width: 'auto',
              padding: '6px 12px',
              opacity: mode === 'login' ? 1 : 0.65,
            }}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              width: 'auto',
              padding: '6px 12px',
              opacity: mode === 'register' ? 1 : 0.65,
            }}
          >
            Kayıt Ol
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
      >
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              flex: '1 1 160px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#ffffff',
            }}
          />
        )}

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            flex: '1 1 180px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #4b5563',
            backgroundColor: '#1f2937',
            color: '#ffffff',
          }}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            flex: '1 1 150px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #4b5563',
            backgroundColor: '#1f2937',
            color: '#ffffff',
          }}
        />

        {mode === 'register' && (
          <input
            type="password"
            placeholder="Şifre Tekrar"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            style={{
              flex: '1 1 150px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#ffffff',
            }}
          />
        )}

        <button
          type="submit"
          disabled={authLoading}
          style={{ width: 'auto', padding: '8px 16px' }}
        >
          {authLoading
            ? 'İşleniyor...'
            : mode === 'login'
              ? 'Giriş Yap'
              : 'Kayıt Ol'}
        </button>
      </form>
    </section>
  );
}