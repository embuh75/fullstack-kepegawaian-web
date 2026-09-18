import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./ui/Avatar";
import ConfirmDialog from "./ui/ConfirmDialog";
import {
  IconHome,
  IconBriefcase,
  IconBook,
  IconUsers,
  IconUser,
  IconLogout,
  IconMenu,
  IconX,
  IconShield,
} from "./icons";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: IconHome },
  { to: "/pegawai", label: "Data Pegawai", icon: IconUsers },
  { to: "/jabatan", label: "Jabatan", icon: IconBriefcase },
  { to: "/mapel", label: "Mata Pelajaran", icon: IconBook },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const activeLabel =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ??
    "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarContent user={user} onLogout={() => setConfirmLogout(true)} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 flex w-72 max-w-[85%] animate-fade-in flex-col bg-white shadow-2xl">
            <div className="flex justify-end p-3">
              <button
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                <IconX size={20} />
              </button>
            </div>
            <SidebarContent
              user={user}
              onLogout={() => {
                setMobileOpen(false);
                setConfirmLogout(true);
              }}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3.5 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <IconMenu size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                {activeLabel}
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                Sistem Informasi Kepegawaian SMA
              </p>
            </div>
          </div>

          <Link
            to="/profile"
            aria-label="Buka profil saya"
            className="flex min-w-0 items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-slate-700">
                {user?.nama}
              </p>
              <p className="text-xs capitalize leading-tight text-slate-400">
                {user?.role}
              </p>
            </div>
            <Avatar src={user?.foto?.path} name={user?.nama} size={38} />
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Keluar dari akun?"
        description="Anda perlu login kembali untuk mengakses sistem kepegawaian."
        confirmLabel="Ya, keluar"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}

function SidebarContent({ user, onLogout, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm shadow-brand-600/30">
          <IconShield size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold leading-tight text-slate-800">
            SMA Muhammadiyah
          </p>
          <p className="truncate text-xs text-slate-400">
            Sokaraja &middot; Kepegawaian
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                )}
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-brand-600"
                      : "text-slate-400 group-hover:text-slate-500"
                  }
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <Link
          to="/profile"
          aria-label="Buka profil saya"
          className="flex min-w-0 items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar src={user?.foto?.path} name={user?.nama} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-700">
                {user?.nama}
              </p>
              <p className="truncate text-xs lowercase text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <IconLogout size={18} />
          Keluar
        </button>
      </div>
    </>
  );
}
