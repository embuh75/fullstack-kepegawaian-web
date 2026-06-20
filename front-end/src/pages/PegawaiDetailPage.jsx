import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pegawaiApi } from "../api/pegawai";
import { useAuthStore } from "../store/authStore";
import { toInternational } from "../utils/nomorHp";

export default function PegawaiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const [pegawai, setPegawai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await pegawaiApi.getById(id);
        if (active) setPegawai(data.data);
      } catch (err) {
        if (active)
          setError(err.response?.data?.message || "Gagal memuat data pegawai");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-56 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl p-5 space-y-3"
            >
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
        {error}
      </div>
    );
  if (!pegawai) return null;

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
        <div className="flex-1 flex items-center gap-3">
          {pegawai.foto ? (
            <img
              src={pegawai.foto}
              alt={pegawai.nama}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-[#2A3554]"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-semibold">
              {pegawai.nama?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              {pegawai.nama}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pegawai.jabatan?.nama || "-"}
            </p>
          </div>
        </div>
        {hasPermission("pegawai:update") && (
          <button
            onClick={() => navigate(`/pegawai/${id}/edit`)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium px-4 py-2.5 hover:bg-amber-600 active:scale-[0.98] transition shadow-sm shadow-amber-500/20"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Identitas Utama">
          <Item label="Nama" value={pegawai.nama} />
          <Item label="Nomor KTP" value={pegawai.noKTP} mono />
          <Item label="Nomor NBM" value={pegawai.noNBM} mono />
          <Card>
            {pegawai.foto ? (
              <img className="mx-auto w-72 h-72" src={pegawai.foto} alt={pegawai.nama} />
            ) : (
              <span className="text-rose-600 dark:text-rose-400">
                Foto belum diupload!
              </span>
            )}
          </Card>
        </Card>

        <Card title="Data Pribadi">
          <Item label="Tempat Lahir" value={pegawai.tempatLahir} />
          <Item
            label="Tanggal Lahir"
            value={pegawai.tanggalLahir?.slice(0, 10)}
            mono
          />
          <Item
            label="Jenis Kelamin"
            value={pegawai.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
          />
          <Item label="Status" value={pegawai.status?.replace("_", " ")} />
          <Item label="Alamat Rumah" value={pegawai.alamatRumah} />
          <Item
            label="Nomor Telepon"
            value={
              pegawai.kontakDarurat
                ? toInternational(pegawai.kontakDarurat)
                : "-"
            }
            mono
          />
          <Item label="Alamat Email" value={pegawai.alamatEmail} />
        </Card>

        <Card title="Pendidikan">
          <Item
            label="Pendidikan Terakhir"
            value={
              pegawai.pendidikanTerakhir ? pegawai.pendidikanTerakhir : "-"
            }
          />
          <Item label="Nama Kampus" value={pegawai.namaKampus} />
          <Item label="Jurusan" value={pegawai.jurusan} />
          <Item label="Tahun Lulus" value={pegawai.tahunLulus} mono />
        </Card>

        <Card title="Kepegawaian">
          <Item label="Jabatan" value={pegawai.jabatan?.nama} />
          <div className="flex justify-between text-sm gap-4">
            <dt className="text-slate-500 dark:text-slate-400 shrink-0">
              Mata Pelajaran
            </dt>
            <dd className="text-slate-800 dark:text-slate-100 font-medium text-right">
              {pegawai.mataPelajaran ? (
                <div className="flex flex-wrap gap-1 justify-end">
                  <span
                    key={pegawai.mataPelajaran.id}
                    className="inline-flex items-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5"
                  >
                    {pegawai.mataPelajaran.nama}
                  </span>
                </div>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <Item
            label="Akun Pengguna"
            value={pegawai.user?.username ? `@${pegawai.user.username}` : "-"}
            mono
          />
        </Card>

        <Card title="Asuransi & Kontak Darurat">
          <Item label="Nomor BPJS" value={pegawai.nomorBpjs} mono />
          <Item
            label="Kontak Darurat"
            value={
              pegawai.kontakDarurat
                ? toInternational(pegawai.kontakDarurat)
                : "-"
            }
          />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white dark:bg-[#1A2342] border border-slate-100 dark:border-[#2A3554] rounded-xl shadow-sm p-5">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 uppercase tracking-wide">
        {title}
      </h2>
      <dl className="space-y-2.5">{children}</dl>
    </div>
  );
}

function Item({ label, value, mono }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <dt className="text-slate-500 dark:text-slate-400 shrink-0">{label}</dt>
      <dd
        className={`text-slate-800 dark:text-slate-100 font-medium text-right ${mono ? "font-tabular" : ""}`}
      >
        {value || "-"}
      </dd>
    </div>
  );
}
