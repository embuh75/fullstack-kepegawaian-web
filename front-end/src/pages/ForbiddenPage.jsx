import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-1">Akses Ditolak</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        Anda tidak memiliki hak akses (permission) untuk membuka halaman ini.
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
