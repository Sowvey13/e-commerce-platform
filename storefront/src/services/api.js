const API_BASE_URL = 'http://localhost/api/v1';
const CART_TOKEN_KEY = 'mvp_cart_token';

function getSavedCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

function saveCartToken(token) {
  if (token) {
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
}

function buildHeaders(extraHeaders = {}) {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  const token = getSavedCartToken();
  if (token) {
    headers['X-Cart-Token'] = token;
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