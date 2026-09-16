import api from "./api";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  // response.data sesuai format backend: { success, message, data: { token, user } }
  return res.data.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.data.user;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
