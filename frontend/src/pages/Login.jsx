import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconShield, IconMail, IconLoader, IconEye, IconAlertTriangle, IconUsers, IconBriefcase, IconBook } from "../components/icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("Server terlalu lama merespons. Coba lagi.");
      } else if (!err.response) {
        setError("Tidak dapat terhubung ke server. Periksa koneksi backend Anda.");
      } else {
        setError(err.response?.data?.message || "Login gagal. Periksa email dan password Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Panel kiri - branding, tersembunyi di layar kecil */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 px-12 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <IconShield size={22} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">SMA Muhammadiyah</p>
            <p className="text-xs text-brand-200">Sokaraja</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-extrabold leading-tight">
            Sistem Informasi
            <br />
            Kepegawaian Sekolah
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100">
            Kelola data guru, tenaga kependidikan, jabatan, dan mata pelajaran dalam satu
            platform yang rapi, cepat, dan aman.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { icon: IconUsers, label: "Data Pegawai" },
              { icon: IconBriefcase, label: "Jabatan" },
              { icon: IconBook, label: "Mata Pelajaran" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <Icon size={20} className="text-brand-200" />
                <p className="mt-2 text-xs font-semibold text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-brand-300">
          &copy; {new Date().getFullYear()} SMA Muhammadiyah Sokaraja. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* Panel kanan - form login */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <IconShield size={20} />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-slate-800">SMA Muhammadiyah</p>
              <p className="text-xs text-slate-400">Sokaraja &middot; Kepegawaian</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800">Selamat datang kembali</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Masuk untuk mengelola data kepegawaian sekolah.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                <IconAlertTriangle size={17} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <IconMail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="nama@sekolah.sch.id"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field !pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  tabIndex={-1}
                >
                  <IconEye size={17} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading && <IconLoader size={16} />}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Hubungi administrator sekolah jika Anda mengalami kendala masuk ke akun.
          </p>
        </div>
      </div>
    </div>
  );
}
