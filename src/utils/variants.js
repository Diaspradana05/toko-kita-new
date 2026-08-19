// Data dummy (dummyjson.com) tidak menyediakan varian produk sungguhan,
// jadi kita generate varian yang masuk akal berdasarkan kategori & tag
// produk, dengan cara yang konsisten (deterministik) untuk produk yang sama.

const CLOTHING_CATEGORIES = [
  "mens-shirts",
  "womens-dresses",
  "womens-shoes",
  "mens-shoes",
  "tops",
];

const COLOR_OPTIONS = ["Hitam", "Putih", "Merah", "Biru", "Abu-abu"];
const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const STORAGE_OPTIONS = ["64GB", "128GB", "256GB"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickOptions(seed, pool, count) {
  const start = seed % pool.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(start + i) % pool.length]);
  }
  return result;
}

export function getProductVariants(product) {
  if (!product) return [];

  const seed = hashString(String(product.id) + (product.category || ""));
  const groups = [];

  const isClothing = CLOTHING_CATEGORIES.includes(product.category);
  const isPhone = product.category === "smartphones" || product.category === "laptops";

  groups.push({
    name: "Warna",
    options: pickOptions(seed, COLOR_OPTIONS, 3),
  });

  if (isClothing) {
    groups.push({
      name: "Ukuran",
      options: pickOptions(seed + 1, SIZE_OPTIONS, 4),
    });
  } else if (isPhone) {
    groups.push({
      name: "Penyimpanan",
      options: pickOptions(seed + 1, STORAGE_OPTIONS, 3),
    });
  }

  return groups;
}
