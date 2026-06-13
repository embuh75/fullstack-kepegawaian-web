import apiClient from "./client";

export const authApi = {
  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),

  // Note: response.data.data = { accessToken, refreshToken } (no `user`)
  refresh: (refreshToken) => apiClient.post("/auth/refresh", { refreshToken }),

  logout: (refreshToken) => apiClient.post("/auth/logout", { refreshToken }),

  me: () => apiClient.get("/auth/me"),

  changePassword: (passwordLama, passwordBaru) =>
    apiClient.put("/auth/change-password", { passwordLama, passwordBaru }),
};
