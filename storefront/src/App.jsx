import { useEffect, useState } from 'react';
import './App.css';
import {
  addToCart,
  getCart,
  getCategories,
  getProducts,
  removeCartItem,
  updateCartItem,
} from './services/api';
import ProductCard from './components/ProductCard';
import CartSection from './components/CartSection';

function extractCartItems(cartData) {
  if (Array.isArray(cartData?.items)) return cartData.items;
  if (Array.isArray(cartData?.cart_items)) return cartData.cart_items;
  if (Array.isArray(cartData)) return cartData;
  return [];
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  async function refreshCart() {
    try {
      const cartData = await getCart();
      setCartItems(extractCartItems(cartData));
    } catch {
      
    }
  }

  useEffect(() => {
    async function loadCategoriesAndCart() {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch {
        
      }
      await refreshCart();
    }

    loadCategoriesAndCart();
  }, []);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        setLoading(true);
        setError('');
        const list = await getProducts({
          categoryId: selectedCategory,
          search: searchTerm,
        });
        setProducts(list);
      } catch (err) {
        setError(err.message || 'API bağlantı hatası oluştu.');
      } finally {
        setLoading(false);
      }
    }

    loadFilteredProducts();
  }, [selectedCategory, searchTerm]);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? item.qty ?? 1),
    0
  );

  const handleAddToCart = async (product) => {
    try {
      setCartMessage('');
      const updatedCart = await addToCart(product.id, 1);
      setCartItems(extractCartItems(updatedCart));
      setCartMessage(`${product.name ?? product.isim} sepete eklendi.`);
    } catch (err) {
      setCartMessage(err.message || 'Sepete eklenirken hata oluştu.');
    }
  };

  const handleQuantityChange = async (productId, nextQty) => {
    try {
      setCartMessage('');
      const updatedCart =
        nextQty <= 0
          ? await removeCartItem(productId)
          : await updateCartItem(productId, nextQty);
      setCartItems(extractCartItems(updatedCart));
    } catch (err) {
      setCartMessage(err.message || 'Adet güncellenemedi.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setCartMessage('');
      const updatedCart = await removeCartItem(productId);
      setCartItems(extractCartItems(updatedCart));
    } catch (err) {
      setCartMessage(err.message || 'Ürün silinemedi.');
    }
  };

  return (
    <div className="page">
      <header className="navbar">
        <h1>E-Commerce MVP Storefront</h1>
        <div className="cart-badge">Sepet: {cartCount}</div>
      </header>

      <main className="container">
        <h2>Ürünler</h2>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1 1 220px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#ffffff',
            }}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#ffffff',
            }}
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name ?? cat.isim ?? `Kategori #${cat.id}`}
              </option>
            ))}
          </select>
        </div>

        {cartMessage && (
          <p style={{ marginBottom: '12px', fontWeight: 600 }}>{cartMessage}</p>
        )}

        {loading && <p>Ürünler yükleniyor...</p>}

        {!loading && error && (
          <p style={{ color: '#dc2626', fontWeight: 600 }}>Hata: {error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>Filtreye uygun ürün bulunmuyor.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        <CartSection
          cartItems={cartItems}
          cartCount={cartCount}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
        />
      </main>
    </div>
  );
}