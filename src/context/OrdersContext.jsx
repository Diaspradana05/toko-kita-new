import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const OrdersContext = createContext();

const ORDERS_KEY = "dummy-store-orders";

// Demo timing: an order auto-advances from "Diproses" to "Dikirim" after
// this many ms, simulating a warehouse packing + courier pickup. Moving
// from "Dikirim" to "Selesai" is left to the buyer (like Shopee's
// "Pesanan Diterima" confirmation) rather than automated.
const AUTO_SHIP_AFTER_MS = 20000;

export const ORDER_STATUS = {
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  // Periodically auto-advance orders still "Diproses" into "Dikirim".
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) => {
        let changed = false;

        const next = prev.map((order) => {
          if (
            order.status === ORDER_STATUS.PROCESSING &&
            Date.now() - new Date(order.date).getTime() > AUTO_SHIP_AFTER_MS
          ) {
            changed = true;
            return { ...order, status: ORDER_STATUS.SHIPPED };
          }
          return order;
        });

        return changed ? next : prev;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  function addOrder(order) {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: ORDER_STATUS.PROCESSING,
      ...order,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }

  function cancelOrder(orderId) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.status === ORDER_STATUS.PROCESSING
          ? { ...order, status: ORDER_STATUS.CANCELLED }
          : order
      )
    );
  }

  function completeOrder(orderId) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId && order.status === ORDER_STATUS.SHIPPED
          ? { ...order, status: ORDER_STATUS.COMPLETED }
          : order
      )
    );
  }

  function markItemReviewed(orderId, cartId) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.cartId === cartId ? { ...item, reviewed: true } : item
              ),
            }
          : order
      )
    );
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        cancelOrder,
        completeOrder,
        markItemReviewed,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
