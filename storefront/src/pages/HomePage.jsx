import ProductCard from '../components/ProductCard';

export default function HomePage({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  loading,
  error,
  onAddToCart,
}) {
  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ürün Vitrini</h1>
          <p className="page-subtitle">
            Kategorilere göre filtrele, arama yap ve sepetine ekle.
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name ?? cat.isim ?? `Kategori #${cat.id}`}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Ürünler yükleniyor...</p>}

      {!loading && error && <p className="error-text">Hata: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="card-panel">
          <p style={{ margin: 0 }}>Filtreye uygun ürün bulunmuyor.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}