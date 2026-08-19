import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [tab, setTab] = useState("profil");

  return (
    <main className="settings-page">
      <h1>Pengaturan Akun</h1>

      <div className="settings-layout">
        <aside className="settings-menu">
          <button
            className={tab === "profil" ? "active" : ""}
            onClick={() => setTab("profil")}
          >
            Profil Saya
          </button>

          <button
            className={tab === "keamanan" ? "active" : ""}
            onClick={() => setTab("keamanan")}
          >
            Ubah Password
          </button>
        </aside>

        <section className="settings-content">
          {tab === "profil" ? (
            <ProfileForm user={user} updateProfile={updateProfile} />
          ) : (
            <PasswordForm changePassword={changePassword} />
          )}
        </section>
      </div>
    </main>
  );
}

function ProfileForm({ user, updateProfile }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      updateProfile(name, email, phone);
      setMessage("Profil berhasil diperbarui");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Profil Saya</h2>
      <p className="settings-form__desc">
        Kelola informasi profil untuk mengontrol, melindungi, dan
        mengamankan akunmu.
      </p>

      {message && <p className="settings-success">{message}</p>}
      {error && <p className="auth-error">{error}</p>}

      <label>
        Nama
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        No. Telepon
        <input
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <button type="submit" className="btn">
        Simpan
      </button>
    </form>
  );
}

function PasswordForm({ changePassword }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    try {
      changePassword(currentPassword, newPassword);
      setMessage("Password berhasil diubah");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h2>Ubah Password</h2>
      <p className="settings-form__desc">
        Demi keamanan akun, jangan bagikan password ke orang lain.
      </p>

      {message && <p className="settings-success">{message}</p>}
      {error && <p className="auth-error">{error}</p>}

      <label>
        Password Saat Ini
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </label>

      <label>
        Password Baru
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
        />
      </label>

      <label>
        Konfirmasi Password Baru
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={6}
          required
        />
      </label>

      <button type="submit" className="btn">
        Simpan Password
      </button>
    </form>
  );
}

export default Settings;
