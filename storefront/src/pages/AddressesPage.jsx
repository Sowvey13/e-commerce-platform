import { useState } from 'react';
import { Link } from 'react-router-dom';

const EMPTY_FORM = {
  title: '',
  city: '',
  district: '',
  address_line: '',
  postal_code: '',
};

export default function AddressesPage({
  token,
  addresses,
  addressesLoading,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!token) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Adreslerim</h1>
            <p className="page-subtitle">
              Teslimat adreslerini yönetmek için önce giriş yapmalısın.
            </p>
          </div>
          <Link to="/login" className="nav-link active">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (addr) => {
    setLocalError('');
    setEditingId(addr.id);
    setForm({
      title: addr.title || '',
      city: addr.city || '',
      district: addr.district || '',
      address_line: addr.address_line || addr.address || '',
      postal_code: addr.postal_code || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!form.title.trim() || !form.city.trim() || !form.address_line.trim()) {
      setLocalError('Adres başlığı, şehir ve açık adres alanları zorunludur.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      address_line: form.address_line.trim(),
      postal_code: form.postal_code.trim(),
    };

    try {
      setSubmitting(true);
      const ok = editingId
        ? await onUpdateAddress(editingId, payload)
        : await onCreateAddress(payload);

      if (ok) {
        setEditingId(null);
        setForm(EMPTY_FORM);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Adres Yönetimi</h1>
          <p className="page-subtitle">
            Teslimat adreslerini ekle, düzenle veya sil.
          </p>
        </div>
        <Link to="/cart" className="nav-link active">
          Sepete Dön
        </Link>
      </div>

      <section className="card-panel" style={{ marginBottom: '20px' }}>
        <h2 className="section-title">
          {editingId ? 'Adresi Güncelle' : 'Yeni Adres Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="form-stack">
          <input
            type="text"
            placeholder="Adres başlığı (örn. Ev, İş)"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <input
              type="text"
              placeholder="Şehir (örn. İstanbul)"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="İlçe (örn. Bakırköy)"
              value={form.district}
              onChange={(e) => handleChange('district', e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Açık adres (mahalle, sokak, bina/daire no)"
            value={form.address_line}
            onChange={(e) => handleChange('address_line', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Posta kodu (opsiyonel)"
            value={form.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
          />

          {localError && <p className="error-text">{localError}</p>}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="submit" disabled={submitting}>
              {submitting
                ? 'Kaydediliyor...'
                : editingId
                  ? 'Değişiklikleri Kaydet'
                  : 'Adres Ekle'}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancelEdit}
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card-panel">
        <h2 className="section-title">Kayıtlı Adresler ({addresses.length})</h2>

        {addressesLoading ? (
          <p className="empty-state">Adresler yükleniyor...</p>
        ) : addresses.length === 0 ? (
          <p className="empty-state">Henüz kayıtlı bir adresin yok.</p>
        ) : (
          <div className="address-list">
            {addresses.map((addr) => (
              <div key={addr.id} className="address-item-card">
                <div className="address-item-body">
                  <div className="address-item-header">
                    <span className="address-badge">{addr.title || 'Adres'}</span>
                    <span className="address-location">
                      {addr.city}
                      {addr.district ? ` / ${addr.district}` : ''}
                    </span>
                  </div>

                  <p className="address-line-text">
                    {addr.address_line || addr.address}
                  </p>

                  {addr.postal_code && (
                    <span className="address-postal">
                      Posta Kodu: {addr.postal_code}
                    </span>
                  )}
                </div>

                <div className="address-item-actions">
                  <button
                    type="button"
                    className="secondary-btn address-action-btn"
                    onClick={() => handleEditClick(addr)}
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    className="danger-btn address-action-btn"
                    onClick={() => onDeleteAddress(addr.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}