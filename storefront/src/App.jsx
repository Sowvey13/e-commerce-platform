import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function extractCartItems(cartData) {
  if (Array.isArray(cartData?.items)) return cartData.items;
  if (Array.isArray(cartData?.cart_items)) return cartData.cart_items;
  if (Array.isArray(cartData)) return cartData;
  return [];
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('mvp_theme') || 'dark';
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mvp_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  async function refreshCart() {
    try {
      const cartData = await getCart();
      setCartItems(extractCartItems(cartData));
    } catch {
      // İlk açılışta boş sepet veya token yoksa sessiz geç
    }
  }

  useEffect(() => {
    async function loadInitialMeta() {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch {
        // Kategori listesi gelmezse boş bırak
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
      setNotice('');
      const guestToken = getSavedCartToken();
      const authData = await loginUser(credentials);
      setUser(authData.user || null);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await refreshCart();
      setNotice('Giriş yapıldı.');
      return true;
    } catch (err) {
      setNotice(err.message || 'Giriş yapılamadı.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    try {
      setAuthLoading(true);
      setNotice('');
      const guestToken = getSavedCartToken();
      const authData = await registerUser(payload);
      setUser(authData.user || null);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await refreshCart();
      setNotice('Kayıt başarılı, giriş yapıldı.');
      return true;
    } catch (err) {
      setNotice(err.message || 'Kayıt olunamadı.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await logoutUser();
      setUser(null);
      await refreshCart();
      setNotice('Çıkış yapıldı.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (payload) => {
    try {
      setNotice('');
      const cleanPayload = {};
      if (payload.name && payload.name !== user?.name) {
        cleanPayload.name = payload.name;
      }
      if (payload.email && payload.email !== user?.email) {
        cleanPayload.email = payload.email;
      }

      if (Object.keys(cleanPayload).length === 0) {
        setNotice('Değişiklik yapılmadı.');
        return;
      }

      const updatedUser = await updateProfile(cleanPayload);
      if (updatedUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      }
      setNotice('Profil bilgileri güncellendi.');
    } catch (err) {
      setNotice(err.message || 'Profil güncellenemedi.');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setNotice('');
      const updatedCart = await addToCart(product.id, 1);
      setCartItems(extractCartItems(updatedCart));
      setNotice(`${product.name ?? product.isim} sepete eklendi.`);
    } catch (err) {
      setNotice(err.message || 'Sepete eklenirken hata oluştu.');
    }
  };

  const handleQuantityChange = async (productId, nextQty) => {
    try {
      setNotice('');
      const updatedCart =
        nextQty <= 0
          ? await removeCartItem(productId)
          : await updateCartItem(productId, nextQty);
      setCartItems(extractCartItems(updatedCart));
    } catch (err) {
      setNotice(err.message || 'Adet güncellenemedi.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setNotice('');
      const updatedCart = await removeCartItem(productId);
      setCartItems(extractCartItems(updatedCart));
    } catch (err) {
      setNotice(err.message || 'Ürün silinemedi.');
    }
  };

  const handleClearCart = async () => {
    try {
      setNotice('');
      for (const item of cartItems) {
        const productId = item.product_id ?? item.product?.id ?? item.id;
        await removeCartItem(productId);
      }
      await refreshCart();
      setNotice('Sepet temizlendi.');
    } catch (err) {
      setNotice(err.message || 'Sepet temizlenirken hata oluştu.');
    }
  };

  return (
    <BrowserRouter>
      <NavBar
        cartCount={cartCount}
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {notice && (
        <div className="page-shell" style={{ paddingTop: '16px', paddingBottom: 0 }}>
          <div className="notice-banner">{notice}</div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              loading={loading}
              error={error}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              cartCount={cartCount}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} authLoading={authLoading} />}
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              onRegister={handleRegister}
              authLoading={authLoading}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={user}
              authLoading={authLoading}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}