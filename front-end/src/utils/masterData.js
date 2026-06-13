// ====================================================================
// PERINGATAN / WARNING
// ====================================================================
// Backend TIDAK menyediakan endpoint GET /jabatan atau
// GET /mata-pelajaran. Data di bawah ini dihardcode berdasarkan urutan
// seed di `prisma/data.js`, dengan asumsi:
//   - Tabel `jabatan` dan `mata_pelajaran` di-seed dari KOSONG
//   - Urutan array di data.js TIDAK diubah
//   - ID auto-increment dimulai dari 1, sesuai urutan upsert
//
// SEBELUM DIPAKAI DI PRODUCTION / DATABASE NYATA:
//   Jalankan query berikut dan cocokkan dengan data di bawah:
//     SELECT id, kode, nama FROM jabatan ORDER BY id;
//     SELECT id, kode, nama FROM mata_pelajaran ORDER BY id;
//   Jika ada perbedaan ID, sesuaikan array di file ini.
// ====================================================================

export const JABATAN_OPTIONS = [
  { id: 1, kode: "GR", nama: "Guru" },
  { id: 2, kode: "KR", nama: "Karyawan" },
  { id: 3, kode: "KS", nama: "Kepala Sekolah" },
  { id: 4, kode: "WSP", nama: "Waka Sarana dan Prasarana" },
  { id: 5, kode: "WKPA", nama: "Wakil Kepala Sekolah dan AIK" },
];

export const MATA_PELAJARAN_OPTIONS = [
  { id: 1, kode: "BIND", nama: "Bahasa Indonesia" },
  { id: 2, kode: "BING", nama: "Bahasa Inggris" },
  { id: 3, kode: "BA", nama: "Bahasa Arab" },
  { id: 4, kode: "MTK", nama: "Matematika" },
  { id: 5, kode: "FSK", nama: "Fisika" },
  { id: 6, kode: "KIM", nama: "Kimia" },
  { id: 7, kode: "BIO", nama: "Biologi" },
  { id: 8, kode: "PAI", nama: "Pendidikan dan Agama Islam" },
  { id: 9, kode: "BK", nama: "Bimbingan Konseling" },
  { id: 10, kode: "SPA", nama: "Sejarah dan Pancasila" },
  { id: 11, kode: "EKO", nama: "Ekonomi" },
  { id: 12, kode: "GEO", nama: "Geografi" },
  { id: 13, kode: "SOS", nama: "Sosiologi" },
  { id: 14, kode: "TK", nama: "Tenaga Kebersihan" },
  { id: 15, kode: "TKJM", nama: "Tenaga Kebersihan dan Jaga Malam" },
  { id: 16, kode: "BHR", nama: "Bendahara" },
  { id: 17, kode: "MM", nama: "Tim Multimedia" },
];

/* export const mapel = [
  { kode: "BIND", nama: "Bahasa Indonesia" },
  { kode: "BING", nama: "Bahasa Inggris" },
  { kode: "BA", nama: "Bahasa Arab" },
  { kode: "MTK", nama: "Matematika" },
  { kode: "FSK", nama: "Fisika" },
  { kode: "KIM", nama: "Kimia" },
  { kode: "BIO", nama: "Biologi" },
  { kode: "PAI", nama: "Pendidikan dan Agama Islam" },
  { kode: "BK", nama: "Bimbingan Konseling" },
  { kode: "SPA", nama: "Sejarah dan Pancasila" },
  { kode: "EKO", nama: "Ekonomi" },
  { kode: "GEO", nama: "Geografi" },
  { kode: "SOS", nama: "Sosiologi" },
  { kode: "TK", nama: "Tenaga Kebersihan" },
  { kode: "TKJM", nama: "Tenaga Kebersihan dan Jaga Malam" },
  { kode: "BHR", nama: "Bendahara" },
  { kode: "MM", nama: " Tim Multimedia" },
]; */

// PEGAWAI role only allows "Belum_Menikah" / "Menikah" per validator
// (schema also defines "Duda" but it is rejected by express-validator
// on create — kept here but flagged)
export const STATUS_PERNIKAHAN_OPTIONS = [
  { value: "Belum_Menikah", label: "Belum Menikah" },
  { value: "Menikah", label: "Menikah" },
  // { value: "Duda", label: "Duda" }, // ditolak oleh validator backend saat create
];

export const JENIS_KELAMIN_OPTIONS = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];
