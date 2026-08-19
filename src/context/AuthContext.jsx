import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

const USERS_KEY = "dummy-store-users";
const SESSION_KEY = "dummy-store-session";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  function register(name, email, password) {
    const users = readUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("Email sudah terdaftar");
    }

    const newUser = { name, email, password, phone: "" };
    writeUsers([...users, newUser]);
    setUser({ name: newUser.name, email: newUser.email, phone: "" });
  }

  function login(email, password) {
    const users = readUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Email atau password salah");
    }

    setUser({ name: found.name, email: found.email, phone: found.phone || "" });
  }

  function logout() {
    setUser(null);
  }

  function updateProfile(name, email, phone) {
    if (!user) throw new Error("Kamu belum masuk");

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx === -1) throw new Error("Akun tidak ditemukan");

    if (email !== user.email && users.some((u) => u.email === email)) {
      throw new Error("Email sudah digunakan akun lain");
    }

    const updatedUsers = [...users];
    updatedUsers[idx] = { ...updatedUsers[idx], name, email, phone };
    writeUsers(updatedUsers);

    setUser({ name, email, phone });
  }

  function changePassword(currentPassword, newPassword) {
    if (!user) throw new Error("Kamu belum masuk");

    const users = readUsers();
    const idx = users.findIndex((u) => u.email === user.email);

    if (idx === -1) throw new Error("Akun tidak ditemukan");

    if (users[idx].password !== currentPassword) {
      throw new Error("Password saat ini salah");
    }

    const updatedUsers = [...users];
    updatedUsers[idx] = { ...updatedUsers[idx], password: newPassword };
    writeUsers(updatedUsers);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
