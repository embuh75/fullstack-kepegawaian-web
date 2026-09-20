import client from "./client";

export const login = async (credentials) => {
  const fetch = await client.post("/auth/login", credentials);
  return fetch.data.data;
};

export const me = async () => {
  const fetch = await client.get("/auth/me");
  return fetch.data.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
