import api from "./api";

export async function getPegawaiList({ page = 1, per_page = 10, search = "" } = {}) {
  const res = await api.get("/pegawai", { params: { page, per_page, search } });
  return res.data.data; // { items, pagination }
}

export async function getPegawaiById(id) {
  const res = await api.get(`/pegawai/${id}`);
  return res.data.data;
}

// Field yang dikenali backend (PegawaiValidator). "foto" ditangani terpisah
// karena berupa file.
const FIELD_KEYS = [
  "nama",
  "nomor_ktp",
  "nomor_nbm",
  "tempat_lahir",
  "tanggal_lahir",
  "jenis_kelamin",
  "status",
  "alamat_rumah",
  "nomor_telephone",
  "alamat_email",
  "pendidikan_terakhir",
  "nama_kampus",
  "jurusan",
  "tahun_lulus",
  "jabatan",
  "mapel",
  "nomor_bpjs",
  "kontak_darurat",
];

function buildFormData(values, fotoFile) {
  const fd = new FormData();
  FIELD_KEYS.forEach((key) => {
    const val = values[key];
    if (val === undefined || val === null) return;
    if (typeof val === "string" && val.trim() === "") return;
    fd.append(key, val);
  });
  if (fotoFile) fd.append("foto", fotoFile);
  return fd;
}

// PegawaiController::store() membaca dari $_POST + $_FILES → kirim multipart.
// PENTING: jangan set header Content-Type secara manual di sini. Saat body berupa
// FormData, browser WAJIB yang menentukan boundary-nya sendiri
// (Content-Type: multipart/form-data; boundary=...). Kalau di-hardcode "multipart/form-data"
// tanpa boundary, PHP (maupun parser custom request_parse_body()) tidak akan bisa
// memisahkan bagian-bagian form sama sekali dan request akan gagal diparse.
export async function createPegawai(values, fotoFile) {
  const fd = buildFormData(values, fotoFile);
  const res = await api.post("/pegawai", fd);
  return res.data.data;
}

// PATCH multipart (backend memakai request_parse_body() untuk baca body+file-nya).
export async function updatePegawai(id, values, fotoFile) {
  const fd = buildFormData(values, fotoFile);
  const res = await api.patch(`/pegawai/${id}`, fd);
  return res.data.data;
}

export async function deletePegawai(id) {
  const res = await api.delete(`/pegawai/${id}`);
  return res.data.data;
}
