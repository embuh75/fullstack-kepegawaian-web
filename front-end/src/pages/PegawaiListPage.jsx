import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pegawaiApi } from "../api/pegawai";
import { useAuthStore } from "../store/authStore";
import { toast } from "../store/toastStore";
import ConfirmDialog from "../components/ConfirmDialog";
import { toInternational } from "../utils/nomorHp";
import { getJabatan } from "../utils/masterData";

export default function PegawaiListPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [jabatanId, setJabatanId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, nama }
  const [deleting, setDeleting] = useState(false);
  const [jabatans, setJabatans] = useState(null);

  const hasPermission = useAuthStore((s) => s.hasPermission);
  const navigate = useNavigate();

  const fetchData = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: pagination.limit };
      if (search) params.search = search;
      if (jabatanId) params.jabatanId = jabatanId;

      const { data: res } = await pegawaiApi.getAll(params);
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPage = async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit: pagination.limit };
        if (search) params.search = search;
        if (jabatanId) params.jabatanId = jabatanId;

        const { data: res } = await pegawaiApi.getAll(params);
        setData(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat data pegawai");
      } finally {
        setLoading(false);
      }
    };

    const fetchMapel = async () => {
      try {
        const jabatan = await getJabatan();
        setJabatans(jabatan.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPage(1);
    fetchMapel();
  }, [jabatanId, pagination.limit, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  const handleResetFilter = () => {
    setSearch("");
    setJabatanId("");
    // fetchData uses closures, run after state settles
    setTimeout(() => fetchData(1), 0);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await pegawaiApi.remove(deleteTarget.id);
      toast.success(`Data pegawai "${deleteTarget.nama}" berhasil dihapus.`);
      const targetPage =
        data.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page;
      setDeleteTarget(null);
      fetchData(targetPage);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal menghapus data pegawai",
      );
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilter = search || jabatanId;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Data Pegawai
          </h1>
          {!loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {pagination.total} pegawai terdaftar
            </p>
          )}
        </div>
        {hasPermission("pegawai:create") && (
          <Link
            to="/pegawai/baru"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-indigo-700 active:scale-[0.98] transition shadow-sm shadow-indigo-500/20 shrink-0"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Tambah Pegawai
          </Link>
        )}
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-wrap gap-3 mb-4 bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] p-4 rounded-xl shadow-sm"
      >
        <div className="relative flex-1 min-w-50">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, NBM, atau email..."
            className="w-full rounded-lg border border-slate-300 dark:border-[#2A3554] bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-slate-400"
          />
        </div>
        <select
          value={jabatanId}
          onChange={(e) => setJabatanId(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-[#2A3554] bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">Semua Jabatan</option>
          {jabatans?.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nama}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-800 dark:bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-900 dark:hover:bg-indigo-700 transition"
        >
          Cari
        </button>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleResetFilter}
            className="rounded-lg border border-slate-300 dark:border-[#2A3554] text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            Reset
          </button>
        )}
      </form>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button
            onClick={() => fetchData(pagination.page)}
            className="shrink-0 rounded-md bg-rose-100 dark:bg-rose-900 hover:bg-rose-200 dark:hover:bg-rose-800 px-3 py-1.5 text-xs font-medium transition"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-[#141A30] text-slate-600 dark:text-slate-400 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">NIK</th>
                <th className="px-4 py-3 font-medium">Jabatan</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">
                  Telepon
                </th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#2A3554]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3.5">
                      <div className="skeleton h-4 w-32 rounded" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="skeleton h-4 w-24 rounded" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="skeleton h-4 w-20 rounded" />
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <div className="skeleton h-4 w-28 rounded" />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <div className="skeleton h-4 w-20 rounded" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="skeleton h-4 w-16 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
                        />
                      </svg>
                      <p className="text-sm">
                        {hasActiveFilter
                          ? "Tidak ada pegawai yang cocok dengan pencarian ini."
                          : "Belum ada data pegawai."}
                      </p>
                      {hasActiveFilter && (
                        <button
                          onClick={handleResetFilter}
                          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                        >
                          Hapus filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
                          {p.nama?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {p.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-tabular">
                      {p.noKTP}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1">
                        {p.jabatan?.nama || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">
                      {p.alamatEmail || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden lg:table-cell font-tabular text-xs">
                      {toInternational(p.nomorTelephone) || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission("pegawai:read") && (
                          <ActionButton
                            label="Detail"
                            onClick={() => navigate(`/pegawai/${p.id}`)}
                            color="indigo"
                          />
                        )}
                        {hasPermission("pegawai:update") && (
                          <ActionButton
                            label="Edit"
                            onClick={() => navigate(`/pegawai/${p.id}/edit`)}
                            color="amber"
                          />
                        )}
                        {hasPermission("pegawai:delete") && (
                          <ActionButton
                            label="Hapus"
                            onClick={() =>
                              setDeleteTarget({ id: p.id, nama: p.nama })
                            }
                            color="rose"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && data.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-[#2A3554] text-sm text-slate-600 dark:text-slate-400">
            <span>
              Halaman {pagination.page} dari {pagination.totalPages} (
              {pagination.total} data)
            </span>
            <div className="space-x-2">
              <button
                onClick={() => fetchData(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-slate-300 dark:border-[#2A3554] px-3 py-1.5 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => fetchData(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-slate-300 dark:border-[#2A3554] px-3 py-1.5 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus data pegawai?"
        message={`Data pegawai "${deleteTarget?.nama}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

const ACTION_COLORS = {
  indigo:
    "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10",
  amber:
    "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
  rose: "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10",
};

function ActionButton({ label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${ACTION_COLORS[color]}`}
    >
      {label}
    </button>
  );
}
