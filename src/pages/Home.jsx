import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const CATEGORY_SHORTCUTS = [
  { icon: "💄", label: "Kecantikan", slug: "beauty" },
  { icon: "👗", label: "Fashion Wanita", slug: "womens-dresses" },
  { icon: "👕", label: "Fashion Pria", slug: "mens-shirts" },
  { icon: "📱", label: "Elektronik", slug: "smartphones" },
  { icon: "💻", label: "Laptop", slug: "laptops" },
  { icon: "🏠", label: "Rumah Tangga", slug: "home-decoration" },
  { icon: "⌚", label: "Aksesoris", slug: "mens-watches" },
  { icon: "🧴", label: "Skincare", slug: "skin-care" },
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function useCountdown(durationMs) {
  const [endTime] = useState(() => Date.now() + durationMs);
  const [remaining, setRemaining] = useState(durationMs);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(Math.max(0, endTime - Date.now()));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(3 * 60 * 60 * 1000); // 3 jam demo

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const flashSaleProducts = [...products]
    .filter((p) => p.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

  const flashSaleIds = new Set(flashSaleProducts.map((p) => p.id));
  const recommendedProducts = products
    .filter((p) => !flashSaleIds.has(p.id))
    .slice(0, 8);

  return (
    <main>
      <section className="home-banner">
        <div className="home-banner__content">
          <span className="home-banner__eyebrow">Toko Online Serba Ada</span>
          <h1>Belanja apa saja, tanpa ribet.</h1>
          <p>
            Temukan berbagai produk pilihan mulai dari elektronik, fashion,
            hingga kebutuhan rumah tangga dengan harga terbaik.
          </p>
          <Link to="/products" className="btn">
            Lihat Semua Produk
          </Link>
        </div>
        <div className="home-banner__badge">🛍️</div>
      </section>

      <div className="home-categories">
        {CATEGORY_SHORTCUTS.map((cat) => (
          <Link
            key={cat.slug}
            to={`/products?category=${cat.slug}`}
            className="home-categories__item"
          >
            <span className="home-categories__icon">{cat.icon}</span>
            {cat.label}
          </Link>
        ))}
      </div>

      {!loading && flashSaleProducts.length > 0 && (
        <section className="home-section flash-sale">
          <div className="flash-sale__head">
            <div className="flash-sale__title">
              <span>⚡ Flash Sale</span>
            </div>

            <div className="flash-sale__countdown">
              <span>Berakhir dalam</span>
              <span className="flash-sale__clock">
                {pad(countdown.hours)}
              </span>
              :
              <span className="flash-sale__clock">
                {pad(countdown.minutes)}
              </span>
              :
              <span className="flash-sale__clock">
                {pad(countdown.seconds)}
              </span>
            </div>

            <Link to="/products" className="flash-sale__more">
              Lihat Semua &rsaquo;
            </Link>
          </div>

          <div className="product-grid">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="home-section__head">
          <h2 className="section-title">Rekomendasi Untukmu</h2>
          <Link to="/products">Lihat Semua &rsaquo;</Link>
        </div>

        {loading && <p>Memuat produk...</p>}

        {!loading && (
          <div className="product-grid">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
