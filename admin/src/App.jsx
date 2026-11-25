import { useEffect, useState } from 'react';
import './App.css';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
} from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');

  
  const [categoryName, setCategoryName] = useState('');

  async function loadProducts() {
    try {
      setLoading(true);
      setError('');
      const list = await getProducts();
      setProducts(list);
    } catch (err) {
      setError(err.message || 'Ürünler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const list = await getCategories();
      setCategories(list);
    } catch {
      
    }
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setNotice('');
    setError('');

    if (!name.trim() || price === '' || stock === '') {
      setError('Lütfen ürün adı, fiyat ve stok alanlarını doldur.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
      };

      if (categoryId) {
        payload.category_id = Number(categoryId);
      }

      await createProduct(payload);
      setName('');
      setPrice('');
      setStock('');
      setCategoryId('');
      setNotice('Yeni ürün başarıyla eklendi.');
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Ürün eklenirken hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setNotice('');
      setError('');
      await deleteProduct(productId);
      setNotice('Ürün silindi.');
      await loadProducts();
    } catch (err) {
      setError(err.message || 'Ürün silinirken hata oluştu.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setNotice('');
    setError('');

    if (!categoryName.trim()) {
      setError('Lütfen bir kategori adı gir.');
      return;
    }

    try {
      setCategorySubmitting(true);
      await createCategory({ name: categoryName.trim() });
      setCategoryName('');
      setNotice('Yeni kategori başarıyla oluşturuldu.');
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Kategori oluşturulurken hata oluştu.');
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setNotice('');
      setError('');
      await deleteCategory(id);
      setNotice('Kategori silindi.');
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Kategori silinirken hata oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h1>E-Commerce MVP Admin Panel</h1>

      <section
        style={{
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #374151',
          marginBottom: '28px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Yeni Ürün Ekle</h2>

        <form
          onSubmit={handleCreateProduct}
          style={{ display: 'grid', gap: '12px' }}
        >
          <input
            type="text"
            placeholder="Ürün adı (örn: Kablosuz Mouse)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px' }}
          />

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="number"
              step="0.01"
              placeholder="Fiyat (TL)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ flex: '1 1 160px', padding: '10px', borderRadius: '8px' }}
            />

            <input
              type="number"
              placeholder="Stok adedi"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={{ flex: '1 1 160px', padding: '10px', borderRadius: '8px' }}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{ flex: '1 1 180px', padding: '10px', borderRadius: '8px' }}
            >
              <option value="">Kategori seç (opsiyonel)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name ?? cat.isim ?? `Kategori #${cat.id}`}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting} style={{ padding: '10px 16px' }}>
            {submitting ? 'Ekleniyor...' : 'Ürünü Kaydet'}
          </button>
        </form>
      </section>

      <section
        style={{
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #374151',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Kategoriler ({categories.length})</h2>

        <form
          onSubmit={handleCreateCategory}
          style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}
        >
          <input
            type="text"
            placeholder="Yeni kategori adı (örn: Spor & Outdoor)"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px' }}
          />
          <button
            type="submit"
            disabled={categorySubmitting}
            style={{ padding: '10px 16px' }}
          >
            {categorySubmitting ? 'Ekleniyor...' : 'Kategori Ekle'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #374151',
              }}
            >
              <span>{cat.name ?? cat.isim ?? `Kategori #${cat.id}`}</span>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id)}
                style={{ padding: '6px 12px' }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </section>

      {notice && (
        <p style={{ color: '#22c55e', fontWeight: 600 }}>{notice}</p>
      )}
      {error && (
        <p style={{ color: '#ef4444', fontWeight: 600 }}>Hata: {error}</p>
      )}

      <h2>Mevcut Ürünler ({products.length})</h2>

      {loading ? (
        <p>Ürünler yükleniyor...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #374151',
              }}
            >
              <div>
                <strong>{product.name ?? product.isim}</strong>
                <div style={{ fontSize: '14px', opacity: 0.85 }}>
                  {product.price ?? product.fiyat} TL • Stok:{' '}
                  {product.stock ?? product.stok ?? 0} adet
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteProduct(product.id)}
                style={{ padding: '8px 12px' }}
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}