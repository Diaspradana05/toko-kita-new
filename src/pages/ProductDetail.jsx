import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { getProductVariants } from "../utils/variants";
import { formatCategory } from "../utils/format";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";
import ProductOptions from "../components/ProductOptions";
import ProductReviews from "../components/ProductReviews";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { getReviews } = useReviews();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [warning, setWarning] = useState("");

  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);

        setProduct(data);

        const variantGroups = getProductVariants(data);
        const initial = {};
        variantGroups.forEach((group) => {
          initial[group.name] = group.options[0];
        });
        setSelected(initial);
        setQuantity(1);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Memuat produk...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const variantGroups = getProductVariants(product);

  const localReviews = getReviews(product.id);
  const combinedReviews = [...localReviews, ...(product.reviews || [])];
  const combinedRating =
    combinedReviews.length > 0
      ? combinedReviews.reduce((sum, r) => sum + r.rating, 0) /
        combinedReviews.length
      : product.rating;

  function handleSelect(groupName, value) {
    setSelected((prev) => ({ ...prev, [groupName]: value }));
    setWarning("");
  }

  function isComplete() {
    return variantGroups.every((group) => selected[group.name]);
  }

  function handleToggleWishlist() {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    toggleWishlist(product);
  }

  function handleAddToCart() {
    if (!isComplete()) {
      setWarning("Pilih varian terlebih dahulu");
      return;
    }

    addToCart(product, selected, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    if (!isComplete()) {
      setWarning("Pilih varian terlebih dahulu");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          cartId: `${product.id}__buynow__${Date.now()}`,
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          variant: selected,
          quantity,
        },
      },
    });
  }

  return (
    <main>
      <Link to="/products" className="product-detail__back">
        ← Kembali ke Produk
      </Link>

      <div className="product-detail">
        <div className="product-detail__gallery">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        <div>
          <div className="detail-title-row">
            <h1>{product.title}</h1>

            <button
              className={
                "wishlist-heart wishlist-heart--inline" +
                (isWishlisted(product.id) ? " wishlist-heart--active" : "")
              }
              onClick={handleToggleWishlist}
              aria-label="Tambah ke favorit"
            >
              {isWishlisted(product.id) ? "♥" : "♡"}
            </button>
          </div>

          <p className="product-detail__category">
            Kategori: {formatCategory(product.category)}
          </p>

          <p className="product-detail__rating">
            <span className="stars">★</span> {combinedRating.toFixed(1)}
            <span> · {combinedReviews.length} ulasan</span>
          </p>

          <div className="product-detail__price-box">
            <h2>${product.price.toFixed(2)}</h2>
          </div>

          <p className="product-detail__description">{product.description}</p>

          <p className="product-detail__stock">Stok: {product.stock}</p>

          <ProductOptions
            variantGroups={variantGroups}
            selected={selected}
            onSelect={handleSelect}
            quantity={quantity}
            onQuantityChange={setQuantity}
            maxQuantity={product.stock}
          />

          {warning && <p className="variant-modal__warning">{warning}</p>}

          <div className="product-detail__actions">
            <button
              className="btn btn--outline"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? "Ditambahkan ✓" : "+ Keranjang"}
            </button>

            <button
              className="btn"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>

      <ProductReviews reviews={combinedReviews} rating={combinedRating} />
    </main>
  );
}

export default ProductDetail;
