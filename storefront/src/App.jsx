import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  addToCart,
  createAddress,
  createOrder,
  deleteAddress,
  getAddresses,
  getCart,
  getCategories,
  getCurrentUser,
  getOrders,
  getProducts,
  getSavedCartToken,
  loginUser,
  logoutUser,
  mergeGuestCart,
  payOrder,
  registerUser,
  removeCartItem,
  updateAddress,
  updateCartItem,
  updateProfile,
} from './services/api';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AddressesPage from './pages/AddressesPage';
import OrdersPage from './pages/OrdersPage';

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
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState(null);
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

  async function refreshAddresses(activeUser = user) {
    if (!activeUser) {
      setAddresses([]);
      return;
    }

    try {
      setAddressesLoading(true);
      const list = await getAddresses();
      setAddresses(list);
    } catch {
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  }

  async function refreshOrders(activeUser = user) {
    if (!activeUser) {
      setOrders([]);
      return;
    }

    try {
      setOrdersLoading(true);
      const list = await getOrders();
      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
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
        await Promise.all([
          refreshAddresses(currentUser),
          refreshOrders(currentUser),
        ]);
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
      const loggedUser = authData.user || null;
      setUser(loggedUser);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await Promise.all([
        refreshCart(),
        refreshAddresses(loggedUser),
        refreshOrders(loggedUser),
      ]);
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
      const registeredUser = authData.user || null;
      setUser(registeredUser);

      if (guestToken) {
        await mergeGuestCart(guestToken);
      }

      await Promise.all([
        refreshCart(),
        refreshAddresses(registeredUser),
        refreshOrders(registeredUser),
      ]);
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
      setAddresses([]);
      setOrders([]);
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

  const handleCreateAddress = async (payload) => {
    try {
      setNotice('');
      await createAddress(payload);
      await refreshAddresses();
      setNotice('Yeni adres eklendi.');
      return true;
    } catch (err) {
      setNotice(err.message || 'Adres eklenemedi.');
      return false;
    }
  };

  const handleUpdateAddress = async (id, payload) => {
    try {
      setNotice('');
      await updateAddress(id, payload);
      await refreshAddresses();
      setNotice('Adres güncellendi.');
      return true;
    } catch (err) {
      setNotice(err.message || 'Adres güncellenemedi.');
      return false;
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      setNotice('');
      await deleteAddress(id);
      await refreshAddresses();
      setNotice('Adres silindi.');
    } catch (err) {
      setNotice(err.message || 'Adres silinemedi.');
    }
  };

  const handleCheckout = async (payload) => {
    try {
      setCheckoutLoading(true);
      setNotice('');
      await createOrder(payload);
      await Promise.all([refreshCart(), refreshOrders()]);
      setNotice(
        'Sipariş oluşturuldu! Siparişlerim ekranından fake ödeme yapabilirsin.'
      );
      return true;
    } catch (err) {
      setNotice(err.message || 'Sipariş oluşturulamadı.');
      return false;
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      setPayingOrderId(orderId);
      setNotice('');
      await payOrder(orderId, { payment_method: 'mock' });
      await refreshOrders();
      setNotice(`#${orderId} numaralı sipariş ödendi (paid).`);
    } catch (err) {
      setNotice(err.message || 'Fake ödeme tamamlanamadı.');
    } finally {
      setPayingOrderId(null);
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
              user={user}
              addresses={addresses}
              checkoutLoading={checkoutLoading}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
            />
          }
        />
        <Route
          path="/addresses"
          element={
            <AddressesPage
              token={Boolean(user)}
              addresses={addresses}
              addressesLoading={addressesLoading}
              onCreateAddress={handleCreateAddress}
              onUpdateAddress={handleUpdateAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <OrdersPage
              user={user}
              orders={orders}
              ordersLoading={ordersLoading}
              payingOrderId={payingOrderId}
              onPayOrder={handlePayOrder}
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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