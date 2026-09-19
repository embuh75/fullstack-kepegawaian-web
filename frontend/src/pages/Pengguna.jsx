import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  getPegawaiList,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from "../services/pegawaiService";
import { getAllJabatan } from "../services/jabatanService";
import { getAllMapel } from "../services/mapelService";
import { index, find } from "../services/penggunaService";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Avatar from "../components/ui/Avatar";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconLoader,
  IconUpload,
  IconIdCard,
  IconPhone,
  IconMail,
  IconCalendar,
  IconGraduationCap,
  IconBriefcase,
  IconHeartPulse,
  IconUser,
  IconShield,
} from "../components/icons";

const PER_PAGE = 10;
const PHONE_REGEX = /^(08|628|\+628)[0-9]{7,11}$/;

const EMPTY_FORM = {
  nama: "",
  nomor_ktp: "",
  nomor_nbm: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "L",
  status: "Belum_Menikah",
  alamat_rumah: "",
  nomor_telephone: "",
  alamat_email: "",
  pendidikan_terakhir: "",
  nama_kampus: "",
  jurusan: "",
  tahun_lulus: "",
  jabatan: "",
  mapel: "",
  nomor_bpjs: "",
  kontak_darurat: "",
};

const STATUS_LABEL = {
  Belum_Menikah: "Belum Menikah",
  Menikah: "Menikah",
  Duda: "Duda / Janda",
};

const PENDIDIKAN_OPTIONS = ["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"];

