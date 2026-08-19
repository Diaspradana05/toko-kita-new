import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useOrders } from "./OrdersContext";

const NotificationsContext = createContext();

const NOTIFS_KEY = "dummy-store-notifications";

function readStored() {
  try {
    return JSON.parse(localStorage.getItem(NOTIFS_KEY)) || [];
  } catch {
    return [];
  }
}

export function NotificationsProvider({ children }) {
  const { orders } = useOrders();
  const [notifications, setNotifications] = useState(readStored);
  const prevOrdersRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Diff the orders array against its previous snapshot to detect new
  // orders and status transitions, then generate a notification for
  // each — this is what powers the bell icon in the navbar.
  useEffect(() => {
    const prevOrders = prevOrdersRef.current;

    if (prevOrders === null) {
      // First run after page load: don't spam notifications for
      // orders that already existed before this session.
      prevOrdersRef.current = orders;
      return;
    }

    const prevById = new Map(prevOrders.map((o) => [o.id, o]));
    const toAdd = [];

    orders.forEach((order) => {
      const prev = prevById.get(order.id);

      if (!prev) {
        toAdd.push({
          userEmail: order.userEmail,
          message: `Pesanan ${order.id} berhasil dibuat dan sedang diproses `,
          orderId: order.id,
        });
        return;
      }

      if (prev.status !== order.status) {
        const messages = {
          Dikirim: `Pesanan ${order.id} sedang dalam pengiriman `,
          Selesai: `Pesanan ${order.id} telah selesai. Yuk beri ulasan! `,
          Dibatalkan: `Pesanan ${order.id} telah dibatalkan.`,
        };

        if (messages[order.status]) {
          toAdd.push({
            userEmail: order.userEmail,
            message: messages[order.status],
            orderId: order.id,
          });
        }
      }
    });

    if (toAdd.length > 0) {
      setNotifications((prevNotifs) => [
        ...toAdd.map((n) => ({
          id: `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          date: new Date().toISOString(),
          read: false,
          ...n,
        })),
        ...prevNotifs,
      ]);
    }

    prevOrdersRef.current = orders;
  }, [orders]);

  function getNotifications(email) {
    return notifications
      .filter((n) => n.userEmail === email)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function getUnreadCount(email) {
    return notifications.filter((n) => n.userEmail === email && !n.read)
      .length;
  }

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead(email) {
    setNotifications((prev) =>
      prev.map((n) => (n.userEmail === email ? { ...n, read: true } : n))
    );
  }

  return (
    <NotificationsContext.Provider
      value={{
        getNotifications,
        getUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
