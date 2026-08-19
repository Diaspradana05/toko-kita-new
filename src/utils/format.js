export function formatCategory(slug) {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Original (pre-discount) price, derived from dummyjson's discountPercentage.
export function getOriginalPrice(product) {
  if (!product?.discountPercentage) return null;

  return product.price / (1 - product.discountPercentage / 100);
}

// Deterministic "terjual" (units sold) estimate for a Shopee-style
// social-proof label. Based on the product id/rating so it stays
// stable across renders instead of being random.
export function estimateSold(product) {
  if (!product) return 0;

  const base = (product.id * 37 + Math.round((product.rating || 0) * 91)) % 950;
  return base + 20;
}

export function formatSold(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")}rb terjual`;
  }
  return `${count} terjual`;
}
