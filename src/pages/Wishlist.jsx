import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatCategory } from "../utils/format";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <h1>Favorit Saya</h1>

        <div className="orders-empty">
          <p>Belum ada produk favorit. Ketuk ikon ❤️ pada produk yang kamu suka.</p>
          <Link to="/products" className="btn">
            Lihat Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <h1>Favorit Saya ({wishlist.length})</h1>

      <div className="product-grid">
        {wishlist.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card__media">
              <button
                className="wishlist-heart wishlist-heart--active"
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Hapus dari favorit"
              >
                ♥
              </button>

              <Link to={`/products/${product.id}`}>
                <img src={product.thumbnail} alt={product.title} />
              </Link>
            </div>

            <div className="product-info">
              <Link to={`/products/${product.id}`}>
                <h3>{product.title}</h3>
              </Link>
              <p className="product-category">
                {formatCategory(product.category)}
              </p>
              <div className="product-card__price-row">
                <p className="product-price">${product.price.toFixed(2)}</p>
              </div>
              <p className="product-card__meta">
                <span className="stars">★</span>
                {product.rating}
              </p>

              <div className="product-card__actions">
                <button
                  className="btn btn--small"
                  onClick={() => addToCart(product, {}, 1)}
                  disabled={product.stock === 0}
                >
                  + Keranjang
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wishlist;