export default function Pengguna() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [mapelOptions, setMapelOptions] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce pencarian supaya tidak memanggil API di setiap ketikan
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const data = await index();
      setItems(data.items || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data pegawai.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  useEffect(() => {
    getAllJabatan()
      .then(setJabatanOptions)
      .catch(() => {});
    getAllMapel()
      .then(setMapelOptions)
      .catch(() => {});
  }, []);

  const jabatanMap = useMemo(
    () => Object.fromEntries(jabatanOptions.map((j) => [j.id, j.nama])),
    [jabatanOptions],
  );
  const mapelMap = useMemo(
    () => Object.fromEntries(mapelOptions.map((m) => [m.id, m.nama])),
    [mapelOptions],
  );

  function resetFotoState() {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    resetFotoState();
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      nama: item.nama || "",
      role: item.role || "",
      email: item.email || "",
      whatsapp: item.whatsapp || "",
    });
    setFormErrors({});
    resetFotoState();
    setFotoPreview(item.foto?.path || null);
    setModalOpen(true);
  }

  async function openDetail(item) {
    setDetailItem(item);
    setDetailLoading(true);
    try {
      const fresh = await find(item.id);
      setDetailItem(fresh);
    } catch {
      // Fallback: tetap tampilkan data ringkas yang sudah ada di list
    } finally {
      setDetailLoading(false);
    }
  }

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Format foto harus JPG, PNG, WEBP, atau GIF.");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error("Ukuran foto maksimal 1MB.");
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const errs = {};
    if (!form.nama.trim() || form.nama.trim().length < 5)
      errs.nama = "Nama minimal 5 karakter.";
    if (!/^\d{16}$/.test(form.nomor_ktp.trim()))
      errs.nomor_ktp = "Nomor KTP harus tepat 16 digit angka.";
    if (form.nomor_nbm && form.nomor_nbm.length > 20)
      errs.nomor_nbm = "Maksimal 20 karakter.";
    if (!form.tempat_lahir.trim()) errs.tempat_lahir = "Wajib diisi.";
    if (!form.tanggal_lahir) errs.tanggal_lahir = "Wajib diisi.";
    if (!form.alamat_rumah.trim()) errs.alamat_rumah = "Wajib diisi.";
    else if (form.alamat_rumah.trim().length > 150)
      errs.alamat_rumah = "Maksimal 150 karakter.";
    if (!PHONE_REGEX.test(form.nomor_telephone.trim()))
      errs.nomor_telephone = "Format tidak valid. Contoh: 081234567890";
    if (form.alamat_email && !/^\S+@\S+\.\S+$/.test(form.alamat_email))
      errs.alamat_email = "Format email tidak valid.";
    if (form.kontak_darurat && !PHONE_REGEX.test(form.kontak_darurat.trim()))
      errs.kontak_darurat = "Format tidak valid. Contoh: 081234567890";
    if (!form.jabatan) errs.jabatan = "Pilih jabatan.";
    if (
      form.tahun_lulus &&
      (form.tahun_lulus < 1970 || form.tahun_lulus > new Date().getFullYear())
    )
      errs.tahun_lulus = `Tahun antara 1970 - ${new Date().getFullYear()}.`;

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.warning("Periksa kembali data yang diisi.");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updatePegawai(editing.id, form, fotoFile);
        toast.success("Data pegawai berhasil diperbarui.");
      } else {
        await createPegawai(form, fotoFile);
        toast.success("Data pegawai berhasil ditambahkan.");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        setFormErrors((prev) => ({ ...prev, ...apiErrors }));
        toast.error("Validasi gagal. Periksa kembali form.");
      } else {
        toast.error(
          err.response?.data?.message || "Gagal menyimpan data pegawai.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePegawai(deleteTarget.id);
      toast.success("Data pegawai berhasil dihapus.");
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal menghapus data pegawai.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        icon={IconUser}
        title="Data Pengguna"
        description="Kelola data pengguna."
        count={pagination?.total}
        action={
          isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <IconPlus size={17} />
              Tambah Pengguna
            </button>
          )
        }
      />

      <div className="card">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau mapel..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
        ) : items.length === 0 ? (
          <EmptyState
            icon={IconUsers}
            title="Belum ada data pegawai"
            description={
              search
                ? "Tidak ada pegawai yang cocok dengan pencarian."
                : "Tambahkan pegawai pertama untuk mulai."
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Nama</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Whatsapp</th>
                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((u) => (
                    <tr key={u.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <button
                          onClick={() => openDetail(u)}
                          className="flex items-center gap-3 text-left"
                        >
                          <Avatar name={u.nama} src={u.foto?.path} size={36} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700 hover:text-brand-600">
                              {u.nama}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {u.role || "-"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {u.email || "-"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{u.whatsapp}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openDetail(u)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                            aria-label="Lihat detail"
                          >
                            <IconEye size={16} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEdit(u)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                                aria-label="Edit"
                              >
                                <IconEdit size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(u)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                aria-label="Hapus"
                              >
                                <IconTrash size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <Pagination
                page={pagination.current_page}
                lastPage={pagination.last_page}
                hasMore={pagination.has_more}
                total={pagination.total}
                perPage={pagination.per_page}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* ============ Modal Tambah/Edit ============ */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Data Pengguna" : "Tambah Pengguna"}
        description={
          editing
            ? "Perbarui informasi pengguna."
            : "Lengkapi data pengguna baru."
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <IconUser size={28} className="text-slate-300" />
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary !py-2 text-xs"
              >
                <IconUpload size={14} />
                {fotoPreview ? "Ganti Foto" : "Unggah Foto"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFotoChange}
                className="hidden"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                JPG, PNG, WEBP, atau GIF. Maks 1MB.
              </p>
            </div>
          </div>

          {/* Data Diri */}
          <FormSection icon={IconIdCard} title="Data Diri">
            <Field label="Nama Lengkap" error={formErrors.nama}>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={`input-field ${formErrors.nama ? "input-error" : ""}`}
                placeholder="Nama lengkap pegawai"
              />
            </Field>
            <Field label="Peran" error={formErrors.role}>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={`input-field ${formErrors.jabatan ? "input-error" : ""}`}
              >
                <option disabled>— Pilih Jabatan —</option>
                <option key="user" value="user">
                  User
                </option>
                <option key="admin" value="admin">
                  Admin
                </option>
              </select>
            </Field>
            <Field label="Email" error={formErrors.email}>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`input-field ${formErrors.email ? "input-error" : ""}`}
                placeholder="Alamata Email"
              />
            </Field>
            <Field label="Whatsapp" error={formErrors.email}>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className={`input-field ${formErrors.whatsapp ? "input-error" : ""}`}
                placeholder="Nomor Whatsapp"
              />
            </Field>
          </FormSection>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving && <IconLoader size={16} />}
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* ============ Modal Detail ============ */}
      <Modal
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={detailItem?.nama}
        description={detailItem?.role}
        size="lg"
      >
        {detailItem && (
          <div>
            {/* <div className="flex items-center gap-4">
              {detailLoading ? (
                <IconLoader size={16} className="ml-auto text-slate-400" />
              ) : (
                <div>
                  <Avatar
                    name={detailItem.nama}
                    src={detailItem.foto?.path}
                    size={64}
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-800">
                      {detailItem.nama}
                    </h4>
                    <p className="text-sm text-slate-500">{detailItem.role}</p>
                  </div>
                </div>
              )}
            </div> */}
            <DetailGrid
              items={[
                {
                  icon: IconIdCard,
                  label: "Id",
                  value: detailItem.id,
                },
                {
                  icon: IconUser,
                  label: "Nama Lengkap",
                  value: detailItem.nama,
                },
                {
                  icon: IconShield,
                  label: "Peran",
                  value: detailItem.role,
                },
                {
                  icon: IconMail,
                  label: "Email",
                  value: detailItem.email,
                },
                {
                  icon: IconPhone,
                  label: "Whatsapp",
                  value: detailItem.whatsapp,
                },
              ]}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus data pegawai ini?"
        description={`Data pegawai "${deleteTarget?.nama}" akan dihapus permanen beserta foto yang terkait.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function FormSection({ icon: Icon, title, children, optional }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-brand-600" />
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        {optional && (
          <span className="text-xs font-normal text-slate-400">(opsional)</span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="field-label">
        {label}{" "}
        {hint && (
          <span className="font-normal normal-case text-slate-400">
            &middot; {hint}
          </span>
        )}
      </label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function DetailGrid({ items }) {
  const visible = items.filter((i) => i.value);
  if (visible.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
      {visible.map((item) => (
        <div key={item.label} className="flex items-start gap-2.5">
          <item.icon size={15} className="mt-0.5 shrink-0 text-slate-400" />
          <div className="min-w-0">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="truncate text-sm font-medium text-slate-700">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function ProfileField({ label, children }) {
  return (
    <div className="grid gap-1.5 py-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-5">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-semibold text-slate-700">
        {children}
      </dd>
    </div>
  );
}
