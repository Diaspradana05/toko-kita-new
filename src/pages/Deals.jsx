import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const FILTERS = [
  { key: 0, label: "Semua Diskon" },
  { key: 10, label: "Diskon 10%+" },
  { key: 30, label: "Diskon 30%+" },
  { key: 50, label: "Diskon 50%+" },
];

function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minDiscount, setMinDiscount] = useState(0);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const deals = useMemo(() => {
    return products
      .filter((p) => p.discountPercentage >= minDiscount && p.discountPercentage > 0)
      .sort((a, b) => b.discountPercentage - a.discountPercentage);
  }, [products, minDiscount]);

  return (
    <main>
      <section className="deals-banner">
        <h1>Diskon Spesial Hari Ini</h1>    
        <p>Belanja hemat dengan potongan harga terbaik pilihan kami.</p>
      </section>

      <div className="products-sortbar">
        <span>Filter:</span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={minDiscount === f.key ? "active" : ""}
            onClick={() => setMinDiscount(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p>Memuat produk...</p>}

      {!loading && deals.length === 0 && (
        <p>Tidak ada produk diskon pada kategori ini.</p>
      )}

      {!loading && deals.length > 0 && (
        <div className="product-grid">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Deals;
