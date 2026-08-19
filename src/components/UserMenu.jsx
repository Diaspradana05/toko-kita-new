import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/");
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu__trigger" onClick={() => setOpen((o) => !o)}>
        Hai, {user.name}
        <span className="user-menu__caret">▾</span>
      </button>

      {open && (
        <div className="user-menu__dropdown">
          <Link to="/riwayat-pesanan" onClick={() => setOpen(false)}>
            Pesanan Saya
          </Link>

          <Link to="/wishlist" onClick={() => setOpen(false)}>
            Favorit Saya
          </Link>

          <Link to="/pengaturan" onClick={() => setOpen(false)}>
            Pengaturan Akun
          </Link>

          <button onClick={handleLogout}>Keluar</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
