import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pegawaiApi } from "../api/pegawai";
import { status, gender, getMapel, getJabatan } from "../utils/masterData";
import { toast } from "../store/toastStore";

const emptyForm = {
  nama: "",
  foto: "",
  noKTP: "",
  noNBM: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  status: "",
  alamatRumah: "",
  nomorTelephone: "",
  alamatEmail: "",
  pendidikanTerakhir: "",
  namaKampus: "",
  jurusan: "",
  tahunLulus: "",
  jabatanId: "",
  mataPelajaranId: [],
  nomorBpjs: "",
  kontakDarurat: "",
};

const currentYear = new Date().getFullYear();

export default function PegawaiFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [mapels, setMapels] = useState(null);
  const [jabatans, setJabatans] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const mapel = await getMapel();
        const jabatan = await getJabatan();

        setMapels(mapel.data.data);
        setJabatans(jabatan.data.data);
      } catch (err) {
        console.error(err);
      }
    })();

    if (!isEdit) return;
    let active = true;

    (async () => {
      try {
        const { data } = await pegawaiApi.getById(id);
        const p = data.data;

        if (!active) return;

        setForm({
          nama: p.nama || "",
          foto: p.foto || null,
          noKTP: p.noKTP || "",
          noNBM: p.noNBM || "",
          tempatLahir: p.tempatLahir || "",
          tanggalLahir: p.tanggalLahir ? p.tanggalLahir.slice(0, 10) : "",
          jenisKelamin: p.jenisKelamin || "",
          status: p.status || "",
          alamatRumah: p.alamatRumah || "",
          nomorTelephone: p.nomorTelephone || "",
          alamatEmail: p.alamatEmail || "",
          pendidikanTerakhir: p.pendidikanTerakhir || "",
          namaKampus: p.namaKampus || "",
          jurusan: p.jurusan || "",
          tahunLulus: p.tahunLulus ?? "",
          jabatanId: p.jabatan?.id ?? "",
          mataPelajaranId: Array.isArray(p.mataPelajaran) ? p.mataPelajaran.map((m) => m.mataPelajaran?.id).filter(Boolean) : [],
          nomorBpjs: p.nomorBpjs || "",
          kontakDarurat: p.kontakDarurat || "",
        });
      } catch (err) {
        setServerError(
          err.response?.data?.message || "Gagal memuat data pegawai",
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleMapel = (mapelId) => {
    setForm((f) => {
      const exists = f.mataPelajaranId.includes(mapelId);
      return {
        ...f,
        mataPelajaranId: exists
          ? f.mataPelajaranId.filter((x) => x !== mapelId)
          : [...f.mataPelajaranId, mapelId],
      };
    });
  };

  const validate = () => {
    const e = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.noKTP.trim()) e.noKTP = "Nomor KTP wajib diisi";
    else if (form.noKTP.length !== 16) e.noKTP = "Nomor KTP harus 16 digit";

    if (form.noNBM && form.noNBM.length > 20)
      e.noNBM = "Nomor NBM maksimal 20 karakter";

    if(form.foto.size > 10 * 1024 * 1024) {
      e.foto = "File foto terlalu besar! (max: 10mb)";
    }

    if (!form.tempatLahir.trim()) e.tempatLahir = "Tempat lahir wajib diisi";
    if (!form.tanggalLahir) e.tanggalLahir = "Tanggal lahir wajib diisi";

    if (!form.jenisKelamin) e.jenisKelamin = "Jenis kelamin wajib dipilih";
    else if (!["L", "P"].includes(form.jenisKelamin))
      e.jenisKelamin = "Jenis kelamin harus L atau P";

    if (!form.status) e.status = "Status wajib dipilih";
    else if (!["Belum_Menikah", "Menikah"].includes(form.status))
      e.status = "Isi dengan [Belum_Menikah / Menikah]";

    if (!form.alamatRumah.trim()) e.alamatRumah = "Alamat rumah wajib diisi";
    if (!form.pendidikanTerakhir.trim())
      e.pendidikanTerakhir = "Pendidikan terakhir harus diisi";

    if (form.tahunLulus) {
      const y = Number(form.tahunLulus);
      if (!Number.isInteger(y) || y < 1900 || y > currentYear)
        e.tahunLulus = "Tahun lulus tidak valid";
    }

    if (!form.jabatanId) e.jabatanId = "Jabatan wajib dipilih";

    if (
      form.alamatEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.alamatEmail)
    )
      e.alamatEmail = "Format email tidak valid";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Periksa kembali form!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      const payload = {
        ...form,
        noNBM: form.noNBM || undefined,
        nomorTelephone: form.nomorTelephone || undefined,
        alamatEmail: form.alamatEmail || undefined,
        namaKampus: form.namaKampus || undefined,
        jurusan: form.jurusan || undefined,
        tahunLulus: form.tahunLulus ? Number(form.tahunLulus) : undefined,
        jabatanId: Number(form.jabatanId),
        nomorBpjs: form.nomorBpjs || undefined,
        kontakDarurat: form.kontakDarurat || undefined,
        foto: form.foto || undefined,
        mataPelajaranId: form.mataPelajaranId,
      };

      // ✅ Fix: handle array (mataPelajaranId bisa array)
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined) return;
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });

      if (isEdit) {
        // console.log(formData);
        // await pegawaiApi.update(id, payload);
        await pegawaiApi.update(id, formData);
        toast.success(`Data "${form.nama}" berhasil diperbarui.`);
      } else {
        // console.log(formData);
        // await pegawaiApi.create(payload);
        await pegawaiApi.create(formData);
        toast.success(`Pegawai "${form.nama}" berhasil ditambahkan.`);
      }

      navigate("/pegawai");
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors && Array.isArray(res.errors)) {
        const fieldErrors = {};
        res.errors.forEach((er) => {
          if (er.path) fieldErrors[er.path] = er.msg;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        setServerError(res.message || "Validasi gagal");
        toast.error(res.message || "Validasi gagal");
      } else {
        const msg = res?.message || "Gagal menyimpan data pegawai";
        setServerError(msg);
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl p-5 space-y-3"
          >
            <div className="skeleton h-4 w-32 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="skeleton h-10 rounded-lg" />
              <div className="skeleton h-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/pegawai")}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          aria-label="Kembali"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
        </h1>
      </div>

      {serverError && (
        <div className="mb-4 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 pb-24">
        <Section title="Identitas Utama">
          <Field label="Nama" error={errors.nama} required>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className={inputClass(errors.nama)}
            />
          </Field>
          <Field label="Nomor KTP (16 digit)" error={errors.noKTP} required>
            <input
              type="text"
              value={form.noKTP}
              onChange={(e) => handleChange("noKTP", e.target.value)}
              maxLength={16}
              className={`${inputClass(errors.noKTP)} font-tabular`}
            />
          </Field>
          <Field label="Nomor NBM" error={errors.noNBM}>
            <input
              type="text"
              value={form.noNBM}
              onChange={(e) => handleChange("noNBM", e.target.value)}
              maxLength={20}
              className={`${inputClass(errors.noNBM)} font-tabular`}
            />
          </Field>
          <Field label="Foto (max: 10mb)" error={errors.foto}>
            <input
              type="file"
              onChange={(e) => handleChange("foto", e.target.files[0])}
              className={inputClass(errors.foto)}
            />
          </Field>
        </Section>

        <Section title="Data Pribadi">
          <Field label="Tempat Lahir" error={errors.tempatLahir} required>
            <input
              type="text"
              value={form.tempatLahir}
              onChange={(e) => handleChange("tempatLahir", e.target.value)}
              className={inputClass(errors.tempatLahir)}
            />
          </Field>
          <Field label="Tanggal Lahir" error={errors.tanggalLahir} required>
            <input
              type="date"
              value={form.tanggalLahir}
              onChange={(e) => handleChange("tanggalLahir", e.target.value)}
              className={inputClass(errors.tanggalLahir)}
            />
          </Field>
          <Field label="Jenis Kelamin" error={errors.jenisKelamin} required>
            <select
              value={form.jenisKelamin}
              onChange={(e) => handleChange("jenisKelamin", e.target.value)}
              className={inputClass(errors.jenisKelamin)}
            >
              <option value="">Pilih...</option>
              {gender.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status Pernikahan" error={errors.status} required>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={inputClass(errors.status)}
            >
              <option value="">Pilih...</option>
              {status.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Alamat Rumah"
            error={errors.alamatRumah}
            required
            className="md:col-span-2"
          >
            <textarea
              value={form.alamatRumah}
              onChange={(e) => handleChange("alamatRumah", e.target.value)}
              rows={2}
              className={inputClass(errors.alamatRumah)}
            />
          </Field>
          <Field
            label="Nomor Telepon (tambahkan 62 didepan 8, contoh: 628xxxxx)"
            error={errors.nomorTelephone}
          >
            <input
              type="text"
              value={form.nomorTelephone}
              onChange={(e) => handleChange("nomorTelephone", e.target.value)}
              className={`${inputClass(errors.nomorTelephone)} font-tabular`}
            />
          </Field>
          <Field label="Alamat Email" error={errors.alamatEmail}>
            <input
              type="email"
              value={form.alamatEmail}
              onChange={(e) => handleChange("alamatEmail", e.target.value)}
              className={inputClass(errors.alamatEmail)}
            />
          </Field>
        </Section>

        <Section title="Pendidikan">
          <Field
            label='Pendidikan Terakhir (isi dengan "-" jika tidak ada)'
            error={errors.pendidikanTerakhir}
            required
          >
            <input
              type="text"
              value={form.pendidikanTerakhir}
              onChange={(e) =>
                handleChange("pendidikanTerakhir", e.target.value)
              }
              className={inputClass(errors.pendidikanTerakhir)}
            />
          </Field>
          <Field label="Nama Kampus" error={errors.namaKampus}>
            <input
              type="text"
              value={form.namaKampus}
              onChange={(e) => handleChange("namaKampus", e.target.value)}
              className={inputClass(errors.namaKampus)}
            />
          </Field>
          <Field label="Jurusan" error={errors.jurusan}>
            <input
              type="text"
              value={form.jurusan}
              onChange={(e) => handleChange("jurusan", e.target.value)}
              className={inputClass(errors.jurusan)}
            />
          </Field>
          <Field label="Tahun Lulus" error={errors.tahunLulus}>
            <input
              type="number"
              value={form.tahunLulus}
              onChange={(e) => handleChange("tahunLulus", e.target.value)}
              min={1900}
              max={currentYear}
              className={`${inputClass(errors.tahunLulus)} font-tabular`}
            />
          </Field>
        </Section>

        <Section title="Kepegawaian">
          <Field label="Jabatan" error={errors.jabatanId} required>
            <select
              value={form.jabatanId}
              onChange={(e) => handleChange("jabatanId", e.target.value)}
              className={inputClass(errors.jabatanId)}
            >
              <option value="">Pilih Jabatan...</option>
              {jabatans?.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Mata Pelajaran{" "}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-slate-200 dark:border-[#2A3554] rounded-lg p-3 bg-white dark:bg-[#141A30]">
              {mapels?.map((m) => {
                return (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.mataPelajaranId.includes(m.id)}
                      onChange={() => toggleMapel(m.id)}
                      className="rounded border-slate-300 dark:border-[#2A3554] text-indigo-600 focus:ring-indigo-500"
                    />
                    {`${m.id}. ${m.nama}`}
                  </label>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Asuransi & Kontak Darurat">
          <Field label="Nomor BPJS" error={errors.nomorBpjs}>
            <input
              type="text"
              value={form.nomorBpjs}
              onChange={(e) => handleChange("nomorBpjs", e.target.value)}
              className={`${inputClass(errors.nomorBpjs)} font-tabular`}
            />
          </Field>
          <Field
            label="Kontak Darurat (tambahkan 62 didepan 8, contoh: 628xxxxx)"
            error={errors.kontakDarurat}
          >
            <input
              type="text"
              value={form.kontakDarurat}
              onChange={(e) => handleChange("kontakDarurat", e.target.value)}
              className={inputClass(errors.kontakDarurat)}
            />
          </Field>
        </Section>

        {/* Sticky action bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/90 dark:bg-[#1A2342]/90 backdrop-blur-sm border-t border-slate-200 dark:border-[#2A3554] px-4 sm:px-6 py-3 z-20">
          <div className="max-w-6xl mx-auto flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 transition shadow-sm shadow-indigo-500/20"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/pegawai")}
              className="rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-medium px-5 py-2.5 hover:bg-slate-200 dark:hover:bg-white/10 transition"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, error, required, className = "", children }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-lg border bg-white dark:bg-[#141A30] text-slate-800 dark:text-slate-100 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-slate-400 ${
    error
      ? "border-rose-400 dark:border-rose-600"
      : "border-slate-300 dark:border-[#2A3554]"
  }`;
}