import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "../services/productService";
import ProductCard from "../components/ProductCard";
import { formatCategory } from "../utils/format";

const SORT_OPTIONS = [
  { key: "default", label: "Terbaru" },
  { key: "rating", label: "Rating Tertinggi" },
  { key: "price-asc", label: "Termurah" },
  { key: "price-desc", label: "Termahal" },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        let data;

        if (search) {
          data = await searchProducts(search);
        } else if (category) {
          data = await getProductsByCategory(category);
        } else {
          data = await getProducts();
        }

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [search, category]);

  function handleCategorySelect(slug) {
    const next = {};

    if (slug) next.category = slug;
    if (search) next.search = search;

    setSearchParams(next);
  }

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (sort === "rating") return list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, sort]);

  return (
    <main>
      <div className="products-header">
        <h1>{search ? "Hasil Pencarian" : "Semua Produk"}</h1>

        <select
          className="category-filter"
          value={category}
          onChange={(e) => handleCategorySelect(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {search && (
        <p className="products-search-info">
          Menampilkan hasil pencarian untuk: <strong>{search}</strong>
        </p>
      )}

      <div className="products-layout">
        <aside className="products-sidebar">
          <h3>Kategori</h3>
          <div className="products-sidebar__list">
            <button
              className={category === "" ? "active" : ""}
              onClick={() => handleCategorySelect("")}
            >
              Semua Kategori
            </button>

            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={category === cat.slug ? "active" : ""}
                onClick={() => handleCategorySelect(cat.slug)}
              >
                {cat.name || formatCategory(cat.slug)}
              </button>
            ))}
          </div>
        </aside>

        <div>
          <div className="products-sortbar">
            <span>Urutkan:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={sort === opt.key ? "active" : ""}
                onClick={() => setSort(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading && <p>Memuat produk...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p>Tidak ada produk ditemukan.</p>
          )}

          {!loading && !error && (
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Products;
