const API_BASE_URL = 'http://localhost/api/v1';
const ADMIN_TOKEN_KEY = 'admin_auth_token';

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function setAdminToken(token) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export async function adminLogin(credentials) {
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

  const token =
    result.data?.token ||
    result.data?.access_token ||
    result.token ||
    '';

  if (token) {
    setAdminToken(token);
  }

  return result.data;
}

export function adminLogout() {
  setAdminToken('');
}

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
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

export async function createProduct(payload) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün oluşturulamadı.');
  }

  return result.data;
}

export async function deleteProduct(productId) {
  const token = getAdminToken();
  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers,
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün silinemedi.');
  }

  return result.data;
}

export async function createCategory(payload) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kategori oluşturulamadı.');
  }

  return result.data;
}

export async function deleteCategory(categoryId) {
  const token = getAdminToken();
  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers,
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kategori silinemedi.');
  }

  return result.data;
}

export async function getUsers() {
  const token = getAdminToken();
  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers,
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kullanıcılar yüklenemedi.');
  }

  if (Array.isArray(result.data?.items)) {
    return result.data.items;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return result.data?.data || [];
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

export async function getAdminUserOrders(userId) {
  const token = getAdminToken();
  const headers = {
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/orders`, {
    headers,
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kullanıcı siparişleri yüklenemedi.');
  }

  if (Array.isArray(result.data?.orders)) {
    return result.data.orders;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return result.data?.data || [];
}