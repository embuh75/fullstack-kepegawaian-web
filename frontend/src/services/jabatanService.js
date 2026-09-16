import api from "./api";

// Catatan: endpoint index milik backend hanya mengembalikan array polos (tanpa
// metadata pagination) saat tanpa parameter "search", dan mengembalikan SATU
// object (bukan array) saat "search" diisi (karena backend memakai ->first()).
// Supaya pencarian & pagination di UI tetap konsisten & bisa menampilkan lebih
// dari satu hasil, kita ambil seluruh data sekali (per_page besar) lalu
// search/pagination dilakukan di sisi frontend.
export async function getAllJabatan() {
  const res = await api.get("/jabatan", { params: { per_page: 1000 } });
  const data = res.data.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function getJabatanById(id) {
  const res = await api.get(`/jabatan/${id}`);
  return res.data.data;
}

// JabatanController::store() membaca body via json_decode(php://input),
// jadi kirim sebagai JSON (default axios untuk object biasa).
export async function createJabatan(payload) {
  const res = await api.post("/jabatan", payload);
  return res.data.data;
}

export async function updateJabatan(id, payload) {
  const res = await api.patch(`/jabatan/${id}`, payload);
  return res.data.data;
}

export async function deleteJabatan(id) {
  const res = await api.delete(`/jabatan/${id}`);
  return res.data.data;
}
