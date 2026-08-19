const API_URL = "https://dummyjson.com/products";

export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data produk");
  }

  const data = await response.json();

  return data.products;
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Produk tidak ditemukan");
  }

  return response.json();
}

export async function searchProducts(query) {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Gagal mencari produk");
  }

  const data = await response.json();

  return data.products;
}

export async function getProductsByCategory(category) {
  const response = await fetch(`${API_URL}/category/${category}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil produk kategori ini");
  }

  const data = await response.json();

  return data.products;
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Gagal mengambil daftar kategori");
  }

  return response.json();
}

export async function getDummyCart(cartId = 1) {
  const response = await fetch(`https://dummyjson.com/carts/${cartId}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data cart");
  }

  return response.json();
}
