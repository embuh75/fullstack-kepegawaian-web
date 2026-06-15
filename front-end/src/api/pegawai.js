import apiClient from "./client";

export const pegawaiApi = {
  getAll: (params) => apiClient.get("/pegawai", { params }),
  getById: (id) => apiClient.get(`/pegawai/${id}`),
  create: (payload) => apiClient.post("/pegawai", payload),
  update: (id, payload) => apiClient.put(`/pegawai/${id}`, payload),
  remove: (id) => apiClient.delete(`/pegawai/${id}`),
}; 

export const masterData = {
  getMapel: () => apiClient.get("/pegawai/mapel"),
  getJabatan: () => apiClient.get("/pegawai/jabatan"),
}