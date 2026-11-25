import { useState } from 'react';

export default function ProductsPage({
  products,
  categories,
  loading,
  submitting,
  onCreateProduct,
  onDeleteProduct,
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onCreateProduct({
      name: name.trim(),
      price,
      stock,
      categoryId,
    });

    if (ok) {
      setName('');
      setPrice('');
      setStock('');
      setCategoryId('');
    }
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ürün Yönetimi</h1>
          <p className="page-subtitle">
            Yeni ürün ekle, stok ve fiyat bilgilerini kontrol et, mevcut ürünleri yönet.
          </p>
        </div>
      </div>

      <section className="card-panel">
        <h2 className="section-title">Yeni Ürün Ekle</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="Ürün adı (örn: Kablosuz Mouse)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="form-row-inline">
            <input
              type="number"
              step="0.01"
              placeholder="Fiyat (TL)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ flex: '1 1 160px' }}
            />

            <input
              type="number"
              placeholder="Stok adedi"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={{ flex: '1 1 160px' }}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{ flex: '1 1 180px' }}
            >
              <option value="">Kategori seç (opsiyonel)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name ?? cat.isim ?? `Kategori #${cat.id}`}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Ekleniyor...' : 'Ürünü Kaydet'}
          </button>
        </form>
      </section>

      <section className="card-panel">
        <h2 className="section-title">Mevcut Ürünler ({products.length})</h2>

        {loading ? (
          <p style={{ margin: 0 }}>Ürünler yükleniyor...</p>
        ) : products.length === 0 ? (
          <p className="item-meta">Henüz ürün bulunmuyor.</p>
        ) : (
          <div className="list-stack">
            {products.map((product) => (
              <div key={product.id} className="list-item">
                <div>
                  <strong>{product.name ?? product.isim}</strong>
                  <div className="item-meta">
                    {product.price ?? product.fiyat} TL • Stok:{' '}
                    {product.stock ?? product.stok ?? 0} adet
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onDeleteProduct(product.id)}
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