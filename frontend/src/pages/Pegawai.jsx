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

export default function Pegawai() {
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
      const data = await getPegawaiList({ page, per_page: PER_PAGE, search });
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
    getAllJabatan().then(setJabatanOptions).catch(() => {});
    getAllMapel().then(setMapelOptions).catch(() => {});
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
      nomor_ktp: item.nomor_ktp || "",
      nomor_nbm: item.nomor_nbm || "",
      tempat_lahir: item.tempat_lahir || "",
      tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.slice(0, 10) : "",
      jenis_kelamin: item.jenis_kelamin || "L",
      status: item.status || "Belum_Menikah",
      alamat_rumah: item.alamat_rumah || "",
      nomor_telephone: item.nomor_telephone || "",
      alamat_email: item.alamat_email || "",
      pendidikan_terakhir: item.pendidikan_terakhir || "",
      nama_kampus: item.nama_kampus || "",
      jurusan: item.jurusan || "",
      tahun_lulus: item.tahun_lulus || "",
      jabatan: item.jabatan?.id ?? item.jabatan ?? "",
      mapel: item.mapel?.id ?? item.mapel ?? "",
      nomor_bpjs: item.nomor_bpjs || "",
      kontak_darurat: item.kontak_darurat || "",
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
      const fresh = await getPegawaiById(item.id);
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
    if (!form.nama.trim() || form.nama.trim().length < 5) errs.nama = "Nama minimal 5 karakter.";
    if (!/^\d{16}$/.test(form.nomor_ktp.trim())) errs.nomor_ktp = "Nomor KTP harus tepat 16 digit angka.";
    if (form.nomor_nbm && form.nomor_nbm.length > 20) errs.nomor_nbm = "Maksimal 20 karakter.";
    if (!form.tempat_lahir.trim()) errs.tempat_lahir = "Wajib diisi.";
    if (!form.tanggal_lahir) errs.tanggal_lahir = "Wajib diisi.";
    if (!form.alamat_rumah.trim()) errs.alamat_rumah = "Wajib diisi.";
    else if (form.alamat_rumah.trim().length > 150) errs.alamat_rumah = "Maksimal 150 karakter.";
    if (!PHONE_REGEX.test(form.nomor_telephone.trim()))
      errs.nomor_telephone = "Format tidak valid. Contoh: 081234567890";
    if (form.alamat_email && !/^\S+@\S+\.\S+$/.test(form.alamat_email))
      errs.alamat_email = "Format email tidak valid.";
    if (form.kontak_darurat && !PHONE_REGEX.test(form.kontak_darurat.trim()))
      errs.kontak_darurat = "Format tidak valid. Contoh: 081234567890";
    if (!form.jabatan) errs.jabatan = "Pilih jabatan.";
    if (form.tahun_lulus && (form.tahun_lulus < 1970 || form.tahun_lulus > new Date().getFullYear()))
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
        toast.error(err.response?.data?.message || "Gagal menyimpan data pegawai.");
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
      toast.error(err.response?.data?.message || "Gagal menghapus data pegawai.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        icon={IconUsers}
        title="Data Pegawai"
        description="Kelola data guru dan tenaga kependidikan."
        count={pagination?.total}
        action={
          isAdmin && (
            <button onClick={openCreate} className="btn-primary">
              <IconPlus size={17} />
              Tambah Pegawai
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
              search ? "Tidak ada pegawai yang cocok dengan pencarian." : "Tambahkan pegawai pertama untuk mulai."
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Nama</th>
                    <th className="px-5 py-3 font-semibold">Jabatan</th>
                    <th className="px-5 py-3 font-semibold">Mapel</th>
                    <th className="px-5 py-3 font-semibold">Kontak</th>
                    <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((p) => (
                    <tr key={p.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3">
                        <button onClick={() => openDetail(p)} className="flex items-center gap-3 text-left">
                          <Avatar name={p.nama} src={p.foto?.path} size={36} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700 hover:text-brand-600">
                              {p.nama}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              {p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{p.jabatan?.nama || "-"}</td>
                      <td className="px-5 py-3 text-slate-600">{p.mapel?.nama || "-"}</td>
                      <td className="px-5 py-3 text-slate-600">{p.nomor_telephone}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openDetail(p)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                            aria-label="Lihat detail"
                          >
                            <IconEye size={16} />
                          </button>
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openEdit(p)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                                aria-label="Edit"
                              >
                                <IconEdit size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(p)}
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
        title={editing ? "Edit Data Pegawai" : "Tambah Pegawai"}
        description={editing ? "Perbarui informasi pegawai." : "Lengkapi data pegawai baru."}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="h-full w-full object-cover" />
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
              <p className="mt-1.5 text-xs text-slate-400">JPG, PNG, WEBP, atau GIF. Maks 1MB.</p>
            </div>
          </div>

          {/* Data Diri */}
          <FormSection icon={IconIdCard} title="Data Diri">
            <Field label="Nama Lengkap" error={formErrors.nama} className="sm:col-span-2">
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={`input-field ${formErrors.nama ? "input-error" : ""}`}
                placeholder="Nama lengkap pegawai"
              />
            </Field>
            <Field label="Nomor KTP" error={formErrors.nomor_ktp}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={16}
                value={form.nomor_ktp}
                onChange={(e) => setForm({ ...form, nomor_ktp: e.target.value.replace(/\D/g, "") })}
                className={`input-field ${formErrors.nomor_ktp ? "input-error" : ""}`}
                placeholder="16 digit NIK"
              />
            </Field>
            <Field label="Nomor NBM" error={formErrors.nomor_nbm} hint="Opsional">
              <input
                type="text"
                value={form.nomor_nbm}
                onChange={(e) => setForm({ ...form, nomor_nbm: e.target.value })}
                className={`input-field ${formErrors.nomor_nbm ? "input-error" : ""}`}
              />
            </Field>
            <Field label="Tempat Lahir" error={formErrors.tempat_lahir}>
              <input
                type="text"
                value={form.tempat_lahir}
                onChange={(e) => setForm({ ...form, tempat_lahir: e.target.value })}
                className={`input-field ${formErrors.tempat_lahir ? "input-error" : ""}`}
              />
            </Field>
            <Field label="Tanggal Lahir" error={formErrors.tanggal_lahir}>
              <input
                type="date"
                value={form.tanggal_lahir}
                onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                className={`input-field ${formErrors.tanggal_lahir ? "input-error" : ""}`}
              />
            </Field>
            <Field label="Jenis Kelamin">
              <select
                value={form.jenis_kelamin}
                onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                className="input-field"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </Field>
            <Field label="Status Pernikahan">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field"
              >
                {Object.entries(STATUS_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Alamat Rumah" error={formErrors.alamat_rumah} className="sm:col-span-2">
              <textarea
                rows={2}
                value={form.alamat_rumah}
                onChange={(e) => setForm({ ...form, alamat_rumah: e.target.value })}
                className={`input-field resize-none ${formErrors.alamat_rumah ? "input-error" : ""}`}
                maxLength={150}
              />
            </Field>
          </FormSection>

          {/* Kontak */}
          <FormSection icon={IconPhone} title="Kontak">
            <Field label="Nomor Telepon/WA" error={formErrors.nomor_telephone}>
              <input
                type="text"
                value={form.nomor_telephone}
                onChange={(e) => setForm({ ...form, nomor_telephone: e.target.value })}
                className={`input-field ${formErrors.nomor_telephone ? "input-error" : ""}`}
                placeholder="081234567890"
              />
            </Field>
            <Field label="Kontak Darurat" error={formErrors.kontak_darurat} hint="Opsional">
              <input
                type="text"
                value={form.kontak_darurat}
                onChange={(e) => setForm({ ...form, kontak_darurat: e.target.value })}
                className={`input-field ${formErrors.kontak_darurat ? "input-error" : ""}`}
                placeholder="081234567890"
              />
            </Field>
            <Field label="Email" error={formErrors.alamat_email} hint="Opsional" className="sm:col-span-2">
              <input
                type="email"
                value={form.alamat_email}
                onChange={(e) => setForm({ ...form, alamat_email: e.target.value })}
                className={`input-field ${formErrors.alamat_email ? "input-error" : ""}`}
                placeholder="nama@email.com"
              />
            </Field>
          </FormSection>

          {/* Pendidikan */}
          <FormSection icon={IconGraduationCap} title="Pendidikan" optional>
            <Field label="Pendidikan Terakhir" hint="Opsional">
              <select
                value={form.pendidikan_terakhir}
                onChange={(e) => setForm({ ...form, pendidikan_terakhir: e.target.value })}
                className="input-field"
              >
                <option value="">— Pilih —</option>
                {PENDIDIKAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tahun Lulus" error={formErrors.tahun_lulus} hint="Opsional">
              <input
                type="number"
                min={1970}
                max={new Date().getFullYear()}
                value={form.tahun_lulus}
                onChange={(e) => setForm({ ...form, tahun_lulus: e.target.value })}
                className={`input-field ${formErrors.tahun_lulus ? "input-error" : ""}`}
              />
            </Field>
            <Field label="Nama Kampus/Sekolah" hint="Opsional">
              <input
                type="text"
                value={form.nama_kampus}
                onChange={(e) => setForm({ ...form, nama_kampus: e.target.value })}
                className="input-field"
              />
            </Field>
            <Field label="Jurusan" hint="Opsional">
              <input
                type="text"
                value={form.jurusan}
                onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                className="input-field"
              />
            </Field>
          </FormSection>

          {/* Kepegawaian */}
          <FormSection icon={IconBriefcase} title="Kepegawaian">
            <Field label="Jabatan" error={formErrors.jabatan}>
              <select
                value={form.jabatan}
                onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                className={`input-field ${formErrors.jabatan ? "input-error" : ""}`}
              >
                <option value="">— Pilih Jabatan —</option>
                {jabatanOptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Mata Pelajaran Diampu" hint="Opsional, khusus guru">
              <select
                value={form.mapel}
                onChange={(e) => setForm({ ...form, mapel: e.target.value })}
                className="input-field"
              >
                <option value="">— Tidak Ada —</option>
                {mapelOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nama}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nomor BPJS" error={formErrors.nomor_bpjs} hint="Opsional" className="sm:col-span-2">
              <input
                type="text"
                value={form.nomor_bpjs}
                onChange={(e) => setForm({ ...form, nomor_bpjs: e.target.value })}
                className={`input-field ${formErrors.nomor_bpjs ? "input-error" : ""}`}
              />
            </Field>
          </FormSection>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
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
        title="Detail Pegawai"
        description={detailItem?.nama}
        size="lg"
      >
        {detailItem && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={detailItem.nama} src={detailItem.foto?.path} size={64} />
              <div>
                <h4 className="text-base font-bold text-slate-800">{detailItem.nama}</h4>
                <p className="text-sm text-slate-500">
                  {detailItem.jabatan?.nama || jabatanMap[detailItem.jabatan] || "Tanpa jabatan"}
                  {(detailItem.mapel?.nama || mapelMap[detailItem.mapel]) &&
                    ` · ${detailItem.mapel?.nama || mapelMap[detailItem.mapel]}`}
                </p>
              </div>
              {detailLoading && <IconLoader size={16} className="ml-auto text-slate-400" />}
            </div>

            <DetailGrid
              items={[
                { icon: IconIdCard, label: "Nomor KTP", value: detailItem.nomor_ktp },
                { icon: IconIdCard, label: "Nomor NBM", value: detailItem.nomor_nbm },
                {
                  icon: IconUser,
                  label: "Jenis Kelamin",
                  value: detailItem.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
                },
                { icon: IconHeartPulse, label: "Status", value: STATUS_LABEL[detailItem.status] },
                {
                  icon: IconCalendar,
                  label: "Tempat, Tgl Lahir",
                  value: `${detailItem.tempat_lahir}, ${formatDate(detailItem.tanggal_lahir)}`,
                },
                { icon: IconPhone, label: "Telepon", value: detailItem.nomor_telephone },
                { icon: IconPhone, label: "Kontak Darurat", value: detailItem.kontak_darurat },
                { icon: IconMail, label: "Email", value: detailItem.alamat_email },
                { icon: IconGraduationCap, label: "Pendidikan Terakhir", value: detailItem.pendidikan_terakhir },
                {
                  icon: IconGraduationCap,
                  label: "Kampus / Jurusan",
                  value: [detailItem.nama_kampus, detailItem.jurusan].filter(Boolean).join(" - "),
                },
                { icon: IconCalendar, label: "Tahun Lulus", value: detailItem.tahun_lulus },
                { icon: IconHeartPulse, label: "Nomor BPJS", value: detailItem.nomor_bpjs },
              ]}
            />

            <div>
              <p className="field-label">Alamat Rumah</p>
              <p className="text-sm text-slate-700">{detailItem.alamat_rumah || "-"}</p>
            </div>
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
        {optional && <span className="text-xs font-normal text-slate-400">(opsional)</span>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="field-label">
        {label} {hint && <span className="font-normal normal-case text-slate-400">&middot; {hint}</span>}
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
            <p className="truncate text-sm font-medium text-slate-700">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}
