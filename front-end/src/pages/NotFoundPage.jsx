import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#F7F8FB] dark:bg-[#0F1422] px-4">
      <p className="text-6xl font-semibold text-indigo-500/30 mb-2 font-tabular">404</p>
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Halaman tidak ditemukan</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        URL yang Anda tuju tidak tersedia di sistem ini.
      </p>
      <Link
        to="/pegawai"
        className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 transition shadow-sm shadow-indigo-500/20"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
