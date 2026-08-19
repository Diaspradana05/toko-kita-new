import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function NotificationBell() {
  const { user } = useAuth();
  const { getNotifications, getUnreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const notifications = getNotifications(user.email);
  const unreadCount = getUnreadCount(user.email);

  return (
    <div className="notif-bell" ref={menuRef}>
      <button
        className="navbar__icon-link"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifikasi"
      >
        🔔
        {unreadCount > 0 && (
          <span className="navbar__icon-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__header">
            <span>Notifikasi</span>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead(user.email)}>
                Tandai semua dibaca
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="notif-bell__empty">Belum ada notifikasi.</p>
          ) : (
            <div className="notif-bell__list">
              {notifications.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  to="/riwayat-pesanan"
                  className={
                    "notif-bell__item" +
                    (n.read ? "" : " notif-bell__item--unread")
                  }
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                >
                  <p>{n.message}</p>
                  <span>{timeAgo(n.date)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
