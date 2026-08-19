import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useReviews } from "../context/ReviewsContext";
import OrderTracking from "../components/OrderTracking";
import ReviewForm from "../components/ReviewForm";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVariant(item) {
  if (!item.variant || Object.keys(item.variant).length === 0) return null;

  return Object.entries(item.variant)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

const PAYMENT_LABELS = {
  transfer: "Transfer Bank",
  cod: "Bayar di Tempat (COD)",
  card: "Kartu Kredit / Debit",
};

function OrderHistory() {
  const { orders, cancelOrder, completeOrder, markItemReviewed } =
    useOrders();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addReview } = useReviews();
  const navigate = useNavigate();

  const [confirmingId, setConfirmingId] = useState(null);
  const [reviewingItem, setReviewingItem] = useState(null); // { orderId, cartId }

  const myOrders = orders.filter((order) => order.userEmail === user?.email);

  if (myOrders.length === 0) {
    return (
      <main className="orders-page">
        <h1>Riwayat Pesanan</h1>

        <div className="orders-empty">
          <p>Kamu belum punya pesanan.</p>
          <Link to="/products" className="btn">
            Mulai Belanja
          </Link>
        </div>
      </main>
    );
  }

  function handleBuyAgain(order) {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
        },
        item.variant || {},
        item.quantity
      );
    });

    navigate("/cart");
  }

  function handleSubmitReview(order, item, { rating, comment, images }) {
    addReview(item.id, {
      reviewerName: user?.name || user?.email || "Pengguna",
      rating,
      comment,
      images,
    });
    markItemReviewed(order.id, item.cartId);
    setReviewingItem(null);
  }

  return (
    <main className="orders-page">
      <h1>Riwayat Pesanan</h1>

      <div className="orders-list">
        {myOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card__header">
              <div>
                <p className="order-card__id">{order.id}</p>
                <p className="order-card__date">{formatDate(order.date)}</p>
              </div>

              <span
                className={
                  "order-status" +
                  (order.status === "Dibatalkan"
                    ? " order-status--cancelled"
                    : "")
                }
              >
                {order.status}
              </span>
            </div>

            <OrderTracking status={order.status} />

            <div className="order-card__items">
              {order.items.map((item) => (
                <div className="order-card__item" key={item.cartId}>
                  <img src={item.thumbnail} alt={item.title} />

                  <div className="order-card__item-info">
                    <p>{item.title}</p>

                    {formatVariant(item) && (
                      <span className="order-card__variant">
                        {formatVariant(item)}
                      </span>
                    )}

                    <span className="order-card__qty">
                      {item.quantity} × ${item.price}
                    </span>

                    {order.status === "Selesai" && (
                      <div className="order-card__review">
                        {item.reviewed ? (
                          <span className="order-card__reviewed">
                            ✓ Sudah diulas
                          </span>
                        ) : reviewingItem?.orderId === order.id &&
                          reviewingItem?.cartId === item.cartId ? (
                          <ReviewForm
                            onSubmit={(data) =>
                              handleSubmitReview(order, item, data)
                            }
                            onCancel={() => setReviewingItem(null)}
                          />
                        ) : (
                          <button
                            className="order-card__review-btn"
                            onClick={() =>
                              setReviewingItem({
                                orderId: order.id,
                                cartId: item.cartId,
                              })
                            }
                          >
                            Beri Ulasan
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card__footer">
              <span>
                Pembayaran: {PAYMENT_LABELS[order.payment] || order.payment}
              </span>

              <span className="order-card__total">
                {order.voucher && (
                  <span className="order-card__voucher">
                    🎟️ {order.voucher}{" "}
                  </span>
                )}
                Total: <strong>${order.total.toFixed(2)}</strong>
              </span>
            </div>

            <div className="order-card__actions">
              {order.status === "Diproses" &&
                (confirmingId === order.id ? (
                  <div className="order-card__confirm">
                    <span>Yakin ingin membatalkan pesanan ini?</span>
                    <button
                      className="btn btn--small"
                      onClick={() => {
                        cancelOrder(order.id);
                        setConfirmingId(null);
                      }}
                    >
                      Ya, Batalkan
                    </button>
                    <button
                      className="btn btn--outline btn--small"
                      onClick={() => setConfirmingId(null)}
                    >
                      Tidak
                    </button>
                  </div>
                ) : (
                  <button
                    className="order-card__cancel-btn"
                    onClick={() => setConfirmingId(order.id)}
                  >
                    Batalkan Pesanan
                  </button>
                ))}

              {order.status === "Dikirim" && (
                <button
                  className="btn btn--small"
                  onClick={() => completeOrder(order.id)}
                >
                  Pesanan Diterima
                </button>
              )}

              {(order.status === "Selesai" ||
                order.status === "Dibatalkan") && (
                <button
                  className="btn btn--outline btn--small"
                  onClick={() => handleBuyAgain(order)}
                >
                  Beli Lagi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default OrderHistory;
