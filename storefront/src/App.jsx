import { useEffect, useState } from 'react';
import './App.css';
import {
  addToCart,
  getCart,
  getCategories,
  getCurrentUser,
  getProducts,
  getSavedCartToken,
  loginUser,
  logoutUser,
  mergeGuestCart,
  registerUser,
  removeCartItem,
  updateCartItem,
  updateProfile,
} from './services/api';
import ProductCard from './components/ProductCard';
import CartSection from './components/CartSection';
import AuthBar from './components/AuthBar';

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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
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
    async function loadInitialMeta() {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch {
        
      }

      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }

      await refreshCart();
    }

    loadInitialMeta();
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

  const handleLogin = async (credentials) => {
    try {
      setAuthLoading(true);
      setCartMessage('');
      const guestToken = getSavedCartToken();
      const authData = await loginUser(credentials);
      setUser(authData.user || null);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await refreshCart();
      setCartMessage('Giriş yapıldı.');
    } catch (err) {
      setCartMessage(err.message || 'Giriş yapılamadı.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    try {
      setAuthLoading(true);
      setCartMessage('');
      const guestToken = getSavedCartToken();
      const authData = await registerUser(payload);
      setUser(authData.user || null);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await refreshCart();
      setCartMessage('Kayıt başarılı, giriş yapıldı.');
    } catch (err) {
      setCartMessage(err.message || 'Kayıt olunamadı.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (payload) => {
    try {
      setCartMessage('');
      const cleanPayload = {};

      if (payload.name && payload.name !== user?.name) {
        cleanPayload.name = payload.name;
      }

      if (payload.email && payload.email !== user?.email) {
        cleanPayload.email = payload.email;
      }

      if (Object.keys(cleanPayload).length === 0) {
        setCartMessage('Değişiklik yapılmadı.');
        return;
      }

      const updatedUser = await updateProfile(cleanPayload);
      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      }
      setCartMessage('Profil bilgileri güncellendi.');
    } catch (err) {
      setCartMessage(err.message || 'Profil güncellenemedi.');
    }
  };

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await logoutUser();
      setUser(null);
      await refreshCart();
      setCartMessage('Çıkış yapıldı.');
    } finally {
      setAuthLoading(false);
    }
  };

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

  const handleClearCart = async () => {
    try {
      setCartMessage('');
      for (const item of cartItems) {
        const productId = item.product_id ?? item.product?.id ?? item.id;
        await removeCartItem(productId);
      }
      await refreshCart();
      setCartMessage('Sepet temizlendi.');
    } catch (err) {
      setCartMessage(err.message || 'Sepet temizlenirken hata oluştu.');
    }
  };

  return (
    <div className="page">
      <header className="navbar">
        <h1>E-Commerce MVP Storefront</h1>
        <div className="cart-badge">Sepet: {cartCount}</div>
      </header>

      <main className="container">
       <AuthBar
          user={user}
          authLoading={authLoading}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />

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
          onClearCart={handleClearCart}
        />
      </main>
    </div>
  );
}