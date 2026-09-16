import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPegawaiList } from "../services/pegawaiService";
import { getAllJabatan } from "../services/jabatanService";
import { getAllMapel } from "../services/mapelService";
import Avatar from "../components/ui/Avatar";
import EmptyState from "../components/ui/EmptyState";
import {
  IconUsers,
  IconBriefcase,
  IconBook,
  IconGraduationCap,
  IconPlus,
  IconLoader,
  IconUser,
} from "../components/icons";

const STAT_STYLES = [
  { icon: IconUsers, wrap: "bg-brand-50 text-brand-600", accent: "before:bg-brand-500" },
  { icon: IconBriefcase, wrap: "bg-emerald-50 text-emerald-600", accent: "before:bg-emerald-500" },
  { icon: IconBook, wrap: "bg-amber-50 text-amber-600", accent: "before:bg-amber-500" },
  { icon: IconGraduationCap, wrap: "bg-violet-50 text-violet-600", accent: "before:bg-violet-500" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [genderSplit, setGenderSplit] = useState({ L: 0, P: 0 });

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [pegawaiRes, jabatanRes, mapelRes] = await Promise.all([
          getPegawaiList({ page: 1, per_page: 200 }),
          getAllJabatan(),
          getAllMapel(),
        ]);

        if (ignore) return;

        const items = pegawaiRes.items || [];
        const withMapel = items.filter((p) => p.mapel).length;
        const male = items.filter((p) => p.jenis_kelamin === "L").length;
        const female = items.filter((p) => p.jenis_kelamin === "P").length;

        setStats({
          totalPegawai: pegawaiRes.pagination?.total ?? items.length,
          totalJabatan: jabatanRes.length,
          totalMapel: mapelRes.length,
          totalPengajarMapel: withMapel,
        });
        setGenderSplit({ L: male, P: female });
        setRecent([...items].slice(-5).reverse());
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || "Gagal memuat ringkasan data.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const totalGender = genderSplit.L + genderSplit.P;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-6 text-white shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-brand-100">Selamat datang,</p>
          <h2 className="text-xl font-extrabold">{user?.nama} 👋</h2>
          <p className="mt-1 text-sm text-brand-100">
            Berikut ringkasan data kepegawaian SMA Muhammadiyah Sokaraja hari ini.
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/pegawai"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
          >
            <IconPlus size={17} />
            Tambah Pegawai
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <IconLoader size={22} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Pegawai", value: stats?.totalPegawai ?? 0 },
              { label: "Jabatan Tersedia", value: stats?.totalJabatan ?? 0 },
              { label: "Mata Pelajaran", value: stats?.totalMapel ?? 0 },
              { label: "Pegawai Mengampu Mapel", value: stats?.totalPengajarMapel ?? 0 },
            ].map((s, i) => {
              const style = STAT_STYLES[i];
              const Icon = style.icon;
              return (
                <div key={s.label} className={`stat-card card-hover ${style.accent}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.wrap}`}>
                    <Icon size={19} />
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-800">{s.value}</p>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-800">Pegawai Terbaru</h3>
                <Link to="/pegawai" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                  Lihat semua &rarr;
                </Link>
              </div>
              {recent.length === 0 ? (
                <EmptyState
                  icon={IconUser}
                  title="Belum ada data pegawai"
                  description="Data pegawai yang ditambahkan akan muncul di sini."
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {recent.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                      <Avatar name={p.nama} src={p.foto?.path} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-700">{p.nama}</p>
                        <p className="truncate text-xs text-slate-400">
                          {p.jabatan?.nama || "Tanpa jabatan"}
                          {p.mapel ? ` · ${p.mapel.nama}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        {p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-bold text-slate-800">Distribusi Gender</h3>
              <p className="mt-0.5 text-xs text-slate-400">Berdasarkan seluruh data pegawai</p>

              <div className="mt-5 space-y-4">
                <GenderBar
                  label="Laki-laki"
                  value={genderSplit.L}
                  total={totalGender}
                  color="bg-brand-500"
                />
                <GenderBar
                  label="Perempuan"
                  value={genderSplit.P}
                  total={totalGender}
                  color="bg-rose-400"
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-center">
                <QuickLink to="/pegawai" icon={IconUsers} label="Pegawai" />
                <QuickLink to="/jabatan" icon={IconBriefcase} label="Jabatan" />
                <QuickLink to="/mapel" icon={IconBook} label="Mapel" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GenderBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{label}</span>
        <span>
          {value} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-brand-600"
    >
      <Icon size={18} />
      <span className="text-[11px] font-semibold">{label}</span>
    </Link>
  );
}
