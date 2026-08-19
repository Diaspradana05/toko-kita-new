import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCategories } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();

  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (category) params.set("category", category);

    navigate(`/products?${params.toString()}`);
  }

  return (
    <nav>
      <h2>
        <Link to="/">Toko Kita</Link>
      </h2>

      <form className="navbar__search" onSubmit={handleSearchSubmit}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cari produk, merek, dan lainnya"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button type="submit">Cari</button>
      </form>

      <div>
        <Link to="/">Beranda</Link>
        <Link to="/products">Produk</Link>
        <Link to="/deals">Deals</Link>

        <div className="navbar__icons">
          {user && (
            <Link
              to="/wishlist"
              className="navbar__icon-link"
              aria-label="Favorit"
            >
              ♡
              {wishlist.length > 0 && (
                <span className="navbar__icon-badge">{wishlist.length}</span>
              )}
            </Link>
          )}

          <Link to="/cart" className="navbar__icon-link" aria-label="Keranjang">
            🛒
            {totalItems > 0 && (
              <span className="navbar__icon-badge">{totalItems}</span>
            )}
          </Link>

          <NotificationBell />
        </div>

        {user ? (
          <UserMenu />
        ) : (
          <div className="navbar__auth">
            <Link to="/login">Masuk</Link>
            <Link to="/register">Daftar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
