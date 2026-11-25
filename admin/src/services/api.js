const API_BASE_URL = 'http://localhost/api/v1';

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
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün oluşturulamadı.');
  }

  return result.data;
}

export async function deleteProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Ürün silinemedi.');
  }

  return result.data;
}

export async function createCategory(payload) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kategori oluşturulamadı.');
  }

  return result.data;
}

export async function deleteCategory(categoryId) {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok || result.status === false) {
    throw new Error(result.message || 'Kategori silinemedi.');
  }

  return result.data;
}