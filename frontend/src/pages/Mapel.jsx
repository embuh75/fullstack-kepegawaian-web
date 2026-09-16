import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAllMapel, createMapel, updateMapel, deleteMapel } from "../services/mapelService";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { IconSearch, IconPlus, IconEdit, IconTrash, IconBook, IconLoader } from "../components/icons";

const PER_PAGE = 8;
const EMPTY_FORM = { nama: "", kode: "" };

export default function Mapel() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === "admin";

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllMapel();
      setAll(data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data mata pelajaran.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((m) => m.nama.toLowerCase().includes(q) || m.kode.toLowerCase().includes(q));
  }, [all, search]);

  const lastPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ nama: item.nama, kode: item.kode });
    setFormErrors({});
    setModalOpen(true);
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim() || form.nama.trim().length < 5) errs.nama = "Nama minimal 5 karakter.";
    if (form.nama.trim().length > 50) errs.nama = "Nama maksimal 50 karakter.";
    if (!form.kode.trim()) errs.kode = "Kode wajib diisi.";
    else if (form.kode.trim().length > 5) errs.kode = "Kode maksimal 5 karakter.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = { nama: form.nama.trim(), kode: form.kode.trim() };
      if (editing) {
        await updateMapel(editing.id, payload);
        toast.success("Data mata pelajaran berhasil diperbarui.");
      } else {
        await createMapel(payload);
        toast.success("Data mata pelajaran berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        setFormErrors(apiErrors);
      } else {
        toast.error(err.response?.data?.message || "Gagal menyimpan data mata pelajaran.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMapel(deleteTarget.id);
      toast.success("Data mata pelajaran berhasil dihapus.");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus data mata pelajaran.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        icon={IconBook}
        iconWrap="bg-amber-50 text-amber-600"
        title="Mata Pelajaran"
        description="Kelola daftar mata pelajaran yang diampu pegawai."
        count={all.length}
        action={
          isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <IconPlus size={17} />
              Tambah Mapel
            </button>
          )
        }
      />

      <div className="card">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-xs">
            <IconSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode mapel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-9 !py-2 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <IconLoader size={22} />
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={IconBook}
            title="Belum ada data mata pelajaran"
            description={search ? "Tidak ada mapel yang cocok dengan pencarian." : "Tambahkan mata pelajaran pertama untuk mulai."}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Nama Mata Pelajaran</th>
                    <th className="px-5 py-3 font-semibold">Kode</th>
                    {isAdmin && <th className="px-5 py-3 text-right font-semibold">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paged.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-medium text-slate-700">{item.nama}</td>
                      <td className="px-5 py-3.5">
                        <span className="badge bg-amber-50 text-amber-700">{item.kode}</span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(item)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                              aria-label="Edit"
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                              aria-label="Hapus"
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} lastPage={lastPage} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
        description={editing ? "Perbarui detail mata pelajaran." : "Isi detail mata pelajaran baru."}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Nama Mata Pelajaran</label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              placeholder="Contoh: Matematika"
              className={`input-field ${formErrors.nama ? "input-error" : ""}`}
            />
            {formErrors.nama && <p className="field-error">{formErrors.nama}</p>}
          </div>
          <div>
            <label className="field-label">Kode</label>
            <input
              type="text"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })}
              placeholder="Contoh: MTK"
              maxLength={5}
              className={`input-field ${formErrors.kode ? "input-error" : ""}`}
            />
            {formErrors.kode && <p className="field-error">{formErrors.kode}</p>}
            <p className="mt-1 text-xs text-slate-400">Maksimal 5 karakter, harus unik.</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <IconLoader size={16} />}
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus mata pelajaran ini?"
        description={`Mapel "${deleteTarget?.nama}" akan dihapus permanen. Pegawai yang mengampu mapel ini juga akan ikut terhapus (cascade), jadi pastikan tidak ada yang masih memakainya.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
