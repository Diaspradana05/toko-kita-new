import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <h1>Keranjang Belanja</h1>

        <div className="orders-empty">
          <p>Keranjang masih kosong. Yuk mulai belanja!</p>
          <Link to="/products" className="btn">
            Lihat Produk
          </Link>
        </div>
      </main>
    );
  }

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <h1>Keranjang Belanja</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={item.cartId}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
              />

              <div className="cart-item-info">
                <h3>{item.title}</h3>

                {item.variant && Object.keys(item.variant).length > 0 && (
                  <p className="cart-item-variant">
                    {Object.entries(item.variant)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </p>
                )}

                <p className="cart-item-price">${item.price.toFixed(2)}</p>

                <div className="cart-item-footer">
                  <div className="quantity">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.cartId)
                      }
                      aria-label="Kurangi jumlah"
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.cartId)
                      }
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.cartId)
                    }
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Ringkasan Pesanan</h2>

          <div>
            <span>Total ({cartItems.reduce((n, i) => n + i.quantity, 0)} barang)</span>

            <strong>
              ${total.toFixed(2)}
            </strong>
          </div>

          <button onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </main>
  );
}

export default Cart;