import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import {
  formatCategory,
  getOriginalPrice,
  estimateSold,
  formatSold,
} from "../utils/format";
import VariantModal from "./VariantModal";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const liked = isWishlisted(product.id);
  const originalPrice = getOriginalPrice(product);
  const sold = estimateSold(product);

  function handleToggleWishlist(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    toggleWishlist(product);
  }

  function handleAddToCart(prod, variant, quantity) {
    addToCart(prod, variant, quantity);
    setShowModal(false);
  }

  function handleBuyNow(prod, variant, quantity) {
    setShowModal(false);
    navigate("/checkout", {
      state: {
        buyNowItem: {
          cartId: `${prod.id}__buynow__${Date.now()}`,
          id: prod.id,
          title: prod.title,
          price: prod.price,
          thumbnail: prod.thumbnail,
          variant,
          quantity,
        },
      },
    });
  }

  return (
    <div className="product-card">
      <div className="product-card__media">
        {product.discountPercentage > 0 && (
          <span className="product-badge">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        <button
          className={
            "wishlist-heart" + (liked ? " wishlist-heart--active" : "")
          }
          onClick={handleToggleWishlist}
          aria-label={liked ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          {liked ? "♥" : "♡"}
        </button>

        <Link to={`/products/${product.id}`}>
          <img src={product.thumbnail} alt={product.title} />
        </Link>
      </div>

      <div className="product-info">
        <Link to={`/products/${product.id}`}>
          <h3>{product.title}</h3>
        </Link>

        <p className="product-category">{formatCategory(product.category)}</p>

        <div className="product-card__price-row">
          <p className="product-price">${product.price.toFixed(2)}</p>
          {originalPrice && (
            <span className="product-price__original">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <p className="product-card__meta">
          <span className="stars">★</span>
          {product.rating}
          <span>·</span>
          {formatSold(sold)}
        </p>

        <div className="product-card__actions">
          <button
            className="btn btn--outline btn--small"
            onClick={() => setShowModal(true)}
            disabled={product.stock === 0}
          >
            + Keranjang
          </button>

          <button
            className="btn btn--small"
            onClick={() => setShowModal(true)}
            disabled={product.stock === 0}
          >
            Beli Sekarang
          </button>
        </div>
      </div>

      {showModal && (
        <VariantModal
          product={product}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}

export default ProductCard;
