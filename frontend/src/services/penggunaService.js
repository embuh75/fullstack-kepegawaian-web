import api from "./api";

export async function store(data) {
  const res = await api.post("/user", data);
  return res.data.data;
}
export async function index() {
  const res = await api.get("/users");
  return res.data.data;
}
export async function find(id) {
  const res = await api.get(`/user/${id}`);
  return res.data.data;
}
export async function update(id, data) {
  const res = await api.patch(`/user/${id}`, data);
  return res.data.data;
}
export async function destroy(id) {
  const res = await api.delete(`/user/${id}`);
  return res.data.data;
}
