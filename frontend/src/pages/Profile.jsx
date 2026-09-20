import { useEffect, useRef, useState } from "react";
import { getMe } from "../services/authService";
import { update as updatePengguna } from "../services/penggunaService";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/ui/Avatar";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import {
  IconAlertTriangle,
  IconLoader,
  IconShield,
  IconUpload,
  IconUser,
} from "../components/icons";

export default function Profile() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const user = await getMe();
        if (!user) throw new Error("Informasi pengguna tidak tersedia.");
        if (!ignore) setProfile(user);
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Gagal memuat informasi profil. Silakan coba lagi.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (!fotoFile) return;

    const previewUrl = URL.createObjectURL(fotoFile);
    setFotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [fotoFile]);

  const status = getAccountStatus(profile?.status_aktif);
  const fotoSrc = fotoPreview || profile?.foto?.path;

  function resetFotoState() {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      resetFotoState();
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      resetFotoState();
      toast.error("Format foto harus JPG, PNG, WEBP, atau GIF.");
      return;
    }
    if (file.size > 1024 * 1024) {
      resetFotoState();
      toast.error("Ukuran foto maksimal 1MB.");
      return;
    }

    setFotoFile(file);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (profile?.id === null) {
      toast.error("ID pengguna tidak tersedia.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    // Sertakan foto hanya jika pengguna memilih file baru.
    if (!fotoFile) formData.delete("foto");

    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");
    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    // Password kosong berarti password lama tetap digunakan.
    if (!password) {
      formData.delete("password");
      formData.delete("confirm_password");
    }

    setSaving(true);
    try {
      await updatePengguna(profile.id, formData);
      toast.success("Profil berhasil diperbarui.");
      resetFotoState();
      setAttempt((value) => value + 1);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Gagal memperbarui profil. Silakan coba lagi.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={IconUser}
        title="Profil Saya"
        description="Informasi akun pengguna yang sedang login."
      />

      {loading ? (
        <div
          className="card flex items-center justify-center gap-3 py-20 text-sm text-slate-500"
          role="status"
        >
          <IconLoader size={22} aria-hidden="true" />
          Memuat profil...
        </div>
      ) : error ? (
        <div className="card" role="alert">
          <EmptyState
            icon={IconAlertTriangle}
            title="Profil belum dapat ditampilkan"
            description={error}
            action={
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Coba lagi
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Card Akun */}
          <section
            className="card min-w-0 overflow-hidden"
            aria-label="Ringkasan profil"
          >
            <div className="h-20 bg-gradient-to-r from-brand-700 to-brand-500" />
            <div className="flex flex-col items-center px-6 pb-6 text-center">
              <Avatar
                name={profile?.nama || ""}
                src={profile?.foto?.path}
                size={88}
                className="-mt-11 ring-4"
              />
              <h3 className="mt-4 w-full break-words text-lg font-bold text-slate-800">
                {profile.nama || "Nama belum tersedia"}
              </h3>
              <p className="mt-1 w-full break-words text-sm text-slate-500">
                {profile.email || "Email belum tersedia"}
              </p>
              <span className="badge mt-4 bg-brand-50 text-brand-700">
                <IconShield size={14} aria-hidden="true" />
                <span className="capitalize">
                  {profile.role || "Peran belum tersedia"}
                </span>
              </span>
            </div>
          </section>

          {/* Informasi Akun */}
          <section
            className="card min-w-0 lg:col-span-2"
            aria-labelledby="account-info-title"
          >
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h3
                id="account-info-title"
                className="text-sm font-bold text-slate-800"
              >
                Informasi Akun
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Detail identitas dan status akun Anda.
              </p>
            </div>
            <dl className="divide-y divide-slate-100 px-5 sm:px-6">
              <ProfileField label="ID Pengguna">
                {profile.id ?? "Belum tersedia"}
              </ProfileField>
              <ProfileField label="Nama Lengkap">
                {profile.nama || "Belum tersedia"}
              </ProfileField>
              <ProfileField label="Alamat Email">
                {profile.email || "Belum tersedia"}
              </ProfileField>
              <ProfileField label="Peran">
                <span className="capitalize">
                  {profile.role || "Belum tersedia"}
                </span>
              </ProfileField>
              <ProfileField label="Status Akun">
                <span className={`badge ${status.className}`}>
                  {status.label}
                </span>
              </ProfileField>
            </dl>
          </section>

          {/* Ubah Profil */}
          <section
            className="card min-w-0 lg:col-span-3"
            aria-labelledby="edit-profile-title"
          >
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h3
                id="edit-profile-title"
                className="text-sm font-bold text-slate-800"
              >
                Ubah Profil
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Perbarui informasi akun Anda.
              </p>
            </div>

            <form
              encType="multipart/form-data"
              className="space-y-5 p-5 sm:p-6"
              onSubmit={handleUpdate}
              onReset={resetFotoState}
            >
              <fieldset
                disabled={saving}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                {/* Nama */}
                <div>
                  <label htmlFor="profile-nama" className="field-label">
                    Nama Lengkap
                  </label>
                  <input
                    id="profile-nama"
                    name="nama"
                    type="text"
                    defaultValue={profile?.nama ?? ""}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    className="input-field"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="profile-email" className="field-label">
                    Alamat Email
                  </label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    defaultValue={profile?.email ?? ""}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    className="input-field"
                  />
                </div>

                {/* Foto */}
                <div className="sm:col-span-2">
                  <label htmlFor="profile-foto" className="field-label">
                    Foto Profil
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      {fotoSrc ? (
                        <img
                          src={fotoSrc}
                          alt="Pratinjau foto profil"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <IconUser
                          size={28}
                          className="text-slate-300"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        aria-describedby="profile-foto-hint"
                        className="btn-secondary !py-2 text-xs"
                      >
                        <IconUpload size={14} aria-hidden="true" />
                        {fotoSrc ? "Ganti Foto" : "Unggah Foto"}
                      </button>
                      <input
                        ref={fileInputRef}
                        id="profile-foto"
                        name="foto"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFotoChange}
                        aria-describedby="profile-foto-hint"
                        className="hidden"
                      />
                      <p
                        id="profile-foto-hint"
                        className="mt-1.5 text-xs text-slate-400"
                      >
                        JPG, PNG, WEBP, atau GIF. Maks 1MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="profile-whatsapp" className="field-label">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="profile-whatsapp"
                    name="whatsapp"
                    type="tel"
                    defaultValue={profile?.whatsapp ?? ""}
                    placeholder="Contoh: 081234567890"
                    autoComplete="tel"
                    className="input-field"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="profile-role" className="field-label">
                    Peran
                  </label>
                  <select
                    id="profile-role"
                    name="role"
                    defaultValue={profile?.role ?? "user"}
                    className="input-field"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="profile-password" className="field-label">
                    Password Baru
                  </label>
                  <input
                    id="profile-password"
                    name="password"
                    type="password"
                    minLength={8}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    aria-describedby="profile-password-hint"
                    className="input-field"
                  />
                  <p
                    id="profile-password-hint"
                    className="mt-1.5 text-xs text-slate-400"
                  >
                    Kosongkan jika tidak ingin mengganti password.
                  </p>
                </div>

                {/* Konfirmasi password */}
                <div>
                  <label
                    htmlFor="profile-confirm-password"
                    className="field-label"
                  >
                    Konfirmasi Password Baru
                  </label>
                  <input
                    id="profile-confirm-password"
                    name="confirm_password"
                    type="password"
                    minLength={8}
                    placeholder="Ulangi password baru"
                    autoComplete="new-password"
                    className="input-field"
                  />
                </div>
              </fieldset>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="reset"
                  disabled={saving}
                  className="btn-secondary"
                >
                  Reset
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving && <IconLoader size={16} aria-hidden="true" />}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
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

function getAccountStatus(value) {
  if (value === true || value === 1 || value === "1") {
    return { label: "Aktif", className: "bg-emerald-50 text-emerald-700" };
  }
  if (value === false || value === 0 || value === "0") {
    return { label: "Tidak aktif", className: "bg-red-50 text-red-700" };
  }
  return { label: "Belum tersedia", className: "bg-slate-100 text-slate-500" };
}
