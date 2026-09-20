import api from "./api";

// Sama seperti Jabatan: ambil semua data sekali, search & pagination di frontend
// karena endpoint index backend tidak konsisten (search hanya balikin satu hasil,
// dan tanpa metadata pagination).
export async function getAllMapel() {
  const res = await api.get("/mapel", { params: { per_page: 1000 } });
  const data = res.data.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}

export async function getMapelById(id) {
  const res = await api.get(`/mapel/${id}`);
  return res.data.data;
}

// MapelController::store() membaca langsung dari $_POST, jadi body request harus
// application/x-www-form-urlencoded (PHP baru mengisi $_POST kalau begitu),
// bukan JSON.
export async function createMapel(payload) {
  // const body = new URLSearchParams(payload);
  const res = await api.post("/mapel", payload);
  return res.data.data;

  // console.log("CreateMapel: ", payload);
}

export async function updateMapel(id, payload) {
  const res = await api.patch(`/mapel/${id}`, payload);
  return res.data.data;
}

export async function deleteMapel(id) {
  const res = await api.delete(`/mapel/${id}`);
  return res.data.data;
}
