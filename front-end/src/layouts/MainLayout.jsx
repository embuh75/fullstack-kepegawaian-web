import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { authApi } from "../api/auth";
import { toast } from "../store/toastStore";
import ConfirmDialog from "../components/ConfirmDialog";

const NAV_ICONS = {
  pegawai: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z" />
    </svg>
  ),
  profil: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path strokeLinecap="round" d="M4.5 19.5c1.5-3.5 4.5-5 7.5-5s6 1.5 7.5 5" />
    </svg>
  ),
};

export default function MainLayout() {
  const { user, refreshToken, hasPermission, clearSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore network errors on logout, clear session regardless
    } finally {
      clearSession();
      toast.success("Anda telah keluar.");
      navigate("/login", { replace: true });
    }
  };

  const navItems = [
    { to: "/pegawai", label: "Data Pegawai", permission: "pegawai:read", icon: "pegawai" },
    { to: "/profil", label: "Profil Saya", permission: null, icon: "profil" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F8FB] dark:bg-[#0F1422]">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col text-slate-100
          bg-gradient-to-b from-[#1E2A4A] to-[#141D38]
          transform transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-semibold text-sm">
            SK
          </div>
          <div>
            <h2 className="font-semibold text-[15px] leading-tight">Kepegawaian</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Sistem Manajemen Pegawai</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 relative">
          {navItems.map((item) => {
            if (item.permission && !hasPermission(item.permission)) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-indigo-400 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className={isActive ? "text-indigo-300" : ""}>{NAV_ICONS[item.icon]}</span>
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between rounded-lg bg-white/5 hover:bg-white/10 px-3 py-2 text-sm text-slate-300 transition"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
              {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            </span>
          </button>

          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={() => setLogoutConfirm(true)}
            className="w-full rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white text-slate-300 text-sm font-medium py-2 transition"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-[#1E2A4A] bg-white dark:bg-[#141A30]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Buka menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Kepegawaian</h1>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={logoutConfirm}
        title="Keluar dari aplikasi?"
        message="Anda perlu masuk kembali untuk mengakses sistem."
        confirmLabel="Keluar"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirm(false)}
      />
    </div>
  );
}
