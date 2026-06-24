const mapel = [
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
];

const jabatan = [
  { kode: "GR", nama: "Guru" },
  { kode: "KR", nama: "Karyawan" },
  { kode: "KS", nama: "Kepala Sekolah" },
  { kode: "WSP", nama: "Waka Sarana dan Prasarana" },
  { kode: "WKPA", nama: "Wakil Kepala Sekolah dan AIK" },
];

const roles = [
  { nama: "ADMIN", deskripsi: "Administrator" },
  { nama: "MANAGER", deskripsi: "Manager" },
  { nama: "PEGAWAI", deskripsi: "Pegawai" },
];

const permission = [
  { nama: "pegawai:read", modul: "pegawai", aksi: "read" },
  { nama: "pegawai:create", modul: "pegawai", aksi: "create" },
  { nama: "pegawai:update", modul: "pegawai", aksi: "update" },
  { nama: "pegawai:delete", modul: "pegawai", aksi: "delete" },
  { nama: "jabatan:read", modul: "jabatan", aksi: "read" },
  { nama: "jabatan:create", modul: "jabatan", aksi: "create" },
  { nama: "jabatan:update", modul: "jabatan", aksi: "update" },
  { nama: "jabatan:delete", modul: "jabatan", aksi: "delete" },
  { nama: "departemen:read", modul: "departemen", aksi: "read" },
  { nama: "departemen:create", modul: "departemen", aksi: "create" },
  { nama: "departemen:update", modul: "departemen", aksi: "update" },
  { nama: "departemen:delete", modul: "departemen", aksi: "delete" },
  { nama: "user:read", modul: "user", aksi: "read" },
  { nama: "user:create", modul: "user", aksi: "create" },
  { nama: "user:update", modul: "user", aksi: "update" },
  { nama: "user:delete", modul: "user", aksi: "delete" },
];

const rootUser = {
  username: "fun",
  password: "Entahlah123",
  email: "fun@email.com",
};

module.exports = { mapel, jabatan, roles, rootUser, permission };
