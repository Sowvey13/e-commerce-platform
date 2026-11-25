import { useState } from 'react';

export default function CategoriesPage({
  categories,
  categorySubmitting,
  onCreateCategory,
  onDeleteCategory,
}) {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateCategory(categoryName.trim());
    if (ok) {
      setCategoryName('');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kategori Yönetimi</h1>
          <p className="page-subtitle">
            Vitrin filtrelemesinde kullanılan kategorileri oluştur ve yönet.
          </p>
        </div>
      </div>

      <section className="card-panel">
        <h2 className="section-title">Yeni Kategori Ekle</h2>

        <form onSubmit={handleSubmit} className="form-row-inline">
          <input
            type="text"
            placeholder="Yeni kategori adı (örn: Spor & Outdoor)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{ flex: '1 1 260px' }}
          />
          <button type="submit" disabled={categorySubmitting}>
            {categorySubmitting ? 'Ekleniyor...' : 'Kategori Ekle'}
          </button>
        </form>
      </section>

      <section className="card-panel">
        <h2 className="section-title">Kategoriler ({categories.length})</h2>

        {categories.length === 0 ? (
          <p className="item-meta">Henüz kategori bulunmuyor.</p>
        ) : (
          <div className="list-stack">
            {categories.map((cat) => (
              <div key={cat.id} className="list-item">
                <span>{cat.name ?? cat.isim ?? `Kategori #${cat.id}`}</span>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDeleteCategory(cat.id)}
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}