import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";

export default function ProfilePage() {
  const { user, setUser, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [confirmBaru, setConfirmBaru] = useState("");
  const [pwError, setPwError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await authApi.me();
        if (active) {
          setProfile(data.data);
          setUser(data.data);
        }
      } catch {
        // fall back to cached user from login
      } finally {
        if (active) setLoadingProfile(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");

    if (passwordBaru.length < 8) {
      setPwError("Password baru minimal 8 karakter");
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordBaru)) {
      setPwError("Password baru harus mengandung huruf besar, huruf kecil, dan angka");
      return;
    }
    if (passwordBaru !== confirmBaru) {
      setPwError("Konfirmasi password baru tidak cocok");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.changePassword(passwordLama, passwordBaru);
      toast.success("Password berhasil diubah. Anda akan diarahkan ke halaman login.");
      setTimeout(() => {
        clearSession();
        navigate("/login", { replace: true });
      }, 1800);
    } catch (err) {
      const res = err.response?.data;
      const msg =
        res?.message ||
        (res?.errors ? res.errors.map((e) => e.msg).join(", ") : "Gagal mengubah password");
      setPwError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Profil Saya</h1>

      <div className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl shadow-sm p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide">
          Informasi Akun
        </h2>
        {loadingProfile ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-[#2A3554]">
              <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-semibold">
                {profile?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{profile?.username}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.email}</p>
              </div>
              <span className="ml-auto inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1">
                {profile?.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Hak Akses (Permissions)</p>
              <div className="flex flex-wrap gap-1.5">
                {profile?.permissions?.length ? (
                  profile.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-tabular px-2 py-1"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">-</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 uppercase tracking-wide">
          Ubah Password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Setelah berhasil, semua sesi akan dicabut dan Anda perlu masuk kembali.
        </p>

        {pwError && (
          <div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-300">
            {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password Lama
            </label>
            <input
              type="password"
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-[#2A3554] bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-[#2A3554] bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmBaru}
              onChange={(e) => setConfirmBaru(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 dark:border-[#2A3554] bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 transition shadow-sm shadow-indigo-500/20"
          >
            {submitting ? "Memproses..." : "Ubah Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
