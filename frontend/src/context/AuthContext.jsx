import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService, logout as logoutService, getMe } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil pengguna saat aplikasi pertama kali dibuka.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    let ignore = false;

    getMe()
      .then((currentUser) => {
        if (!ignore && localStorage.getItem("token") === token) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (!ignore && localStorage.getItem("token") === token) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function login(email, password) {
    const { token } = await loginService(email, password);
    localStorage.setItem("token", token);
    setUser(null);

    try {
      const currentUser = await getMe();

      if (localStorage.getItem("token") !== token) {
        throw new Error("Sesi login sudah berubah. Silakan login kembali.");
      }

      setUser(currentUser);
      return currentUser;
    } catch (err) {
      if (localStorage.getItem("token") === token) {
        logoutService();
        setUser(null);
      }

      throw err;
    }
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }

  return ctx;
}
