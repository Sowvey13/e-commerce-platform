const API_BASE_URL = 'http://localhost/api/v1';
const CART_TOKEN_KEY = 'mvp_cart_token';
const AUTH_TOKEN_KEY = 'mvp_auth_token';

export function getSavedCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

export function saveCartToken(token) {
  if (token) {
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
}

export function clearSavedCartToken() {
  localStorage.removeItem(CART_TOKEN_KEY);
}

export function getSavedAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function buildHeaders(extraHeaders = {}) {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  const authToken = getSavedAuthToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const cartToken = getSavedCartToken();
  if (cartToken) {
    headers['X-Cart-Token'] = cartToken;
  }

  return headers;
}

export async function getProducts({ categoryId = '', search = '' } = {}) {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set('category_id', categoryId);
  }

  if (search.trim()) {
    params.set('search', search.trim());
  }

  const queryString = params.toString();
  const url = queryString
    ? `${API_BASE_URL}/products?${queryString}`
    : `${API_BASE_URL}/products`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürünler yüklenemedi.');
  }

  if (Array.isArray(result.data?.items)) {
    return result.data.items;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return result.data?.data || [];
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kategoriler yüklenemedi.');
  }

  if (Array.isArray(result.data?.items)) {
    return result.data.items;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return result.data?.data || [];
}

export async function getCart() {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: buildHeaders(),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Sepet alınamadı.');
  }

  if (result.data?.guest_token) {
    saveCartToken(result.data.guest_token);
  }

  return result.data;
}

export async function addToCart(productId, quantity = 1) {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: buildHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün sepete eklenemedi.');
  }

  if (result.data?.guest_token) {
    saveCartToken(result.data.guest_token);
  }

  return result.data;
}

export async function updateCartItem(productId, quantity) {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'PATCH',
    headers: buildHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ quantity }),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Sepet güncellenemedi.');
  }

  if (result.data?.guest_token) {
    saveCartToken(result.data.guest_token);
  }

  return result.data;
}

export async function removeCartItem(productId) {
  const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün sepetten silinemedi.');
  }

  if (result.data?.guest_token) {
    saveCartToken(result.data.guest_token);
  }

  return result.data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Giriş yapılamadı.');
  }

  if (result.data?.token) {
    saveAuthToken(result.data.token);
  }

  return result.data;
}

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kayıt olunamadı.');
  }

  if (result.data?.token) {
    saveAuthToken(result.data.token);
  }

  return result.data;
}

export async function getCurrentUser() {
  const token = getSavedAuthToken();
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    clearAuthToken();
    return null;
  }

  const data = await response.json();
  return data?.data ?? data;
}

export async function logoutUser() {
  const token = getSavedAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ağ hatası olsa bile yerel token'ı temizle
    }
  }
  clearAuthToken();
}

export async function mergeGuestCart(guestToken) {
  const token = getSavedAuthToken();
  if (!token || !guestToken) return null;

  const response = await fetch(`${API_BASE_URL}/cart/merge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'X-Cart-Token': guestToken,
    },
    body: JSON.stringify({ guest_token: guestToken }),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    return null;
  }

  clearSavedCartToken();
  return result.data;
}
export async function updateProfile(payload) {
  const token = getSavedAuthToken();
  if (!token) {
    throw new Error('Profil güncellemek için giriş yapmalısın.');
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Profil güncellenemedi.');
  }

  return result.data?.user ?? result.data;
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Şifre sıfırlama talebi gönderilemedi.');
  }

  return result;
}

export async function resetPassword(payload) {
  const response = await fetch(`${API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Şifre sıfırlanamadı.');
  }

  return result;
}

export async function getAddresses() {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    headers: buildHeaders(),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Adresler yüklenemedi.');
  }

  return Array.isArray(result.data) ? result.data : result.data?.data || [];
}

export async function createAddress(payload) {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Adres eklenemedi.');
  }

  return result.data || result;
}

export async function updateAddress(id, payload) {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Adres güncellenemedi.');
  }

  return result.data || result;
}

export async function deleteAddress(id) {
  const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Adres silinemedi.');
  }

  return result;
}

export async function getOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    headers: buildHeaders(),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Siparişler yüklenemedi.');
  }

  if (Array.isArray(result.data?.items)) {
    return result.data.items;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return result.data?.data || [];
}

export async function createOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Sipariş oluşturulamadı.');
  }

  return result.data ?? result;
}

export async function payOrder(orderId, payload = { payment_method: 'mock' }) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
    method: 'POST',
    headers: buildHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ödeme işlemi başarısız.');
  }

  return result.data ?? result;
}