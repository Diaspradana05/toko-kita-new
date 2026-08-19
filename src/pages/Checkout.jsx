import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { validateVoucher } from "../utils/vouchers";

const SHIPPING_FEE = 4.99;

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = Boolean(buyNowItem);
  const items = isBuyNow ? [buyNowItem] : cartItems;

  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    payment: "transfer",
  });
  const [placed, setPlaced] = useState(false);

  const [voucherInput, setVoucherInput] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = voucher?.type === "shipping" ? 0 : SHIPPING_FEE;

  let discount = 0;
  if (voucher?.type === "percent") {
    discount = (subtotal * voucher.value) / 100;
  } else if (voucher?.type === "flat") {
    discount = voucher.value;
  }

  const total = Math.max(subtotal + shipping - discount, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleApplyVoucher(e) {
    e.preventDefault();
    setVoucherError("");

    try {
      const applied = validateVoucher(voucherInput, subtotal);
      setVoucher(applied);
    } catch (err) {
      setVoucher(null);
      setVoucherError(err.message);
    }
  }

  function handleRemoveVoucher() {
    setVoucher(null);
    setVoucherInput("");
    setVoucherError("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    addOrder({
      items,
      subtotal,
      shipping,
      discount,
      voucher: voucher?.code || null,
      total,
      payment: form.payment,
      recipient: form.name,
      address: `${form.address}, ${form.city} ${form.postalCode}`,
      userEmail: user?.email,
    });

    setPlaced(true);

    if (!isBuyNow) {
      clearCart();
    }
  }

  function formatVariant(item) {
    if (!item.variant || Object.keys(item.variant).length === 0) return null;

    return Object.entries(item.variant)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
  }

  if (placed) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">
          <h1>Pesanan Berhasil Dibuat </h1>
          <p>
            Terima kasih, {form.name || "pelanggan"}. Pesananmu akan dikirim
            ke {form.address || "alamat yang kamu masukkan"}.
          </p>

          <div className="checkout-success__actions">
            <button className="btn" onClick={() => navigate("/products")}>
              Kembali Belanja
            </button>

            <button
              className="btn btn--outline"
              onClick={() => navigate("/riwayat-pesanan")}
            >
              Lihat Riwayat Pesanan
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <p>Keranjang kamu kosong. Belanja dulu sebelum checkout.</p>
        <button className="btn" onClick={() => navigate("/products")}>
          Lihat Produk
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Nama Penerima
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Alamat Lengkap
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </label>

          <div className="checkout-form__row">
            <label>
              Kota
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Kode Pos
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <fieldset className="checkout-payment">
            <legend>Metode Pembayaran</legend>

            <label>
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={form.payment === "transfer"}
                onChange={handleChange}
              />
              Transfer Bank
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={form.payment === "cod"}
                onChange={handleChange}
              />
              Bayar di Tempat (COD)
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={form.payment === "card"}
                onChange={handleChange}
              />
              Kartu Kredit / Debit
            </label>
          </fieldset>

          <button type="submit" className="btn">
            Buat Pesanan
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Ringkasan Pesanan</h2>

          {items.map((item) => (
            <div className="checkout-summary__item" key={item.cartId}>
              <div>
                <span>
                  {item.title} × {item.quantity}
                </span>

                {formatVariant(item) && (
                  <span className="checkout-summary__variant">
                    {formatVariant(item)}
                  </span>
                )}
              </div>

              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="voucher-box">
            {voucher ? (
              <div className="voucher-box__applied">
                <span>
                  🎟️ <strong>{voucher.code}</strong> — {voucher.label}
                </span>
                <button type="button" onClick={handleRemoveVoucher}>
                  Hapus
                </button>
              </div>
            ) : (
              <form className="voucher-box__form" onSubmit={handleApplyVoucher}>
                <input
                  type="text"
                  placeholder="Masukkan kode voucher"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                />
                <button type="submit">Pakai</button>
              </form>
            )}

            {voucherError && (
              <p className="voucher-box__error">{voucherError}</p>
            )}

            <p className="voucher-box__hint">
              Coba: DISKON10, DISKON20, GRATISONGKIR, POTONG5
            </p>
          </div>

          <div className="checkout-summary__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="checkout-summary__row">
            <span>Ongkos Kirim</span>
            <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
          </div>

          {discount > 0 && (
            <div className="checkout-summary__row checkout-summary__row--discount">
              <span>Diskon Voucher</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="checkout-summary__total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
