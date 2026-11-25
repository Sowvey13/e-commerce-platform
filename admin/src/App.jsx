import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';
import {
  adminLogin,
  adminLogout,
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAdminToken,
  getCategories,
  getProducts,
  getUsers,
} from './services/api';
import AdminNavBar from './components/AdminNavBar';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminAppContent() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin_mvp_theme') || 'dark';
  });
  const [token, setToken] = useState(() => getAdminToken());
  const [authLoading, setAuthLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin_mvp_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      // Kategori listesi alınamazsa mevcut hali koru
    }
  }

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const list = await getUsers();
      setUsers(list);
      setError('');
    } catch (err) {
      setUsers([]);
      setError(err.message || 'Kullanıcılar yüklenemedi.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (token) {
      loadUsers();
    } else {
      setUsers([]);
      setUsersLoading(false);
    }
  }, [token, loadUsers]);

  const handleLogin = async (credentials) => {
    try {
      setAuthLoading(true);
      setError('');
      setNotice('');
      const authData = await adminLogin(credentials);
      const nextToken =
        authData?.token ||
        authData?.access_token ||
        getAdminToken();

      if (authData?.user?.role && authData.user.role !== 'admin') {
        adminLogout();
        setToken('');
        setError('Bu hesap admin yetkisine sahip değil.');
        return false;
      }

      setToken(nextToken);
      setNotice('Admin girişi başarılı.');
      return true;
    } catch (err) {
      setError(err.message || 'Giriş yapılamadı.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setToken('');
    setUsers([]);
    setNotice('Çıkış yapıldı.');
    navigate('/login', { replace: true });
  };

  const handleCreateProduct = async ({ name, price, stock, categoryId }) => {
    setNotice('');
    setError('');

    if (!name || price === '' || stock === '') {
      setError('Lütfen ürün adı, fiyat ve stok alanlarını doldur.');
      return false;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        price: Number(price),
        stock: Number(stock),
      };

      if (categoryId) {
        payload.category_id = Number(categoryId);
      }

      await createProduct(payload);
      setNotice('Yeni ürün başarıyla eklendi.');
      await loadProducts();
      return true;
    } catch (err) {
      setError(err.message || 'Ürün eklenirken hata oluştu.');
      return false;
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

  const handleCreateCategory = async (name) => {
    setNotice('');
    setError('');

    if (!name) {
      setError('Lütfen bir kategori adı gir.');
      return false;
    }

    try {
      setCategorySubmitting(true);
      await createCategory({ name });
      setNotice('Yeni kategori başarıyla oluşturuldu.');
      await loadCategories();
      return true;
    } catch (err) {
      setError(err.message || 'Kategori oluşturulurken hata oluştu.');
      return false;
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

  const isAuthenticated = Boolean(token);

  return (
    <>
      <AdminNavBar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {(notice || error) && (
        <div
          className="page-shell"
          style={{ paddingTop: '16px', paddingBottom: 0 }}
        >
          {notice && <div className="notice-banner">{notice}</div>}
          {error && <div className="error-banner">Hata: {error}</div>}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage
                products={products}
                categories={categories}
                loading={loading}
                submitting={submitting}
                onCreateProduct={handleCreateProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CategoriesPage
                categories={categories}
                categorySubmitting={categorySubmitting}
                onCreateCategory={handleCreateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UsersPage users={users} usersLoading={usersLoading} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/users" replace />
            ) : (
              <LoginPage onLogin={handleLogin} authLoading={authLoading} />
            )
          }
        />
        <Route
  path="/forgot-password"
  element={
    isAuthenticated ? (
      <Navigate to="/users" replace />
    ) : (
      <ForgotPasswordPage />
    )
  }
/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAppContent />
    </BrowserRouter>
  );
}